'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import Link from 'next/link'

export default function SummaryCards() {
    const supabase = createSupabaseBrowserClient()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        bibleStreak: 0,
        bibleThisWeek: 0,
        totalPrayers: 0,
        answeredPrayers: 0,
        latestJournal: null as { title: string; date: string } | null,
        totalGoals: 0,
        completedGoals: 0,
        fitnessThisWeek: 0,
        fitnessMinutesThisWeek: 0,
    })

    useEffect(() => {
        async function load() {
            const now = new Date()
            const startOfWeek = new Date(now)
            startOfWeek.setDate(now.getDate() - now.getDay())
            const startOfWeekStr = startOfWeek.toISOString().split('T')[0]

            const [bible, prayers, journal, goals, fitness] = await Promise.all([
                supabase.from('bible_reading').select('*').order('date', { ascending: false }),
                supabase.from('prayer_log').select('*'),
                supabase.from('journal').select('title, date').order('date', { ascending: false }).limit(1),
                supabase.from('goals').select('status'),
                supabase.from('fitness').select('date, duration').gte('date', startOfWeekStr),
            ])

            // Bible streak
            const readings = bible.data || []
            const today = new Date().toISOString().split('T')[0]
            const readingDates = [...new Set(readings.map((r: any) => r.date))].sort().reverse()
            let streak = 0
            for (let i = 0; i < readingDates.length; i++) {
                const expected = new Date(today)
                expected.setDate(expected.getDate() - i)
                if (readingDates[i] === expected.toISOString().split('T')[0]) streak++
                else break
            }
            const bibleThisWeek = readings.filter((r: any) => r.date >= startOfWeekStr).length

            // Prayers
            const prayerData = prayers.data || []
            const answeredPrayers = prayerData.filter((p: any) => p.answered).length

            // Journal
            const latestJournal = journal.data?.[0] || null

            // Goals
            const goalsData = goals.data || []
            const completedGoals = goalsData.filter((g: any) => g.status === 'done').length

            // Fitness
            const fitnessData = fitness.data || []
            const fitnessMinutes = fitnessData.reduce((acc: number, e: any) => acc + e.duration, 0)

            setStats({
                bibleStreak: streak,
                bibleThisWeek,
                totalPrayers: prayerData.length,
                answeredPrayers,
                latestJournal,
                totalGoals: goalsData.length,
                completedGoals,
                fitnessThisWeek: fitnessData.length,
                fitnessMinutesThisWeek: fitnessMinutes,
            })
            setLoading(false)
        }
        load()
    }, [])

    const cards = [
        {
            title: 'Bible Tracker',
            href: '/dashboard/bible-tracker',
            icon: '📖',
            primary: `${stats.bibleStreak} day streak`,
            secondary: `${stats.bibleThisWeek} chapters this week`,
            gold: true,
        },
        {
            title: 'Prayer Log',
            href: '/dashboard/prayer-log',
            icon: '🙏',
            primary: `${stats.totalPrayers} prayers`,
            secondary: `${stats.answeredPrayers} answered`,
            gold: false,
        },
        {
            title: 'Journal',
            href: '/dashboard/journal',
            icon: '📓',
            primary: stats.latestJournal ? stats.latestJournal.title : 'No entries yet',
            secondary: stats.latestJournal ? `Last entry: ${new Date(stats.latestJournal.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'Start writing today',
            gold: false,
        },
        {
            title: 'Goals',
            href: '/dashboard/goals',
            icon: '🎯',
            primary: `${stats.completedGoals} / ${stats.totalGoals} complete`,
            secondary: `${stats.totalGoals - stats.completedGoals} still in progress`,
            gold: false,
        },
        {
            title: 'Fitness',
            href: '/dashboard/fitness',
            icon: '💪',
            primary: `${stats.fitnessThisWeek} workouts this week`,
            secondary: `${stats.fitnessMinutesThisWeek} mins logged`,
            gold: false,
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card, i) => (
                <Link key={i} href={card.href} style={{ textDecoration: 'none' }}>
                    <div style={{
                        background: card.gold ? 'var(--gold-card-bg)' : 'var(--card-bg)',
                        border: `1px solid ${card.gold ? 'var(--gold-border-subtle)' : 'var(--border-default)'}`,
                        borderRadius: 16, padding: 24, cursor: 'pointer', transition: 'all 0.2s',
                    }}
                        onMouseEnter={e => (e.currentTarget.style.border = `1px solid ${card.gold ? 'var(--gold-border)' : 'var(--border-medium)'}`)}
                        onMouseLeave={e => (e.currentTarget.style.border = `1px solid ${card.gold ? 'var(--gold-border-subtle)' : 'var(--border-default)'}`)}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                            <span style={{ fontSize: 13, color: 'var(--app-text-muted)', fontWeight: 500 }}>{card.title}</span>
                            <span style={{ fontSize: 22 }}>{card.icon}</span>
                        </div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: card.gold ? 'var(--app-gold)' : 'var(--app-text)', marginBottom: 6 }}>
                            {loading ? '—' : card.primary}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>
                            {loading ? '' : card.secondary}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}