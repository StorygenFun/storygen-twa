'use client'

import { FC } from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { Button, Popconfirm } from 'antd'
import { useTranslation } from '@/i18n/client'
import { useSceneStore } from '../../scene/sceneStore'
import { useStoryStore } from '../storyStore'
import { IStory } from '../type'

type Props = {
  story: IStory
}

export const StoryScenesActions: FC<Props> = ({ story }) => {
  const { t } = useTranslation()
  const { updateStory } = useStoryStore()
  const { deleteScene } = useSceneStore()

  const removeScenes = async () => {
    const ids = story.sceneIds || []
    ids.forEach(id => {
      deleteScene(id)
    })

    const update = {
      ...story,
      sceneIds: [],
    }

    await updateStory(story.id, update)
  }

  return (
    <Popconfirm
      title={t('StoryPage.removeScenesQuestion')}
      onConfirm={removeScenes}
      okText={t('actions.yes')}
      cancelText={t('actions.no')}
    >
      <Button danger icon={<DeleteOutlined />}>
        {t('StoryPage.removeScenes')}
      </Button>
    </Popconfirm>
  )
}
