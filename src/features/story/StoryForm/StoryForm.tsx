'use client'

import { FC, useCallback, useState } from 'react'
import { Button, Form, InputNumber, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { ActionBar } from '@/components/ActionBar/ActionBar'
import { LLMTextModelList } from '@/features/llm/constants'
import { LLMTextModel } from '@/features/llm/types'
import { IStory, StoryAudience, StoryGenre, StoryOptions, StoryWriter } from '@/features/story/type'
import {
  calculateStoryGenerationCost,
  getReadableCost,
} from '@/features/wallet/utils/payment.utils'
import { useTranslation } from '@/i18n/client'
import styles from './StoryForm.module.scss'

type Props = {
  story: IStory
  onGenerate: (options: StoryOptions) => void
}

export const StoryForm: FC<Props> = ({ story, onGenerate }) => {
  const { t } = useTranslation()

  const [prompt, setPrompt] = useState(story.prompt || '')
  const [model, setModel] = useState<LLMTextModel>(
    story.model || LLMTextModel.Mixtral8x22BInstruct141B,
  )
  const [scenesNum, setScenesNum] = useState<number>(story.scenesNum || 5)
  const [writer, setWriter] = useState<StoryWriter | string | undefined>(story.writer)
  const [genre, setGenre] = useState<StoryGenre | undefined>(story.genre)
  const [audience, setAudience] = useState<StoryAudience | undefined>(story.audience)

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
    onGenerate({
      prompt,
      model,
      scenesNum,
      writer,
      genre,
      audience,
    })
  }, [audience, genre, model, onGenerate, prompt, scenesNum, writer])

  return (
    <div className={styles.storyForm}>
      <Form
        layout="vertical"
        initialValues={{
          promptValue: prompt,
          modelValue: model,
          scenesValue: scenesNum,
          writerValue: writer ? [writer] : [],
          genreValue: genre,
          audienceValue: audience,
        }}
      >
        <Form.Item label={t('StoryPage.prompt')} name="promptValue">
          <TextArea rows={5} value={prompt} onChange={e => setPrompt(e.target.value)} />
        </Form.Item>

        <Form.Item label={t('StoryPage.model')} name="modelValue">
          <Select
            style={{ width: 300 }}
            options={Array.from(LLMTextModelList, ([value, label]) => ({ value, label }))}
            onChange={val => setModel(val)}
          />
        </Form.Item>

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

        <ActionBar
          actionStart={
            <Button type="primary" disabled={!prompt} onClick={handleSubmit}>
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
