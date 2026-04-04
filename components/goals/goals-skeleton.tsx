export default function GoalsSkeleton() {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                    { bg: 'var(--column-todo-bg)', border: 'var(--column-todo-accent)', cards: 3 },
                    { bg: 'var(--gold-bg-subtle)', border: 'var(--app-gold)', cards: 2 },
                    { bg: 'rgba(74,222,128,0.1)', border: '#4ade80', cards: 4 },
                ].map((col, ci) => (
                    <div key={ci} style={{
                        background: col.bg,
                        border: `1px solid ${col.border}30`,
                        borderRadius: 16,
                        padding: 20,
                        minHeight: 300,
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <div className="skeleton" style={{ height: 16, width: 80 }} />
                            <div className="skeleton" style={{ height: 22, width: 30, borderRadius: 20 }} />
                        </div>
                        <div className="skeleton" style={{ height: 11, width: 70, marginBottom: 10 }} />
                        {[...Array(col.cards)].map((_, i) => (
                            <div key={i} style={{
                                background: 'var(--card-bg)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: 12,
                                padding: 14,
                                marginBottom: 8,
                            }}>
                                <div className="skeleton" style={{ height: 14, width: '80%', marginBottom: 8 }} />
                                <div className="skeleton" style={{ height: 11, width: '60%', marginBottom: 12 }} />
                                <div className="skeleton" style={{ height: 30, width: '100%', borderRadius: 8 }} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </>
    )
}