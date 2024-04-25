'use client'

import { FC } from 'react'
import {
  CHAIN,
  SendTransactionRequest,
  TonConnectButton,
  useIsConnectionRestored,
  useTonAddress,
  useTonConnectUI,
  useTonWallet,
} from '@tonconnect/ui-react'
import styles from './TonUser.module.scss'

export const TonUser: FC = () => {
  const connectionRestored = useIsConnectionRestored()
  const userFriendlyAddress = useTonAddress()
  const wallet = useTonWallet()
  console.log('🚀 ~ wallet:', wallet)

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

  const formatAddress = (address: string) => {
    return address.slice(0, 4) + '...' + address.slice(-4)
  }

  const handleLogout = async () => {
    await tonConnectUI.disconnect()
  }

  if (!connectionRestored) {
    return <div>Please wait...</div>
  }

  return (
    <div className={styles.tonUser}>
      {userFriendlyAddress ? (
        <>
          <button onClick={handleLogout}>{formatAddress(userFriendlyAddress)}</button>
          <button onClick={() => tonConnectUI.sendTransaction(transaction)}>
            Test transaction
          </button>
        </>
      ) : (
        <TonConnectButton />
      )}
    </div>
  )
}
