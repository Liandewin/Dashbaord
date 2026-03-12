'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { Prayer } from './types'

interface Props {
    onSave: (prayer: Prayer) => void
    onCancel: () => void
}

export default function LogPrayerForm({ onSave, onCancel }: Props) {
    const supabase = createSupabaseBrowserClient()
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({
        title: '',
        body: '',
        date: new Date().toISOString().split('T')[0],
        answered: false,
    })

    async function handleSave() {
        if (!form.title) return
        setSaving(true)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('prayer_log')
            .insert({
                user_id: user.id,
                title: form.title,
                body: form.body || null,
                date: form.date,
                answered: form.answered,
            })
            .select()
            .single()

        if (!error && data) {
            onSave(data)
            setForm({ title: '', body: '', date: new Date().toISOString().split('T')[0], answered: false })
        }
        setSaving(false)
    }

    return (
        <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
        }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, margin: '0 0 20px', fontWeight: 600 }}>
                Log a Prayer
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                    <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                        Title *
                    </label>
                    <input
                        type="text"
                        placeholder="What are you praying for?"
                        value={form.title}
                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        style={{
                            width: '100%', padding: '10px 14px', borderRadius: 10,
                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                            color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box',
                        }}
                    />
                </div>

                <div>
                    <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                        Details
                    </label>
                    <textarea
                        placeholder="Add more details about your prayer..."
                        value={form.body}
                        onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                        rows={3}
                        style={{
                            width: '100%', padding: '10px 14px', borderRadius: 10,
                            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                            color: 'white', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: 14 }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>
                            Date
                        </label>
                        <input
                            type="date"
                            value={form.date}
                            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                            style={{
                                width: '100%', padding: '10px 14px', borderRadius: 10,
                                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                            <input
                                type="checkbox"
                                checked={form.answered}
                                onChange={e => setForm(f => ({ ...f, answered: e.target.checked }))}
                                style={{ accentColor: '#d4af37', width: 16, height: 16 }}
                            />
                            Already answered
                        </label>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
                    <button
                        onClick={onCancel}
                        style={{
                            padding: '9px 18px', borderRadius: 10, fontSize: 14, cursor: 'pointer',
                            background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)',
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
                        {saving ? 'Saving...' : 'Save Prayer'}
                    </button>
                </div>
            </div>
        </div>
    )
}