'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
    const supabase = createSupabaseBrowserClient()
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleReset() {
        setError('')

        if (password !== confirm) {
            setError('Passwords do not match')
            return
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)
        const { error } = await supabase.auth.updateUser({ password })

        if (error) {
            setError(error.message)
        } else {
            router.replace('/dashboard')
        }
        setLoading(false)
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10" style={{ background: '#0a0a0f' }}>
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
                            Set a new password
                        </h1>
                        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                            Choose something strong
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <input
                            type="password"
                            placeholder="New password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={{
                                height: 40, width: '100%', borderRadius: 10,
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white', fontSize: 14, padding: '0 14px',
                                outline: 'none', boxSizing: 'border-box',
                            }}
                        />
                        <input
                            type="password"
                            placeholder="Confirm password"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            style={{
                                height: 40, width: '100%', borderRadius: 10,
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white', fontSize: 14, padding: '0 14px',
                                outline: 'none', boxSizing: 'border-box',
                            }}
                        />
                        {error && (
                            <p style={{ fontSize: 13, color: '#f87171', textAlign: 'center' }}>{error}</p>
                        )}
                        <button
                            onClick={handleReset}
                            disabled={loading || !password || !confirm}
                            style={{
                                height: 40, width: '100%', borderRadius: 10,
                                background: 'linear-gradient(135deg, #d4af37, #b8962e)',
                                color: '#0a0a0f', fontSize: 14, fontWeight: 600,
                                border: 'none', cursor: 'pointer',
                                opacity: loading || !password || !confirm ? 0.5 : 1,
                            }}
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}