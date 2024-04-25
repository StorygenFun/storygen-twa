'use client'

import { FC } from 'react'
import axios from 'axios'

export const OpenAiConnector: FC = () => {
  const fetchData = async () => {
    try {
      const res = await axios.post('/api/openai', {
        prompt: 'Hello, world!',
        systemMessage: 'You are a mega-robot.',
      })

      console.log(res.data)
    } catch (error) {
      console.error('Failed to fetch API', error)
    }
  }

  return (
    <div>
      <button onClick={fetchData}>Test OpenAI</button>
    </div>
  )
}
