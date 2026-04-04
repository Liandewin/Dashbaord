'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg border border-[var(--border-subtle)] text-[var(--text-faint)] hover:text-[var(--app-gold)] hover:border-[var(--gold-border-faint)] hover:bg-[var(--gold-card-bg)] transition-all duration-200"
            aria-label="Toggle theme"
        >
            {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
    )
}