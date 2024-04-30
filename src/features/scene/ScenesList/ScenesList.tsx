'use client'

import { FC, useMemo, useState } from 'react'
import { Spinner } from '@/components/Spinner/Spinner'
import { TypedText } from '@/components/TypedText/TypedText'
import { IStory } from '@/features/story/type'
import { useTranslation } from '@/i18n/client'
import { IScene } from '../type'
import styles from './ScenesList.module.scss'

type Props = {
  story: IStory
  scenes: IScene[]
  isStoryGenerating: boolean
  typeSpeed?: number
}

export const ScenesList: FC<Props> = ({ story, scenes, isStoryGenerating, typeSpeed }) => {
  const { t } = useTranslation()

  const [currentIndex, setCurrentIndex] = useState(0)

  const output = useMemo(() => {
    return scenes.flatMap(scene => {
      return [
        { content: scene.title, type: 'title' },
        { content: scene.content, type: 'description' },
      ]
    })
  }, [scenes])

  return (
    <section className={styles.scene}>
      {output.map((item, index) => (
        <div key={index}>
          {item.type === 'title' && index <= currentIndex && (
            <h3 className={styles.title}>
              <TypedText
                text={item.content}
                typeSpeed={typeSpeed}
                onComplete={() => setCurrentIndex(index + 1)}
              />
            </h3>
          )}
          {item.type === 'description' && index <= currentIndex && (
            <p className={styles.paragraph}>
              <TypedText
                text={item.content}
                typeSpeed={typeSpeed}
                onComplete={() => setCurrentIndex(index + 1)}
              />
            </p>
          )}
        </div>
      ))}

      {isStoryGenerating && scenes.length !== story.scenesNum && (
        <Spinner isCompact size="default" content={t('progress.briefInProgress')} />
      )}
    </section>
  )
}
