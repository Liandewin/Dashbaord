'use client'

import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { Prayer } from './types'

interface Props {
    prayers: Prayer[]
    loading: boolean
    onDelete: (id: string) => void
    onToggleAnswered: (id: string, answered: boolean) => void
}

function formatDate(dateStr: string) {
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    if (dateStr === today) return 'Today'
    if (dateStr === yesterdayStr) return 'Yesterday'
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function PrayerList({ prayers, loading, onDelete, onToggleAnswered }: Props) {
    const supabase = createSupabaseBrowserClient()

    async function handleDelete(id: string) {
        await supabase.from('prayer_log').delete().eq('id', id)
        onDelete(id)
    }

    async function handleToggle(id: string, current: boolean) {
        await supabase.from('prayer_log').update({ answered: !current }).eq('id', id)
        onToggleAnswered(id, !current)
    }

    return (
        <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-default)',
            borderRadius: 16,
            padding: 24,
        }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, margin: '0 0 20px', fontWeight: 600 }}>
                Prayer Journal
            </h3>

            {loading ? (
                <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Loading...</p>
            ) : prayers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <p style={{ fontSize: 32, marginBottom: 8 }}>🙏</p>
                    <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>No prayers yet. Log your first one!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {prayers.map(p => (
                        <div key={p.id} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 14,
                            padding: 16,
                            borderRadius: 12,
                            background: 'var(--card-bg-subtle)',
                            border: '1px solid var(--border-subtle)',
                            transition: 'all 0.2s',
                        }}>
                            <button
                                onClick={() => handleToggle(p.id, p.answered)}
                                title={p.answered ? 'Mark as unanswered' : 'Mark as answered'}
                                style={{
                                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                                    background: p.answered ? 'var(--gold-bg-medium)' : 'var(--card-bg-hover)',
                                    border: p.answered ? '1px solid var(--gold-border)' : '1px solid var(--border-default)',
                                    cursor: 'pointer', fontSize: 16, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                }}
                            >
                                {p.answered ? '✅' : '🙏'}
                            </button>

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                    <span style={{ fontWeight: 600, fontSize: 15, color: p.answered ? 'var(--app-gold)' : 'var(--app-text)' }}>
                                        {p.title}
                                    </span>
                                    <span style={{ fontSize: 12, color: 'var(--text-dim)', flexShrink: 0, marginLeft: 12 }}>
                                        {formatDate(p.date)}
                                    </span>
                                </div>
                                {p.body && (
                                    <p style={{ fontSize: 13, color: 'var(--app-text-muted)', margin: 0, lineHeight: 1.5 }}>
                                        {p.body}
                                    </p>
                                )}
                                {p.answered && (
                                    <span style={{ fontSize: 11, color: 'var(--app-gold)', marginTop: 4, display: 'inline-block' }}>
                                        ✨ Answered
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={() => handleDelete(p.id)}
                                style={{
                                    background: 'transparent', border: 'none',
                                    color: 'var(--text-faint)', cursor: 'pointer',
                                    fontSize: 14, padding: 4, flexShrink: 0,
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-faint)')}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}