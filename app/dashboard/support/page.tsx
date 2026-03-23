'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

const faqs = [
    {
        question: 'How do I log a Bible reading?',
        answer: 'Head to the Bible Tracker page from the sidebar. Click "Log Reading", select the book and chapter, pick a date, and optionally add notes or mark it as completed. Your streak updates automatically.',
    },
    {
        question: 'How do I set up my goals?',
        answer: 'Go to the Goals page from the sidebar. Click "Add Goal", fill in the title, category, and target date. Your goal will appear in the To Do column. You can drag it across to In Progress and Done as you make progress.',
    },
    {
        question: 'How do I log a workout?',
        answer: 'Navigate to the Fitness page from the sidebar. Click "Log Workout", enter the workout name, type, duration in minutes, and date. Your weekly activity chart updates automatically.',
    },
    {
        question: 'How do I log a Prayer?',
        answer: 'Go to the Prayer Log page from the sidebar. Click "Add Prayer", enter a title and optional details. Once a prayer is answered, click the prayer icon next to it to mark it as answered.',
    },
]

function FaqItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false)

    return (
        <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${open ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 12,
            overflow: 'hidden',
            transition: 'border-color 0.2s',
        }}>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    width: '100%', padding: '16px 20px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: 'white', fontSize: 15, fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif", textAlign: 'left',
                }}
            >
                <span>{question}</span>
                <span style={{
                    color: '#d4af37', fontSize: 20, lineHeight: 1,
                    transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                    flexShrink: 0, marginLeft: 12,
                }}>+</span>
            </button>
            {open && (
                <div style={{
                    padding: '0 20px 16px',
                    fontSize: 14, color: 'rgba(255,255,255,0.5)',
                    lineHeight: 1.7,
                }}>
                    {answer}
                </div>
            )}
        </div>
    )
}

export default function SupportPage() {
    const supabase = createSupabaseBrowserClient()
    const [form, setForm] = useState({ subject: '', message: '' })
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit() {
        if (!form.subject || !form.message) return
        setLoading(true)
        setError('')

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const res = await fetch('/api/send-feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: `Support Request: ${form.subject}`,
                message: form.message,
            }),
        })

        if (res.ok) {
            setSubmitted(true)
        } else {
            setError('Something went wrong. Please try again.')
        }
        setLoading(false)
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
            `}</style>

            {/* Header */}
            <div style={{ marginBottom: 40 }}>
                <h1 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 42, fontWeight: 700, margin: 0, lineHeight: 1.1,
                }}>
                    How can we <span style={{ color: '#d4af37' }}>Help?</span>
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 6, fontSize: 14 }}>
                    Find answers below or send us a message
                </p>
            </div>

            {/* FAQ Section */}
            <div style={{ maxWidth: 640, marginBottom: 48 }}>
                <p style={{ fontSize: 12, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
                    Frequently Asked Questions
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {faqs.map((faq, i) => (
                        <FaqItem key={i} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>

            {/* Contact Form */}
            <div style={{ maxWidth: 640 }}>
                <p style={{ fontSize: 12, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
                    Still need help?
                </p>

                {submitted ? (
                    <div style={{
                        background: 'rgba(212,175,55,0.08)',
                        border: '1px solid rgba(212,175,55,0.25)',
                        borderRadius: 16, padding: 40,
                        textAlign: 'center',
                    }}>
                        <p style={{ fontSize: 40, marginBottom: 16 }}>✅</p>
                        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>
                            Message sent!
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0 }}>
                            We'll get back to you as soon as possible.
                        </p>
                    </div>
                ) : (
                    <div style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 16, padding: 32,
                        display: 'flex', flexDirection: 'column', gap: 20,
                    }}>
                        <div>
                            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>
                                Subject
                            </label>
                            <input
                                type="text"
                                placeholder="What do you need help with?"
                                value={form.subject}
                                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                                style={{
                                    width: '100%', padding: '10px 14px', borderRadius: 10,
                                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>
                                Message
                            </label>
                            <textarea
                                placeholder="Describe your issue in detail..."
                                value={form.message}
                                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                rows={5}
                                style={{
                                    width: '100%', padding: '10px 14px', borderRadius: 10,
                                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white', fontSize: 14, outline: 'none', resize: 'vertical',
                                    boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif",
                                }}
                            />
                        </div>

                        {error && (
                            <p style={{ fontSize: 13, color: '#f87171' }}>{error}</p>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={loading || !form.subject || !form.message}
                            style={{
                                padding: '12px 0', borderRadius: 10, fontSize: 14, fontWeight: 600,
                                background: 'linear-gradient(135deg, #d4af37, #b8962e)',
                                color: '#0a0a0f', border: 'none', cursor: 'pointer',
                                opacity: loading || !form.subject || !form.message ? 0.5 : 1,
                                transition: 'opacity 0.2s',
                            }}
                        >
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}