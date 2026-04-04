export default function PrayerLogLoading() {
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
                    <div className="skeleton" style={{ height: 50, width: 240, marginBottom: 10 }} />
                    <div className="skeleton" style={{ height: 14, width: 260 }} />
                </div>
                <div className="skeleton" style={{ height: 40, width: 120, borderRadius: 10 }} />
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
                            <div className="skeleton" style={{ height: 12, width: 90 }} />
                            <div className="skeleton" style={{ height: 20, width: 20, borderRadius: '50%' }} />
                        </div>
                        <div className="skeleton" style={{ height: 36, width: 60, marginBottom: 8 }} />
                        <div className="skeleton" style={{ height: 12, width: 100 }} />
                    </div>
                ))}
            </div>

            {/* Prayer Journal card */}
            <div style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-default)',
                borderRadius: 16,
                padding: 24,
            }}>
                <div className="skeleton" style={{ height: 26, width: 160, marginBottom: 20 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'flex-start', gap: 14,
                            padding: 16, borderRadius: 12,
                            background: 'var(--card-bg-subtle)',
                            border: '1px solid var(--border-subtle)',
                        }}>
                            <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <div className="skeleton" style={{ height: 14, width: '45%' }} />
                                    <div className="skeleton" style={{ height: 12, width: 60 }} />
                                </div>
                                <div className="skeleton" style={{ height: 12, width: '70%' }} />
                            </div>
                            <div className="skeleton" style={{ width: 16, height: 16, flexShrink: 0 }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
