export function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
    return (
        <div style={{
            position: 'fixed', top: 24, right: 24, zIndex: 9999,
            padding: '14px 20px', borderRadius: 12, fontSize: 14, fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif", backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            background: type === 'success' ? 'rgba(212,175,55,0.15)' : 'rgba(239,68,68,0.15)',
            border: type === 'success' ? '1px solid rgba(212,175,55,0.4)' : '1px solid rgba(239,68,68,0.4)',
            color: type === 'success' ? '#d4af37' : '#f87171',
            display: 'flex', alignItems: 'center', gap: 10,
            animation: 'slideIn 0.3s ease forwards',
        }}>
            <span>{type === 'success' ? '✓' : '✕'}</span>
            {message}
            <style>{`@keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }`}</style>
        </div>
    )
}