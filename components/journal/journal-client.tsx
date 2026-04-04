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
        <div className="flex flex-col min-h-screen lg:h-screen" style={{
            background: 'var(--app-bg)',
            fontFamily: "'DM Sans', sans-serif",
            color: 'var(--app-text)',
        }}>
            <style>{`
                .entry-item:hover { background: var(--card-bg-hover) !important; }
                .entry-item.active { background: var(--gold-card-bg) !important; border-color: var(--gold-border-faint) !important; }
            `}</style>

            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 700, margin: 0, lineHeight: 1.1 }}>
                        My <span style={{ color: 'var(--app-gold)' }}>Journal</span>
                    </h1>
                    <p style={{ color: 'var(--app-text-muted)', marginTop: 4, fontSize: 13 }}>
                        {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                    </p>
                </div>
                <button
                    onClick={() => { setIsWriting(true); setSelected(null) }}
                    style={{
                        background: 'var(--gold-bg-medium)', border: '1px solid var(--gold-border)',
                        color: 'var(--app-gold)', padding: '10px 20px', borderRadius: 10,
                        fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    }}
                >
                    + New Entry
                </button>
            </div>

            {/* Body */}
            <div className="flex flex-col-reverse lg:flex-row lg:flex-1 lg:overflow-hidden">

                {/* Left — Writing / Reading area */}
                <div className="flex-1 overflow-y-auto border-t lg:border-t-0 lg:border-r" style={{ padding: '24px', borderColor: 'var(--border-subtle)' }}>
                    {isWriting ? (
                        <div style={{ maxWidth: 680 }}>
                            <input
                                type="text"
                                placeholder="Entry title..."
                                value={form.title}
                                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                style={{
                                    width: '100%', background: 'transparent', border: 'none',
                                    borderBottom: '1px solid var(--border-medium)', color: 'var(--app-text)',
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
                                    background: 'transparent', border: '1px solid var(--border-medium)',
                                    color: 'var(--text-soft)', fontSize: 13, padding: '6px 12px',
                                    borderRadius: 8, outline: 'none', marginBottom: 24,
                                }}
                            />
                            <textarea
                                placeholder="Write your thoughts..."
                                value={form.body}
                                onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                                style={{
                                    width: '100%', background: 'transparent', border: 'none',
                                    color: 'var(--text-strong)', fontSize: 16, lineHeight: 1.8,
                                    outline: 'none', resize: 'none', minHeight: 400,
                                    boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif",
                                }}
                            />
                            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                                <button
                                    onClick={() => setIsWriting(false)}
                                    style={{
                                        padding: '9px 18px', borderRadius: 10, fontSize: 14, cursor: 'pointer',
                                        background: 'transparent', border: '1px solid var(--border-medium)',
                                        color: 'var(--text-soft)',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving || !form.title}
                                    style={{
                                        padding: '9px 18px', borderRadius: 10, fontSize: 14, cursor: 'pointer',
                                        background: 'var(--gold-bg-medium)', border: '1px solid var(--gold-border)',
                                        color: 'var(--app-gold)', fontWeight: 600, opacity: saving || !form.title ? 0.5 : 1,
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
                                    <span style={{ fontSize: 13, color: 'var(--app-text-muted)' }}>
                                        {formatDate(selected.date)}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleDelete(selected.id)}
                                    style={{
                                        background: 'transparent', border: '1px solid var(--border-default)',
                                        color: 'var(--text-dim)', padding: '6px 12px', borderRadius: 8,
                                        fontSize: 13, cursor: 'pointer',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
                                >
                                    Delete
                                </button>
                            </div>
                            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--text-medium)', whiteSpace: 'pre-wrap' }}>
                                {selected.body || <span style={{ color: 'var(--text-faint)', fontStyle: 'italic' }}>No content.</span>}
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 12 }}>
                            <p style={{ fontSize: 40 }}>📓</p>
                            <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>Select an entry or create a new one</p>
                            <button
                                onClick={() => { setIsWriting(true); setSelected(null) }}
                                style={{
                                    background: 'var(--gold-bg-medium)', border: '1px solid var(--gold-border)',
                                    color: 'var(--app-gold)', padding: '10px 20px', borderRadius: 10,
                                    fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 4,
                                }}
                            >
                                + New Entry
                            </button>
                        </div>
                    )}
                </div>

                {/* Right — Entry list */}
                <div className="lg:w-[300px] overflow-y-auto" style={{ padding: 16 }}>
                    {loading ? (
                        <p style={{ color: 'var(--text-dim)', fontSize: 14, padding: 8 }}>Loading...</p>
                    ) : entries.length === 0 ? (
                        <p style={{ color: 'var(--text-dim)', fontSize: 14, padding: 8 }}>No entries yet.</p>
                    ) : (
                        entries.map(entry => (
                            <div
                                key={entry.id}
                                className={`entry-item ${selected?.id === entry.id ? 'active' : ''}`}
                                onClick={() => { setSelected(entry); setIsWriting(false) }}
                                style={{
                                    padding: 14, borderRadius: 12, cursor: 'pointer', marginBottom: 8,
                                    background: 'var(--card-bg-subtle)', border: '1px solid var(--border-subtle)',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {entry.title}
                                </div>
                                <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                                    {formatDate(entry.date)}
                                </div>
                                {entry.body && (
                                    <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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