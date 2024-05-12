'use client'

import { FC, useEffect, useState } from 'react'
import { GiftOutlined } from '@ant-design/icons'
import { Input, Modal } from 'antd'
import cn from 'classnames'
import { TonIcon } from '@/components/TonIcon/TonIcon'
import { useWalletStore } from '@/features/wallet/walletStore'
import { useTranslation } from '@/i18n/client'
import styles from './PromoCode.module.scss'

export const PromoCode: FC = () => {
  const { t } = useTranslation()

  const { promoCodeBalance, promoCode, updatePromoCode, refreshCodeBalance } = useWalletStore()

  const [codeName, setCodeName] = useState(promoCode || '')
  const [isPromoCodeModalOpen, setIsPromoCodeModalOpen] = useState(false)

  useEffect(() => {
    if (promoCode) {
      refreshCodeBalance(promoCode)
      setCodeName(promoCode)
    }
  }, [promoCode, refreshCodeBalance])

  const handleChange = async () => {
    updatePromoCode(codeName)
    setIsPromoCodeModalOpen(false)
  }

  return (
    <div className={styles.code}>
      <button
        className={cn(styles.promoButton, 'ghostButton')}
        onClick={() => setIsPromoCodeModalOpen(true)}
      >
        <GiftOutlined /> {promoCodeBalance} {promoCodeBalance ? <TonIcon size={20} /> : null}
      </button>

      <Modal
        title={t('modal.havePromoCode')}
        centered
        open={isPromoCodeModalOpen}
        onOk={() => handleChange()}
        onCancel={() => setIsPromoCodeModalOpen(false)}
      >
        <p>
          <Input
            value={codeName}
            onChange={val => setCodeName(val.target.value)}
            placeholder="XXXXXXX"
          />
        </p>
      </Modal>
    </div>
  )
}
