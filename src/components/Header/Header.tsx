'use client'

import { FC } from 'react'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import Link from 'next/link'
import { TonUser } from '../../features/wallet/TonUser/TonUser'
import styles from './Header.module.scss'

type Props = {
  siteUrl: string
}

export const Header: FC<Props> = ({ siteUrl }) => {
  return (
    <TonConnectUIProvider manifestUrl={`${siteUrl}/tonconnect-manifest.json`}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link href="/">Home</Link>
          <Link href="/projects">Projects</Link>
        </nav>

        <TonUser />
      </header>
    </TonConnectUIProvider>
  )
}
