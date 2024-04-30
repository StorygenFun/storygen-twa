'use client'

import { FC } from 'react'
import { ReactTyped } from 'react-typed'
import { DEFAULT_TYPING_SPEED } from '@/features/llm/constants'

type Props = {
  text: string
  typeSpeed?: number
  isTyped?: boolean
  onComplete: () => void
}

export const TypedText: FC<Props> = ({
  text,
  typeSpeed = DEFAULT_TYPING_SPEED,
  isTyped = true,
  onComplete,
}) => {
  if (!isTyped) {
    return <>{text}</>
  }

  return (
    <ReactTyped strings={[text]} typeSpeed={typeSpeed} showCursor={false} onComplete={onComplete} />
  )
}
