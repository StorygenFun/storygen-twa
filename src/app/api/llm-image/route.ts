import { NextRequest } from 'next/server'
import { getClient } from '@/features/llm/constants'
import { LLMImageModel } from '@/features/llm/types'

const fetchOpenAI = async (prompt: string, model: LLMImageModel, url?: string) => {
  const key = process.env.NEXT_PUBLIC_TOGETHER_API_KEY
  if (!key) return Response.error()

  const client = getClient(key, url)

  if (!client) return Response.error()

  try {
    const response = await client.images.generate({
      prompt: prompt,
      model: model,
    })

    return Response.json(response.data)
  } catch (error: any) {
    console.error(error)
    throw new Error(error.message)
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { prompt, model } = body

  return fetchOpenAI(prompt, model, 'https://api.together.xyz/v1')
}
