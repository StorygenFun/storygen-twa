'use client'

import { FC, PropsWithChildren } from 'react'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import { TonTransaction } from '@/features/wallet/TonTransaction/TonTransaction'

type Props = {
  siteUrl: string
}

export const StoryWrapper: FC<PropsWithChildren<Props>> = ({ children, siteUrl }) => {
  return (
    <TonConnectUIProvider manifestUrl={`${siteUrl}/tonconnect-manifest.json`}>
      {children}
      <TonTransaction />
    </TonConnectUIProvider>
  )
}
