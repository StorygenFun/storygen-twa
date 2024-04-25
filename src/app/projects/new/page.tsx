import Link from 'next/link'

export default async function NewProjectPage() {
  return (
    <div>
      <p>
        <Link href="/projects">Back to projects</Link>
      </p>
    </div>
  )
}
