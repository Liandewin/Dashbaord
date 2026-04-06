import type { Metadata } from 'next'
import BibleTrackerClient from '@/components/bible-tracker/bible-tracker-client'

export const metadata: Metadata = {
    title: 'Bible Tracker',
    description: 'Track your daily Bible reading, build streaks, and visualise your progress through Scripture.',
}

export default function BibleTrackerPage() {
    return <BibleTrackerClient />
}