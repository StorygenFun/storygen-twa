'use client'

import { FC, useState } from 'react'
import { TypedText } from '@/components/TypedText/TypedText'
import { IStory } from '../type'
import styles from './StoryMeta.module.scss'

type Props = {
  story: IStory
  typeSpeed?: number
  isGenerating: boolean
}

export const StoryMeta: FC<Props> = ({ story, typeSpeed }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <div className={styles.meta}>
      <div className={styles.poster}>
        {story.description && (
          <h3 className={styles.description}>
            <TypedText
              text={story.description}
              typeSpeed={typeSpeed}
              onComplete={() => setCurrentIndex(1)}
            />
          </h3>
        )}
        {currentIndex >= 1 && story.summary && (
          <p>
            <q className={styles.quote}>
              <TypedText
                text={story.summary}
                typeSpeed={typeSpeed}
                onComplete={() => setCurrentIndex(2)}
              />
            </q>
          </p>
        )}
      </div>
    </div>
  )
}
