import { NextRequest } from 'next/server'
import { getClient } from '@/features/llm/constants'
import { LLMImageModel } from '@/features/llm/types'

export async function POST(req: NextRequest) {
  const key = process.env.NEXT_PUBLIC_TOGETHER_API_KEY
  if (!key) return Response.error()

  const body = await req.json()
  const { prompt, model } = body

  const TOGETHER_AI_URL = 'https://api.together.xyz/v1'
  const client = getClient(key, TOGETHER_AI_URL)

  if (!client) return Response.error()

  try {
    const response = await client.images.generate({
      prompt: prompt || 'Big Boss',
      model: model || LLMImageModel.RealisticVision,
    })

    return Response.json(response.data)
  } catch (error: any) {
    console.error(error)
    throw new Error(error.message)
  }
}
