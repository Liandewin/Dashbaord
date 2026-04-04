export default function FitnessLoading() {
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
                    <div className="skeleton" style={{ height: 50, width: 260, marginBottom: 10 }} />
                    <div className="skeleton" style={{ height: 14, width: 220 }} />
                </div>
                <div className="skeleton" style={{ height: 40, width: 130, borderRadius: 10 }} />
            </div>

            {/* 4 stats cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} style={{
                        background: i === 0 ? 'var(--gold-card-bg)' : 'var(--card-bg)',
                        border: `1px solid ${i === 0 ? 'var(--gold-border-subtle)' : 'var(--border-default)'}`,
                        borderRadius: 16,
                        padding: 20,
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                            <div className="skeleton" style={{ height: 12, width: 110 }} />
                            <div className="skeleton" style={{ height: 20, width: 20, borderRadius: '50%' }} />
                        </div>
                        <div className="skeleton" style={{ height: 36, width: 60, marginBottom: 8 }} />
                        <div className="skeleton" style={{ height: 12, width: 90 }} />
                    </div>
                ))}
            </div>

            {/* Weekly Activity chart */}
            <div style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-default)',
                borderRadius: 16,
                padding: 24,
                marginBottom: 24,
            }}>
                <div className="skeleton" style={{ height: 26, width: 180, marginBottom: 20 }} />
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 200, padding: '0 8px' }}>
                    {[80, 120, 45, 160, 95, 130, 70].map((h, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
                            <div className="skeleton" style={{ width: '100%', height: h, borderRadius: '6px 6px 0 0' }} />
                            <div className="skeleton" style={{ height: 12, width: 28 }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Workout History list */}
            <div style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-default)',
                borderRadius: 16,
                padding: 24,
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <div className="skeleton" style={{ height: 26, width: 180 }} />
                    <div className="skeleton" style={{ height: 12, width: 50 }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', gap: 14,
                            padding: 14, borderRadius: 12,
                            background: 'var(--card-bg-subtle)',
                            border: '1px solid var(--border-subtle)',
                        }}>
                            <div className="skeleton" style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <div className="skeleton" style={{ height: 14, width: '40%' }} />
                                    <div className="skeleton" style={{ height: 12, width: 60 }} />
                                </div>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <div className="skeleton" style={{ height: 20, width: 60, borderRadius: 20 }} />
                                    <div className="skeleton" style={{ height: 12, width: 70 }} />
                                </div>
                            </div>
                            <div className="skeleton" style={{ width: 16, height: 16, flexShrink: 0 }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
