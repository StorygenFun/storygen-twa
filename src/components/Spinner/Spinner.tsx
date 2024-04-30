'use client'

import { FC } from 'react'
import { Spin } from 'antd'
import cn from 'classnames'
import styles from './Spinner.module.scss'

type Props = {
  size?: 'small' | 'default' | 'large'
  content?: string
  isCompact?: boolean
}

export const Spinner: FC<Props> = ({ size = 'large', content, isCompact }) => {
  return (
    <div className={cn(styles.spinner, { [styles.compact]: isCompact })}>
      <Spin size={size} />
      {content && <div className={styles.content}>{content}</div>}
    </div>
  )
}
