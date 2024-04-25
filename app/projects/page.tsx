import Link from 'next/link'

export default async function ProjectsPage() {
  return (
    <div>
      <p>
        <Link href="/projects/new">New project</Link>
      </p>
    </div>
  )
}
