import { ChatPromptTemplate } from '@langchain/core/prompts'
import { NextRequest } from 'next/server'
import { getClient, getLangChainClient } from '@/features/llm/constants'
import { LLMTextModel } from '@/features/llm/types'

const fetchOpenAI = async (
  systemMessage: string,
  prompt: string,
  textModel: LLMTextModel,
  url?: string,
): Promise<Response> => {
  const isLangChain = textModel.startsWith('gpt-')

  const key = isLangChain
    ? process.env.NEXT_PUBLIC_OPENAI_API_KEY
    : process.env.NEXT_PUBLIC_TOGETHER_API_KEY

  if (!key) {
    return new Response(null, { status: 500, statusText: 'API key is missing.' })
  }

  const langChainClient = getLangChainClient(key)
  const togetherClient = getClient(key, url)

  if (!prompt) {
    return new Response(null, { status: 500, statusText: 'Prompt is missing.' })
  }

  try {
    if (isLangChain) {
      if (!langChainClient) {
        return new Response(null, { status: 500, statusText: 'Client creation failed.' })
      }

      const langChainPrompt = ChatPromptTemplate.fromMessages([
        ['system', systemMessage],
        ['user', '{input}'],
      ])
      const chain = langChainPrompt.pipe(langChainClient)

      const response = await chain.invoke({
        input: prompt || '',
      })

      return Response.json(response.content)
    } else {
      if (!togetherClient) {
        return new Response(null, { status: 500, statusText: 'Client creation failed.' })
      }

      const response = await togetherClient.chat.completions.create({
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
        model: textModel || LLMTextModel.LLaMA3Chat70B,
      })

      return Response.json(response.choices[0].message.content?.trim())
    }
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
  const { systemMessage, prompt, textModel } = body

  return fetchOpenAI(systemMessage, prompt, textModel, 'https://api.together.xyz/v1')
}
