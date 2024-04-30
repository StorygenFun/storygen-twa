import { FC, PropsWithChildren } from 'react'
import { Header as AntHeader } from 'antd/es/layout/layout'
import Link from 'next/link'
import { WalletSection } from '@/features/wallet/WalletSection/WalletSection'
import { createTranslation } from '@/i18n/server'
import { Container } from '../Container/Container'
import styles from './Header.module.scss'

export const Header: FC<PropsWithChildren> = async () => {
  const { t } = await createTranslation()

  return (
    <AntHeader className={styles.header}>
      <Container className={styles.wrapper}>
        <Link href="/" className={styles.logo}>
          <svg
            width="1109"
            height="1115"
            viewBox="0 0 1109 1115"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M554.5 38.0899L1077 375.43V738.097L554.5 1076.38L32 738.097L32 375.43L554.5 38.0899Z"
              stroke="currentColor"
              strokeWidth="64"
            />
            <path
              d="M554 1063.5L554 845.409C554 763.811 512.541 687.803 443.936 643.626L26 374.5"
              stroke="currentColor"
              strokeWidth="64"
            />
            <path
              d="M554 1052L554 1025.41C554 943.811 512.541 867.803 443.936 823.626L26 554.5"
              stroke="currentColor"
              strokeWidth="64"
            />
            <path
              d="M556 1063.5L556 845.409C556 763.811 597.459 687.803 666.064 643.626L1084 374.5"
              stroke="currentColor"
              strokeWidth="64"
            />
            <path
              d="M556 1052L556 1025.41C556 943.811 597.459 867.803 666.064 823.626L1084 554.5"
              stroke="currentColor"
              strokeWidth="64"
            />
          </svg>
          <span className={styles.logoText}>StoryGen</span>
        </Link>

        <ul className={styles.menuList}>
          <li className={styles.menuItem}>
            <Link href="/projects" className={styles.menuLink}>
              {t('header.projects')}
            </Link>
          </li>
        </ul>

        <WalletSection siteUrl={process.env.NEXT_PUBLIC_BASE_URL || 'https://storygen.fun'} />
      </Container>
    </AntHeader>
  )
}
