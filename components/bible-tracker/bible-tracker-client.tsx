'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { BibleReading } from '@/components/bible-tracker/types'
import StatsCards from '@/components/bible-tracker/stats-cards'
import ProgressChart from '@/components/bible-tracker/progress-chart'
import RecentReadings from '@/components/bible-tracker/recent-readings'
import LogReadingForm from '@/components/bible-tracker/log-reading-form'
import { WelcomeHeader } from '@/components/bible-tracker/welcome-header'

export default function BibleTrackerPage() {
    const supabase = createSupabaseBrowserClient()
    const [readings, setReadings] = useState<BibleReading[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        async function load() {
            const { data, error } = await supabase
                .from('bible_readings')
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
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0f',
            padding: '32px',
            fontFamily: "'DM Sans', sans-serif",
            color: 'white',
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .glass-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          backdrop-filter: blur(12px);
          transition: all 0.3s ease;
        }
        .glass-card:hover { background: rgba(255,255,255,0.06); border-color: rgba(212,175,55,0.2); }
        .gold-card {
          background: linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.04));
          border: 1px solid rgba(212,175,55,0.25);
          border-radius: 16px;
        }
        .btn-gold {
          background: linear-gradient(135deg, #d4af37, #b8962e);
          color: #0a0a0f;
          border: none;
          border-radius: 10px;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px rgba(212,175,55,0.2);
        }
        .btn-gold:hover { transform: translateY(-1px); box-shadow: 0 0 30px rgba(212,175,55,0.35); }
        .btn-ghost {
          background: transparent;
          color: rgba(255,255,255,0.5);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 10px 20px;
          font-size: 14px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .btn-ghost:hover { border-color: rgba(212,175,55,0.3); color: #d4af37; }
        .form-label {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          display: block;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .form-input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 10px 14px;
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          width: 100%;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-input:focus { border-color: rgba(212,175,55,0.5); }
        .form-input option { background: #1a1a2e; }
        .reading-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          transition: all 0.2s;
        }
        .reading-row:hover { background: rgba(255,255,255,0.06); border-color: rgba(212,175,55,0.15); }
        .delete-btn {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.2);
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

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
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