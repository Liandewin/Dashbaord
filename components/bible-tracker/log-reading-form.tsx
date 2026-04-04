'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { BibleReading } from './types'

const BIBLE_BOOKS = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
    '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
    'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
    'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
    'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah',
    'Malachi', 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians',
    '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians',
    '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon',
    'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation',
]

interface Props {
    onSave: (reading: BibleReading) => void
    onCancel: () => void
}

export default function LogReadingForm({ onSave, onCancel }: Props) {
    const supabase = createSupabaseBrowserClient()
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({
        book: '',
        chapter: '',
        date: new Date().toISOString().split('T')[0],
        completed: false,
        notes: '',
    })

    async function handleSave() {
        if (!form.book || !form.chapter) return
        setSaving(true)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('bible_reading')
            .insert({
                user_id: user.id,
                book: form.book,
                chapter: parseInt(form.chapter),
                date: form.date,
                completed: form.completed,
                notes: form.notes,
            })
            .select()
            .single()

        if (!error && data) {
            onSave(data)
            setForm({ book: '', chapter: '', date: new Date().toISOString().split('T')[0], completed: false, notes: '' })
        }
        setSaving(false)
    }

    return (
        <div className="glass-card" style={{ padding: 24, marginBottom: 28 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, margin: '0 0 20px', color: 'var(--app-gold)' }}>
                Log New Reading
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <div>
                    <label className="form-label">Book</label>
                    <select
                        className="form-input"
                        value={form.book}
                        onChange={e => setForm(f => ({ ...f, book: e.target.value }))}
                    >
                        <option value="">Select a book...</option>
                        {BIBLE_BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                </div>
                <div>
                    <label className="form-label">Chapter</label>
                    <input
                        type="number"
                        className="form-input"
                        placeholder="e.g. 3"
                        min={1}
                        value={form.chapter}
                        onChange={e => setForm(f => ({ ...f, chapter: e.target.value }))}
                    />
                </div>
                <div>
                    <label className="form-label">Date</label>
                    <input
                        type="date"
                        className="form-input"
                        value={form.date}
                        onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    />
                </div>
            </div>

            <div style={{ marginBottom: 12 }}>
                <label className="form-label">Notes / Reflection</label>
                <textarea
                    className="form-input"
                    placeholder="What stood out to you today?"
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    style={{ height: 80, resize: 'none' }}
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-soft)', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={form.completed}
                        onChange={e => setForm(f => ({ ...f, completed: e.target.checked }))}
                        style={{ accentColor: 'var(--app-gold)', width: 16, height: 16 }}
                    />
                    Mark as completed
                </label>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                    <button className="btn-ghost" onClick={onCancel}>Cancel</button>
                    <button className="btn-gold" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Reading'}
                    </button>
                </div>
            </div>
        </div>
    )
}