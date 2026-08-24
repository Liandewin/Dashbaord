import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import MonthlyReviewEmail from '@/app/email/monthly-review'
import { EMAIL_FROM, EmailPayload, sendEmail, sendToAll, withEmail } from '@/lib/email'

function getTier(score: number) {
    if (score >= 80) return { label: 'Warrior', emoji: '⚔️' }
    if (score >= 60) return { label: 'Soldier', emoji: '🛡️' }
    if (score >= 40) return { label: 'Recruit', emoji: '🏹' }
    return { label: 'Apprentice', emoji: '🌱' }
}

async function buildPayload(
    supabase: any,
    profileId: string,
    email: string,
    firstName: string
): Promise<EmailPayload> {
    const now = new Date()
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const monthStart = prev.toISOString().split('T')[0]
    const daysInMonth = new Date(prev.getFullYear(), prev.getMonth() + 1, 0).getDate()
    const monthName = prev.toLocaleString('default', { month: 'long' })

    const monthEnd = new Date(prev.getFullYear(), prev.getMonth() + 1, 0).toISOString().split('T')[0]

    const [bible, goals, fitness] = await Promise.all([
        supabase.from('bible_reading').select('id').gte('date', monthStart).lte('date', monthEnd).eq('user_id', profileId),
        supabase.from('goals').select('status').eq('user_id', profileId),
        supabase.from('fitness').select('id').gte('date', monthStart).lte('date', monthEnd).eq('user_id', profileId),
    ])

    const bibleChapters = bible.data?.length ?? 0
    const goalsCompleted = goals.data?.filter((g: any) => g.status === 'done').length ?? 0
    const totalGoals = goals.data?.length ?? 0
    const workouts = fitness.data?.length ?? 0

    const bibleScore = Math.min((bibleChapters / daysInMonth) * 100, 100)
    const goalsScore = totalGoals === 0 ? 100 : (goalsCompleted / totalGoals) * 100
    const fitnessScore = Math.min((workouts / 12) * 100, 100)
    const overallScore = Math.round((bibleScore + goalsScore + fitnessScore) / 3)
    const tier = getTier(overallScore)

    return {
        from: EMAIL_FROM,
        to: email,
        subject: `${tier.emoji} Your ${monthName} review — ${tier.label}`,
        react: MonthlyReviewEmail({
            firstName, monthName, tier: tier.label, tierEmoji: tier.emoji,
            overallScore, bibleChapters, daysInMonth, goalsCompleted, totalGoals, workouts,
        }),
    }
}

// POST — triggered by the "Send to my email" button in the modal
export async function POST() {
    const supabase = await createSupabaseServerClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, email')
        .eq('id', user.id)
        .single()

    const recipient = profile?.email || user.email
    if (!recipient) return NextResponse.json({ error: 'No email on file' }, { status: 400 })

    try {
        const payload = await buildPayload(supabase, user.id, recipient, profile?.first_name || 'Friend')
        await sendEmail(payload)
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to send email' },
            { status: 500 }
        )
    }

    return NextResponse.json({ sent: true })
}

// GET — triggered by Vercel cron on the 1st of the month
export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createSupabaseServiceClient()
    const { data: profiles, error } = await supabase.from('profiles').select('id, first_name, email')

    if (error || !profiles) {
        return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 })
    }

    const recipients = withEmail(profiles)
    const skipped = profiles.length - recipients.length

    const report = await sendToAll(
        recipients,
        profile => buildPayload(supabase, profile.id, profile.email, profile.first_name || 'Friend'),
        'send-monthly'
    )

    return NextResponse.json({ ...report, skipped })
}
