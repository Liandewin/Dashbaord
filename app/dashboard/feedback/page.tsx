'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

export default function FeedbackPage() {
    const supabase = createSupabaseBrowserClient()
    const [form, setForm] = useState({ name: '', message: '' })
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit() {
        if (!form.name || !form.message) return
        setLoading(true)
        setError('')

        const res = await fetch('/api/send-feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        })

        if (res.ok) {
            setSubmitted(true)
        } else {
            setError('Something went wrong. Please try again.')
        }
        setLoading(false)
    }

    return (
        <div className="page-padding" style={{
            minHeight: '100vh',
            background: 'var(--app-bg)',

            fontFamily: "'DM Sans', sans-serif",
            color: 'var(--app-text)',
        }}>
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <h1 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 42, fontWeight: 700, margin: 0, lineHeight: 1.1,
                }}>
                    Share your <span style={{ color: 'var(--app-gold)' }}>Feedback</span>
                </h1>
                <p style={{ color: 'var(--app-text-muted)', marginTop: 6, fontSize: 14 }}>
                    Help us improve the app — every message is read personally
                </p>
            </div>

            {submitted ? (
                <div style={{
                    background: 'var(--gold-bg-subtle)',
                    border: '1px solid var(--gold-border-subtle)',
                    borderRadius: 16, padding: 40,
                    textAlign: 'center', maxWidth: 520,
                }}>
                    <p style={{ fontSize: 40, marginBottom: 16 }}>🙏</p>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>
                        Thank you!
                    </h2>
                    <p style={{ color: 'var(--app-text-muted)', fontSize: 14, margin: 0 }}>
                        Your feedback has been received. We appreciate you taking the time.
                    </p>
                </div>
            ) : (
                <div style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 16, padding: 32,
                    maxWidth: 520,
                    display: 'flex', flexDirection: 'column', gap: 20,
                }}>
                    <div>
                        <label style={{ fontSize: 12, color: 'var(--app-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>
                            Your Name
                        </label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            style={{
                                width: '100%', padding: '10px 14px', borderRadius: 10,
                                background: 'var(--card-bg-hover)', border: '1px solid var(--border-medium)',
                                color: 'var(--app-text)', fontSize: 14, outline: 'none', boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ fontSize: 12, color: 'var(--app-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>
                            Message
                        </label>
                        <textarea
                            placeholder="What's on your mind? Any bugs, suggestions, or things you love?"
                            value={form.message}
                            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                            rows={6}
                            style={{
                                width: '100%', padding: '10px 14px', borderRadius: 10,
                                background: 'var(--card-bg-hover)', border: '1px solid var(--border-medium)',
                                color: 'var(--app-text)', fontSize: 14, outline: 'none', resize: 'vertical',
                                boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif",
                            }}
                        />
                    </div>

                    {error && (
                        <p style={{ fontSize: 13, color: '#f87171' }}>{error}</p>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading || !form.name || !form.message}
                        style={{
                            padding: '12px 0', borderRadius: 10, fontSize: 14, fontWeight: 600,
                            background: 'linear-gradient(135deg, var(--app-gold), #b8962e)',
                            color: 'var(--app-bg)', border: 'none', cursor: 'pointer',
                            opacity: loading || !form.name || !form.message ? 0.5 : 1,
                            transition: 'opacity 0.2s',
                        }}
                    >
                        {loading ? 'Sending...' : 'Send Feedback'}
                    </button>
                </div>
            )}
        </div>
    )
}
