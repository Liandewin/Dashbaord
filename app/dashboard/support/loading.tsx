export default function SupportLoading() {
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
            <div style={{ marginBottom: 40 }}>
                <div className="skeleton" style={{ height: 50, width: 340, marginBottom: 10 }} />
                <div className="skeleton" style={{ height: 14, width: 230 }} />
            </div>

            {/* FAQ section */}
            <div style={{ maxWidth: 640, marginBottom: 48 }}>
                <div className="skeleton" style={{ height: 11, width: 210, marginBottom: 16 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 12, padding: '16px 20px',
                        }}>
                            <div className="skeleton" style={{ height: 15, width: `${50 + i * 10}%` }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact form */}
            <div style={{ maxWidth: 640 }}>
                <div className="skeleton" style={{ height: 11, width: 110, marginBottom: 16 }} />
                <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16, padding: 32,
                    display: 'flex', flexDirection: 'column', gap: 20,
                }}>
                    {/* Subject field */}
                    <div>
                        <div className="skeleton" style={{ height: 11, width: 60, marginBottom: 10 }} />
                        <div className="skeleton" style={{ height: 42, width: '100%', borderRadius: 10 }} />
                    </div>
                    {/* Message field */}
                    <div>
                        <div className="skeleton" style={{ height: 11, width: 65, marginBottom: 10 }} />
                        <div className="skeleton" style={{ height: 110, width: '100%', borderRadius: 10 }} />
                    </div>
                    {/* Submit button */}
                    <div className="skeleton" style={{ height: 44, width: '100%', borderRadius: 10 }} />
                </div>
            </div>
        </div>
    )
}
