import { FC } from 'react'
import Lottie from 'lottie-react'
import styles from './StoryCompleted.module.scss'
import groovyWalkAnimation from './lottie-completed.json'

type Props = {}

export const StoryCompleted: FC<Props> = () => {
  return (
    <div className={styles.completed}>
      <Lottie animationData={groovyWalkAnimation} loop={false} />
    </div>
  )
}
