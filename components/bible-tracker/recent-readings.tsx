'use client'

import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { BibleReading } from './types'

interface Props {
    readings: BibleReading[]
    loading: boolean
    onDelete: (id: string) => void
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

export default function RecentReadings({ readings, loading, onDelete }: Props) {
    const supabase = createSupabaseBrowserClient()

    async function handleDelete(id: string) {
        await supabase.from('bible_reading').delete().eq('id', id)
        onDelete(id)
    }

    return (
        <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, margin: 0, fontWeight: 600 }}>
                    Recent Readings
                </h3>
                <span style={{ fontSize: 12, color: 'var(--app-gold)' }}>{readings.length} total</span>
            </div>

            {loading ? (
                <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Loading...</p>
            ) : readings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                    <p style={{ fontSize: 32, marginBottom: 8 }}>📖</p>
                    <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>No readings yet. Log your first one!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 280, overflowY: 'auto' }}>
                    {readings.slice(0, 8).map((r) => (
                        <div key={r.id} className="reading-row">
                            <div style={{
                                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                                background: r.completed ? 'var(--gold-bg-medium)' : 'var(--card-bg-hover)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                                border: r.completed ? '1px solid var(--gold-border)' : '1px solid var(--border-default)',
                            }}>
                                {r.completed ? '✝️' : '📖'}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: 14 }}>{r.book} {r.chapter}</div>
                                {r.notes && (
                                    <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {r.notes}
                                    </div>
                                )}
                            </div>
                            <span style={{ fontSize: 12, color: 'var(--text-dim)', flexShrink: 0 }}>{formatDate(r.date)}</span>
                            <button className="delete-btn" onClick={() => handleDelete(r.id)}>✕</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}