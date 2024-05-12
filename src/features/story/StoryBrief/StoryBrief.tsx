'use client'

import { FC, useMemo, useState } from 'react'
import { Button, Result } from 'antd'
import { Spinner } from '@/components/Spinner/Spinner'
import { TypedText } from '@/components/TypedText/TypedText'
import { useTranslation } from '@/i18n/client'
import { CompactShortScene } from '../type'
import styles from './StoryBrief.module.scss'

type Props = {
  brief?: CompactShortScene[] | null
  typeSpeed?: number
  isStoryGenerating: boolean
  onClear: () => void
}

export const StoryBrief: FC<Props> = ({ brief, typeSpeed, isStoryGenerating, onClear }) => {
  const { t } = useTranslation()

  const isWrongFormat = !Array.isArray(brief)

  const [currentIndex, setCurrentIndex] = useState(0)

  const output = useMemo(() => {
    if (typeof brief === 'string') return [{ content: brief, type: 'description' }]
    return brief?.flatMap(item => [
      { content: item.t, type: 'title' },
      { content: item.d, type: 'description' },
    ])
  }, [brief])

  if (!brief && isStoryGenerating) {
    return <Spinner isCompact size="default" content={t('progress.briefInProgress')} />
  }

  if (!brief) return null

  return (
    <div className={styles.brief}>
      <h2 className={styles.h2}>{t('StoryPage.generatedBrief')}</h2>

      {!isWrongFormat ? (
        <section className={styles.content}>
          {output?.map((item, index) => (
            <div key={index}>
              {item.type === 'title' && index <= currentIndex && (
                <h3 className={styles.title}>
                  <TypedText
                    // isTyped={isStoryGenerating}
                    text={item.content}
                    typeSpeed={typeSpeed}
                    onComplete={() => setCurrentIndex(index + 1)}
                  />
                </h3>
              )}
              {item.type === 'description' && index <= currentIndex && (
                <p className={styles.paragraph}>
                  <TypedText
                    // isTyped={isStoryGenerating}
                    text={item.content}
                    typeSpeed={typeSpeed}
                    onComplete={() => setCurrentIndex(index + 1)}
                  />
                </p>
              )}
            </div>
          ))}
        </section>
      ) : (
        <Result
          status="warning"
          title={t('modal.wrongAnswerFormat')}
          extra={
            <Button type="primary" onClick={onClear}>
              {t('actions.tryAgain')}
            </Button>
          }
        />
      )}
    </div>
  )
}
