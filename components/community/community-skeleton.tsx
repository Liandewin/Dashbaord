export default function CommunitySkeleton() {
    return (
        <>
            {[1, 2, 3].map(i => (
                <div key={i} style={{
                    background: 'var(--card-bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 16,
                    padding: 24,
                    marginBottom: 16,
                }}>
                    {/* Post header: avatar + name/timestamp */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                        <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} />
                        <div>
                            <div className="skeleton" style={{ height: 13, width: 120, marginBottom: 6 }} />
                            <div className="skeleton" style={{ height: 11, width: 80 }} />
                        </div>
                    </div>

                    {/* Post content lines */}
                    <div className="skeleton" style={{ height: 13, width: '100%', marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 13, width: '85%', marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 13, width: '60%', marginBottom: 20 }} />

                    {/* Like / comment buttons */}
                    <div style={{ display: 'flex', gap: 10 }}>
                        <div className="skeleton" style={{ height: 30, width: 70, borderRadius: 8 }} />
                        <div className="skeleton" style={{ height: 30, width: 70, borderRadius: 8 }} />
                    </div>
                </div>
            ))}
        </>
    )
}
