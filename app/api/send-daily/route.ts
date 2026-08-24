import { NextResponse, NextRequest } from 'next/server'
import DailyCheckinEmail from '@/app/email/daily-checkin'
import { createSupabaseServiceClient } from '@/lib/supabase-server'
import { EMAIL_FROM, sendToAll, withEmail } from '@/lib/email'

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createSupabaseServiceClient()

    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, first_name, email')

    if (error || !profiles) {
        return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
    }

    const recipients = withEmail(profiles)
    const skipped = profiles.length - recipients.length

    const { data: verses } = await supabase.from('verses').select('*')
    const dayOfYear = Math.floor(
        (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    )
    const verse = verses?.[dayOfYear % (verses?.length || 1)]

    const report = await sendToAll(
        recipients,
        profile => ({
            from: EMAIL_FROM,
            to: profile.email,
            subject: '🌅 Your daily check-in',
            react: DailyCheckinEmail({
                firstName: profile.first_name || 'Friend',
                verse: verse?.text || 'The Lord is my shepherd, I lack nothing.',
                reference: verse?.reference || 'Psalm 23:1',
            }),
        }),
        'send-daily'
    )

    return NextResponse.json({ ...report, skipped })
}
