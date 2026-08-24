import * as React from 'react'
import { EmailButton } from './button'

interface Props {
    firstName: string
    verse: string
    reference: string
}

export default function DailyCheckinEmail({ firstName, verse, reference }: Props) {
    return (
        <div style={{ fontFamily: 'Georgia, serif', background: '#0a0a0f', color: 'white', padding: '40px 32px', maxWidth: 600, margin: '0 auto' }}>
            <h1 style={{ color: '#d4af37', fontSize: 28, marginBottom: 8 }}>Good morning, {firstName} 🙏</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, marginBottom: 32 }}>Here's your verse for today</p>

            <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 12, padding: 24, marginBottom: 32 }}>
                <p style={{ fontSize: 18, lineHeight: 1.8, fontStyle: 'italic', color: 'rgba(255,255,255,0.85)', margin: '0 0 12px' }}>"{verse}"</p>
                <p style={{ color: '#d4af37', fontWeight: 600, margin: 0 }}>— {reference}</p>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, marginBottom: 24 }}>
                Take a moment today to log your Bible reading, say a prayer, or write in your journal. Small steps build big faith. 💪
            </p>

            <EmailButton href="https://faith-growth-tracker.vercel.app/dashboard" label="Open my dashboard →" />

            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 40 }}>
                You're receiving this because you signed up for Faith & Growth Tracker.
            </p>
        </div>
    )
}