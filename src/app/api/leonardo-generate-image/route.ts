import axios from 'axios'
import { NextRequest } from 'next/server'
import { LeonardoModel } from '@/features/llm/types'

const fetchLeonardoResponse = async (prompt: string): Promise<Response> => {
  const key = process.env.NEXT_PUBLIC_LEONARDO_API_KEY
  if (!key) {
    return new Response(null, { status: 500, statusText: 'API key is missing.' })
  }

  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    data: JSON.stringify({
      alchemy: false,
      modelId: LeonardoModel.LightningXL,
      num_images: 1,
      presetStyle: 'DYNAMIC',
      photoReal: false,
      prompt: prompt,
      width: 1024,
      height: 1024,
      num_inference_steps: 10,
      guidance_scale: 7,
      sd_version: 'SDXL_LIGHTNING',
      scheduler: 'LEONARDO',
      public: false,
      tiling: false,
      weighting: 0.75,
      highContrast: false,
      elements: [],
      transparency: 'disabled',
    }),
    url: 'https://cloud.leonardo.ai/api/rest/v1/generations',
  }

  try {
    const response = await axios(options)
    const generationId = response.data.sdGenerationJob.generationId
    return Response.json(generationId)
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  const body = await req.json()
  const { prompt } = body

  return fetchLeonardoResponse(prompt)
}
