'use client'

import { FC, useCallback, useState } from 'react'
import { PromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'
import TextArea from 'antd/es/input/TextArea'
import { LLMChain } from 'langchain/chains'
import { ConversationSummaryMemory } from 'langchain/memory'

const openAIApiKey = '123'

const model = new ChatOpenAI({
  openAIApiKey: openAIApiKey,
  model: 'gpt-3.5-turbo',
  temperature: 0,
})

export const Story: FC = () => {
  const memoryKey = 'chat_history_4'

  const [memory, setMemory] = useState<ConversationSummaryMemory | null>(null)
  const [prompt, setPrompt] = useState<any | null>(null)
  const [chain, setChain] = useState<LLMChain | null>(null)
  const [value, setValue] = useState<string | null>("Hello, I'm Serg")
  const [history, setHistory] = useState<(string | null)[]>([])

  const initMemory = async () => {
    setMemory(
      new ConversationSummaryMemory({
        memoryKey,
        llm: model,
      }),
    )
  }

  const initPrompt = async () => {
    setPrompt(
      PromptTemplate.fromTemplate(`The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.
  
    Current conversation:
    {${memoryKey}}
    Human: {input}
    AI:`),
    )
  }

  const initChain = async () => {
    if (!memory || !prompt) return
    setChain(new LLMChain({ llm: model, prompt, memory }))
  }

  const handleInvoke = useCallback(async () => {
    if (!chain || !memory) return
    console.log('🚀 ~ value:', value)
    const result = [...history, value]
    setHistory(result)
    const res = await chain.invoke({ input: value })
    console.log('🚀 ~ res:', res)
    result.push(res.text)
    setHistory(result)
    const mem = await memory.loadMemoryVariables({})
    console.log('🚀 ~ memory:', mem)
    result.push(mem[memoryKey])
    setHistory(result)
    setValue(null)
  }, [chain, history, memory, value])

  return (
    <div>
      <p>
        <button onClick={initMemory}>initMemory</button>
      </p>
      <p>
        <button onClick={initPrompt}>initPrompt</button>
      </p>
      <p>
        <button onClick={initChain}>initChain</button>
      </p>

      <ul>
        {history.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>

      <p>
        <TextArea rows={4} onChange={e => setValue(e.target.value)} value={value || ''} />
        <button disabled={!value} onClick={handleInvoke}>
          Submit
        </button>
      </p>
    </div>
  )
}
