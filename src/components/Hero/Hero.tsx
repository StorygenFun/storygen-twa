'use client'

import { FC, PropsWithChildren } from 'react'
import { Button } from 'antd'
import Link from 'next/link'
import styles from './Hero.module.scss'

type Props = {
  title?: string
  ctaText?: string
  ctaUrl?: string
  imageUrl?: string
  backgroundColor?: string
}
export const Hero: FC<PropsWithChildren<Props>> = ({
  title,
  ctaText,
  ctaUrl,
  imageUrl,
  backgroundColor,
  children,
}) => {
  const style = {
    backgroundColor: backgroundColor,
    backgroundImage: `url(${imageUrl})`,
  }
  return (
    <div className={styles.hero} style={style}>
      {(children || title) && (
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>{title}</h1>
            {ctaText && ctaUrl && (
              <Link href={ctaUrl}>
                <Button size="large">{ctaText}</Button>
              </Link>
            )}
            {children && <div className={styles.children}>{children}</div>}
          </div>
        </div>
      )}
    </div>
  )
}
