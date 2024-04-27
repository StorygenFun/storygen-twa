'use client'

import { FC, useCallback, useMemo, useState } from 'react'
import { notification } from 'antd'
import { Spinner } from '@/components/Spinner/Spinner'
import { StepProgress } from '@/components/StepProgress/StepProgress'
import { LLMImageModel, LLMTextModel } from '@/features/llm/types'
import { useSceneStore } from '@/features/scene/sceneStore'
import { extractObjectFromString, formatResponse } from '@/features/story/utils/story.utils'
import { useTranslation } from '@/i18n/client'
import { StoryWrapper } from '../StoryWrapper/StoryWrapper'
import { useFetchAllStories } from '../hooks/fetch-stories.hook'
import { useStoryStore } from '../storyStore'
import { IStory } from '../type'
import {
  generateCover,
  generateMeta,
  generateScenes,
  preGenerateStory,
} from '../utils/story-generator.utils'
import { StoryView } from './StoryView'

type StoryProps = {
  storyId: string
  siteUrl: string
}

export const Story: FC<StoryProps> = ({ storyId, siteUrl }) => {
  const { t } = useTranslation()

  useFetchAllStories()
  const { isStoriesLoading, updateStory } = useStoryStore()
  const { createScene, generatedScene } = useSceneStore()

  const { getStoryById } = useStoryStore()
  const story = getStoryById(storyId)

  const [isStoryGenerating, setIsStoryGenerating] = useState(false)
  const [isSummaryGenerating] = useState(false)
  const [isMetaGenerating, setIsMetaGenerating] = useState(false)
  const [isCoverGenerating, setIsCoverGenerating] = useState(false)

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

  const handleStoryGenerate = async (updatedStory: IStory) => {
    setIsStoryGenerating(true)
    const chatGPTResponse = await preGenerateStory(updatedStory, t)
    if (chatGPTResponse) {
      openErrorNotification('Wrong answer')
      handleUpdate({ ...updatedStory, response: chatGPTResponse.trim() })
    }
    setIsStoryGenerating(false)
  }

  const handleScenesGenerate = async () => {
    if (!story || !formattedResponse) return
    setIsStoryGenerating(true)

    const scenes = await generateScenes(story, formattedResponse, t)

    setIsStoryGenerating(false)

    for (const scene of scenes) {
      await createScene(scene)
    }

    await updateStory(story.id, { ...story, sceneIds: scenes.map(item => item.id) })
  }

  const handleMetaGenerate = async (model: LLMTextModel, context: string) => {
    if (!story) return

    setIsMetaGenerating(true)

    const result = await generateMeta(story, model, context, t)

    if (result) {
      const resJSON = extractObjectFromString(result)

      const update = {
        ...story,
        names: resJSON?.storyTitles || [],
        description: resJSON?.description || '',
        summary: resJSON?.summary || '',
        summary_en: resJSON?.summaryEn || resJSON?.summary || '',
        cover_text: resJSON?.coverText || '',
        cover_text_en: resJSON?.coverTextEn || resJSON?.coverText || '',
      }

      await updateStory(story.id, update)
    }

    setIsMetaGenerating(false)

    window.scrollTo({ top: 0, behavior: 'smooth' })

    return result
  }

  const handleCoverGenerate = async (model: LLMImageModel) => {
    if (!story?.cover_text_en) return

    setIsCoverGenerating(true)

    await updateStory(story.id, {
      cover: '',
    })

    try {
      const cover = await generateCover(story, model)

      await updateStory(story.id, {
        cover,
      })
    } catch (error) {
      openErrorNotification("Can't generate Image")
    } finally {
      setIsCoverGenerating(false)
    }
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

      {contextHolder}
    </>
  )
}
