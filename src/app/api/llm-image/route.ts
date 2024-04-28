import axios from 'axios'
import FormData from 'form-data'
import { NextRequest } from 'next/server'
import { getClient } from '@/features/llm/constants'
import { LLMImageModel } from '@/features/llm/types'

const fetchOpenAI = async (
  prompt: string,
  imageModel: LLMImageModel,
  url?: string,
): Promise<Response> => {
  const key = process.env.NEXT_PUBLIC_TOGETHER_API_KEY
  if (!key) return new Response(null, { status: 500, statusText: 'API key is missing.' })

  const client = getClient(key, url)
  if (!client) return new Response(null, { status: 500, statusText: 'Client creation failed.' })

  try {
    const response = await client.images.generate({
      prompt: prompt,
      model: imageModel,
    })

    return new Response(JSON.stringify(response.data), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}

const fetchStabilityDiffusionResponse = async (prompt: string): Promise<Response> => {
  const key = process.env.NEXT_PUBLIC_STABILITY_API_KEY
  if (!key) return new Response(null, { status: 500, statusText: 'API key is missing.' })

  const formData = new FormData()
  formData.append('prompt', prompt)
  formData.append('output_format', 'jpeg')

  try {
    const response = await axios.post(
      `https://api.stability.ai/v2beta/stable-image/generate/sd3`,
      formData,
      {
        validateStatus: () => true,
        responseType: 'arraybuffer',
        headers: {
          Authorization: `Bearer ${key}`,
          Accept: 'image/*',
          Model: 'sd3-turbo',
        },
      },
    )

    if (response.status === 200) {
      const blob = new Blob([response.data], { type: 'image/jpeg' })
      return new Response(blob)
    } else {
      return new Response(null, { status: response.status, statusText: response.statusText })
    }
  } catch (error: any) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  const body = await req.json()
  const { prompt, imageModel } = body

  if (imageModel === LLMImageModel.StabilityDiffusion3Turbo) {
    return fetchStabilityDiffusionResponse(prompt)
  }

  return fetchOpenAI(prompt, imageModel, 'https://api.together.xyz/v1')
}
