'use client'

import { FC, useState } from 'react'
import { Button, Form, Select, Spin } from 'antd'
import { LLMTextModelList } from '@/features/llm/constants'
import { LLMTextModel } from '@/features/llm/types'
import { useWalletStore } from '@/features/wallet/walletStore'
import { useTranslation } from '@/i18n/client'
import { IStory } from '../type'
import styles from './StoryMetaForm.module.scss'

type Props = {
  story: IStory
  isGenerating: boolean
  onGenerate: (textModel: LLMTextModel) => void
}

export const StoryMetaForm: FC<Props> = ({ story, isGenerating, onGenerate }) => {
  const { t } = useTranslation()
  const { isDebugMode } = useWalletStore()

  const [textModel, setTextModel] = useState<LLMTextModel>(
    story.textModel || LLMTextModel.Mixtral8x22BInstruct141B,
  )

  return (
    <div className={styles.meta}>
      {isGenerating ? (
        <div className={styles.process}>
          {t('StoryPage.generatingMetaData')} <Spin />
        </div>
      ) : (
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
              <Button type="primary" onClick={() => onGenerate(textModel)}>
                {t('StoryPage.generateMetaData')}
              </Button>
            </Form.Item>

            {isDebugMode && <span>{t('StoryPage.generateWith')}</span>}

            {isDebugMode && (
              <Form.Item name="textModelValue" className={styles.field}>
                <Select
                  style={{ width: 300 }}
                  options={Array.from(LLMTextModelList, ([value, label]) => ({ value, label }))}
                  onChange={val => setTextModel(val)}
                />
              </Form.Item>
            )}
          </Form>
        </div>
      )}
    </div>
  )
}
