'use client'

import { FC, useMemo, useState } from 'react'
import { Button, Result } from 'antd'
import { TypedText } from '@/components/TypedText/TypedText'
import { useTranslation } from '@/i18n/client'
import { CompactShortScene } from '../type'
import styles from './StoryBrief.module.scss'

type Props = {
  brief: CompactShortScene[]
  typeSpeed?: number
  onClear: () => void
}

export const StoryBrief: FC<Props> = ({ brief, typeSpeed, onClear }) => {
  const { t } = useTranslation()

  const isWrongFormat = !Array.isArray(brief)

  const [currentIndex, setCurrentIndex] = useState(0)

  const output = useMemo(() => {
    return brief?.flatMap(item => [
      { content: item.t, type: 'title' },
      { content: item.d, type: 'description' },
    ])
  }, [brief])

  return (
    <div className={styles.brief}>
      <h2 className={styles.h2}>{t('StoryPage.generatedBrief')}</h2>

      {!isWrongFormat ? (
        <section className={styles.content}>
          {output.map((item, index) => (
            <>
              {item.type === 'title' && index <= currentIndex && (
                <h3 className={styles.title} key={index}>
                  <TypedText
                    text={item.content}
                    typeSpeed={typeSpeed}
                    onComplete={() => setCurrentIndex(index + 1)}
                  />
                </h3>
              )}
              {item.type === 'description' && index <= currentIndex && (
                <p className={styles.paragraph} key={index}>
                  <TypedText
                    text={item.content}
                    typeSpeed={typeSpeed}
                    onComplete={() => setCurrentIndex(index + 1)}
                  />
                </p>
              )}
            </>
          ))}
        </section>
      ) : (
        <Result
          status="warning"
          title="Format of the answer is wrong"
          extra={
            <Button type="primary" onClick={onClear}>
              Try again
            </Button>
          }
        />
      )}
    </div>
  )
}
