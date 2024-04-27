'use client'

import { FC } from 'react'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { TonUser } from '../TonUser/TonUser'

type Props = {
  siteUrl: string
}

export const WalletSection: FC<Props> = ({ siteUrl }) => {
  return (
    <TonConnectUIProvider manifestUrl={`${siteUrl}/tonconnect-manifest.json`}>
      <TonUser />
    </TonConnectUIProvider>
  )
}
