'use client'

import { FC } from 'react'
import { Button, Popconfirm, Result } from 'antd'
import { ActionBar } from '@/components/ActionBar/ActionBar'
import { useTranslation } from '@/i18n/client'
import { CompactShortScene } from '../type'
import styles from './StoryBrief.module.scss'

type Props = {
  brief: CompactShortScene[]
  onCancel: () => void
  onGenerate: () => void
}

export const StoryBrief: FC<Props> = ({ brief, onCancel, onGenerate }) => {
  const { t } = useTranslation()

  const isWrongFormat = !Array.isArray(brief)

  return (
    <div className={styles.brief}>
      <h2 className={styles.h2}>{t('StoryPage.generatedScenes')}</h2>

      {!isWrongFormat ? (
        <ul className={styles.list}>
          {brief?.map((scene, index) => (
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
