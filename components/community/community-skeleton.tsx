export default function CommunitySkeleton() {
    return (
        <>
            <style>{`
                @keyframes community-shimmer {
                    0% { background-position: -1000px 0; }
                    100% { background-position: 1000px 0; }
                }
                .community-skeleton-block {
                    background: linear-gradient(
                        90deg,
                        rgba(255,255,255,0.04) 25%,
                        rgba(255,255,255,0.08) 50%,
                        rgba(255,255,255,0.04) 75%
                    );
                    background-size: 1000px 100%;
                    animation: community-shimmer 2s infinite;
                    border-radius: 8px;
                }
            `}</style>

            {[1, 2, 3].map(i => (
                <div key={i} style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 16,
                    padding: 24,
                    marginBottom: 16,
                }}>
                    {/* Post header: avatar + name/timestamp */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                        <div className="community-skeleton-block" style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} />
                        <div>
                            <div className="community-skeleton-block" style={{ height: 13, width: 120, marginBottom: 6 }} />
                            <div className="community-skeleton-block" style={{ height: 11, width: 80 }} />
                        </div>
                    </div>

                    {/* Post content lines */}
                    <div className="community-skeleton-block" style={{ height: 13, width: '100%', marginBottom: 8 }} />
                    <div className="community-skeleton-block" style={{ height: 13, width: '85%', marginBottom: 8 }} />
                    <div className="community-skeleton-block" style={{ height: 13, width: '60%', marginBottom: 20 }} />

                    {/* Like / comment buttons */}
                    <div style={{ display: 'flex', gap: 10 }}>
                        <div className="community-skeleton-block" style={{ height: 30, width: 70, borderRadius: 8 }} />
                        <div className="community-skeleton-block" style={{ height: 30, width: 70, borderRadius: 8 }} />
                    </div>
                </div>
            ))}
        </>
    )
}