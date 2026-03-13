import { FitnessEntry } from './types'

interface Props {
    entries: FitnessEntry[]
    loading: boolean
}

export default function FitnessStatsCards({ entries, loading }: Props) {
    const now = new Date()
    const startOfThisWeek = new Date(now)
    startOfThisWeek.setDate(now.getDate() - now.getDay())

    const thisWeek = entries.filter(e => new Date(e.date) >= startOfThisWeek)
    const totalMinutes = entries.reduce((acc, e) => acc + e.duration, 0)
    const thisWeekMinutes = thisWeek.reduce((acc, e) => acc + e.duration, 0)

    const types = entries.reduce((acc, e) => {
        acc[e.type] = (acc[e.type] || 0) + 1
        return acc
    }, {} as Record<string, number>)
    const topType = Object.entries(types).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'

    const cards = [
        { label: 'Workouts This Week', value: thisWeek.length, sub: 'Keep pushing!', icon: '💪', gold: true },
        { label: 'Minutes This Week', value: thisWeekMinutes, sub: 'Time invested', icon: '⏱️', gold: false },
        { label: 'Total Workouts', value: entries.length, sub: 'All time', icon: '🏋️', gold: false },
        { label: 'Top Activity', value: topType, sub: 'Most logged type', icon: '🏆', gold: false },
    ]

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {cards.map((card, i) => (
                <div key={i} style={{
                    background: card.gold ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${card.gold ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 16,
                    padding: 20,
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {card.label}
                        </span>
                        <span style={{ fontSize: 20 }}>{card.icon}</span>
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: card.gold ? '#d4af37' : 'white', marginBottom: 4 }}>
                        {loading ? '—' : card.value}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{card.sub}</div>
                </div>
            ))}
        </div>
    )
}