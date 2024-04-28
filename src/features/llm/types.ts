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
  StabilityDiffusion3Turbo = 'stability.ai/v2beta/stable-image/generate/sd3',
  Leonardo = 'leonardo',
}

export enum LeonardoModel {
  LightningXL = 'b24e16ff-06e3-43eb-8d33-4416c2d75876',
  AnimateXL = 'e71a1c2f-4f80-4800-934f-2c68979d8cc8',
  DiffusionXL = '1e60896f-3c26-4296-8ecc-53e2afecc132',
  KinoXL = 'aa77f04e-3eec-4034-9c07-d0f619684628',
  VisionXL = '5c232a9e-9061-4777-980a-ddc8e65647c6',
  AlbedoBaseXL = '2067ae52-33fd-4a82-bb92-c2c55e7d2786',
}

export type LLMTextQuery = {
  prompt: string
  systemMessage?: string
  textModel?: LLMTextModel
  stream?: boolean
}

export type LLMImageQuery = {
  prompt: string
  imageModel?: LLMImageModel
}
