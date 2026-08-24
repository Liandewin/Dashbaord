import { Resend } from 'resend'
import * as Sentry from '@sentry/nextjs'
import type { ReactElement } from 'react'

const resend = new Resend(process.env.RESEND_API_KEY)

export const EMAIL_FROM = 'Faith & Growth Tracker <noreply@faith-growth-tracker.co.za>'

// Resend's default account limit is 2 requests per second. The cron routes fan
// out over every profile at once, so sending them all in parallel means most
// come back 429 rate_limit_exceeded.
const SENDS_PER_SECOND = 2

export type EmailPayload = {
    from: string
    to: string
    subject: string
    react: ReactElement
}

export type SendReport = {
    sent: number
    failed: number
    skipped: number
    errors: string[]
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Sends one email and surfaces the failure as a thrown error.
 *
 * The Resend SDK resolves with `{ data, error }` instead of rejecting, so an
 * unchecked call looks identical whether it delivered or was rejected outright.
 */
export async function sendEmail(payload: EmailPayload) {
    const { data, error } = await resend.emails.send(payload)
    if (error) throw new Error(`${error.name}: ${error.message}`)
    return data
}

/** Drops recipients with no address on file — Resend rejects the whole send otherwise. */
export function withEmail<T extends { email: string | null }>(rows: T[]) {
    return rows.filter((row): row is T & { email: string } => !!row.email?.trim())
}

/**
 * Builds every payload in parallel, then delivers them within Resend's rate
 * limit. A failure on one recipient never stops the rest, and every failure is
 * counted, logged and reported to Sentry rather than swallowed.
 */
export async function sendToAll<T>(
    items: T[],
    buildPayload: (item: T) => Promise<EmailPayload> | EmailPayload,
    context: string
): Promise<SendReport> {
    const errors: string[] = []

    const built = await Promise.allSettled(items.map(item => buildPayload(item)))

    const payloads: EmailPayload[] = []
    for (const result of built) {
        if (result.status === 'fulfilled') payloads.push(result.value)
        else errors.push(`build failed: ${result.reason}`)
    }

    let sent = 0

    for (let i = 0; i < payloads.length; i += SENDS_PER_SECOND) {
        const batch = payloads.slice(i, i + SENDS_PER_SECOND)

        const settled = await Promise.allSettled(batch.map(payload => sendEmail(payload)))

        settled.forEach((result, index) => {
            if (result.status === 'fulfilled') sent++
            else errors.push(`${batch[index].to}: ${result.reason}`)
        })

        if (i + SENDS_PER_SECOND < payloads.length) await sleep(1_100)
    }

    const report: SendReport = {
        sent,
        failed: errors.length,
        skipped: 0,
        errors,
    }

    if (errors.length) {
        console.error(`[${context}] ${errors.length} email(s) failed`, errors)
        Sentry.captureException(new Error(`[${context}] ${errors.length} email(s) failed`), {
            extra: { errors, sent },
        })
    }

    return report
}
