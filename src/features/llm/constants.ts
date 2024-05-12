import { ChatOpenAI } from '@langchain/openai'
import OpenAI from 'openai'
import { LLMImageModel, LLMTextModel } from './types'

export const LLMTextModelList = new Map([
  [LLMTextModel.GPT3P5Turbo, 'GPT 3.5 Turbo'],
  [LLMTextModel.GPT3P5Turbo16k, 'GPT 3.5 Turbo 16K'],
  [LLMTextModel.GPT4P32K, 'GPT 4 32K'],
  [LLMTextModel.GPT4Turbo, 'GPT 4 Turbo'],
  [LLMTextModel.GPT4TurboPreview, 'GPT 4 Turbo Preview'],
  [LLMTextModel.GPT4VisionPreview, 'GPT 4 Vision Preview'],
  [LLMTextModel.GPT4Turbo2024P04P09, 'GPT 4 Turbo 	2024-02-16'],
  [LLMTextModel.GPT4, 'GPT 4'],
  [LLMTextModel.Claude3Opus, 'Claude 3 Opus'],
  [LLMTextModel.Claude3Sonnet, 'Claude 3 Sonnet'],
  [LLMTextModel.Claude3Haiku, 'Claude 3 Haiku'],
  [LLMTextModel.LLaMA2Chat70B, 'Meta LLaMA-2 Chat (70B)'],
  [LLMTextModel.LLaMA2Chat13B, 'Meta LLaMA-2 Chat (13B)'],
  [LLMTextModel.LLaMA2Chat7B, 'Meta LLaMA-2 Chat (7B)'],
  [LLMTextModel.LLaMA3Chat8B, 'Meta LLaMA-3 Chat (8B)'],
  [LLMTextModel.LLaMA3Chat70B, 'Meta LLaMA-3 Chat (70B)'],
  [LLMTextModel.Mistral7BInstruct02, 'Mistral (7B) Instruct 0.2'],
  [LLMTextModel.Mistral8x7BInstruct, 'Mistral 8x7B Instruct (46.7B)'],
  [LLMTextModel.Mixtral8x22BInstruct141B, 'Mixtral-8x22B Instruct (141B)'],
])

export const DEFAULT_TEXT_MODEL = LLMTextModel.Mixtral8x22BInstruct141B

export const LLMImageModelList = new Map([
  [LLMImageModel.Openjourney4, 'Prompt Hero Openjourney v4'],
  [LLMImageModel.RunwayStableDiffusion, 'Runway ML Stable Diffusion 1.5'],
  [LLMImageModel.RealisticVision, 'Realistic Vision 3.0'],
  [LLMImageModel.StableDiffusion2, 'Stable Diffusion 2.1'],
  [LLMImageModel.StableDiffusionXL, 'Stable Diffusion XL 1.0'],
  [LLMImageModel.AnalogDiffusion, 'Analog Diffusion'],
  [LLMImageModel.Leonardo, 'Leonardo.AI'],
  // [LLMImageModel.StabilityDiffusion3Turbo, 'Stable Diffusion 3 Turbo'],
])

export const DEFAULT_IMAGE_MODEL = LLMImageModel.Leonardo

export const TOGETHER_AI_URL = 'https://api.together.xyz/v1'

export const getClient = (key: string, baseURL?: string) => {
  return new OpenAI({
    apiKey: key,
    baseURL,
    dangerouslyAllowBrowser: true,
  })
}

export const getLangChainClient = (key: string) => {
  return new ChatOpenAI({
    apiKey: key,
  })
}

export const DEFAULT_TYPING_SPEED = 1
