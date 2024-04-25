import { NextApiRequest } from 'next'
import OpenAI from 'openai'

const getClient = (key: string, baseURL?: string) => {
  return new OpenAI({
    apiKey: key,
    baseURL,
    dangerouslyAllowBrowser: true,
  })
}

export async function POST(req: NextApiRequest) {
  const key = process.env.NEXT_PUBLIC_TOGETHER_API_KEY
  if (!key) return Response.error()

  const { prompt, systemMessage } = req.body

  const TOGETHER_AI_URL = 'https://api.together.xyz/v1'
  const client = getClient(key, TOGETHER_AI_URL)

  try {
    if (!client) return

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
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    })

    const result = response.choices[0].message.content

    return Response.json({ result })
  } catch (error) {
    console.error(error)
  }
}
