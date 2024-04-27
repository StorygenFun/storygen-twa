import axios from 'axios'
import { clog } from '@/utils/common.utils'
import { LLMImageModel, LLMImageQuery, LLMTextModel, LLMTextQuery } from './types'

export const askTextLLM = async (options: LLMTextQuery) => {
  const { systemMessage, prompt, model, stream } = options

  if (!prompt) {
    throw new Error('Prompt to be defined')
  }

  if (systemMessage) {
    clog('System message', systemMessage)
  }
  clog('PROMPT', prompt)

  try {
    const { data } = await axios.post('/api/llm-text', {
      systemMessage: systemMessage || '',
      prompt,
      model: model || LLMTextModel.LLaMA3Chat70B,
      stream,
    })

    clog('ANSWER', data)

    return data
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const askImageLLM = async (options: LLMImageQuery) => {
  const { prompt, model } = options

  if (!prompt) {
    throw new Error('Prompt to be defined')
  }

  clog('PROMPT', prompt)

  try {
    const { data } = await axios.post('/api/llm-image', {
      prompt,
      model: model || LLMImageModel.RealisticVision,
    })

    return data[0]
  } catch (error: any) {
    throw new Error(error.message)
  }
}
