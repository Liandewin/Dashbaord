export default function FeedbackLoading() {
    return (
        <div className="page-padding" style={{
            minHeight: '100vh',
            background: 'var(--app-bg)',

            fontFamily: "'DM Sans', sans-serif",
            color: 'var(--app-text)',
        }}>
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <div className="skeleton" style={{ height: 50, width: 380, marginBottom: 10 }} />
                <div className="skeleton" style={{ height: 14, width: 280 }} />
            </div>

            {/* Form card */}
            <div style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-default)',
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
