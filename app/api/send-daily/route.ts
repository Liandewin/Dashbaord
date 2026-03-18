import { Resend } from 'resend'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse, NextRequest } from 'next/server'
import DailyCheckinEmail from '@/app/email/daily-checkin'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createSupabaseServerClient()

    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, first_name, email')

    if (error || !profiles) {
        return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
    }

    const { data: verses } = await supabase.from('verses').select('*')
    const dayOfYear = Math.floor(
        (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    )
    const verse = verses?.[dayOfYear % (verses?.length || 1)]

    const results = await Promise.all(
        profiles.map(profile =>
            resend.emails.send({
                from: 'Faith & Growth Tracker <onboarding@resend.dev>',
                to: profile.email,
                subject: '🌅 Your daily check-in',
                react: DailyCheckinEmail({
                    firstName: profile.first_name || 'Friend',
                    verse: verse?.text || 'The Lord is my shepherd, I lack nothing.',
                    reference: verse?.reference || 'Psalm 23:1',
                }),
            })
        )
    )

    return NextResponse.json({ sent: results.length })
}