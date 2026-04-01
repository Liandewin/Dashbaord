export default function GoalsSkeleton() {
    return (
        <>
            <style>{`
                @keyframes shimmer {
                    0% { background-position: -1000px 0; }
                    100% { background-position: 1000px 0; }
                }
                .goals-skeleton-block {
                    background: linear-gradient(
                        90deg,
                        rgba(255,255,255,0.04) 25%,
                        rgba(255,255,255,0.08) 50%,
                        rgba(255,255,255,0.04) 75%
                    );
                    background-size: 1000px 100%;
                    animation: shimmer 2s infinite;
                    border-radius: 8px;
                }
            `}</style>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                {[
                    { bg: 'rgba(255,255,255,0.15)', border: 'rgba(255,255,255,0.5)', cards: 3 },
                    { bg: 'rgba(212,175,55,0.1)', border: '#d4af37', cards: 2 },
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
                            <div className="goals-skeleton-block" style={{ height: 16, width: 80 }} />
                            <div className="goals-skeleton-block" style={{ height: 22, width: 30, borderRadius: 20 }} />
                        </div>
                        <div className="goals-skeleton-block" style={{ height: 11, width: 70, marginBottom: 10 }} />
                        {[...Array(col.cards)].map((_, i) => (
                            <div key={i} style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: 12,
                                padding: 14,
                                marginBottom: 8,
                            }}>
                                <div className="goals-skeleton-block" style={{ height: 14, width: '80%', marginBottom: 8 }} />
                                <div className="goals-skeleton-block" style={{ height: 11, width: '60%', marginBottom: 12 }} />
                                <div className="goals-skeleton-block" style={{ height: 30, width: '100%', borderRadius: 8 }} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </>
    )
}