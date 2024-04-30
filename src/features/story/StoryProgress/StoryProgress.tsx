import { FC, useMemo } from 'react'
import { Button, Progress, message } from 'antd'
import cn from 'classnames'
import { IScene } from '@/features/scene/type'
import { useTranslation } from '@/i18n/client'
import { StoryCompleted } from '../StoryCompleted/StoryCompleted'
import { GenerationStep, IStory } from '../type'
import styles from './StoryProgress.module.scss'

type Props = {
  story: IStory
  scenes: IScene[]
  inProgress: GenerationStep | null
  isStoryGenerating: boolean
}

export const StoryProgress: FC<Props> = ({ story, scenes, inProgress, isStoryGenerating }) => {
  const { t } = useTranslation()

  const [messageApi, contextHolder] = message.useMessage()

  const partsCollector: number = (story?.scenesNum || 0) * 2 + 3
  const pointsCollection: number =
    [story?.brief, story?.summary_en, story?.cover].filter(Boolean).length +
    (story?.sceneIds.length || 0) +
    scenes.filter(scene => scene.summary).length

  const percent = Math.ceil((pointsCollection / partsCollector) * 100)
  const isCompleted = percent > 99

  const resultMessage = useMemo(() => {
    if (inProgress === GenerationStep.Brief)
      return isStoryGenerating ? t('progress.briefInProgress') : t('progress.briefDone')
    if (inProgress === GenerationStep.Scenes)
      return isStoryGenerating
        ? t('progress.scenesInProgress', { num: scenes.length, total: story.scenesNum })
        : t('progress.scenesDone')
    if (inProgress === GenerationStep.Meta)
      return isStoryGenerating ? t('progress.metaInProgress') : t('progress.metaDone')
    if (!percent) return t('progress.start')
    if (isCompleted) return t('progress.completed')
    if (inProgress === GenerationStep.Cover)
      return isStoryGenerating ? t('progress.coverInProgress') : t('progress.coverDone')
    return 'message'
  }, [inProgress, isCompleted, isStoryGenerating, percent, scenes.length, story.scenesNum, t])

  const warning = () => {
    messageApi.open({
      type: 'warning',
      content: 'The publishing is not available yet. Please, wait for the next updates.',
    })
  }

  return (
    <div className={styles.progress}>
      {contextHolder}
      <Progress type="circle" percent={percent} size={52} />
      <div className={cn(styles.message, { [styles.completed]: isCompleted })}>{resultMessage}</div>
      {isCompleted && <span className={styles.icon}>🎉</span>}
      <div className={styles.space} />
      {isCompleted && (
        <Button type="primary" onClick={warning}>
          {t('actions.publish')}
        </Button>
      )}
      {isCompleted && <StoryCompleted />}
    </div>
  )
}
