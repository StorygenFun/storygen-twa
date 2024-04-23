import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function ProjectPage(context: { params: { id: string } }) {
  const { params } = context
  const { id } = params

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: project, error } = await supabase.from('projects').select('*').eq('id', id).single()

  return (
    <div>
      <p>
        <Link href="/projects">Back to projects</Link>
      </p>

      <h1>Project: {project?.title}</h1>
      {error ? (
        <p>Something went wrong...</p>
      ) : (
        <div>
          <p>Status: {project.status}</p>
          <p>Content: {JSON.stringify(project.story)}</p>
          <p>Last update: {new Date(project.updated_at).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  )
}
