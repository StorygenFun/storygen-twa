import axios from 'axios'
import { NextRequest } from 'next/server'

const fetchLeonardoResponse = async (generationId: string) => {
  const key = process.env.NEXT_PUBLIC_LEONARDO_API_KEY
  if (!key) return Response.error()

  return axios({
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${key}`,
    },
    url: `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`,
  })
    .then(response => {
      const imageUrl = response?.data?.generations_by_pk?.generated_images?.[0]?.url
      console.log('🫤', imageUrl)
      if (imageUrl) {
        return Response.json(imageUrl)
      } else {
        return Response.json(null)
      }
    })
    .catch(err => {
      return new Error(err)
    })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { generationId } = body

  return fetchLeonardoResponse(generationId)
}
