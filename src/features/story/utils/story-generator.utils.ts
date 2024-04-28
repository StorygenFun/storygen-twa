import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { Translation } from '@/features/localization/types'
import { IScene } from '@/features/scene/type'
import {
  buildScenePrompt,
  getAudienceText,
  getGenreText,
  getNewStoryTaskText,
  getWriterStyleText,
} from '@/features/story/utils/story.utils'
import { clog } from '@/utils/common.utils'
import { askImageLLM, askTextLLM } from '../../llm/api'
import { LLMImageModel, LLMImageQuery, LLMTextModel, LLMTextQuery } from '../../llm/types'
import { CompactShortScene, IStory } from '../type'

export const PROMPT_SIZE = 2000

export const preGenerateStory = async (updatedStory: IStory, t: Translation) => {
  const systemMessageSize = 650

  const systemMessage = [
    getWriterStyleText(updatedStory, t),
    getNewStoryTaskText(updatedStory, t),
    getGenreText(updatedStory, t),
    getAudienceText(updatedStory, t),
    t('prompts.storyGenerator.main', {
      num: updatedStory.scenesNum,
      size: Math.round((PROMPT_SIZE - systemMessageSize) / (updatedStory?.scenesNum || 1)),
    }),
    `${t(`StoryPage.languageAnswer`)}.`,
  ]
    .filter(Boolean)
    .join('\n')

  if (!updatedStory.prompt) {
    throw new Error('Prompt is empty')
  }

  const request: LLMTextQuery = {
    systemMessage,
    prompt: updatedStory.prompt,
    textModel: updatedStory.textModel,
  }

  clog('Request', JSON.stringify(request))

  try {
    return await askTextLLM(request)
  } catch (error) {
    console.error(error)
  }
}

export const generateSceneContent = async (
  updatedStory: IStory,
  context: string,
  t: Translation,
) => {
  const systemMessageSize = 300

  const systemMessage = [
    getWriterStyleText(updatedStory, t),
    getGenreText(updatedStory, t),
    getAudienceText(updatedStory, t),
    t('prompts.sceneGenerator', {
      size: systemMessageSize,
    }),
    t('prompts.sceneVolume', {
      from: 2000,
      to: 3000,
    }),
  ]
    .filter(Boolean)
    .join('\n')

  const request = {
    systemMessage,
    prompt: t('prompts.scenePrompt', { context }),
    lang: updatedStory.lang,
    textModel: updatedStory.textModel,
  }

  clog('Request', JSON.stringify(request))

  return await askTextLLM(request)
}

export const generateSceneSummary = async (story: IStory, context: string, t: Translation) => {
  const request = {
    systemMessage: t('prompts.sceneSummaryGenerator'),
    prompt: context,
    lang: story.lang,
    textModel: story.textModel,
  }

  clog('Request', JSON.stringify(request))

  return await askTextLLM(request)
}

export const generateScenes = async (
  story: IStory,
  formattedResponse: CompactShortScene[],
  t: Translation,
) => {
  const scenes: IScene[] = []

  for (let i = 0; i < formattedResponse.length; i++) {
    const context = buildScenePrompt(story, formattedResponse, i)
    const content = await generateSceneContent(story, context, t)
    if (content) {
      const summary = await generateSceneSummary(story, content, t)
      const scene: IScene = {
        id: uuidv4(),
        title: formattedResponse[i].t,
        content,
        summary: summary ? summary : undefined,
      }
      scenes.push(scene)
    }
  }

  return scenes
}

export const generateMeta = async (
  story: IStory,
  textModel: LLMTextModel,
  context: string,
  t: Translation,
) => {
  const request = {
    prompt: t('prompts.storySummaryGenerator', { context }),
    lang: story.lang,
    textModel: textModel || story.textModel,
  }

  clog('Request', JSON.stringify(request))

  return await askTextLLM(request)
}

const generateWithOpenAIApi = async (story: IStory, imageModel: LLMImageModel) => {
  const options: LLMImageQuery = {
    imageModel,
    prompt: story.cover_text_en || '',
  }

  try {
    const response = await askImageLLM(options)
    return response?.b64_json ? `data:image/png;base64, ${response?.b64_json}` : response?.url
  } catch (error: any) {
    throw new Error("Can't generate Image", error.message)
  }
}

const generateWithLeonardo = async (story: IStory): Promise<string> => {
  try {
    const { data: generationId } = await axios.post<string>('/api/leonardo-generate-image', {
      prompt: story.cover_text_en,
    })
    // const generationId = 'd1451eb1-334c-46ee-842e-321f0c1f84d6'

    const getGeneratedImage = (): Promise<string> => {
      let totalTime = 0
      const maxTime = 20000

      return new Promise((resolve, reject) => {
        const checkImage = async () => {
          try {
            const { data: imageUrl } = await axios.post<string>('/api/leonardo-get-image', {
              generationId,
            })

            if (imageUrl) {
              resolve(imageUrl)
            } else if (totalTime < maxTime) {
              setTimeout(checkImage, 1000)
              totalTime += 1000
            } else {
              reject(new Error('Timeout reached without retrieving an image.'))
            }
          } catch (error: any) {
            if (error.response && error.response.status === 404 && totalTime < maxTime) {
              setTimeout(checkImage, 1000)
              totalTime += 1000
            } else {
              reject(new Error('An error occurred: ' + error.message))
            }
          }
        }

        checkImage()
      })
    }

    return await getGeneratedImage()
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const generateCover = async (story: IStory, imageModel: LLMImageModel) => {
  if (!story.cover_text_en) {
    throw new Error('Cover prompt is empty')
  }

  if (imageModel === LLMImageModel.Leonardo) {
    return generateWithLeonardo(story)
  }

  return generateWithOpenAIApi(story, imageModel)
}
