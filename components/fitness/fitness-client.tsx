'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { FitnessEntry } from './types'
import FitnessStatsCards from './stats-cards'
import FitnessChart from './fitness-chart'
import FitnessList from './fitness-list'

const WORKOUT_TYPES = ['Cardio', 'Strength', 'Flexibility', 'Sports', 'Other']

export default function FitnessClient() {
    const supabase = createSupabaseBrowserClient()
    const [entries, setEntries] = useState<FitnessEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({
        title: '',
        type: 'Cardio',
        duration: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
    })

    useEffect(() => {
        async function load() {
            const { data, error } = await supabase
                .from('fitness')
                .select('*')
                .order('date', { ascending: false })

            if (!error && data) setEntries(data)
            setLoading(false)
        }
        load()
    }, [])

    async function handleSave() {
        if (!form.title || !form.duration) return
        setSaving(true)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('fitness')
            .insert({
                user_id: user.id,
                title: form.title,
                type: form.type,
                duration: parseInt(form.duration),
                date: form.date,
                notes: form.notes || null,
            })
            .select()
            .single()

        if (!error && data) {
            setEntries(prev => [data, ...prev])
            setShowForm(false)
            setForm({ title: '', type: 'Cardio', duration: '', date: new Date().toISOString().split('T')[0], notes: '' })
        }
        setSaving(false)
    }

    function handleDelete(id: string) {
        setEntries(prev => prev.filter(e => e.id !== id))
    }

    return (
        <div className="page-padding" style={{
            minHeight: '100vh',
            background: 'var(--app-bg)',

            fontFamily: "'DM Sans', sans-serif",
            color: 'var(--app-text)',
        }}>
            <style>{`
                .btn-gold {
                    background: var(--gold-bg-medium);
                    border: 1px solid var(--gold-border);
                    color: var(--app-gold);
                    padding: 10px 20px;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-gold:hover {
                    background: var(--gold-bg-strong);
                    border-color: var(--gold-border);
                }
            `}</style>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 700, margin: 0, lineHeight: 1.1 }}>
                        My <span style={{ color: 'var(--app-gold)' }}>Fitness</span>
                    </h1>
                    <p style={{ color: 'var(--app-text-muted)', marginTop: 6, fontSize: 14 }}>
                        Track your workouts and stay consistent
                    </p>
                </div>
                <button className="btn-gold" onClick={() => setShowForm(!showForm)}>
                    + Log Workout
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div style={{
                    background: 'var(--card-bg)', border: '1px solid var(--gold-border-faint)',
                    borderRadius: 16, padding: 24, marginBottom: 32,
                }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, margin: '0 0 20px', fontWeight: 600 }}>
                        Log a Workout
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2">
                                <label style={{ fontSize: 12, color: 'var(--app-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Workout Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Morning Run"
                                    value={form.title}
                                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--card-bg-hover)', border: '1px solid var(--border-medium)', color: 'var(--app-text)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: 12, color: 'var(--app-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Type</label>
                                <select
                                    value={form.type}
                                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--card-bg-hover)', border: '1px solid var(--border-medium)', color: 'var(--app-text)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                                >
                                    {WORKOUT_TYPES.map(t => <option key={t} value={t} style={{ background: 'var(--app-bg)' }}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label style={{ fontSize: 12, color: 'var(--app-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Duration (mins) *</label>
                                <input
                                    type="number"
                                    placeholder="45"
                                    value={form.duration}
                                    onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--card-bg-hover)', border: '1px solid var(--border-medium)', color: 'var(--app-text)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: 12, color: 'var(--app-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Date</label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--card-bg-hover)', border: '1px solid var(--border-medium)', color: 'var(--app-text)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: 12, color: 'var(--app-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Notes</label>
                            <textarea
                                placeholder="Any notes about this workout..."
                                value={form.notes}
                                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                                rows={2}
                                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--card-bg-hover)', border: '1px solid var(--border-medium)', color: 'var(--app-text)', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
                            <button onClick={() => setShowForm(false)} style={{ padding: '9px 18px', borderRadius: 10, fontSize: 14, cursor: 'pointer', background: 'transparent', border: '1px solid var(--border-medium)', color: 'var(--text-soft)' }}>Cancel</button>
                            <button onClick={handleSave} disabled={saving || !form.title || !form.duration} style={{ padding: '9px 18px', borderRadius: 10, fontSize: 14, cursor: 'pointer', background: 'var(--gold-bg-medium)', border: '1px solid var(--gold-border)', color: 'var(--app-gold)', fontWeight: 600, opacity: saving || !form.title || !form.duration ? 0.5 : 1 }}>
                                {saving ? 'Saving...' : 'Save Workout'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <FitnessStatsCards entries={entries} loading={loading} />
            <FitnessChart entries={entries} />
            <FitnessList entries={entries} loading={loading} onDelete={handleDelete} />
        </div>
    )
}