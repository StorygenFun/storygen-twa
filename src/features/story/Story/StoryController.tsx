'use client'

import { FC, useMemo, useState } from 'react'
import { notification } from 'antd'
import { Spinner } from '@/components/Spinner/Spinner'
import { StepProgress } from '@/components/StepProgress/StepProgress'
import { DEFAULT_IMAGE_MODEL, DEFAULT_TEXT_MODEL } from '@/features/llm/constants'
import { useSceneStore } from '@/features/scene/sceneStore'
import { IScene } from '@/features/scene/type'
import { extractObjectFromString, formatBrief } from '@/features/story/utils/story.utils'
import { useTranslation } from '@/i18n/client'
import { StoryPayment } from '../StoryPayment/StoryPayment'
import { StoryWrapper } from '../StoryWrapper/StoryWrapper'
import { useFetchAllStories } from '../hooks/fetch-stories.hook'
import { useStoryStore } from '../storyStore'
import { GenerationStep, IStory } from '../type'
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
  serviceWallet?: string
}

export const Story: FC<StoryProps> = ({ storyId, siteUrl }) => {
  const { t } = useTranslation()

  useFetchAllStories()
  const { currentStep, isStoriesLoading, getStoryById, changeCurrentStep, updateStory } =
    useStoryStore()
  const { createScene, getScenesByIds, generatedScene } = useSceneStore()

  const initialStory = getStoryById(storyId)

  const [storyForPay, setStoryForPay] = useState<IStory | null>(null)
  const [isBriefGenerating, setIsBriefGenerating] = useState(false)
  const [isSummaryGenerating] = useState(false)
  const [isMetaGenerating, setIsMetaGenerating] = useState(false)
  const [isCoverGenerating, setIsCoverGenerating] = useState(false)

  const [api, contextHolder] = notification.useNotification()

  const progressStep = useMemo(() => {
    if (!initialStory) return 0
    if (initialStory.cover) return 5
    if (initialStory.summary) return 4
    if (initialStory.sceneIds.length) return 3
    if (initialStory.brief) return 2
    return 1
  }, [initialStory])

  const scenesList = getScenesByIds(initialStory?.sceneIds || [])

  const openErrorNotification = (message: string, description?: string) => {
    api.error({
      message,
      description,
    })
  }

  const handleCoverGenerate = async (currentStory: IStory) => {
    if (!currentStory?.cover_text_en) return
    changeCurrentStep(GenerationStep.Cover)

    setIsCoverGenerating(true)

    const imageModel = currentStory.imageModel || DEFAULT_IMAGE_MODEL

    updateStory(currentStory.id, {
      cover: '',
      imageModel,
    })

    try {
      const cover = await generateCover(currentStory, imageModel)

      await updateStory(currentStory.id, {
        cover,
        imageModel,
      })
    } catch (error) {
      openErrorNotification("Can't generate Image")
    } finally {
      setIsCoverGenerating(false)
    }
  }

  const handleMetaGenerate = async (currentStory: IStory, storyScenesList?: IScene[]) => {
    if (!currentStory || !storyScenesList) return
    changeCurrentStep(GenerationStep.Meta)
    const context = storyScenesList.map(scene => scene.summary).join('\n')

    setIsMetaGenerating(true)

    const result = await generateMeta(
      currentStory,
      currentStory.textModel || DEFAULT_TEXT_MODEL,
      context,
      t,
    )

    if (!result) {
      setIsMetaGenerating(false)
    }

    const resJSON = extractObjectFromString(result)

    const updatedStory = {
      ...currentStory,
      title: resJSON?.storyTitles?.[0] || currentStory.title,
      names: resJSON?.storyTitles || [],
      description: resJSON?.description || '',
      summary: resJSON?.summary || '',
      summary_en: resJSON?.summaryEn || resJSON?.summary || '',
      cover_text: resJSON?.coverText || '',
      cover_text_en: resJSON?.coverTextEn || resJSON?.coverText || '',
    }

    await updateStory(currentStory.id, updatedStory)

    setIsMetaGenerating(false)

    window.scrollTo({ top: 0, behavior: 'smooth' })

    if (updatedStory?.isSimple) {
      handleCoverGenerate(updatedStory)
    }
  }

  const handleScenesGenerate = async (currentStory: IStory) => {
    changeCurrentStep(GenerationStep.Scenes)
    if (!currentStory.brief) return

    const scenes = await generateScenes(currentStory, formatBrief(currentStory.brief), t)

    for (const scene of scenes) {
      await createScene(scene)
    }

    const updatedStory = { ...currentStory, sceneIds: scenes.map(item => item.id) }

    await updateStory(updatedStory.id, updatedStory)

    if (updatedStory.textModel && updatedStory.isSimple) {
      handleMetaGenerate(updatedStory, scenesList)
    }
  }

  const handleBriefGenerate = async (currentStory: IStory) => {
    changeCurrentStep(GenerationStep.Brief)
    setStoryForPay(null)
    setIsBriefGenerating(true)
    const brief = await preGenerateStory(currentStory, t)
    if (brief) {
      const updatedStory = { ...currentStory, brief: brief.trim() }

      await updateStory(currentStory.id, updatedStory)

      if (currentStory.isSimple) {
        handleScenesGenerate(updatedStory)
      }
    }
    setIsBriefGenerating(false)
  }

  const handleStartGeneration = async (currentStory: IStory) => {
    if (currentStory.payment_transaction) {
      await handleBriefGenerate(currentStory)
      return
    }
    setStoryForPay(currentStory)
  }

  if (isStoriesLoading) {
    return <Spinner content={t('StoryPage.storiesLoading')} />
  }

  if (!initialStory) return null

  return (
    <>
      {currentStep}
      <StepProgress total={5} current={progressStep} />

      <StoryWrapper siteUrl={siteUrl}>
        <StoryView
          story={initialStory}
          generatedScene={generatedScene}
          isStoryGenerating={isBriefGenerating}
          isSummaryGenerating={isSummaryGenerating}
          isMetaGenerating={isMetaGenerating}
          isCoverGenerating={isCoverGenerating}
          scenesList={scenesList}
          onChangeTitle={title => updateStory(initialStory.id, { ...initialStory, title })}
          onGenerateStart={options => handleStartGeneration({ ...initialStory, ...options })}
          onGenerateScenes={() => handleScenesGenerate(initialStory)}
          onGenerateMeta={textModel =>
            handleMetaGenerate({ ...initialStory, textModel }, scenesList)
          }
          onGenerateCover={imageModel => handleCoverGenerate({ ...initialStory, imageModel })}
          onClearStory={() => updateStory(initialStory.id, { ...initialStory, brief: '' })}
        />

        <StoryPayment
          storyForPay={storyForPay}
          onClear={() => setStoryForPay(null)}
          onError={(error: string) => openErrorNotification(error)}
          onGenerate={handleBriefGenerate}
        />
      </StoryWrapper>

      {contextHolder}
    </>
  )
}
