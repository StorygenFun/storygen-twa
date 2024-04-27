export enum LLMTextModel {
  LLaMA2Chat70B = 'meta-llama/Llama-2-70b-chat-hf', // 4096
  LLaMA2Chat13B = 'meta-llama/Llama-2-13b-chat-hf', // 4096
  LLaMA2Chat7B = 'meta-llama/Llama-2-7b-chat-hf', // 4096
  LLaMA3Chat8B = 'meta-llama/Llama-3-8b-chat-hf', // 8000
  LLaMA3Chat70B = 'meta-llama/Llama-3-70b-chat-hf', // 8000
  Mistral7BInstruct02 = 'mistralai/Mistral-7B-Instruct-v0.2', // 32768
  Mistral8x7BInstruct = 'mistralai/Mixtral-8x7B-Instruct-v0.1', // 32768
  Mixtral8x22BInstruct141B = 'mistralai/Mixtral-8x22B-Instruct-v0.1', // 65536
}

export enum LLMImageModel {
  Openjourney4 = 'prompthero/openjourney',
  RunwayStableDiffusion = 'runwayml/stable-diffusion-v1-5',
  RealisticVision = 'SG161222/Realistic_Vision_V3.0_VAE',
  StableDiffusion2 = 'stabilityai/stable-diffusion-2-1',
  StableDiffusionXL = 'stabilityai/stable-diffusion-xl-base-1.0',
  AnalogDiffusion = 'wavymulder/Analog-Diffusion',
}

export type LLMTextQuery = {
  prompt: string
  systemMessage?: string
  model?: LLMTextModel
  stream?: boolean
}

export type LLMImageQuery = {
  prompt: string
  model?: LLMImageModel
}
