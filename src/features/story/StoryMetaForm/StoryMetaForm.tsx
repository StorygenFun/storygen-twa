'use client'

import { FC, useState } from 'react'
import { Button, Form, Select } from 'antd'
import { DEFAULT_TEXT_MODEL, LLMTextModelList } from '@/features/llm/constants'
import { LLMTextModel } from '@/features/llm/types'
import { useTranslation } from '@/i18n/client'
import { IStory } from '../type'
import styles from './StoryMetaForm.module.scss'

type Props = {
  story: IStory
  isStoryGenerating: boolean
  isDebugMode: boolean
  onGenerate: (textModel: LLMTextModel) => void
}

export const StoryMetaForm: FC<Props> = ({ story, isStoryGenerating, isDebugMode, onGenerate }) => {
  const { t } = useTranslation()

  const [textModel, setTextModel] = useState<LLMTextModel>(story.textModel || DEFAULT_TEXT_MODEL)

  return (
    <div className={styles.meta}>
      <div className={styles.generator}>
        <Form
          className={styles.form}
          layout="vertical"
          initialValues={{
            promptValue: prompt,
            textModelValue: textModel,
          }}
        >
          <Form.Item className={styles.field}>
            <Button
              type="primary"
              disabled={isStoryGenerating}
              onClick={() => onGenerate(textModel)}
            >
              {t('StoryPage.generateMetaData')}
            </Button>
          </Form.Item>

          {isDebugMode && <span>{t('StoryPage.generateWith')}</span>}

          {isDebugMode && (
            <Form.Item name="textModelValue" className={styles.field}>
              <Select
                style={{ width: 300 }}
                options={Array.from(LLMTextModelList, ([value, label]) => ({ value, label }))}
                disabled={isStoryGenerating}
                onChange={val => setTextModel(val)}
              />
            </Form.Item>
          )}
        </Form>
      </div>
    </div>
  )
}
