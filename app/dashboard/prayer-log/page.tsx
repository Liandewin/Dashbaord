import type { Metadata } from 'next'
import PrayerLogClient from '@/components/prayer-log/prayer-log-client'

export const metadata: Metadata = {
    title: 'Prayer Log',
    description: 'Record prayer requests, mark answered prayers, and track your prayer consistency.',
}

export default function PrayerLogPage() {
    return <PrayerLogClient />
}