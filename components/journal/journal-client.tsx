'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { JournalEntry } from './types'

export default function JournalClient() {
    const supabase = createSupabaseBrowserClient()
    const [entries, setEntries] = useState<JournalEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState<JournalEntry | null>(null)
    const [isWriting, setIsWriting] = useState(false)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({
        title: '',
        body: '',
        date: new Date().toISOString().split('T')[0],
    })

    useEffect(() => {
        async function load() {
            const { data, error } = await supabase
                .from('journal')
                .select('*')
                .order('date', { ascending: false })

            if (!error && data) {
                setEntries(data)
                if (data.length > 0) setSelected(data[0])
            }
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
            .from('journal')
            .insert({
                user_id: user.id,
                title: form.title,
                body: form.body || null,
                date: form.date,
            })
            .select()
            .single()

        if (!error && data) {
            setEntries(prev => [data, ...prev])
            setSelected(data)
            setIsWriting(false)
            setForm({ title: '', body: '', date: new Date().toISOString().split('T')[0] })
        }
        setSaving(false)
    }

    async function handleDelete(id: string) {
        await supabase.from('journal').delete().eq('id', id)
        const remaining = entries.filter(e => e.id !== id)
        setEntries(remaining)
        setSelected(remaining.length > 0 ? remaining[0] : null)
    }

    function formatDate(dateStr: string) {
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    }

    return (
        <div style={{
            height: '100vh',
            background: '#0a0a0f',
            fontFamily: "'DM Sans', sans-serif",
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
                .entry-item:hover { background: rgba(255,255,255,0.06) !important; }
                .entry-item.active { background: rgba(212,175,55,0.08) !important; border-color: rgba(212,175,55,0.2) !important; }
            `}</style>

            {/* Header */}
            <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 700, margin: 0, lineHeight: 1.1 }}>
                        My <span style={{ color: '#d4af37' }}>Journal</span>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 4, fontSize: 13 }}>
                        {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                    </p>
                </div>
                <button
                    onClick={() => { setIsWriting(true); setSelected(null) }}
                    style={{
                        background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)',
                        color: '#d4af37', padding: '10px 20px', borderRadius: 10,
                        fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    }}
                >
                    + New Entry
                </button>
            </div>

            {/* Body */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                {/* Left — Writing / Reading area */}
                <div style={{ flex: 1, padding: 40, overflowY: 'auto', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                    {isWriting ? (
                        <div style={{ maxWidth: 680 }}>
                            <input
                                type="text"
                                placeholder="Entry title..."
                                value={form.title}
                                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                style={{
                                    width: '100%', background: 'transparent', border: 'none',
                                    borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'white',
                                    fontSize: 28, fontWeight: 700, padding: '0 0 16px',
                                    outline: 'none', marginBottom: 16, boxSizing: 'border-box',
                                    fontFamily: "'Cormorant Garamond', serif",
                                }}
                            />
                            <input
                                type="date"
                                value={form.date}
                                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                style={{
                                    background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'rgba(255,255,255,0.5)', fontSize: 13, padding: '6px 12px',
                                    borderRadius: 8, outline: 'none', marginBottom: 24,
                                }}
                            />
                            <textarea
                                placeholder="Write your thoughts..."
                                value={form.body}
                                onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                                style={{
                                    width: '100%', background: 'transparent', border: 'none',
                                    color: 'rgba(255,255,255,0.8)', fontSize: 16, lineHeight: 1.8,
                                    outline: 'none', resize: 'none', minHeight: 400,
                                    boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif",
                                }}
                            />
                            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                                <button
                                    onClick={() => setIsWriting(false)}
                                    style={{
                                        padding: '9px 18px', borderRadius: 10, fontSize: 14, cursor: 'pointer',
                                        background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'rgba(255,255,255,0.5)',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving || !form.title}
                                    style={{
                                        padding: '9px 18px', borderRadius: 10, fontSize: 14, cursor: 'pointer',
                                        background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)',
                                        color: '#d4af37', fontWeight: 600, opacity: saving || !form.title ? 0.5 : 1,
                                    }}
                                >
                                    {saving ? 'Saving...' : 'Save Entry'}
                                </button>
                            </div>
                        </div>
                    ) : selected ? (
                        <div style={{ maxWidth: 680 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                                <div>
                                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 700, margin: '0 0 8px' }}>
                                        {selected.title}
                                    </h2>
                                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                                        {formatDate(selected.date)}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleDelete(selected.id)}
                                    style={{
                                        background: 'transparent', border: '1px solid rgba(255,255,255,0.08)',
                                        color: 'rgba(255,255,255,0.3)', padding: '6px 12px', borderRadius: 8,
                                        fontSize: 13, cursor: 'pointer',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
                                >
                                    Delete
                                </button>
                            </div>
                            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', whiteSpace: 'pre-wrap' }}>
                                {selected.body || <span style={{ color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>No content.</span>}
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 12 }}>
                            <p style={{ fontSize: 40 }}>📓</p>
                            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>Select an entry or create a new one</p>
                        </div>
                    )}
                </div>

                {/* Right — Entry list */}
                <div style={{ width: 300, overflowY: 'auto', padding: 16 }}>
                    {loading ? (
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, padding: 8 }}>Loading...</p>
                    ) : entries.length === 0 ? (
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, padding: 8 }}>No entries yet.</p>
                    ) : (
                        entries.map(entry => (
                            <div
                                key={entry.id}
                                className={`entry-item ${selected?.id === entry.id ? 'active' : ''}`}
                                onClick={() => { setSelected(entry); setIsWriting(false) }}
                                style={{
                                    padding: 14, borderRadius: 12, cursor: 'pointer', marginBottom: 8,
                                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {entry.title}
                                </div>
                                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                                    {formatDate(entry.date)}
                                </div>
                                {entry.body && (
                                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {entry.body}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}