export default function JournalLoading() {
    return (
        <div className="flex flex-col min-h-screen lg:h-screen" style={{
            background: 'var(--app-bg)',
            fontFamily: "'DM Sans', sans-serif",
            color: 'var(--app-text)',
        }}>

            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div className="skeleton" style={{ height: 44, width: 220, marginBottom: 10 }} />
                    <div className="skeleton" style={{ height: 13, width: 70 }} />
                </div>
                <div className="skeleton" style={{ height: 40, width: 120, borderRadius: 10 }} />
            </div>

            {/* Body */}
            <div className="flex flex-col-reverse lg:flex-row lg:flex-1 lg:overflow-hidden">

                {/* Left — main reading/writing area */}
                <div className="flex-1 border-t lg:border-t-0 lg:border-r" style={{ padding: 24, borderColor: 'var(--border-subtle)' }}>
                    <div className="skeleton" style={{ height: 44, width: '55%', marginBottom: 12 }} />
                    <div className="skeleton" style={{ height: 13, width: 100, marginBottom: 32 }} />
                    {[92, 85, 78, 88, 60, 72].map((w, i) => (
                        <div key={i} className="skeleton" style={{ height: 14, width: `${w}%`, marginBottom: 12 }} />
                    ))}
                </div>

                {/* Right — entry list */}
                <div className="lg:w-[300px] overflow-y-auto" style={{ padding: 16 }}>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} style={{
                            padding: 14, borderRadius: 12, marginBottom: 8,
                            background: 'var(--card-bg-subtle)',
                            border: '1px solid var(--border-subtle)',
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
