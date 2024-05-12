'use client'

import { FC } from 'react'
import { MessageOutlined, WalletOutlined, WarningOutlined } from '@ant-design/icons'
import { Button, List, Modal, Popconfirm, Switch } from 'antd'
import { useWalletStore } from '@/features/wallet/walletStore'
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

  const { isDebugMode, changeDebugMode } = useWalletStore()

  const data = [
    {
      title: t('modal.yourAddress'),
      description: walletAddress,
      icon: <WalletOutlined />,
    },
    {
      title: t('modal.yourLanguage'),
      description: <LanguageSelector />,
      icon: <MessageOutlined />,
    },
    {
      title: t('modal.debugMode'),
      description: (
        <div>
          <Switch defaultChecked={isDebugMode} onChange={val => changeDebugMode(val)} />
        </div>
      ),
      icon: (
        <span style={{ color: '#ff4d4f' }}>
          <WarningOutlined />
        </span>
      ),
    },
  ]

  return (
    <Modal
      title={t('modal.profileInfo')}
      centered
      open={isOpen}
      onCancel={onClose}
      footer={
        <div className={styles.footer}>
          <Button onClick={onClose}>{t('actions.close')}</Button>

          <Popconfirm
            title={t('actions.areYouSure')}
            description={t('modal.canConnectAgain')}
            onConfirm={onLogout}
            okText={t('actions.yes')}
            cancelText={t('actions.no')}
          >
            <Button type="default" danger>
              {t('actions.disconnect')}
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
            <List.Item.Meta avatar={item.icon} title={item.title} description={item.description} />
          </List.Item>
        )}
      />
    </Modal>
  )
}
