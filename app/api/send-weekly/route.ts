import { Resend } from 'resend'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import WeeklySummaryEmail from '@/app/email/weekly-summary'

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

    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - 7)
    const startOfWeekStr = startOfWeek.toISOString().split('T')[0]

    const results = await Promise.all(
        profiles.map(async profile => {
            const [bible, prayers, journal, goals, fitness] = await Promise.all([
                supabase.from('bible_reading').select('date').gte('date', startOfWeekStr).eq('user_id', profile.id),
                supabase.from('prayer_log').select('answered').gte('date', startOfWeekStr).eq('user_id', profile.id),
                supabase.from('journal').select('id').gte('date', startOfWeekStr).eq('user_id', profile.id),
                supabase.from('goals').select('status').eq('user_id', profile.id),
                supabase.from('fitness').select('duration').gte('date', startOfWeekStr).eq('user_id', profile.id),
            ])

            // Bible streak
            const allReadings = await supabase.from('bible_reading').select('date').eq('user_id', profile.id).order('date', { ascending: false })
            const readingDates = [...new Set((allReadings.data || []).map((r: any) => r.date))].sort().reverse()
            const today = new Date().toISOString().split('T')[0]
            let streak = 0
            for (let i = 0; i < readingDates.length; i++) {
                const expected = new Date(today)
                expected.setDate(expected.getDate() - i)
                if (readingDates[i] === expected.toISOString().split('T')[0]) streak++
                else break
            }

            const answeredPrayers = (prayers.data || []).filter((p: any) => p.answered).length
            const completedGoals = (goals.data || []).filter((g: any) => g.status === 'done').length
            const workoutMinutes = (fitness.data || []).reduce((acc: number, e: any) => acc + e.duration, 0)

            return resend.emails.send({
                from: 'Faith & Growth Tracker <onboarding@resend.dev>',
                to: profile.email,
                subject: '📊 Your weekly growth summary',
                react: WeeklySummaryEmail({
                    firstName: profile.first_name || 'Friend',
                    bibleReadings: bible.data?.length || 0,
                    bibleStreak: streak,
                    totalPrayers: prayers.data?.length || 0,
                    answeredPrayers,
                    journalEntries: journal.data?.length || 0,
                    goalsCompleted: completedGoals,
                    totalGoals: goals.data?.length || 0,
                    workouts: fitness.data?.length || 0,
                    workoutMinutes,
                }),
            })
        })
    )

    return NextResponse.json({ sent: results.length })
}