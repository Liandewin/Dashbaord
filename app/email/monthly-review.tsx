import * as React from 'react'

interface Props {
    firstName: string
    monthName: string
    tier: string
    tierEmoji: string
    overallScore: number
    bibleChapters: number
    daysInMonth: number
    goalsCompleted: number
    totalGoals: number
    workouts: number
}

export default function MonthlyReviewEmail({
    firstName, monthName, tier, tierEmoji, overallScore,
    bibleChapters, daysInMonth, goalsCompleted, totalGoals, workouts,
}: Props) {
    return (
        <div style={{ fontFamily: 'Georgia, serif', background: '#0a0a0f', color: 'white', padding: '40px 32px', maxWidth: 600, margin: '0 auto' }}>
            <p style={{ fontSize: 12, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>
                Monthly Review — {monthName}
            </p>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: 'white', margin: '0 0 8px' }}>
                {tierEmoji} {firstName}, you're a {tier}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, margin: '0 0 32px' }}>
                Here's how your month shaped up
            </p>

            {/* Overall score */}
            <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 12, padding: 20, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Overall score</span>
                <span style={{ color: '#d4af37', fontSize: 28, fontWeight: 700 }}>{overallScore}%</span>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 32 }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16 }}>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>📖 Bible</p>
                    <p style={{ fontSize: 24, fontWeight: 700, color: 'white', margin: '0 0 4px' }}>{bibleChapters}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>of {daysInMonth} days</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16 }}>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>🎯 Goals</p>
                    <p style={{ fontSize: 24, fontWeight: 700, color: 'white', margin: '0 0 4px' }}>{goalsCompleted}/{totalGoals}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>completed</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16 }}>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px' }}>💪 Fitness</p>
                    <p style={{ fontSize: 24, fontWeight: 700, color: 'white', margin: '0 0 4px' }}>{workouts}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>workouts</p>
                </div>
            </div>

            {/* Motivational line */}
            <div style={{ borderLeft: '3px solid #d4af37', paddingLeft: 16, marginBottom: 32 }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                    "Iron sharpens iron. Keep showing up — the man you're becoming is worth the effort."
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