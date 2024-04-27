'use client'

import { FC } from 'react'
import { CHAIN, SendTransactionRequest, useTonConnectUI } from '@tonconnect/ui-react'
import { Button } from 'antd'

export const TonTransaction: FC = () => {
  const [tonConnectUI] = useTonConnectUI()

  const transaction: SendTransactionRequest = {
    validUntil: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    network: CHAIN.TESTNET,
    messages: [
      {
        address: '0QDmiXPOTeV34BgpeV9IrLL1w3SfPSxmbVTu99uQcgy9J7X1',
        amount: '20000000',
      },
    ],
  }

  if (!tonConnectUI) return null

  return <Button onClick={() => tonConnectUI.sendTransaction(transaction)}>Test</Button>
}
