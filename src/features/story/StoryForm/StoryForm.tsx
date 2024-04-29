'use client'

import { FC, useCallback, useEffect, useState } from 'react'
import { Alert, Button, Form, InputNumber, Select, Switch } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { ActionBar } from '@/components/ActionBar/ActionBar'
import { LLMImageModelList, LLMTextModelList } from '@/features/llm/constants'
import { LLMImageModel, LLMTextModel } from '@/features/llm/types'
import {
  GenerationStep,
  IStory,
  StoryAudience,
  StoryGenre,
  StoryOptions,
  StoryWriter,
} from '@/features/story/type'
import {
  calculateStoryGenerationCost,
  getReadableCost,
} from '@/features/wallet/utils/payment.utils'
import { useWalletStore } from '@/features/wallet/walletStore'
import { useTranslation } from '@/i18n/client'
import { useStoryStore } from '../storyStore'
import styles from './StoryForm.module.scss'

type Props = {
  story: IStory
  onGenerate: (options: StoryOptions) => void
}

export const StoryForm: FC<Props> = ({ story, onGenerate }) => {
  const { t } = useTranslation()
  const { changeCurrentStep } = useStoryStore()
  const { walletAddress } = useWalletStore()

  const [prompt, setPrompt] = useState(story.prompt || '')
  const [textModel, setTextModel] = useState<LLMTextModel>(
    story.textModel || LLMTextModel.Mixtral8x22BInstruct141B,
  )
  const [imageModel, setImageModel] = useState<LLMImageModel>(
    story.imageModel || LLMImageModel.Leonardo,
  )
  const [scenesNum, setScenesNum] = useState<number>(story.scenesNum || 5)
  const [writer, setWriter] = useState<StoryWriter | string | undefined>(story.writer)
  const [genre, setGenre] = useState<StoryGenre | undefined>(story.genre)
  const [audience, setAudience] = useState<StoryAudience | undefined>(story.audience)
  const [isSimple, setIsSimple] = useState(!!story.isSimple)

  useEffect(() => {
    changeCurrentStep(GenerationStep.Brief)
  }, [changeCurrentStep])

  const buildOptions = (list: string[], translationPrefix: string) => {
    return list.map(item => {
      return { value: item, label: t(`${translationPrefix}.${item}`) }
    })
  }

  const writerOptions = buildOptions(Object.values(StoryWriter), 'StoryPage.writers')
  const genreOptions = buildOptions(Object.values(StoryGenre), 'StoryPage.genres')
  const audienceOptions = buildOptions(Object.values(StoryAudience), 'StoryPage.audiences')

  const handleChangeScenes = (e: number | null) => {
    setScenesNum(e || 1)
  }

  const handleSubmit = useCallback(async () => {
    if (!prompt) return

    if (!walletAddress) {
      console.log('!!!!!!!')
      return
    }

    onGenerate({
      prompt,
      textModel,
      imageModel,
      scenesNum,
      writer,
      genre,
      audience,
      isSimple,
    })
  }, [
    prompt,
    walletAddress,
    onGenerate,
    textModel,
    imageModel,
    scenesNum,
    writer,
    genre,
    audience,
    isSimple,
  ])

  return (
    <div className={styles.storyForm}>
      <Form
        layout="vertical"
        initialValues={{
          promptValue: prompt,
          textModelValue: textModel,
          imageModelValue: imageModel,
          scenesValue: scenesNum,
          writerValue: writer ? [writer] : [],
          genreValue: genre,
          audienceValue: audience,
          isSimpleValue: isSimple,
        }}
      >
        <Form.Item label={t('StoryPage.prompt')} name="promptValue">
          <TextArea rows={5} value={prompt} onChange={e => setPrompt(e.target.value)} />
        </Form.Item>

        <Form.Item name="isSimpleValue">
          <div className={styles.switcherContainer}>
            <Switch defaultChecked={isSimple} onChange={val => setIsSimple(val)} />
            {t('StoryPage.simpleMode')}
          </div>
        </Form.Item>

        {!isSimple && (
          <Form.Item label={t('StoryPage.textModel')} name="textModelValue">
            <Select
              style={{ width: 300 }}
              options={Array.from(LLMTextModelList, ([value, label]) => ({ value, label }))}
              onChange={val => setTextModel(val)}
            />
          </Form.Item>
        )}

        {!isSimple && (
          <Form.Item label={t('StoryPage.imageModel')} name="imageModelValue">
            <Select
              style={{ width: 300 }}
              options={Array.from(LLMImageModelList, ([value, label]) => ({ value, label }))}
              onChange={val => setImageModel(val)}
            />
          </Form.Item>
        )}

        <Form.Item label={t('StoryPage.writerStyle')} name="writerValue">
          <Select
            mode="tags"
            style={{ width: 300 }}
            placeholder={t('StoryPage.ownStyle')}
            maxCount={1}
            options={writerOptions}
            onChange={val => setWriter(val[0])}
          />
        </Form.Item>

        <Form.Item label={t('StoryPage.genre')} name="genreValue">
          <Select options={genreOptions} style={{ width: 300 }} onChange={val => setGenre(val)} />
        </Form.Item>

        <Form.Item label={t('StoryPage.audience')} name="audienceValue">
          <Select
            options={audienceOptions}
            style={{ width: 300 }}
            onChange={val => setAudience(val)}
          />
        </Form.Item>

        <Form.Item label={t('StoryPage.numberOfScenes')} name="scenesValue">
          <InputNumber min={1} max={10} onChange={handleChangeScenes} />
        </Form.Item>

        {!walletAddress && (
          <Form.Item>
            <Alert
              message={t('notices.connectRequiredTitle')}
              description={t('notices.connectRequiredText')}
              type="warning"
              showIcon
            />
          </Form.Item>
        )}

        <ActionBar
          actionStart={
            <Button type="primary" disabled={!prompt || !walletAddress} onClick={handleSubmit}>
              {t('StoryPage.generateStoryFor', {
                cost: getReadableCost(calculateStoryGenerationCost(scenesNum)),
              })}
            </Button>
          }
        />
      </Form>
    </div>
  )
}
