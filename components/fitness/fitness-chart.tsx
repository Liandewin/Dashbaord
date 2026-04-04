'use client'

import { FitnessEntry } from './types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface Props {
    entries: FitnessEntry[]
}

export default function FitnessChart({ entries }: Props) {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (6 - i))
        const dateStr = d.toISOString().split('T')[0]
        const dayEntries = entries.filter(e => e.date === dateStr)
        return {
            day: d.toLocaleDateString('en-US', { weekday: 'short' }),
            minutes: dayEntries.reduce((acc, e) => acc + e.duration, 0),
            workouts: dayEntries.length,
        }
    })

    return (
        <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-default)',
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
        }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, margin: '0 0 20px', fontWeight: 600 }}>
                Weekly Activity
            </h3>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={last7Days} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                    <XAxis dataKey="day" tick={{ fill: 'var(--text-dim)', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'var(--text-dim)', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                        contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--gold-border-faint)', borderRadius: 10, color: 'var(--app-text)' }}
                        cursor={{ fill: 'var(--card-bg-hover)' }}
                        formatter={(value: any) => [`${value} mins`, 'Duration']}
                    />
                    <Bar dataKey="minutes" fill="var(--app-gold)" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}