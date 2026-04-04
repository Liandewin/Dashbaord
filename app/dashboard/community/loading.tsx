import CommunitySkeleton from '@/components/community/community-skeleton'

export default function CommunityLoading() {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--app-bg)',
            fontFamily: "'DM Sans', sans-serif",
            color: 'var(--app-text)',
        }}>
            {/* Header */}
            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div className="skeleton" style={{ height: 44, width: 300, marginBottom: 10 }} />
                    <div className="skeleton" style={{ height: 13, width: 240 }} />
                </div>
                <div className="skeleton" style={{ height: 40, width: 110, borderRadius: 10 }} />
            </div>

            <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px' }}>
                <CommunitySkeleton />
            </div>
        </div>
    )
}
