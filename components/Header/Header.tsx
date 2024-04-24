'use client'

import { FC } from 'react'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import Link from 'next/link'
import { TonUser } from '../TonUser/TonUser'

export const Header: FC = () => {
  return (
    <TonConnectUIProvider manifestUrl={`https://storygen-fun.vercel.app/tonconnect-manifest.json`}>
      <header>
        <nav>
          <Link href="/">Home</Link> | <Link href="/projects">Projects</Link>
        </nav>

        <TonUser />
      </header>
    </TonConnectUIProvider>
  )
}
