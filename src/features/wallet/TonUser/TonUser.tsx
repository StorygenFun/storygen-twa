'use client'

import { FC, useEffect, useState } from 'react'
import {
  TonConnectButton,
  useIsConnectionRestored,
  useTonAddress,
  useTonConnectUI,
  useTonWallet,
} from '@tonconnect/ui-react'
import { UserAvatar } from '@/components/UserAvatar/UserAvatar'
import { UserInfoModal } from '@/components/UserInfoModal/UserInfoModal'
import { useWalletStore } from '@/features/wallet/walletStore'
// import { TonTransaction } from '../TonTransaction/TonTransaction'
import styles from './TonUser.module.scss'

export const TonUser: FC = () => {
  const { clearWallet, updateWalletData } = useWalletStore()

  const connectionRestored = useIsConnectionRestored()
  const userFriendlyAddress = useTonAddress()
  const wallet = useTonWallet()

  const [isUserModalOpen, setIsUserModalOpen] = useState(false)

  useEffect(() => {
    updateWalletData('walletAddress', wallet?.account?.address || null)
    updateWalletData('walletPublicKey', wallet?.account?.publicKey || null)
  }, [updateWalletData, wallet])

  const [tonConnectUI] = useTonConnectUI()

  // const formatAddress = (address: string) => {
  //   return address.slice(0, 4) + '...' + address.slice(-4)
  // }
  // const shortAddress = userFriendlyAddress ? formatAddress(userFriendlyAddress) : ''

  const handleLogout = async () => {
    await tonConnectUI.disconnect()
    clearWallet()
  }

  if (!connectionRestored) {
    return <div className={styles.loading}>Please wait...</div>
  }

  return (
    <div className={styles.tonUser}>
      {userFriendlyAddress ? (
        <>
          {/* <TonTransaction /> */}

          <button className="ghostButton" onClick={() => setIsUserModalOpen(true)}>
            <UserAvatar avatarStr={userFriendlyAddress} />
          </button>

          <UserInfoModal
            isOpen={isUserModalOpen}
            walletAddress={userFriendlyAddress}
            onLogout={handleLogout}
            onClose={() => setIsUserModalOpen(false)}
          />
        </>
      ) : (
        <TonConnectButton />
      )}
    </div>
  )
}
