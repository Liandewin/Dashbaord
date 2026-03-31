import type { Metadata } from 'next'
import GoalsClient from '@/components/goals/goals-client'

export const metadata: Metadata = {
    title: 'Goals',
    description: 'Manage your personal goals on a Kanban board and move them from idea to completion.',
}

export default function GoalsPage() {
    return <GoalsClient />
}