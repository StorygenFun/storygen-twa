'use client'

import { FC, useState } from 'react'
import { SettingOutlined, WarningOutlined } from '@ant-design/icons'
import { Button, List, Modal } from 'antd'
import { useParams } from 'next/navigation'

type Props = {}

export const StoryDebug: FC<Props> = () => {
  const { id: storyId } = useParams()
  console.log('🚀 ~ storyId:', storyId)
  const [isDebagActive, setIsDebagActive] = useState(false)

  const data = [
    {
      title: 'Remove brief',
      action: () => {},
    },
    {
      title: 'Remove scenes',
      action: () => {},
    },
    {
      title: 'Remove meta',
      action: () => {},
    },
    {
      title: 'Remove cover',
      action: () => {},
    },
  ]

  if (!storyId) return null

  return (
    <>
      <Button
        ghost
        danger
        icon={<SettingOutlined />}
        onClick={() => setIsDebagActive(!isDebagActive)}
      />

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px', color: '#ff4d4f' }}>
              <WarningOutlined />
            </span>{' '}
            Danger zone
          </div>
        }
        centered
        open={isDebagActive}
        onOk={() => setIsDebagActive(false)}
        onCancel={() => setIsDebagActive(false)}
      >
        <List
          dataSource={data}
          renderItem={item => (
            <List.Item key={item.title}>
              <List.Item.Meta title={item.title} />
              <Button type="primary" danger onClick={item.action}>
                Remove
              </Button>
            </List.Item>
          )}
        />
      </Modal>
    </>
  )
}
