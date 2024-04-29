'use client'

import { FC } from 'react'
import { IStory } from '../type'
import styles from './StoryMeta.module.scss'

type Props = {
  story: IStory
  isGenerating: boolean
}

export const StoryMeta: FC<Props> = ({ story }) => {
  return (
    <div className={styles.meta}>
      <div className={styles.poster}>
        {story.description && <h3 className={styles.description}>{story.description}</h3>}
        <p>
          <q className={styles.quote}>{story.summary}</q>
        </p>
      </div>
    </div>
  )
}
