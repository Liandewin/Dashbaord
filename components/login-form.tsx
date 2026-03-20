'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { Spinner } from "@/components/ui/spinner"
import { Toast } from "@/components/ui/toast"


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const supabase = createSupabaseBrowserClient()

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  async function handleLogin() {
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setLoading(false)
      if (error.message.includes('Invalid login credentials')) {
        setError('Incorrect email or password. Please try again.')
      } else if (error.message.includes('Email not confirmed')) {
        setError('Please confirm your email before logging in.')
      } else {
        setError(error.message)
      }
    } else {
      showToast('Welcome back! Redirecting...', 'success')
      setTimeout(() => { window.location.href = '/dashboard' }, 1000)
    }
    setLoading(false)
  }

  async function handleSignUp() {
    setError('')
    if (!firstName || !lastName) {
      setError('Please enter your first and last name.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName }
      }
    })

    if (error) {
      setLoading(false)
      if (error.message.includes('already registered')) {
        setError('An account with this email already exists. Try logging in.')
      } else {
        setError(error.message)
      }
    } else {
      showToast('Account created! Check your email to confirm.', 'success')
      setMessage('Check your email to confirm your account!')
    }
    setLoading(false)
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </CardTitle>
            <CardDescription>
              {mode === 'login' ? 'Login with your Apple or Google account' : 'Sign up to start your growth journey'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={e => e.preventDefault()}>
              <FieldGroup>
                <Field>
                  <Button variant="outline" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" fill="currentColor" />
                    </svg>
                    {mode === 'login' ? 'Login' : 'Sign up'} with Apple
                  </Button>
                  <Button variant="outline" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
                    </svg>
                    {mode === 'login' ? 'Login' : 'Sign up'} with Google
                  </Button>
                </Field>

                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  Or continue with
                </FieldSeparator>

                {mode === 'signup' && (
                  <>
                    <Field>
                      <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        required
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        required
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                      />
                    </Field>
                  </>
                )}

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </Field>

                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    {mode === 'login' && (
                      <Link
                        href="/forgot-password"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </Field>

                {error && (
                  <div className="flex items-center gap-2 rounded-md bg-red-500/10 border border-red-500/20 px-3 py-2">
                    <span className="text-red-400 text-xs">✕</span>
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}
                {message && (
                  <div className="flex items-center gap-2 rounded-md bg-green-500/10 border border-green-500/20 px-3 py-2">
                    <span className="text-green-400 text-xs">✓</span>
                    <p className="text-sm text-green-400">{message}</p>
                  </div>
                )}

                <Field>
                  <Button
                    type="button"
                    onClick={mode === 'login' ? handleLogin : handleSignUp}
                    disabled={loading}
                    className="gap-2"
                  >
                    {loading && <Spinner />}
                    {loading
                      ? (mode === 'login' ? 'Logging in...' : 'Creating account...')
                      : (mode === 'login' ? 'Login' : 'Create Account')
                    }
                  </Button>
                  <FieldDescription className="text-center">
                    {mode === 'login' ? (
                      <>Don&apos;t have an account?{' '}
                        <a href="#" className="underline underline-offset-4" onClick={e => { e.preventDefault(); setMode('signup'); setError(''); setMessage('') }}>
                          Sign up
                        </a>
                      </>
                    ) : (
                      <>Already have an account?{' '}
                        <a href="#" className="underline underline-offset-4" onClick={e => { e.preventDefault(); setMode('login'); setError(''); setMessage('') }}>
                          Log in
                        </a>
                      </>
                    )}
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
        <FieldDescription className="px-6 text-center">
          By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
          and <a href="#">Privacy Policy</a>.
        </FieldDescription>
      </div>
    </>
  )
}