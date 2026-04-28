import { Resend } from 'resend'
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import MonthlyReviewEmail from '@/app/email/monthly-review'

const resend = new Resend(process.env.RESEND_API_KEY)

function getMonthKey() {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function getTier(score: number) {
    if (score >= 80) return { label: 'Warrior', emoji: '⚔️' }
    if (score >= 60) return { label: 'Soldier', emoji: '🛡️' }
    if (score >= 40) return { label: 'Recruit', emoji: '🏹' }
    return { label: 'Apprentice', emoji: '🌱' }
}

async function buildAndSend(supabase: any, profileId: string, email: string, firstName: string) {
    const now = new Date()
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const monthStart = prev.toISOString().split('T')[0]
    const daysInMonth = new Date(prev.getFullYear(), prev.getMonth() + 1, 0).getDate()
    const monthName = prev.toLocaleString('default', { month: 'long' })

    const [bible, goals, fitness] = await Promise.all([
        supabase.from('bible_reading').select('id').gte('date', monthStart).eq('user_id', profileId),
        supabase.from('goals').select('status').eq('user_id', profileId),
        supabase.from('fitness').select('id').gte('date', monthStart).eq('user_id', profileId),
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

    return resend.emails.send({
        from: 'Faith & Growth Tracker <noreply@faith-growth-tracker.co.za>',
        to: email,
        subject: `${tier.emoji} Your ${monthName} review — ${tier.label}`,
        react: MonthlyReviewEmail({
            firstName, monthName, tier: tier.label, tierEmoji: tier.emoji,
            overallScore, bibleChapters, daysInMonth, goalsCompleted, totalGoals, workouts,
        }),
    })
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

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    if (!profile.email) return NextResponse.json({ error: 'No email on profile' }, { status: 400 })

    try {
        const result = await buildAndSend(supabase, user.id, profile.email, profile.first_name || 'Friend')
        if (result.error) {
            console.error('[send-monthly] Resend error:', result.error)
            return NextResponse.json({ error: result.error.message || 'Email send failed' }, { status: 500 })
        }
        return NextResponse.json({ sent: true })
    } catch (err: any) {
        console.error('[send-monthly] Unexpected error:', err)
        return NextResponse.json({ error: err?.message || 'Unexpected error' }, { status: 500 })
    }
}

// GET — triggered by Vercel cron on the last day of the month
export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createSupabaseServiceClient()
    const { data: profiles } = await supabase.from('profiles').select('id, first_name, email')
    if (!profiles) return NextResponse.json({ error: 'No profiles' }, { status: 500 })

    await Promise.all(
        profiles.map(p => buildAndSend(supabase, p.id, p.email, p.first_name || 'Friend'))
    )

    return NextResponse.json({ sent: profiles.length })
}