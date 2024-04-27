'use client'

import { FC } from 'react'
import { Button, Popconfirm, Result } from 'antd'
import { ActionBar } from '@/components/ActionBar/ActionBar'
import { useTranslation } from '@/i18n/client'
import { CompactShortScene } from '../type'
import styles from './StoryResponse.module.scss'

type Props = {
  response: CompactShortScene[]
  onCancel: () => void
  onGenerate: () => void
}

export const StoryResponse: FC<Props> = ({ response, onCancel, onGenerate }) => {
  const { t } = useTranslation()

  const isWrongFormat = !Array.isArray(response)

  return (
    <div className={styles.response}>
      <h2 className={styles.h2}>{t('StoryPage.generatedScenes')}</h2>

      {!isWrongFormat ? (
        <ul className={styles.list}>
          {response?.map((scene, index) => (
            <li key={index} className={styles.chapter}>
              <h3 className={styles.title}>{scene.t}</h3>
              <p className={styles.paragraph}>{scene.d}</p>
            </li>
          ))}
        </ul>
      ) : (
        <Result
          status="warning"
          title="Format of the answer is wrong"
          extra={
            <Button type="primary" onClick={onGenerate}>
              Try again
            </Button>
          }
        />
      )}

      <ActionBar
        actionStart={
          <Popconfirm
            title={t('StoryPage.removeScenesQuestion')}
            onConfirm={onCancel}
            okText={t('actions.yes')}
            cancelText={t('actions.no')}
          >
            <Button danger>{t('StoryPage.regenerate')}</Button>
          </Popconfirm>
        }
        actionEnd={
          <Button type="primary" onClick={onGenerate}>
            {t('StoryPage.generateFullStory')}
          </Button>
        }
      />
    </div>
  )
}
