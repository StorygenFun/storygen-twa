import { NextRequest } from 'next/server'
import { getClient } from '@/features/llm/constants'
import { LLMTextModel } from '@/features/llm/types'

const fetchOpenAI = async (
  systemMessage: string,
  prompt: string,
  model: LLMTextModel,
  url?: string,
): Promise<Response> => {
  const key = process.env.NEXT_PUBLIC_TOGETHER_API_KEY
  if (!key) {
    return new Response(null, { status: 500, statusText: 'API key is missing.' })
  }

  const client = getClient(key, url)
  if (!client) {
    return new Response(null, { status: 500, statusText: 'Client creation failed.' })
  }

  if (!prompt) {
    return new Response(null, { status: 500, statusText: 'Prompt is missing.' })
  }

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
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  const body = await req.json()
  const { systemMessage, prompt, model } = body

  return fetchOpenAI(systemMessage, prompt, model, 'https://api.together.xyz/v1')
}
