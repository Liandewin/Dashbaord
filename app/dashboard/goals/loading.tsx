import GoalsSkeleton from '@/components/goals/goals-skeleton'

export default function GoalsLoading() {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0f',
            padding: '32px',
            fontFamily: "'DM Sans', sans-serif",
            color: 'white',
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                    <div style={{ height: 50, width: 200, borderRadius: 8, background: 'rgba(255,255,255,0.06)', marginBottom: 10 }} />
                    <div style={{ height: 14, width: 220, borderRadius: 8, background: 'rgba(255,255,255,0.04)' }} />
                </div>
                <div style={{ height: 40, width: 110, borderRadius: 10, background: 'rgba(255,255,255,0.06)' }} />
            </div>

            <GoalsSkeleton />
        </div>
    )
}