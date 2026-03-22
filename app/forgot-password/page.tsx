'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
    const supabase = createSupabaseBrowserClient()
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit() {
        setLoading(true)
        await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        })
        // Always show success regardless of whether email exists
        setSubmitted(true)
        setLoading(false)
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10" style={{ background: '#0a0a0f' }}>
            <Link href="/login" className="absolute top-6 left-6 flex items-center gap-2 text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <ArrowLeft className="size-4" />
                Back to login
            </Link>

            <div className="w-full max-w-sm">
                <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16,
                    padding: 32,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 24,
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: 12, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                            Password Reset
                        </p>
                        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'white', margin: '0 0 8px' }}>
                            {submitted ? 'Check your email' : 'Reset your password'}
                        </h1>
                        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                            {submitted
                                ? "If an account exists with that email, you'll receive a reset link shortly."
                                : "Enter your email and we'll send you a reset link"
                            }
                        </p>
                    </div>

                    {!submitted ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <input
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                style={{
                                    height: 40, width: '100%', borderRadius: 10,
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white', fontSize: 14, padding: '0 14px',
                                    outline: 'none', boxSizing: 'border-box',
                                }}
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !email}
                                style={{
                                    height: 40, width: '100%', borderRadius: 10,
                                    background: 'linear-gradient(135deg, #d4af37, #b8962e)',
                                    color: '#0a0a0f', fontSize: 14, fontWeight: 600,
                                    border: 'none', cursor: 'pointer',
                                    opacity: loading || !email ? 0.5 : 1,
                                }}
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: 40, marginBottom: 16 }}>📬</p>
                            <Link href="/login" style={{
                                display: 'inline-block', marginTop: 8,
                                fontSize: 14, color: '#d4af37',
                                textDecoration: 'underline',
                                textUnderlineOffset: 4,
                            }}>
                                Back to login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}