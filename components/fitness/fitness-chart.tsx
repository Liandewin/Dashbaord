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
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
        }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, margin: '0 0 20px', fontWeight: 600 }}>
                Weekly Activity
            </h3>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={last7Days} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                        contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 10, color: 'white' }}
                        cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                        formatter={(value: any) => [`${value} mins`, 'Duration']}
                    />
                    <Bar dataKey="minutes" fill="rgba(212,175,55,0.6)" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}