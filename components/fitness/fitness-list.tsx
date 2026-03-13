'use client'

import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { FitnessEntry } from './types'

interface Props {
    entries: FitnessEntry[]
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

const TYPE_COLORS: Record<string, string> = {
    Cardio: '#f87171',
    Strength: '#d4af37',
    Flexibility: '#4ade80',
    Sports: '#60a5fa',
    Other: 'rgba(255,255,255,0.4)',
}

export default function FitnessList({ entries, loading, onDelete }: Props) {
    const supabase = createSupabaseBrowserClient()

    async function handleDelete(id: string) {
        await supabase.from('fitness').delete().eq('id', id)
        onDelete(id)
    }

    return (
        <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: 24,
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, margin: 0, fontWeight: 600 }}>
                    Workout History
                </h3>
                <span style={{ fontSize: 12, color: '#d4af37' }}>{entries.length} total</span>
            </div>

            {loading ? (
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Loading...</p>
            ) : entries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <p style={{ fontSize: 32, marginBottom: 8 }}>🏋️</p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No workouts yet. Log your first one!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {entries.map(e => (
                        <div key={e.id} style={{
                            display: 'flex', alignItems: 'center', gap: 14, padding: 14,
                            borderRadius: 12, background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.2s',
                        }}>
                            <div style={{
                                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                                background: `${TYPE_COLORS[e.type] || TYPE_COLORS.Other}20`,
                                border: `1px solid ${TYPE_COLORS[e.type] || TYPE_COLORS.Other}40`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                            }}>
                                💪
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                    <span style={{ fontWeight: 600, fontSize: 15 }}>{e.title}</span>
                                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', flexShrink: 0, marginLeft: 12 }}>
                                        {formatDate(e.date)}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                    <span style={{
                                        fontSize: 11, padding: '2px 8px', borderRadius: 20,
                                        background: `${TYPE_COLORS[e.type] || TYPE_COLORS.Other}20`,
                                        color: TYPE_COLORS[e.type] || TYPE_COLORS.Other,
                                        border: `1px solid ${TYPE_COLORS[e.type] || TYPE_COLORS.Other}30`,
                                    }}>
                                        {e.type}
                                    </span>
                                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>⏱ {e.duration} mins</span>
                                    {e.notes && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.notes}</span>}
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(e.id)}
                                style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: 14, padding: 4, flexShrink: 0 }}
                                onMouseEnter={ev => (ev.currentTarget.style.color = '#ef4444')}
                                onMouseLeave={ev => (ev.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
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