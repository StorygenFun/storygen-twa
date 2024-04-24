'use client'

import { FC } from 'react'
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react'

export const TonUser: FC = () => {
  const userFriendlyAddress = useTonAddress()

  const formatAddress = (address: string) => {
    return address.slice(0, 4) + '...' + address.slice(-4)
  }

  return (
    <div>
      {userFriendlyAddress ? <div>{formatAddress(userFriendlyAddress)}</div> : <TonConnectButton />}
    </div>
  )
}
