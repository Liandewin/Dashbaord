import { Prayer } from './types'

interface Props {
    prayers: Prayer[]
    loading: boolean
}

export default function PrayerStatsCards({ prayers, loading }: Props) {
    const answered = prayers.filter(p => p.answered)
    const unanswered = prayers.filter(p => !p.answered)
    const answerRate = prayers.length > 0 ? Math.round((answered.length / prayers.length) * 100) : 0

    const thisWeek = prayers.filter(p => {
        const date = new Date(p.date)
        const now = new Date()
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay())
        return date >= startOfWeek
    })

    const cards = [
        { label: 'Total Prayers', value: prayers.length, sub: 'All time', icon: '🙏', gold: true },
        { label: 'Answered', value: answered.length, sub: 'Prayers received', icon: '✅', gold: false },
        { label: 'Believing', value: unanswered.length, sub: 'Still trusting', icon: '⏳', gold: false },
        { label: 'This Week', value: thisWeek.length, sub: 'Prayers logged', icon: '📅', gold: false },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {cards.map((card, i) => (
                <div key={i} style={{
                    background: card.gold ? 'var(--gold-card-bg)' : 'var(--card-bg)',
                    border: `1px solid ${card.gold ? 'var(--gold-border-subtle)' : 'var(--border-default)'}`,
                    borderRadius: 16,
                    padding: 20,
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <span style={{ fontSize: 12, color: 'var(--app-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {card.label}
                        </span>
                        <span style={{ fontSize: 20 }}>{card.icon}</span>
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: card.gold ? 'var(--app-gold)' : 'var(--app-text)', marginBottom: 4 }}>
                        {loading ? '—' : card.value}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{card.sub}</div>
                </div>
            ))}
        </div>
    )
}