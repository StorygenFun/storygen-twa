'use client'

import { FC, useCallback, useMemo, useState } from 'react'
import { notification } from 'antd'
import { Spinner } from '@/components/Spinner/Spinner'
import { StepProgress } from '@/components/StepProgress/StepProgress'
import { LLMImageModel, LLMTextModel } from '@/features/llm/types'
import { useSceneStore } from '@/features/scene/sceneStore'
import { IScene } from '@/features/scene/type'
import { useTranslation } from '@/i18n/client'
import { clog } from '@/utils/common.utils'
import {
  extractObjectFromString,
  formatResponse,
  getAudienceText,
  getGenreText,
  getNewStoryTaskText,
  getWriterStyleText,
} from '@/utils/story.utils'
import { StoryWrapper } from '../StoryWrapper/StoryWrapper'
import { useFetchAllStories } from '../hooks/fetch-stories.hook'
import { useStoryStore } from '../storyStore'
import { CompactShortScene, IStory } from '../type'
import { StoryView } from './StoryView'

type StoryProps = {
  storyId: string
  siteUrl: string
}

export const Story: FC<StoryProps> = ({ storyId, siteUrl }) => {
  const PROMPT_SIZE = 2000
  const { t } = useTranslation()

  useFetchAllStories()
  const { isStoriesLoading, updateStory } = useStoryStore()
  const { createScene, generatedScene, updateGeneratedScene } = useSceneStore()

  const { getStoryById } = useStoryStore()
  const story = getStoryById(storyId)

  const [isStoryGenerating, setIsStoryGenerating] = useState(false)
  const [isSummaryGenerating, setIsSummaryGenerating] = useState(false)
  const [isMetaGenerating, setIsMetaGenerating] = useState(false)
  const [isCoverGenerating, setIsCoverGenerating] = useState(false)
  const [changedStory, setChangedStory] = useState<IStory | null>(null)

  const formattedResponse = story?.response ? formatResponse(story?.response) : null

  const [api, contextHolder] = notification.useNotification()

  const currentStep = useMemo(() => {
    if (!story) return 0
    if (story.cover) return 5
    if (story.summary) return 4
    if (story.sceneIds.length) return 3
    if (story.response) return 2
    return 1
  }, [story])

  const openErrorNotification = (message: string, description?: string) => {
    api.error({
      message,
      description,
    })
  }

  const handleUpdate = useCallback(
    (story: IStory) => {
      updateStory(story.id, story)
    },
    [updateStory],
  )

  const fetchAIResponse = async (updatedStory: IStory, localKey?: string) => {
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
    ]
      .filter(Boolean)
      .join('\n')

    const request = {
      systemMessage,
      prompt: updatedStory.prompt,
      lang: updatedStory.lang,
      model: updatedStory.model,
    }

    clog('Request', JSON.stringify(request))

    // TODO: RENDER
    // try {
    //   const key = localKey || getKey(updatedStory.model as AITextModel)
    //   return await askGPT(request, key)
    // } catch (error) {
    //   console.error(error)
    // }
  }

  const handleStoryGenerate = async (updatedStory: IStory) => {
    setChangedStory(updatedStory)
    setIsStoryGenerating(true)
    // TODO: RENDER
    const chatGPTResponse = await fetchAIResponse(updatedStory)
    // if (!chatGPTResponse && getKey(updatedStory.model as AITextModel)) {
    //   openErrorNotification('Wrong answer')
    //   setIsStoryGenerating(false)
    //   return
    // }
    // if (chatGPTResponse) {
    //   handleUpdate({ ...updatedStory, response: chatGPTResponse.trim() })
    // }
    setIsStoryGenerating(false)
  }

  const generateSceneContent = async (updatedStory: IStory, context: string) => {
    const systemMessageSize = 300

    const systemMessage = [
      getWriterStyleText(updatedStory, t),
      getGenreText(updatedStory, t),
      getAudienceText(updatedStory, t),
      t('prompts.sceneGenerator', {
        size: systemMessageSize,
      }),
    ]
      .filter(Boolean)
      .join('\n')

    const request = {
      systemMessage,
      prompt: t('prompts.scenePrompt', { context }),
      lang: updatedStory.lang,
      model: updatedStory.model,
    }

    clog('Request', JSON.stringify(request))

    // TODO: RENDER
    // return await askAIStream(request, getKey(updatedStory.model as AITextModel))
  }

  const generateSceneSummary = async (story: IStory, context: string) => {
    const request = {
      systemMessage: t('prompts.sceneSummaryGenerator'),
      prompt: context,
      lang: story.lang,
      model: story.model,
    }

    clog('Request', JSON.stringify(request))

    // TODO: RENDER
    // return await askGPT(request, getKey(story.model as AITextModel))
  }

  const handleScenesGenerate = async () => {
    if (!story || !formattedResponse) return
    setIsStoryGenerating(true)

    const scenes: IScene[] = []

    // TODO: RENDER
    // for (let i = 0; i < formattedResponse.length; i++) {
    //   const context = buildScenePrompt(story, formattedResponse, i)
    //   const stream = await generateSceneContent(story, context)
    //   const teeStream = stream?.tee()

    //   let content = ''
    //   if (teeStream) {
    //     for await (const chunk of teeStream[0]) {
    //       content = content + chunk.choices[0]?.delta?.content || ''
    //       updateGeneratedScene(content)
    //     }
    //   }

    //   if (content) {
    //     setIsSummaryGenerating(true)
    //     const summary = await generateSceneSummary(story, content)
    //     const scene: IScene = {
    //       id: uuidv4(),
    //       title: formattedResponse[i].t,
    //       content,
    //       summary: summary ? summary : undefined,
    //     }
    //     scenes.push(scene)
    //     await createScene(scene)
    //     await updateStory(story.id, { ...story, sceneIds: scenes.map(item => item.id) })
    //     setIsSummaryGenerating(false)
    //     updateGeneratedScene(null)
    //   }
    // }

    setIsStoryGenerating(false)

    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }

  const handleMetaGenerate = async (model: LLMTextModel, context: string) => {
    if (!story) return

    setIsMetaGenerating(true)

    const request = {
      prompt: t('prompts.storySummaryGenerator', { context }),
      lang: story.lang,
      model: model || story.model,
    }

    clog('Request', JSON.stringify(request))

    // TODO: RENDER
    // const response = await askGPT(request, getKey(story.model as AITextModel))

    // if (response) {
    //   const resJSON = extractObjectFromString(response)

    //   const update = {
    //     ...story,
    //     names: resJSON?.storyTitles || [],
    //     description: resJSON?.description || '',
    //     summary: resJSON?.summary || '',
    //     summary_en: resJSON?.summaryEn || resJSON?.summary || '',
    //     cover_text: resJSON?.coverText || '',
    //     cover_text_en: resJSON?.coverTextEn || resJSON?.coverText || '',
    //   }

    //   await updateStory(story.id, update)
    // }

    // setIsMetaGenerating(false)

    // window.scrollTo({ top: 0, behavior: 'smooth' })

    // return response
  }

  const handleCoverGenerate = async (model: LLMImageModel) => {
    if (!story?.cover_text_en) return

    setIsCoverGenerating(true)

    await updateStory(story.id, {
      cover: '',
    })

    const options = {
      model: model,
      prompt: story.cover_text_en,
      n: 1,
    }

    // TODO: RENDER
    // try {
    //   const response = await askGPTImage(options, getKey(model))
    //   const imageData = response?.[0]
    //   await updateStory(story.id, {
    //     cover: imageData?.b64_json
    //       ? `data:image/png;base64, ${imageData?.b64_json}`
    //       : imageData?.url,
    //   })
    // } catch (error: any) {
    //   openErrorNotification("Can't generate Image", error.message)
    // } finally {
    //   setIsCoverGenerating(false)
    // }
    setIsCoverGenerating(false)
  }

  if (isStoriesLoading) {
    return <Spinner content={t('StoryPage.storiesLoading')} />
  }

  if (!story) return null

  return (
    <>
      <StepProgress total={5} current={currentStep} />

      <StoryWrapper siteUrl={siteUrl}>
        <StoryView
          story={story}
          generatedScene={generatedScene}
          isStoryGenerating={isStoryGenerating}
          isSummaryGenerating={isSummaryGenerating}
          isMetaGenerating={isMetaGenerating}
          isCoverGenerating={isCoverGenerating}
          formattedResponse={formattedResponse}
          onUpdate={handleUpdate}
          onStoryGenerate={handleStoryGenerate}
          onStoryCancel={() => handleUpdate({ ...story, response: '' })}
          onScenesGenerate={handleScenesGenerate}
          onMetaGenerate={handleMetaGenerate}
          onCoverGenerate={handleCoverGenerate}
        />
      </StoryWrapper>
    </>
  )
}
