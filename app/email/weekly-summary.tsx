import * as React from 'react'

interface Props {
    firstName: string
    bibleReadings: number
    bibleStreak: number
    totalPrayers: number
    answeredPrayers: number
    journalEntries: number
    goalsCompleted: number
    totalGoals: number
    workouts: number
    workoutMinutes: number
}

export default function WeeklySummaryEmail({
    firstName,
    bibleReadings,
    bibleStreak,
    totalPrayers,
    answeredPrayers,
    journalEntries,
    goalsCompleted,
    totalGoals,
    workouts,
    workoutMinutes,
}: Props) {
    return (
        <div style={{ fontFamily: 'Georgia, serif', background: '#0a0a0f', color: 'white', padding: '40px 32px', maxWidth: 600, margin: '0 auto' }}>
            <h1 style={{ color: '#d4af37', fontSize: 28, marginBottom: 8 }}>Your weekly recap, {firstName} 📊</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, marginBottom: 32 }}>Here's how you grew this week</p>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
                <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 12, padding: 20 }}>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>📖 Bible</p>
                    <p style={{ fontSize: 28, fontWeight: 700, color: '#d4af37', margin: '0 0 4px' }}>{bibleReadings}</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: 0 }}>chapters · {bibleStreak} day streak</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>🙏 Prayer</p>
                    <p style={{ fontSize: 28, fontWeight: 700, color: 'white', margin: '0 0 4px' }}>{totalPrayers}</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: 0 }}>{answeredPrayers} answered this week</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>📓 Journal</p>
                    <p style={{ fontSize: 28, fontWeight: 700, color: 'white', margin: '0 0 4px' }}>{journalEntries}</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: 0 }}>entries this week</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>💪 Fitness</p>
                    <p style={{ fontSize: 28, fontWeight: 700, color: 'white', margin: '0 0 4px' }}>{workouts}</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: 0 }}>{workoutMinutes} mins logged</p>
                </div>
            </div>

            {/* Goals */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20, marginBottom: 32 }}>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>🎯 Goals</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: 'white', margin: '0 0 4px' }}>{goalsCompleted} / {totalGoals}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: 0 }}>goals completed</p>
            </div>

            {/* Motivational message */}
            <div style={{ borderLeft: '3px solid #d4af37', paddingLeft: 16, marginBottom: 32 }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                    "Every day is a new opportunity to grow closer to God and become the best version of yourself. Keep showing up — it matters more than you know."
                </p>
            </div>

            <a href="https://faith-growth-tracker.vercel.app/dashboard" style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: '#d4af37', padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
                Open my dashboard →
            </a>

            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 40 }}>
                You're receiving this because you signed up for Faith & Growth Tracker.
            </p>
        </div>
    )
}