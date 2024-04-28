'use client'

import { FC } from 'react'
import { FileImageOutlined, FileTextOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { askImageLLM, askTextLLM } from '@/features/llm/api'
import { LLMTextModel } from '@/features/llm/types'

export const OpenAiConnector: FC = () => {
  const handleTextRequest = async () => {
    return await askTextLLM({
      prompt: 'Hello, world!',
      systemMessage: 'You are a mega-robot.',
      textModel: LLMTextModel.LLaMA3Chat70B,
    })
  }

  const handleImageRequest = async () => {
    return await askImageLLM({
      prompt: 'Big Boss',
    })
  }

  return (
    <div>
      <p>
        <Button type="primary" icon={<FileTextOutlined />} onClick={handleTextRequest}>
          Ask Text LLM
        </Button>
      </p>
      <p>
        <Button type="primary" icon={<FileImageOutlined />} onClick={handleImageRequest}>
          Ask Image LLM
        </Button>
      </p>
    </div>
  )
}
