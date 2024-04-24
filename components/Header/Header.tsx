'use client'

import { FC } from 'react'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import Link from 'next/link'
import { TonUser } from '../TonUser/TonUser'

type Props = {
  siteUrl: string
}

export const Header: FC<Props> = ({ siteUrl }) => {
  return (
    <TonConnectUIProvider manifestUrl={`${siteUrl}/tonconnect-manifest.json`}>
      <header>
        <nav>
          <Link href="/">Home</Link> | <Link href="/projects">Projects</Link>
        </nav>

        <TonUser />
      </header>
    </TonConnectUIProvider>
  )
}
