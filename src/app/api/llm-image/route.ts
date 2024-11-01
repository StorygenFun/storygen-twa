import axios from 'axios'
import FormData from 'form-data'
import { NextRequest } from 'next/server'
import { LLMImageModel } from '@/features/llm/types'

const fetchOpenAI = async (prompt: string, imageModel: LLMImageModel): Promise<Response> => {
  const key = process.env.NEXT_PUBLIC_TOGETHER_API_KEY
  if (!key) return new Response(null, { status: 500, statusText: 'API key is missing.' })

  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: 'Bearer ' + key,
    },
    body: JSON.stringify({
      steps: 4,
      n: 1,
      height: 768,
      width: 768,
      prompt,
      model: imageModel,
    }),
  }
  return fetch('https://api.together.xyz/v1/images/generations', options)
    .then(res => res.json())
    .then(res => {
      console.log('🪲', res)
      return new Response(JSON.stringify(res), {
        headers: { 'Content-Type': 'application/json' },
      })
    })
    .catch(err => {
      console.error(err)
      return new Response(JSON.stringify({ error: err.message }), { status: 500 })
    })
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

  if (imageModel === LLMImageModel.StableDiffusionXL) {
    return fetchStabilityDiffusionResponse(prompt)
  }

  return fetchOpenAI(prompt, imageModel)
}
