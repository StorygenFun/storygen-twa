import axios from 'axios'
import FormData from 'form-data'
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

const fetchStabilityDiffusionResponse = async (prompt: string) => {
  const key = process.env.NEXT_PUBLIC_STABILITY_API_KEY
  if (!key) return Response.error()

  const formData = {
    prompt,
    output_format: 'jpeg',
  }

  try {
    const response = await axios.postForm(
      `https://api.stability.ai/v2beta/stable-image/generate/sd3`,
      axios.toFormData(formData, new FormData()),
      {
        validateStatus: undefined,
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
      return URL.createObjectURL(blob)
    } else {
      throw new Error(`${response.status}: ${response.data.toString()}`)
    }
    return ''
  } catch (error) {
    console.error(error)
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { prompt, model } = body

  if (false && model === LLMImageModel.StabilityDiffusion3Turbo) {
    return fetchStabilityDiffusionResponse(prompt)
  }

  return fetchOpenAI(prompt, model, 'https://api.together.xyz/v1')
}
