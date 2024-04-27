import { fromNano } from '@ton/core'
import { GENERATION_COST } from '../constants'

export const calculateStoryGenerationCost = (scenesAmount: number) => {
  return GENERATION_COST * (scenesAmount + 1)
}

export const getReadableCost = (cost: number) => {
  return `${fromNano(cost)} TON`
}
