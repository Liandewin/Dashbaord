import type { Metadata } from 'next'
import FitnessClient from '@/components/fitness/fitness-client'

export const metadata: Metadata = {
    title: 'Fitness',
    description: 'Log your workouts, track duration, and visualise your fitness consistency over time.',
}

export default function FitnessPage() {
    return <FitnessClient />
}