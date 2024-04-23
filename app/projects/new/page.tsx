import Link from 'next/link'
import { redirect } from 'next/navigation'
import { NewProject } from '@/features/projects/NewProject/NewProject'
import { createClient } from '@/utils/supabase/server'

export default async function NewProjectPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  return (
    <div>
      <p>
        <Link href="/projects">Back to projects</Link>
      </p>
      <NewProject user={user} />
    </div>
  )
}
