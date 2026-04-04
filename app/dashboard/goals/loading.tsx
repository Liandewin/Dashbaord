import GoalsSkeleton from '@/components/goals/goals-skeleton'

export default function GoalsLoading() {
    return (
        <div className="page-padding" style={{
            minHeight: '100vh',
            background: 'var(--app-bg)',

            fontFamily: "'DM Sans', sans-serif",
            color: 'var(--app-text)',
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                    <div style={{ height: 50, width: 200, borderRadius: 8, background: 'var(--card-bg-hover)', marginBottom: 10 }} />
                    <div style={{ height: 14, width: 220, borderRadius: 8, background: 'var(--card-bg)' }} />
                </div>
                <div style={{ height: 40, width: 110, borderRadius: 10, background: 'var(--card-bg-hover)' }} />
            </div>

            <GoalsSkeleton />
        </div>
    )
}