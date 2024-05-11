'use client'

import { FC, useEffect, useState } from 'react'
import { fromNano } from '@ton/core'
import { notification } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import { Spinner } from '@/components/Spinner/Spinner'
import { DEFAULT_IMAGE_MODEL, DEFAULT_TEXT_MODEL } from '@/features/llm/constants'
import { useSceneStore } from '@/features/scene/sceneStore'
import { IScene } from '@/features/scene/type'
import {
  buildScenePrompt,
  extractObjectFromString,
  formatBrief,
} from '@/features/story/utils/story.utils'
import { calculateStoryGenerationCost } from '@/features/wallet/utils/payment.utils'
import { useWalletStore } from '@/features/wallet/walletStore'
import { useTranslation } from '@/i18n/client'
import { StoryPayment } from '../StoryPayment/StoryPayment'
import { StoryProgress } from '../StoryProgress/StoryProgress'
import { StoryWrapper } from '../StoryWrapper/StoryWrapper'
import { useFetchAllStories } from '../hooks/fetch-stories.hook'
import { useStoryStore } from '../storyStore'
import { GenerationStep, IStory } from '../type'
import {
  generateCover,
  generateMeta,
  generateSceneContent,
  generateSceneSummary,
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
  const { isStoriesLoading, currentStep, getStoryById, changeCurrentStep, updateStory } =
    useStoryStore()
  const { createScene, getScenesByIds, updateScene } = useSceneStore()
  const { promoCode, promoCodeBalance, reduceCodeBalance } = useWalletStore()

  const initialStory = getStoryById(storyId)
  const scenes = getScenesByIds(initialStory?.sceneIds || [])

  const [storyForPay, setStoryForPay] = useState<IStory | null>(null)
  const [isFistRender, setIsFistRender] = useState(true)
  const [isStoryGenerating, setIsStoryGenerating] = useState(false)

  const [api, contextHolder] = notification.useNotification()

  const scenesList = getScenesByIds(initialStory?.sceneIds || [])

  const openErrorNotification = (message: string, description?: string) => {
    api.error({
      message,
      description,
    })
  }

  useEffect(() => {
    if (initialStory && isFistRender) {
      if (initialStory.cover) {
        changeCurrentStep(GenerationStep.Cover)
        return
      }
      if (initialStory.summary_en) {
        changeCurrentStep(GenerationStep.Meta)
        return
      }
      if (initialStory.sceneIds.length) {
        changeCurrentStep(GenerationStep.Scenes)
        return
      }
      if (initialStory.brief) {
        changeCurrentStep(GenerationStep.Brief)
        return
      }
      setIsFistRender(false)
    }
  }, [changeCurrentStep, currentStep, initialStory, isFistRender])

  const handleCoverGenerate = async (currentStory: IStory) => {
    if (!currentStory?.cover_text_en) return
    changeCurrentStep(GenerationStep.Cover)

    setIsStoryGenerating(true)

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
      setIsStoryGenerating(false)
    }
  }

  const handleMetaGenerate = async (currentStory: IStory, storyScenesList?: IScene[]) => {
    if (!currentStory || !storyScenesList) return
    changeCurrentStep(GenerationStep.Meta)
    const context = storyScenesList.map(scene => scene.summary).join('\n')

    setIsStoryGenerating(true)

    const result = await generateMeta(
      currentStory,
      currentStory.textModel || DEFAULT_TEXT_MODEL,
      context,
      t,
    )

    if (!result) {
      setIsStoryGenerating(false)
    }

    const resJSON = extractObjectFromString(result)

    const updatedStory = {
      ...currentStory,
      title: resJSON?.storyTitles?.[0] || currentStory.title,
      names: resJSON?.storyTitles || [],
      description: resJSON?.description || null,
      summary: resJSON?.summary || null,
      summary_en: resJSON?.summaryEn || resJSON?.summary || null,
      cover_text: resJSON?.coverText || null,
      cover_text_en: resJSON?.coverTextEn || resJSON?.coverText || null,
    }

    await updateStory(currentStory.id, updatedStory)

    setIsStoryGenerating(false)

    window.scrollTo({ top: 0, behavior: 'smooth' })

    if (currentStory.isSimple) {
      handleCoverGenerate(updatedStory)
    }
  }

  const handleScenesGenerate = async (currentStory: IStory) => {
    changeCurrentStep(GenerationStep.Scenes)
    setIsStoryGenerating(true)
    if (!currentStory.brief) return

    const formattedBrief = formatBrief(currentStory.brief)
    let updatedStory = { ...currentStory }

    for (let i = 0; i < formatBrief(currentStory.brief).length; i++) {
      const context = buildScenePrompt(formattedBrief, i + 1, t)
      const content = await generateSceneContent(currentStory, context, t)

      if (content) {
        const scene: IScene = {
          id: uuidv4(),
          title: formattedBrief[i].t,
          content,
        }
        await createScene(scene)
        updatedStory = { ...updatedStory, sceneIds: [...updatedStory.sceneIds, scene.id] }
        await updateStory(updatedStory.id, updatedStory)
        const summary = await generateSceneSummary(currentStory, content, t)
        scene.summary = summary
        if (summary) {
          await updateScene(scene.id, scene)
        }
      }
    }

    setIsStoryGenerating(false)

    if (currentStory.isSimple) {
      handleMetaGenerate(updatedStory, scenesList)
    }
  }

  const handleBriefGenerate = async (currentStory: IStory) => {
    changeCurrentStep(GenerationStep.Brief)
    setStoryForPay(null)
    setIsStoryGenerating(true)
    const brief = await preGenerateStory(currentStory, t)
    if (brief) {
      const updatedStory = { ...currentStory, brief: brief.trim() }

      await updateStory(currentStory.id, updatedStory)

      if (currentStory.isSimple) {
        handleScenesGenerate(updatedStory)
      } else {
        setIsStoryGenerating(false)
      }
    } else {
      setIsStoryGenerating(false)
    }
  }

  const handleStartGeneration = async (currentStory: IStory) => {
    const cost = Number(fromNano(calculateStoryGenerationCost(currentStory.scenesNum || 1)))
    const canUsePromoCode = promoCodeBalance && promoCodeBalance >= cost

    if (currentStory.payment_transaction || canUsePromoCode) {
      changeCurrentStep(GenerationStep.Brief)
      await handleBriefGenerate(currentStory)

      if (canUsePromoCode && promoCode) {
        reduceCodeBalance(promoCode, cost)
      }

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
      <StoryProgress
        story={initialStory}
        scenes={scenes}
        isStoryGenerating={isStoryGenerating}
        inProgress={currentStep}
      />

      <StoryWrapper siteUrl={siteUrl}>
        <StoryView
          story={initialStory}
          isStoryGenerating={isStoryGenerating}
          scenesList={scenesList}
          onChange={story => updateStory(initialStory.id, story)}
          onChangeTitle={title => updateStory(initialStory.id, { ...initialStory, title })}
          onGenerateStart={() => handleStartGeneration(initialStory)}
          onGenerateScenes={() => handleScenesGenerate(initialStory)}
          onGenerateMeta={textModel =>
            handleMetaGenerate({ ...initialStory, textModel }, scenesList)
          }
          onGenerateCover={imageModel => handleCoverGenerate({ ...initialStory, imageModel })}
        />

        <StoryPayment
          storyForPay={storyForPay}
          onClear={() => setStoryForPay(null)}
          onError={(error: string) => openErrorNotification(error)}
          onChange={handleStartGeneration}
        />
      </StoryWrapper>

      {contextHolder}
    </>
  )
}
