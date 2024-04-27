'use client'

import { FC, useEffect, useState } from 'react'
import { CHAIN, SendTransactionRequest, useTonConnectUI } from '@tonconnect/ui-react'
import { Modal } from 'antd'
import {
  calculateStoryGenerationCost,
  getReadableCost,
} from '@/features/wallet/utils/payment.utils'
import { useTranslation } from '@/i18n/client'
import { IStory } from '../type'

type Props = {
  storyForPay: IStory | null
  onClear: () => void
  onError: (error: string) => void
  onGenerate: (story: IStory) => void
}

export const StoryPayment: FC<Props> = ({ storyForPay, onClear, onError, onGenerate }) => {
  const { t } = useTranslation()
  const [tonConnectUI] = useTonConnectUI()

  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    setIsModalOpen(!!storyForPay)
  }, [storyForPay])

  const cost = calculateStoryGenerationCost(storyForPay?.scenesNum || 1)

  const handlePay = async () => {
    if (!storyForPay) return
    setIsModalOpen(false)
    const transaction: SendTransactionRequest = {
      validUntil: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      network: CHAIN.TESTNET,
      messages: [
        {
          address: '0QDmiXPOTeV34BgpeV9IrLL1w3SfPSxmbVTu99uQcgy9J7X1',
          amount: String(cost),
        },
      ],
    }

    try {
      const response = await tonConnectUI.sendTransaction(transaction)
      console.log('🚀 ~ handleStartPayment ~ response:', response)
      onGenerate({
        ...storyForPay,
        payment_transaction: response.boc,
        payment_date: new Date().toISOString(),
      })
    } catch (error) {
      onError('Оплата не удалась, попробуйте снова.')
      console.error(error)
    }
  }

  return (
    <Modal
      title={t('StoryPage.paymentModalTitle')}
      open={isModalOpen}
      centered
      okText={t('actions.pay')}
      cancelText={t('actions.cancel')}
      onOk={handlePay}
      onCancel={onClear}
    >
      <p>{t('StoryPage.payModalText')}</p>
      <p>
        {t('StoryPage.payModalCost')} - <b>{getReadableCost(cost)}</b>
      </p>
    </Modal>
  )
}
