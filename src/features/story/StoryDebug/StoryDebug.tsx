'use client'

import { FC, useMemo, useState } from 'react'
import { WarningOutlined } from '@ant-design/icons'
import { Button, FloatButton, List, Modal, Switch } from 'antd'
import { useSceneStore } from '@/features/scene/sceneStore'
import { useWalletStore } from '@/features/wallet/walletStore'
import { useTranslation } from '@/i18n/client'
import { useStoryStore } from '../storyStore'

type Props = {
  storyId: string
}

export const StoryDebug: FC<Props> = ({ storyId }) => {
  const { t } = useTranslation()

  const [isDebagActive, setIsDebagActive] = useState(false)
  const [shouldClose, setShouldClose] = useState(true)
  const { getStoryById, updateStory } = useStoryStore()
  const { isDebugMode } = useWalletStore()
  const { deleteScene } = useSceneStore()

  const initialStory = storyId ? getStoryById(storyId as string) : null

  const data = useMemo(() => {
    if (!initialStory) return []
    return [
      {
        title: t('modal.removeBrief'),
        isDisabled: !initialStory.brief,
        action: () => {
          updateStory(initialStory.id, { ...initialStory, brief: null })
          if (shouldClose) setIsDebagActive(false)
        },
      },
      {
        title: t('modal.removeScenes'),
        isDisabled: !initialStory.sceneIds.length,
        action: () => {
          const ids = initialStory.sceneIds
          ids.forEach(id => deleteScene(id))
          updateStory(initialStory.id, { ...initialStory, sceneIds: [] })
          if (shouldClose) setIsDebagActive(false)
        },
      },
      {
        title: t('modal.removeMeta'),
        isDisabled: !initialStory.summary_en,
        action: () => {
          updateStory(initialStory.id, {
            ...initialStory,
            names: [],
            description: null,
            summary: null,
            summary_en: null,
            cover_text: null,
            cover_text_en: null,
          })
          if (shouldClose) setIsDebagActive(false)
        },
      },
      {
        title: t('modal.removeCover'),
        isDisabled: !initialStory.cover,
        action: () => {
          updateStory(initialStory.id, { ...initialStory, cover: null })
          if (shouldClose) setIsDebagActive(false)
        },
      },
    ]
  }, [deleteScene, initialStory, shouldClose, t, updateStory])

  if (!storyId || !isDebugMode) return null

  return (
    <>
      <FloatButton
        icon={
          <span style={{ color: '#ff4d4f' }}>
            <WarningOutlined />
          </span>
        }
        onClick={() => setIsDebagActive(!isDebagActive)}
      />

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px', color: '#ff4d4f' }}>
              <WarningOutlined />
            </span>{' '}
            {t('modal.dangerZone')}
          </div>
        }
        centered
        open={isDebagActive}
        okText={t('actions.close')}
        cancelText={t('actions.cancel')}
        onOk={() => setIsDebagActive(false)}
        onCancel={() => setIsDebagActive(false)}
      >
        <List
          dataSource={data}
          renderItem={item => (
            <List.Item key={item.title}>
              <List.Item.Meta title={item.title} />
              <Button type="primary" danger disabled={item.isDisabled} onClick={item.action}>
                {t('actions.remove')}
              </Button>
            </List.Item>
          )}
        />
        <div>
          <Switch defaultChecked={shouldClose} onChange={val => setShouldClose(val)} />{' '}
          {t('modal.closeAfterAction')}
        </div>
      </Modal>
    </>
  )
}
