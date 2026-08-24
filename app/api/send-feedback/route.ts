import * as Sentry from '@sentry/nextjs'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import FeedbackNotificationEmail from '@/app/email/feedback-notification'
import { EMAIL_FROM, FEEDBACK_TO, sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
    const supabase = await createSupabaseServerClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name, message } = await request.json()

    if (!name || !message) {
        return NextResponse.json({ error: 'Name and message are required' }, { status: 400 })
    }

    // Save to Supabase
    const { error: dbError } = await supabase
        .from('feedback')
        .insert({ user_id: user.id, name, message })

    if (dbError) {
        return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 })
    }

    // The feedback row is already saved, so a failed notification must not fail
    // the request — but it must not vanish silently either.
    try {
        await sendEmail({
            from: EMAIL_FROM,
            to: FEEDBACK_TO,
            replyTo: user.email,
            subject: `💬 New feedback from ${name}`,
            react: FeedbackNotificationEmail({ name, message }),
        })
    } catch (error) {
        console.error('[send-feedback] notification failed', error)
        Sentry.captureException(error, { extra: { route: 'send-feedback', name } })
    }

    return NextResponse.json({ success: true })
}
