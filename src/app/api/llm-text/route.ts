import { NextRequest } from 'next/server'
import { getClient } from '@/features/llm/constants'
import { LLMTextModel } from '@/features/llm/types'

const fetchOpenAI = async (
  systemMessage: string,
  prompt: string,
  model: LLMTextModel,
  url?: string,
) => {
  const key = process.env.NEXT_PUBLIC_TOGETHER_API_KEY
  if (!key) return Response.error()

  const client = getClient(key, url)

  if (!client) return Response.error()

  try {
    const response = await client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemMessage,
        },
        {
          role: 'user',
          content: prompt || '',
        },
      ],
      model: model || LLMTextModel.LLaMA3Chat70B,
    })

    return Response.json(response.choices[0].message.content?.trim())
  } catch (error: any) {
    console.error(error)
    throw new Error(error.message)
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { prompt, systemMessage, model } = body

  return fetchOpenAI(systemMessage, prompt, model, 'https://api.together.xyz/v1')
}
