'use client'

import { FC, useCallback, useState } from 'react'
import { ChatAnthropic } from '@langchain/anthropic'
import { PromptTemplate } from '@langchain/core/prompts'
// import { ChatOpenAI } from '@langchain/openai'
import TextArea from 'antd/es/input/TextArea'
import { LLMChain } from 'langchain/chains'
import { ConversationSummaryMemory } from 'langchain/memory'

// const openAIApiKey = '123'
const anthropicApiKey =
  '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'

// const modeOpenAi = new ChatOpenAI({
//   openAIApiKey: openAIApiKey,
//   model: 'gpt-3.5-turbo',
//   // temperature: 0,
// })

const modelAnthropic = new ChatAnthropic({
  anthropicApiKey: anthropicApiKey,
  model: 'claude-3-opus-20240229',
  // temperature: 0,
})

const model = modelAnthropic

export const Story: FC = () => {
  const memoryKey = 'chat_history_13'

  const [memory, setMemory] = useState<ConversationSummaryMemory | null>(null)
  const [prompt, setPrompt] = useState<any | null>(null)
  const [chain, setChain] = useState<LLMChain | null>(null)
  const [value, setValue] = useState<string | null>(
    'В темном лесу жила старушка, которая любила собирать грибы. Однажды она отправилась в лес и нашла там большой гриб. Она взяла его домой и приготовила из него вкусный ужин. Но когда она проснулась утром, она обнаружила, что гриб исчез. Старушка решила найти его и отправилась в лес.',
  )
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
      PromptTemplate.fromTemplate(`Ниже приводится разговор между человеком в роли заказчика и ИИ в роли автора, который пишет книги в стиле писателя Стивен Кинг.
Заказчик предлагает тему для книги, а автор должен написать историю в жанре "ужасы". Возростная аудитория этой истории - взрослые.
Заказчик может давать некоторые инструкции по форматированию ответа, их нужно выполнять.
Ты не должен давать дополнительные пояснения или задавать вопросы, нужно только выполнять инструкции заказчика.
При написании эпизодов нельзя начинать их с нумерации: не добавляй ничего вроде "Эпизод №X" или "Эпизод X", где X - номер эпизода.
Требуется  не описание эпизодов, а их художетсвенное написание.
Все ответы должны быть на Русском языке кроме случаев, если нет указаний использовать другой язык.
  
Current conversation:
{${memoryKey}}
human: {input}
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
    const initialStory = `Тема истории: "${value}"
Нужно составить список из 3 эпизодов, которые будут описывать историю.
Формат ответа сделай в одном едином JSON, который придставляет из себя массив объектов "scene" с полями "t" (название) и "d" (описание), т.е. [scene, scene, ... scene].
Не нумеруй эпизоды.
Размер каждого описания около 500 символов.
Пришли полный список из всех 3 эпизодов без сокращений и пропусков.
В ответе не должно быть ничего, кроме этого JSON.`
    const result = [...history, initialStory]
    setHistory(result)
    const res0 = await chain.invoke({ input: initialStory })
    console.log('🚀 ~ res0:', res0)
    result.push(res0.text)
    setHistory(result)

    const input1 = `Максимально подробно напиши эпизод №1. Объём около 3000 символов`
    const res1 = await chain.invoke({ input: input1 })
    console.log('🚀 ~ res1:', res1)
    result.push(res1.text)
    setHistory(result)

    const input2 = `Максимально подробно напиши эпизод №2. Объём около 3000 символов`
    const res2 = await chain.invoke({ input: input2 })
    console.log('🚀 ~ res2:', res2)
    result.push(res2.text)
    setHistory(result)

    const input3 = `Максимально подробно напиши эпизод №3. Объём около 3000 символов`
    const res3 = await chain.invoke({ input: input3 })
    console.log('🚀 ~ res3:', res3)
    result.push(res3.text)
    setHistory(result)

    const inputMeta = `Сформируй JSON следующего формата:
{summary: "_summary_", summaryEn: "_summaryEn_", coverText: "_coverText_", coverTextEn: "_coverTextEn_", description: "_description_", storyTitles: ["name1", "name2", ... "name10"]}
где summary - саммари на русском языке, от 300 до 500 символов;
summaryEn - перевод summary на английский язык;
coverText - составь промпт для геренации иллюстрации к этой истории, описание основного место событий для этой истории и краткое описание основных персонажей без упоминания их имен, на русском языке, около 300 символов;
coverTextEn - перевод coverText на английский язык;
description - короткое описание истории на русском языке;
storyTitles - массив из 10 названий истории на русском языке.`
    const resMeta = await chain.invoke({ input: inputMeta })
    console.log('🚀 ~ resMeta:', resMeta)
    result.push(resMeta.text)
    setHistory(result)

    // const mem = await memory.loadMemoryVariables({})
    // console.log('🚀 ~ memory:', mem)
    // result.push(mem[memoryKey])
    // setHistory(result)
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
          <li key={i} style={{ whiteSpace: 'pre-wrap' }}>
            {h}
          </li>
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
