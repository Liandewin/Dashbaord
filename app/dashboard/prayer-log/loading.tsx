export default function PrayerLogLoading() {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0f',
            padding: '32px',
            fontFamily: "'DM Sans', sans-serif",
            color: 'white',
        }}>
            <style>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .skeleton {
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

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                    <div className="skeleton" style={{ height: 50, width: 240, marginBottom: 10 }} />
                    <div className="skeleton" style={{ height: 14, width: 260 }} />
                </div>
                <div className="skeleton" style={{ height: 40, width: 120, borderRadius: 10 }} />
            </div>

            {/* 4 stats cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                {[...Array(4)].map((_, i) => (
                    <div key={i} style={{
                        background: i === 0 ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${i === 0 ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.08)'}`,
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
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                padding: 24,
            }}>
                <div className="skeleton" style={{ height: 26, width: 160, marginBottom: 20 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'flex-start', gap: 14,
                            padding: 16, borderRadius: 12,
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
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
