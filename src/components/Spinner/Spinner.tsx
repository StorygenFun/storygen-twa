'use client'

import { FC } from 'react'
import { Spin } from 'antd'
import styles from './Spinner.module.scss'

type Props = {
  size?: 'small' | 'default' | 'large'
  content?: string
}

export const Spinner: FC<Props> = ({ size = 'large', content }) => {
  return (
    <div className={styles.spinner}>
      <Spin size={size} />
      {content && <div className={styles.content}>{content}</div>}
    </div>
  )
}
