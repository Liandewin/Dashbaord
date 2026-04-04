'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { Goal } from './types'
import GoalsSkeleton from './goals-skeleton'

const CATEGORIES = ['Spiritual', 'Financial', 'Health', 'Relationships', 'Personal', 'Career']

const STATUSES = [
    { key: 'todo', label: 'To Do', color: 'var(--column-todo-bg)', accent: 'var(--column-todo-accent)' },
    { key: 'in_progress', label: 'In Progress', color: 'var(--gold-bg-subtle)', accent: 'var(--app-gold)' },
    { key: 'done', label: 'Done', color: 'rgba(74,222,128,0.1)', accent: '#4ade80' },
]

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function GoalsClient() {
    const supabase = createSupabaseBrowserClient()
    const [goals, setGoals] = useState<Goal[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({
        title: '',
        description: '',
        target_date: '',
        category: 'Spiritual',
        status: 'todo' as Goal['status'],
    })

    useEffect(() => {
        async function load() {
            const { data, error } = await supabase
                .from('goals')
                .select('*')
                .order('created_at', { ascending: false })

            if (!error && data) setGoals(data)
            setLoading(false)
        }
        load()
    }, [])

    async function handleSave() {
        if (!form.title) return
        setSaving(true)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('goals')
            .insert({
                user_id: user.id,
                title: form.title,
                description: form.description || null,
                target_date: form.target_date || null,
                category: form.category,
                status: form.status,
            })
            .select()
            .single()

        if (!error && data) {
            setGoals(prev => [data, ...prev])
            setShowForm(false)
            setForm({ title: '', description: '', target_date: '', category: 'Spiritual', status: 'todo' })
        }
        setSaving(false)
    }

    async function handleStatusChange(id: string, status: Goal['status']) {
        await supabase.from('goals').update({ status }).eq('id', id)
        setGoals(prev => prev.map(g => g.id === id ? { ...g, status } : g))
    }

    async function handleDelete(id: string) {
        await supabase.from('goals').delete().eq('id', id)
        setGoals(prev => prev.filter(g => g.id !== id))
    }

    return (
        <div className="page-padding" style={{
            minHeight: '100vh',
            background: 'var(--app-bg)',

            fontFamily: "'DM Sans', sans-serif",
            color: 'var(--app-text)',
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
                .goal-card:hover { background: var(--card-bg-hover) !important; }
            `}</style>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 700, margin: 0, lineHeight: 1.1 }}>
                        My <span style={{ color: 'var(--app-gold)' }}>Goals</span>
                    </h1>
                    <p style={{ color: 'var(--app-text-muted)', marginTop: 6, fontSize: 14 }}>
                        Track and achieve what matters most
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        background: 'var(--gold-bg-medium)', border: '1px solid var(--gold-border)',
                        color: 'var(--app-gold)', padding: '10px 20px', borderRadius: 10,
                        fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    }}
                >
                    + Add Goal
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div style={{
                    background: 'var(--card-bg)', border: '1px solid var(--gold-border-faint)',
                    borderRadius: 16, padding: 24, marginBottom: 32,
                }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, margin: '0 0 20px', fontWeight: 600 }}>
                        Add a Goal
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                            <label style={{ fontSize: 12, color: 'var(--app-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Title *</label>
                            <input
                                type="text"
                                placeholder="What do you want to achieve?"
                                value={form.title}
                                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--card-bg-hover)', border: '1px solid var(--border-medium)', color: 'var(--app-text)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: 12, color: 'var(--app-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Description</label>
                            <textarea
                                placeholder="Describe your goal..."
                                value={form.description}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                rows={2}
                                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--card-bg-hover)', border: '1px solid var(--border-medium)', color: 'var(--app-text)', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: 14 }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: 12, color: 'var(--app-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Category</label>
                                <select
                                    value={form.category}
                                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--card-bg-hover)', border: '1px solid var(--border-medium)', color: 'var(--app-text)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c} style={{ background: 'var(--app-bg)' }}>{c}</option>)}
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: 12, color: 'var(--app-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Status</label>
                                <select
                                    value={form.status}
                                    onChange={e => setForm(f => ({ ...f, status: e.target.value as Goal['status'] }))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--card-bg-hover)', border: '1px solid var(--border-medium)', color: 'var(--app-text)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                                >
                                    <option value="todo" style={{ background: 'var(--app-bg)' }}>To Do</option>
                                    <option value="in_progress" style={{ background: 'var(--app-bg)' }}>In Progress</option>
                                    <option value="done" style={{ background: 'var(--app-bg)' }}>Done</option>
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: 12, color: 'var(--app-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Target Date</label>
                                <input
                                    type="date"
                                    value={form.target_date}
                                    onChange={e => setForm(f => ({ ...f, target_date: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--card-bg-hover)', border: '1px solid var(--border-medium)', color: 'var(--app-text)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
                            <button onClick={() => setShowForm(false)} style={{ padding: '9px 18px', borderRadius: 10, fontSize: 14, cursor: 'pointer', background: 'transparent', border: '1px solid var(--border-medium)', color: 'var(--text-soft)' }}>Cancel</button>
                            <button onClick={handleSave} disabled={saving || !form.title} style={{ padding: '9px 18px', borderRadius: 10, fontSize: 14, cursor: 'pointer', background: 'var(--gold-bg-medium)', border: '1px solid var(--gold-border)', color: 'var(--app-gold)', fontWeight: 600, opacity: saving || !form.title ? 0.5 : 1 }}>
                                {saving ? 'Saving...' : 'Save Goal'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Kanban */}
            {loading ? (
                <GoalsSkeleton />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {STATUSES.map(col => {
                        const colGoals = goals.filter(g => g.status === col.key)
                        const grouped = CATEGORIES.reduce((acc, cat) => {
                            const catGoals = colGoals.filter(g => g.category === cat)
                            if (catGoals.length > 0) acc[cat] = catGoals
                            return acc
                        }, {} as Record<string, Goal[]>)

                        return (
                            <div key={col.key} style={{ background: col.color, border: `1px solid ${col.accent}30`, borderRadius: 16, padding: 20, minHeight: 300 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: col.accent }}>{col.label}</h3>
                                    <span style={{ fontSize: 12, color: col.accent, background: `${col.accent}20`, padding: '2px 10px', borderRadius: 20 }}>{colGoals.length}</span>
                                </div>

                                {colGoals.length === 0 ? (
                                    <p style={{ color: 'var(--text-faint)', fontSize: 13, textAlign: 'center', marginTop: 40 }}>No goals here</p>
                                ) : (
                                    Object.entries(grouped).map(([cat, catGoals]) => (
                                        <div key={cat} style={{ marginBottom: 16 }}>
                                            <div style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{cat}</div>
                                            {catGoals.map(goal => (
                                                <div key={goal.id} className="goal-card" style={{
                                                    background: 'var(--card-bg)', border: '1px solid var(--border-subtle)',
                                                    borderRadius: 12, padding: 14, marginBottom: 8, transition: 'all 0.2s',
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                                                        <span style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.4 }}>{goal.title}</span>
                                                        <button onClick={() => handleDelete(goal.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', fontSize: 12, flexShrink: 0 }}
                                                            onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                                                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-faint)')}
                                                        >✕</button>
                                                    </div>
                                                    {goal.description && <p style={{ fontSize: 12, color: 'var(--app-text-muted)', margin: '6px 0 0', lineHeight: 1.5 }}>{goal.description}</p>}
                                                    {goal.target_date && <p style={{ fontSize: 11, color: 'var(--text-dim)', margin: '8px 0 0' }}>📅 {formatDate(goal.target_date)}</p>}
                                                    <select
                                                        value={goal.status}
                                                        onChange={e => handleStatusChange(goal.id, e.target.value as Goal['status'])}
                                                        style={{ marginTop: 10, width: '100%', padding: '5px 8px', borderRadius: 8, background: 'var(--card-bg-hover)', border: '1px solid var(--border-medium)', color: 'var(--text-medium)', fontSize: 12, outline: 'none', cursor: 'pointer' }}
                                                    >
                                                        <option value="todo" style={{ background: 'var(--app-bg)' }}>To Do</option>
                                                        <option value="in_progress" style={{ background: 'var(--app-bg)' }}>In Progress</option>
                                                        <option value="done" style={{ background: 'var(--app-bg)' }}>Done</option>
                                                    </select>
                                                </div>
                                            ))}
                                        </div>
                                    ))
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}