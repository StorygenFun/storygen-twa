import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

const fetchLeonardoResponse = async (generationId: string) => {
  const key = process.env.NEXT_PUBLIC_LEONARDO_API_KEY
  if (!key) return NextResponse.json({ error: 'Missing Leonardo API Key' }, { status: 500 })

  try {
    const response = await axios({
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${key}`,
      },
      url: `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`,
    })

    const imageUrl = response?.data?.generations_by_pk?.generated_images?.[0]?.url

    return imageUrl
      ? NextResponse.json(imageUrl)
      : NextResponse.json({ error: 'Image not found' }, { status: 404 })
  } catch (err) {
    console.error('Error fetching image:', err)
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { generationId } = body

  return fetchLeonardoResponse(generationId)
}
