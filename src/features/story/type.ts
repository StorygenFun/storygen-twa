import { LLMTextModel } from '@/features/llm/types'
import { Language } from '@/features/localization/types'
import { UUID } from '@/types/common'

export enum StoryWriter {
  Murakami = 'murakami',
  Orwell = 'orwell',
  Kafka = 'kafka',
  Nabokov = 'nabokov',
  King = 'king',
  LiuCixin = 'liuCixin',
}

export enum StoryGenre {
  Fantasy = 'fantasy',
  ScienceFiction = 'scienceFiction',
  LiteraryFiction = 'literaryFiction',
  Humor = 'humor',
  Mystery = 'mystery',
  Horror = 'horror',
  Thriller = 'thriller',
  Detective = 'detective',
  Romance = 'romance',
  HistoricalFiction = 'historicalFiction',
  Memoir = 'memoir',
}

export enum StoryAudience {
  Children = 'children',
  Teenagers = 'teenagers',
  YoungAdults = 'youngAdults',
  Adults = 'adults',
  MiddleGrade = 'middleGrade',
  Seniors = 'seniors',
}

export type StoryOptions = {
  systemMessage?: string
  prompt?: string
  model?: LLMTextModel
  lang?: Language
  scenesNum?: number
  writer?: StoryWriter | string
  genre?: StoryGenre
  audience?: StoryAudience
}

export type IStory = StoryOptions & {
  id: UUID
  title: string
  description: string
  summary: string
  summary_en: string
  sceneIds: UUID[]
  cover?: string
  cover_text?: string
  cover_text_en?: string
  response?: string
  names?: string[]
}

export type ShortScene = {
  title: string
  description: string
}

export type CompactShortScene = {
  t: string
  d: string
}
