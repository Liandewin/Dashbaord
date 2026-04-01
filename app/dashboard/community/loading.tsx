import CommunitySkeleton from '@/components/community/community-skeleton'

export default function CommunityLoading() {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0f',
            fontFamily: "'DM Sans', sans-serif",
        }}>
            {/* Header */}
            <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ height: 44, width: 300, borderRadius: 8, background: 'rgba(255,255,255,0.06)', marginBottom: 10 }} />
                    <div style={{ height: 13, width: 240, borderRadius: 8, background: 'rgba(255,255,255,0.04)' }} />
                </div>
                <div style={{ height: 40, width: 110, borderRadius: 10, background: 'rgba(255,255,255,0.06)' }} />
            </div>

            <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px' }}>
                <CommunitySkeleton />
            </div>
        </div>
    )
}