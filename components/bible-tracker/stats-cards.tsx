import { BibleReading } from './types'

interface Props {
    readings: BibleReading[]
    loading: boolean
}

export default function StatsCards({ readings, loading }: Props) {
    const now = new Date()

    const startOfThisWeek = new Date(now)
    startOfThisWeek.setDate(now.getDate() - now.getDay())

    const startOfLastWeek = new Date(startOfThisWeek)
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7)

    const thisWeekReadings = readings.filter(r => new Date(r.date) >= startOfThisWeek)
    const lastWeekReadings = readings.filter(r => new Date(r.date) >= startOfLastWeek && new Date(r.date) < startOfThisWeek)

    const thisWeekCount = thisWeekReadings.length
    const weekDiff = thisWeekCount - lastWeekReadings.length

    const completedThisWeek = thisWeekReadings.filter(r => r.completed).length
    const completionRate = thisWeekCount > 0 ? Math.round((completedThisWeek / thisWeekCount) * 100) : 0

    // Streak calculation
    let streak = 0
    const today = new Date().toISOString().split('T')[0]
    const readingDates = [...new Set(readings.map(r => r.date))].sort().reverse()
    for (let i = 0; i < readingDates.length; i++) {
        const expected = new Date(today)
        expected.setDate(expected.getDate() - i)
        if (readingDates[i] === expected.toISOString().split('T')[0]) streak++
        else break
    }

    const cards = [
        {
            label: 'Chapters This Week',
            value: thisWeekCount,
            sub: weekDiff >= 0 ? `+${weekDiff} from last week` : `${weekDiff} from last week`,
            positive: weekDiff >= 0,
            icon: '📖',
            gold: true,
        },
        {
            label: 'Current Streak',
            value: `${streak} days`,
            sub: streak > 0 ? 'Keep it up! 💪' : 'Start today!',
            positive: streak > 0,
            icon: '🔥',
            gold: false,
        },
        {
            label: 'Completion Rate',
            value: `${completionRate}%`,
            sub: 'This week',
            positive: completionRate >= 70,
            icon: '✅',
            gold: false,
        },
        {
            label: 'Total Chapters',
            value: readings.length,
            sub: 'All time',
            positive: true,
            icon: '📚',
            gold: false,
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {cards.map((card, i) => (
                <div key={i} className={card.gold ? 'gold-card' : 'glass-card'} style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {card.label}
                        </span>
                        <span style={{ fontSize: 20 }}>{card.icon}</span>
                    </div>
                    <div style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 36,
                        fontWeight: 700,
                        color: card.gold ? '#d4af37' : 'white',
                        marginTop: 8,
                    }}>
                        {loading ? '—' : card.value}
                    </div>
                    <div style={{ fontSize: 12, marginTop: 4, color: card.positive ? '#4ade80' : '#f87171', fontWeight: 500 }}>
                        {card.positive ? '↑' : '↓'} {card.sub}
                    </div>
                </div>
            ))}
        </div>
    )
}