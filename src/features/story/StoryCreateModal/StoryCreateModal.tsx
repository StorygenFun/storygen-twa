'use client'

import { FC, useEffect, useState } from 'react'
import { Input, Modal } from 'antd'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/i18n/client'
import { UUID } from '../../../types/common'
import { IStory } from '../type'

type Props = {
  isOpen: boolean
  newStoryId?: UUID
  onClose: () => void
  onSubmit: (value: string) => Promise<IStory | undefined>
}

export const StoryCreateModal: FC<Props> = ({ isOpen, onSubmit, onClose }) => {
  const { t, i18n } = useTranslation()
  const router = useRouter()

  const [storyTitle, setStoryTitle] = useState(t('StoryPage.defaultTitle') as string)
  const [confirmLoading, setConfirmLoading] = useState(false)

  useEffect(() => {
    setStoryTitle(t('StoryPage.defaultTitle'))
  }, [i18n.language, t])

  const handleOk = async () => {
    setConfirmLoading(true)
    try {
      const story = await onSubmit(storyTitle)
      if (story) {
        onClose()
        router.push(`/projects/${story.id}`)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setConfirmLoading(false)
    }
  }

  return (
    <Modal
      title={t('modal.createStory')}
      open={isOpen}
      confirmLoading={confirmLoading}
      okButtonProps={{ disabled: !storyTitle }}
      okText={t('actions.ok')}
      cancelText={t('actions.cancel')}
      onOk={handleOk}
      onCancel={onClose}
    >
      <Input
        value={storyTitle}
        onChange={val => setStoryTitle(val.target.value)}
        placeholder={t('StoryPage.storyName')}
      />
    </Modal>
  )
}
