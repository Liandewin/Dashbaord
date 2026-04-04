export default function BibleTrackerLoading() {
    return (
        <div className="page-padding" style={{
            minHeight: '100vh',
            background: 'var(--app-bg)',

            fontFamily: "'DM Sans', sans-serif",
        }}>

            {/* Header skeleton */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                    <div className="skeleton" style={{ height: 44, width: 380, marginBottom: 10 }} />
                    <div className="skeleton" style={{ height: 16, width: 240 }} />
                </div>
                <div className="skeleton" style={{ height: 40, width: 130, borderRadius: 10 }} />
            </div>

            {/* Stats cards skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} style={{
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 16,
                        padding: 20,
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                            <div className="skeleton" style={{ height: 12, width: 100 }} />
                            <div className="skeleton" style={{ height: 20, width: 20, borderRadius: '50%' }} />
                        </div>
                        <div className="skeleton" style={{ height: 36, width: 80, marginBottom: 8 }} />
                        <div className="skeleton" style={{ height: 12, width: 120 }} />
                    </div>
                ))}
            </div>

            {/* Chart + Recent readings skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Chart skeleton */}
                <div style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 16,
                    padding: 24,
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                        <div>
                            <div className="skeleton" style={{ height: 22, width: 160, marginBottom: 8 }} />
                            <div className="skeleton" style={{ height: 12, width: 120 }} />
                        </div>
                        <div className="skeleton" style={{ height: 28, width: 100, borderRadius: 20 }} />
                    </div>
                    {/* Fake chart bars */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 180, padding: '0 8px' }}>
                        {[60, 90, 45, 120, 80, 100, 70].map((h, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                                <div className="skeleton" style={{ width: '100%', height: h, borderRadius: '6px 6px 0 0' }} />
                                <div className="skeleton" style={{ height: 10, width: 24 }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent readings skeleton */}
                <div style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 16,
                    padding: 24,
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                        <div className="skeleton" style={{ height: 22, width: 160 }} />
                        <div className="skeleton" style={{ height: 14, width: 50 }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: 12,
                                borderRadius: 12,
                                background: 'var(--card-bg-subtle)',
                                border: '1px solid var(--card-bg)',
                            }}>
                                <div className="skeleton" style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 6 }} />
                                    <div className="skeleton" style={{ height: 11, width: '80%' }} />
                                </div>
                                <div className="skeleton" style={{ height: 12, width: 40 }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}