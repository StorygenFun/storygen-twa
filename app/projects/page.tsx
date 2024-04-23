import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function ProjectsPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <p>
        <Link href="/projects/new">New project</Link>
      </p>

      <ul>
        {projects?.map(project => (
          <li key={project.id}>
            <Link href={`/projects/${project.id}`}>{project.id}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
