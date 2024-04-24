'use client'

import { FC } from 'react'
import { TonConnectButton } from '@tonconnect/ui-react'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import Link from 'next/link'

export const Header: FC = () => {
  return (
    <TonConnectUIProvider manifestUrl="https://<YOUR_APP_URL>/tonconnect-manifest.json">
      <header>
        <nav>
          <Link href="/">Home</Link> | <Link href="/projects">Projects</Link>
        </nav>
        <TonConnectButton />
      </header>
    </TonConnectUIProvider>
  )
}
