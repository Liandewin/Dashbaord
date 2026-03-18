'use client'

import VerseOfTheDay from './verse-of-the-day'
import SummaryCards from './summary-cards'
import MonthlyReviewModal from '@/components/monthly-review/monthly-review-modal'

interface Props {
    firstName: string
}

export default function HomeClient({ firstName }: Props) {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0f',
            padding: '32px',
            fontFamily: "'DM Sans', sans-serif",
            color: 'white',
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
            `}</style>

            <div style={{ marginBottom: 32 }}>
                <h1 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 42, fontWeight: 700, margin: 0, lineHeight: 1.1, color: 'white',
                }}>
                    Welcome back, <span style={{ color: '#d4af37', textTransform: 'capitalize' }}>{firstName}</span> 🙏
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 6, fontSize: 14 }}>
                    Here's your growth journey at a glance
                </p>
            </div>

            <VerseOfTheDay />
            <SummaryCards />
            <MonthlyReviewModal />
        </div>
    )
}