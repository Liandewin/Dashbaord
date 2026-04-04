import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function WelcomeHeader() {
    const supabase = await createSupabaseServerClient()

    const { data: { user } } = await supabase.auth.getUser()

    let firstName = 'Friend'

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('first_name')
            .eq('id', user.id)
            .single()

        if (profile?.first_name) firstName = profile.first_name
    }

    return (
        <div>
            <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 42,
                fontWeight: 700,
                margin: 0,
                lineHeight: 1.1,
                color: 'var(--app-text)',
            }}>
                Welcome back, <span style={{ color: 'var(--app-gold)', textTransform: 'capitalize' }}>{firstName}</span> 🙏
            </h1>
            <p style={{ color: 'var(--app-text-muted)', marginTop: 6, fontSize: 14 }}>
                Here's your scripture journey at a glance
            </p>
        </div>
    )
}