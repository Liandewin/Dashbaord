'use client'

import { useState, useEffect } from 'react'

interface Verse {
    id: string
    reference: string
    text: string
}

export default function VerseOfTheDay() {
    const [verse, setVerse] = useState<Verse | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const res = await fetch('/api/verse')
            if (res.ok) {
                const data = await res.json()
                setVerse(data)
            }
            setLoading(false)
        }
        load()
    }, [])

    return (
        <div style={{
            background: 'var(--gold-card-bg)',
            border: '1px solid var(--gold-border-faint)',
            borderRadius: 16,
            padding: 28,
            marginBottom: 32,
        }}>
            <div style={{ fontSize: 12, color: 'var(--app-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
                ✨ Verse of the Day
            </div>
            {loading ? (
                <div style={{ height: 60, background: 'var(--card-bg)', borderRadius: 8, animation: 'pulse 2s infinite' }} />
            ) : verse ? (
                <>
                    <p style={{ fontSize: 18, lineHeight: 1.8, color: 'var(--text-strong)', margin: '0 0 16px', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>
                        "{verse.text}"
                    </p>
                    <p style={{ fontSize: 14, color: 'var(--app-gold)', margin: 0, fontWeight: 600 }}>
                        — {verse.reference}
                    </p>
                </>
            ) : (
                <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>No verse available today.</p>
            )}
        </div>
    )
}