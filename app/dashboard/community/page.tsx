import type { Metadata } from 'next'
import CommunityClient from '@/components/community/community-client'

export const metadata: Metadata = {
    title: 'Community',
}

export default function CommunityPage() {
    return <CommunityClient />
}
