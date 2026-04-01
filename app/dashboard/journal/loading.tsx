export default function JournalLoading() {
    return (
        <div style={{
            height: '100vh',
            background: '#0a0a0f',
            fontFamily: "'DM Sans', sans-serif",
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
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
                    <div className="skeleton" style={{ height: 44, width: 220, marginBottom: 10 }} />
                    <div className="skeleton" style={{ height: 13, width: 70 }} />
                </div>
                <div className="skeleton" style={{ height: 40, width: 120, borderRadius: 10 }} />
            </div>

            {/* Body */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                {/* Left — main reading/writing area */}
                <div style={{ flex: 1, padding: 40, borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="skeleton" style={{ height: 44, width: '55%', marginBottom: 12 }} />
                    <div className="skeleton" style={{ height: 13, width: 100, marginBottom: 32 }} />
                    {[92, 85, 78, 88, 60, 72].map((w, i) => (
                        <div key={i} className="skeleton" style={{ height: 14, width: `${w}%`, marginBottom: 12 }} />
                    ))}
                </div>

                {/* Right — entry list */}
                <div style={{ width: 300, overflowY: 'auto', padding: 16 }}>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} style={{
                            padding: 14, borderRadius: 12, marginBottom: 8,
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                            <div className="skeleton" style={{ height: 14, width: '75%', marginBottom: 8 }} />
                            <div className="skeleton" style={{ height: 11, width: '50%', marginBottom: 6 }} />
                            <div className="skeleton" style={{ height: 11, width: '85%' }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
