'use client'

import { FC, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

type Props = {
  user: User
}

export const NewProject: FC<Props> = ({ user }) => {
  const supabase = createClient()
  const router = useRouter()

  const [status, setStatus] = useState('draft')
  const [story, setStory] = useState(`{"title": "New project"}`)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (event: any) => {
    event.preventDefault()
    setLoading(true)

    const { data, error } = await supabase
      .from('projects')
      .insert([{ user_id: user.id, status: status, story: JSON.parse(story) }])
      .select('*')
    console.log('🚀 ~ handleSubmit ~ data:', data)

    if (error) {
      setMessage('Error while creating project: ' + error.message)
    } else {
      setMessage('The project has been created successfully!')
      setStory('')
      setStatus('draft')
      router.push(`/projects/${data[0].id}`)
    }

    setLoading(false)
  }

  return (
    <div>
      <h1>Create new project</h1>
      <form onSubmit={handleSubmit}>
        <p>
          <label htmlFor="status">Status of the project:</label>
          <br />
          <select id="status" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </p>

        <p>
          <label htmlFor="story">Your story (in the JSON format):</label>
          <br />
          <textarea
            id="story"
            value={story}
            onChange={e => setStory(e.target.value)}
            placeholder='{"content": "Your story here..."}'
          />
        </p>

        <p>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create the project'}
          </button>
        </p>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}
