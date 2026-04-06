'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { BibleReading } from '@/components/bible-tracker/types'
import StatsCards from '@/components/bible-tracker/stats-cards'
import ProgressChart from '@/components/bible-tracker/progress-chart'
import RecentReadings from '@/components/bible-tracker/recent-readings'
import LogReadingForm from '@/components/bible-tracker/log-reading-form'

export default function BibleTrackerPage() {
    const supabase = createSupabaseBrowserClient()
    const [readings, setReadings] = useState<BibleReading[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        async function load() {
            const { data, error } = await supabase
                .from('bible_reading')
                .select('*')
                .order('date', { ascending: false })

            if (!error && data) setReadings(data)
            setLoading(false)
        }
        load()
    }, [])

    function handleSave(reading: BibleReading) {
        setReadings(prev => [reading, ...prev])
        setShowForm(false)
    }

    function handleDelete(id: string) {
        setReadings(prev => prev.filter(r => r.id !== id))
    }

    return (
        <div className="page-padding" style={{
            minHeight: '100vh',
            background: 'var(--app-bg)',
            fontFamily: "'DM Sans', sans-serif",
            color: 'var(--app-text)',
        }}>
            <style>{`
        .glass-card {
          background: var(--card-bg);
          border: 1px solid var(--border-default);
          border-radius: 16px;
          backdrop-filter: blur(12px);
          transition: all 0.3s ease;
        }
        .glass-card:hover { background: var(--card-bg-hover); border-color: var(--gold-border-faint); }
        .gold-card {
          background: linear-gradient(135deg, var(--gold-bg-subtle), var(--gold-card-bg));
          border: 1px solid var(--gold-border-subtle);
          border-radius: 16px;
        }
        .btn-gold {
          background: linear-gradient(135deg, var(--app-gold), #b8962e);
          color: var(--app-bg);
          border: none;
          border-radius: 10px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px var(--gold-bg-strong);
        }
        .btn-gold:hover { transform: translateY(-1px); box-shadow: 0 0 30px var(--gold-bg-strong); }
        .btn-ghost {
          background: transparent;
          color: var(--text-soft);
          border: 1px solid var(--border-medium);
          border-radius: 10px;
          padding: 10px 20px;
          font-size: 14px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .btn-ghost:hover { border-color: var(--gold-border); color: var(--app-gold); }
        .form-label {
          font-size: 12px;
          color: var(--app-text-muted);
          display: block;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .form-input {
          background: var(--card-bg-hover);
          border: 1px solid var(--border-medium);
          border-radius: 10px;
          padding: 10px 14px;
          color: var(--app-text);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          width: 100%;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-input:focus { border-color: var(--gold-border); }
        .form-input option { background: var(--app-bg); }
        .reading-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 12px;
          background: var(--card-bg-subtle);
          border: 1px solid var(--border-subtle);
          transition: all 0.2s;
        }
        .reading-row:hover { background: var(--card-bg-hover); border-color: var(--gold-bg-medium); }
        .delete-btn {
          background: transparent;
          border: none;
          color: var(--text-faint);
          cursor: pointer;
          font-size: 14px;
          padding: 4px;
          transition: color 0.2s;
        }
        .delete-btn:hover { color: #ef4444; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeInUp 0.5s ease forwards; }
      `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                <div>
                    <h1 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 42, fontWeight: 700, margin: 0, lineHeight: 1.1, color: 'var(--app-text)',
                    }}>
                        Bible <span style={{ color: 'var(--app-gold)' }}>Tracker</span>
                    </h1>
                    <p style={{ color: 'var(--app-text-muted)', marginTop: 6, fontSize: 14 }}>
                        Track your daily reading and build a lasting streak
                    </p>
                </div>
                <button className="btn-gold" onClick={() => setShowForm(!showForm)}>
                    + Log Reading
                </button>
            </div>


            {/* Log Form */}
            {showForm && (
                <LogReadingForm
                    onSave={handleSave}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {/* Stats */}
            <StatsCards readings={readings} loading={loading} />

            {/* Chart + Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ProgressChart readings={readings} />
                <RecentReadings readings={readings} loading={loading} onDelete={handleDelete} />
            </div>
        </div>
    )
}