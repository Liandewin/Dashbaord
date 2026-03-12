'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { Prayer } from './types'
import PrayerStatsCards from './stats-cards'
import PrayerList from './prayer-list'
import LogPrayerForm from './log-prayer-form'

export default function PrayerLogClient() {
    const supabase = createSupabaseBrowserClient()
    const [prayers, setPrayers] = useState<Prayer[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        async function load() {
            const { data, error } = await supabase
                .from('prayer_log')
                .select('*')
                .order('date', { ascending: false })

            if (!error && data) setPrayers(data)
            setLoading(false)
        }
        load()
    }, [])

    function handleSave(prayer: Prayer) {
        setPrayers(prev => [prayer, ...prev])
        setShowForm(false)
    }

    function handleDelete(id: string) {
        setPrayers(prev => prev.filter(p => p.id !== id))
    }

    function handleToggleAnswered(id: string, answered: boolean) {
        setPrayers(prev => prev.map(p => p.id === id ? { ...p, answered } : p))
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
                .btn-gold {
                    background: rgba(212,175,55,0.15);
                    border: 1px solid rgba(212,175,55,0.3);
                    color: #d4af37;
                    padding: 10px 20px;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-gold:hover {
                    background: rgba(212,175,55,0.25);
                    border-color: rgba(212,175,55,0.5);
                }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                    <h1 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 42, fontWeight: 700, margin: 0, lineHeight: 1.1, color: 'white',
                    }}>
                        Prayer <span style={{ color: '#d4af37' }}>Log</span>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 6, fontSize: 14 }}>
                        Track your prayers and celebrate answered ones
                    </p>
                </div>
                <button className="btn-gold" onClick={() => setShowForm(!showForm)}>
                    + Add Prayer
                </button>
            </div>

            {showForm && (
                <LogPrayerForm
                    onSave={handleSave}
                    onCancel={() => setShowForm(false)}
                />
            )}

            <PrayerStatsCards prayers={prayers} loading={loading} />
            <PrayerList
                prayers={prayers}
                loading={loading}
                onDelete={handleDelete}
                onToggleAnswered={handleToggleAnswered}
            />
        </div>
    )
}