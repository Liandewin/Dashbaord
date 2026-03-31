import type { Metadata } from 'next'
import JournalClient from '@/components/journal/journal-client'

export const metadata: Metadata = {
    title: 'Journal',
    description: 'Write and reflect in a distraction-free personal journal.',
}

export default function JournalPage() {
    return <JournalClient />
}