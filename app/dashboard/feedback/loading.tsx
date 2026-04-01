export default function FeedbackLoading() {
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
            <div style={{ marginBottom: 32 }}>
                <div className="skeleton" style={{ height: 50, width: 380, marginBottom: 10 }} />
                <div className="skeleton" style={{ height: 14, width: 280 }} />
            </div>

            {/* Form card */}
            <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, padding: 32,
                maxWidth: 520,
                display: 'flex', flexDirection: 'column', gap: 20,
            }}>
                {/* Name field */}
                <div>
                    <div className="skeleton" style={{ height: 11, width: 80, marginBottom: 10 }} />
                    <div className="skeleton" style={{ height: 42, width: '100%', borderRadius: 10 }} />
                </div>
                {/* Message field */}
                <div>
                    <div className="skeleton" style={{ height: 11, width: 65, marginBottom: 10 }} />
                    <div className="skeleton" style={{ height: 130, width: '100%', borderRadius: 10 }} />
                </div>
                {/* Submit button */}
                <div className="skeleton" style={{ height: 44, width: '100%', borderRadius: 10 }} />
            </div>
        </div>
    )
}
