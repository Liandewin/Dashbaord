'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { Goal } from './types'

const CATEGORIES = ['Spiritual', 'Financial', 'Health', 'Relationships', 'Personal', 'Career']

const STATUSES = [
    { key: 'todo', label: 'To Do', color: 'rgba(255,255,255,0.15)', accent: 'rgba(255,255,255,0.5)' },
    { key: 'in_progress', label: 'In Progress', color: 'rgba(212,175,55,0.1)', accent: '#d4af37' },
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
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0f',
            padding: '32px',
            fontFamily: "'DM Sans', sans-serif",
            color: 'white',
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
                .goal-card:hover { background: rgba(255,255,255,0.06) !important; }
            `}</style>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 700, margin: 0, lineHeight: 1.1 }}>
                        My <span style={{ color: '#d4af37' }}>Goals</span>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 6, fontSize: 14 }}>
                        Track and achieve what matters most
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)',
                        color: '#d4af37', padding: '10px 20px', borderRadius: 10,
                        fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    }}
                >
                    + Add Goal
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.2)',
                    borderRadius: 16, padding: 24, marginBottom: 32,
                }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, margin: '0 0 20px', fontWeight: 600 }}>
                        Add a Goal
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Title *</label>
                            <input
                                type="text"
                                placeholder="What do you want to achieve?"
                                value={form.title}
                                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Description</label>
                            <textarea
                                placeholder="Describe your goal..."
                                value={form.description}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                rows={2}
                                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: 14 }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Category</label>
                                <select
                                    value={form.category}
                                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#1a1a2e' }}>{c}</option>)}
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Status</label>
                                <select
                                    value={form.status}
                                    onChange={e => setForm(f => ({ ...f, status: e.target.value as Goal['status'] }))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                                >
                                    <option value="todo" style={{ background: '#1a1a2e' }}>To Do</option>
                                    <option value="in_progress" style={{ background: '#1a1a2e' }}>In Progress</option>
                                    <option value="done" style={{ background: '#1a1a2e' }}>Done</option>
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Target Date</label>
                                <input
                                    type="date"
                                    value={form.target_date}
                                    onChange={e => setForm(f => ({ ...f, target_date: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
                            <button onClick={() => setShowForm(false)} style={{ padding: '9px 18px', borderRadius: 10, fontSize: 14, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>Cancel</button>
                            <button onClick={handleSave} disabled={saving || !form.title} style={{ padding: '9px 18px', borderRadius: 10, fontSize: 14, cursor: 'pointer', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: '#d4af37', fontWeight: 600, opacity: saving || !form.title ? 0.5 : 1 }}>
                                {saving ? 'Saving...' : 'Save Goal'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Kanban */}
            {loading ? (
                <p style={{ color: 'rgba(255,255,255,0.3)' }}>Loading...</p>
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
                                    <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, textAlign: 'center', marginTop: 40 }}>No goals here</p>
                                ) : (
                                    Object.entries(grouped).map(([cat, catGoals]) => (
                                        <div key={cat} style={{ marginBottom: 16 }}>
                                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{cat}</div>
                                            {catGoals.map(goal => (
                                                <div key={goal.id} className="goal-card" style={{
                                                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                                                    borderRadius: 12, padding: 14, marginBottom: 8, transition: 'all 0.2s',
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                                                        <span style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.4 }}>{goal.title}</span>
                                                        <button onClick={() => handleDelete(goal.id)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: 12, flexShrink: 0 }}
                                                            onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                                                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
                                                        >✕</button>
                                                    </div>
                                                    {goal.description && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '6px 0 0', lineHeight: 1.5 }}>{goal.description}</p>}
                                                    {goal.target_date && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '8px 0 0' }}>📅 {formatDate(goal.target_date)}</p>}
                                                    <select
                                                        value={goal.status}
                                                        onChange={e => handleStatusChange(goal.id, e.target.value as Goal['status'])}
                                                        style={{ marginTop: 10, width: '100%', padding: '5px 8px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: 12, outline: 'none', cursor: 'pointer' }}
                                                    >
                                                        <option value="todo" style={{ background: '#1a1a2e' }}>To Do</option>
                                                        <option value="in_progress" style={{ background: '#1a1a2e' }}>In Progress</option>
                                                        <option value="done" style={{ background: '#1a1a2e' }}>Done</option>
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