import { Resend } from 'resend'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import FeedbackNotificationEmail from '@/app/email/feedback-notification'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
    const supabase = await createSupabaseServerClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name, message } = await request.json()

    if (!name || !message) {
        return NextResponse.json({ error: 'Name and message are required' }, { status: 400 })
    }

    // Save to Supabase
    const { error: dbError } = await supabase
        .from('feedback')
        .insert({ user_id: user.id, name, message })

    if (dbError) {
        return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 })
    }

    // Email notification to you
    await resend.emails.send({
    from: 'Faith & Growth Tracker <noreply@faith-growth-tracker.co.za>',
    to: user.email!,
    subject: '💬 New Feedback Received',
    react: FeedbackNotificationEmail({ name, message }),
})

    return NextResponse.json({ success: true })
}