export function Spinner() {
    return (
        <svg
            width="16" height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{ animation: 'spin 0.7s linear infinite' }}
        >
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
            <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </svg>
    )
}