'use client'

import { FC } from 'react'
import { WalletOutlined } from '@ant-design/icons'
import { Button, List, Modal, Popconfirm } from 'antd'
import { useTranslation } from '@/i18n/client'
import { LanguageSelector } from '../LanguageSelector/LanguageSelector'
import styles from './UserInfoModal.module.scss'

type Props = {
  isOpen: boolean
  walletAddress: string
  onLogout: () => void
  onClose: () => void
}
export const UserInfoModal: FC<Props> = ({ isOpen, walletAddress, onLogout, onClose }) => {
  const { t } = useTranslation()

  const data = [
    {
      title: 'Your wallet address',
      description: walletAddress,
    },
    {
      title: 'Your language',
      description: <LanguageSelector />,
    },
  ]

  return (
    <Modal
      title="Profile info"
      centered
      open={isOpen}
      onCancel={onClose}
      footer={
        <div className={styles.footer}>
          <Button onClick={onClose}>Close</Button>

          <Popconfirm
            title="Are you sure?"
            description="Anyway, you can always connect again"
            onConfirm={onLogout}
            okText="Yes"
            cancelText="No"
          >
            <Button type="default" danger>
              Disconnect
            </Button>
          </Popconfirm>
        </div>
      }
    >
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={<WalletOutlined />}
              title={<a href="https://ant.design">{item.title}</a>}
              description={item.description}
            />
          </List.Item>
        )}
      />

      {t('HomePage.title')}
    </Modal>
  )
}
