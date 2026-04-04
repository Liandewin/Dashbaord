'use client'

import VerseOfTheDay from './verse-of-the-day'
import SummaryCards from './summary-cards'
import MonthlyReviewModal from '@/components/monthly-review/monthly-review-modal'

interface Props {
    firstName: string
}

export default function HomeClient({ firstName }: Props) {
    return (
        <div className="min-h-screen bg-background text-foreground p-4 md:p-8 font-[family-name:var(--font-dm-sans)]">
            <div style={{ marginBottom: 32 }}>
                <h1 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 42, fontWeight: 700, margin: 0, lineHeight: 1.1, color: 'var(--app-text)',
                }}>
                    Welcome back, <span style={{ color: 'var(--app-gold)', textTransform: 'capitalize' }}>{firstName}</span> 🙏
                </h1>
                <p style={{ color: 'var(--app-text-muted)', marginTop: 6, fontSize: 14 }}>
                    Here's your growth journey at a glance
                </p>
            </div>

            <VerseOfTheDay />
            <SummaryCards />
            <MonthlyReviewModal />
        </div>
    )
}