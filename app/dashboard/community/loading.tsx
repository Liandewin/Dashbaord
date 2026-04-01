export default function CommunityLoading() {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0f',
            fontFamily: "'DM Sans', sans-serif",
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
            <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div className="skeleton" style={{ height: 44, width: 300, marginBottom: 10 }} />
                    <div className="skeleton" style={{ height: 13, width: 240 }} />
                </div>
                <div className="skeleton" style={{ height: 40, width: 110, borderRadius: 10 }} />
            </div>

            {/* Feed */}
            <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px' }}>
                {[...Array(4)].map((_, i) => (
                    <div key={i} style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 16, padding: 24, marginBottom: 16,
                    }}>
                        {/* Post header: avatar + name/time */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                                <div>
                                    <div className="skeleton" style={{ height: 14, width: 120, marginBottom: 6 }} />
                                    <div className="skeleton" style={{ height: 11, width: 60 }} />
                                </div>
                            </div>
                        </div>
                        {/* Post content lines */}
                        <div className="skeleton" style={{ height: 14, width: '90%', marginBottom: 8 }} />
                        <div className="skeleton" style={{ height: 14, width: '75%', marginBottom: 8 }} />
                        <div className="skeleton" style={{ height: 14, width: '50%', marginBottom: 20 }} />
                        {/* Like + comment buttons */}
                        <div style={{ display: 'flex', gap: 10 }}>
                            <div className="skeleton" style={{ height: 32, width: 58, borderRadius: 8 }} />
                            <div className="skeleton" style={{ height: 32, width: 58, borderRadius: 8 }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
