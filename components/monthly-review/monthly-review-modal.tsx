'use client'

import { useState, useEffect } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { X, Send } from 'lucide-react'
import { Toast } from '@/components/ui/toast'

function getReviewedMonth() {
    const now = new Date()
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return {
        key: `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`,
        year: prev.getFullYear(),
        month: prev.getMonth(),
        name: prev.toLocaleString('default', { month: 'long' }),
    }
}

function isFirstThreeDays() {
    return new Date().getDate() <= 3
}

function getTier(score: number) {
    if (score >= 80) return { label: 'Warrior', emoji: '⚔️', color: 'var(--app-gold)', description: 'Exceptional month. You showed up and dominated.' }
    if (score >= 60) return { label: 'Soldier', emoji: '🛡️', color: '#a8c5da', description: 'Solid effort. You stayed the course.' }
    if (score >= 40) return { label: 'Recruit', emoji: '🏹', color: '#c8a97e', description: 'You made progress. Keep building the habit.' }
    return { label: 'Apprentice', emoji: '🌱', color: '#7cb97e', description: 'Every warrior starts somewhere. Next month is yours.' }
}

interface Stats {
    bibleChapters: number
    daysInMonth: number
    goalsCompleted: number
    totalGoals: number
    workouts: number
    workoutTarget: number
}

export default function MonthlyReviewModal() {
    const supabase = createSupabaseBrowserClient()
    const [show, setShow] = useState(false)
    const [stats, setStats] = useState<Stats | null>(null)
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

    useEffect(() => {
        async function check() {
            if (!isFirstThreeDays()) return

            const reviewed = getReviewedMonth()

            // Check if already dismissed for this reviewed month
            const { data } = await supabase
                .from('monthly_summaries')
                .select('id')
                .eq('month', reviewed.key)
                .single()

            if (data) return // already seen

            // Fetch stats for the previous (completed) month
            const monthStart = new Date(reviewed.year, reviewed.month, 1).toISOString().split('T')[0]
            const monthEnd = new Date(reviewed.year, reviewed.month + 1, 1).toISOString().split('T')[0]
            const daysInMonth = new Date(reviewed.year, reviewed.month + 1, 0).getDate()

            const [bible, goals, fitness] = await Promise.all([
                supabase.from('bible_reading').select('id').gte('date', monthStart).lt('date', monthEnd),
                supabase.from('goals').select('status'),
                supabase.from('fitness').select('id').gte('date', monthStart).lt('date', monthEnd),
            ])

            setStats({
                bibleChapters: bible.data?.length ?? 0,
                daysInMonth,
                goalsCompleted: goals.data?.filter((g: any) => g.status === 'done').length ?? 0,
                totalGoals: goals.data?.length ?? 0,
                workouts: fitness.data?.length ?? 0,
                workoutTarget: 12,
            })

            setShow(true)
        }

        check()
    }, [])

    async function handleDismiss() {
        await supabase.from('monthly_summaries').insert({
            month: getReviewedMonth().key,
        })
        setShow(false)
    }

    async function handleSendEmail() {
        setSending(true)
        try {
            const res = await fetch('/api/send-monthly', { method: 'POST' })
            if (!res.ok) {
                const body = await res.json().catch(() => ({}))
                setToast({ message: body.error || 'Couldn’t send email. Please try again.', type: 'error' })
                setSending(false)
                setTimeout(() => setToast(null), 4000)
                return
            }
            await handleDismiss()
            setSent(true)
            setToast({ message: 'Monthly review sent to your inbox', type: 'success' })
            setTimeout(() => setToast(null), 4000)
        } catch {
            setToast({ message: 'Couldn’t send email. Please try again.', type: 'error' })
            setTimeout(() => setToast(null), 4000)
        } finally {
            setSending(false)
        }
    }

    if (!show || !stats) return toast ? <Toast message={toast.message} type={toast.type} /> : null

    const bibleScore = Math.min((stats.bibleChapters / stats.daysInMonth) * 100, 100)
    const goalsScore = stats.totalGoals === 0 ? 100 : (stats.goalsCompleted / stats.totalGoals) * 100
    const fitnessScore = Math.min((stats.workouts / stats.workoutTarget) * 100, 100)
    const overallScore = Math.round((bibleScore + goalsScore + fitnessScore) / 3)
    const tier = getTier(overallScore)

    const monthName = getReviewedMonth().name

    return (
        <>
        {toast && <Toast message={toast.message} type={toast.type} />}
        <div style={{
            position: 'fixed', inset: 0, zIndex: 50,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
        }}>
            <div style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--gold-border-subtle)',
                borderRadius: 24,
                padding: 40,
                maxWidth: 520,
                width: '100%',
                position: 'relative',
            }}>
                {/* Close */}
                <button onClick={handleDismiss} style={{
                    position: 'absolute', top: 16, right: 16,
                    background: 'transparent', border: 'none',
                    color: 'var(--text-dim)', cursor: 'pointer',
                }}>
                    <X size={20} />
                </button>

                {/* Header */}
                <p style={{ fontSize: 12, color: 'var(--app-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>
                    Monthly Review — {monthName}
                </p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 700, color: 'var(--app-text)', margin: '0 0 4px' }}>
                    {tier.emoji} {tier.label}
                </h2>
                <p style={{ color: 'var(--app-text-muted)', fontSize: 14, margin: '0 0 32px' }}>
                    {tier.description}
                </p>

                {/* Score */}
                <div style={{
                    background: 'var(--gold-bg-subtle)',
                    border: '1px solid var(--gold-border-faint)',
                    borderRadius: 14, padding: '16px 20px', marginBottom: 24,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <span style={{ fontSize: 13, color: 'var(--app-text-muted)' }}>Overall score</span>
                    <span style={{ fontSize: 28, fontWeight: 700, color: tier.color }}>{overallScore}%</span>
                </div>

                {/* Stat rows */}
                {[
                    { label: '📖 Bible', value: `${stats.bibleChapters} chapters`, score: bibleScore },
                    { label: '🎯 Goals', value: `${stats.goalsCompleted} / ${stats.totalGoals} completed`, score: goalsScore },
                    { label: '💪 Fitness', value: `${stats.workouts} workouts`, score: fitnessScore },
                ].map(row => (
                    <div key={row.label} style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 13, color: 'var(--text-soft)' }}>{row.label}</span>
                            <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{row.value}</span>
                        </div>
                        <div style={{ height: 4, background: 'var(--border-default)', borderRadius: 4 }}>
                            <div style={{
                                height: '100%', borderRadius: 4,
                                width: `${row.score}%`,
                                background: row.score >= 80 ? 'var(--app-gold)' : row.score >= 60 ? '#a8c5da' : '#c8a97e',
                                transition: 'width 0.8s ease',
                            }} />
                        </div>
                    </div>
                ))}

                {/* Actions */}
                <div style={{ display: 'flex', gap: 10, marginTop: 32 }}>
                    <button onClick={handleDismiss} style={{
                        flex: 1, padding: '11px 0', borderRadius: 12, fontSize: 14,
                        background: 'transparent', border: '1px solid var(--border-medium)',
                        color: 'var(--text-dim)', cursor: 'pointer',
                    }}>
                        Dismiss
                    </button>
                    <button onClick={handleSendEmail} disabled={sending || sent} style={{
                        flex: 2, padding: '11px 0', borderRadius: 12, fontSize: 14,
                        background: 'var(--gold-bg-medium)', border: '1px solid var(--gold-border)',
                        color: 'var(--app-gold)', fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        opacity: sending || sent ? 0.6 : 1,
                    }}>
                        <Send size={14} />
                        {sent ? 'Sent!' : sending ? 'Sending...' : 'Send to my email'}
                    </button>
                </div>
            </div>
        </div>
        </>
    )
}
