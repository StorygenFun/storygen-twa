import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { SubmitButton } from './submit-button'

export default function Login({ searchParams }: { searchParams: { message: string } }) {
  const signIn = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect('/login?message=Could not authenticate user')
    }

    return redirect('/projects')
  }

  const signUp = async (formData: FormData) => {
    'use server'

    const origin = headers().get('origin')
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      return redirect('/login?message=Could not authenticate user')
    }

    return redirect('/login?message=Check email to continue sign in process')
  }

  return (
    <div>
      <Link href="/">Back</Link>

      <form>
        <p>
          <label htmlFor="email">Email</label>
          <br />
          <input name="email" placeholder="you@example.com" required />
        </p>

        <p>
          <label htmlFor="password">Password</label>
          <br />
          <input type="password" name="password" placeholder="••••••••" required />
        </p>

        <p>
          <SubmitButton formAction={signIn} pendingText="Signing In...">
            Sign In
          </SubmitButton>{' '}
          <SubmitButton formAction={signUp} pendingText="Signing Up...">
            Sign Up
          </SubmitButton>
        </p>

        {searchParams?.message && <p>{searchParams.message}</p>}
      </form>
    </div>
  )
}
