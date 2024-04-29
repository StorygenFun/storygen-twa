import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { clearDatabase, localDB } from '@/libs/dexie/db'
import { UUID } from '@/types/common'
import { GenerationStep, IStory } from './type'

type StoryState = {
  isStoriesLoading: boolean
  stories: IStory[]
  currentStep: GenerationStep | null
  fetchAllStories: () => Promise<IStory[] | undefined>
  fetchStoryById: (id: UUID) => Promise<IStory | undefined>
  createStory: (story: IStory) => Promise<IStory | undefined>
  updateStory: (id: UUID, updatedFields: Partial<IStory>) => void
  deleteStory: (id: UUID) => void
  changeCurrentStep: (step: GenerationStep) => void
  getAllStories: () => IStory[]
  getStoryById: (id?: UUID | null) => IStory | null
  clearDB: () => void
}

export const useStoryStore = create<StoryState>()(
  devtools((set, get) => ({
    isStoriesLoading: true,
    stories: [],
    currentStep: null,
    fetchAllStories: async () => {
      set({ isStoriesLoading: true })
      try {
        const stories = await localDB.stories.toArray()
        set({
          stories: [...stories],
        })
        return stories
      } catch (err) {
        console.error('fetchAllStories:', err)
      } finally {
        set({ isStoriesLoading: false })
      }
    },
    fetchStoryById: async (id: UUID) => {
      try {
        const story = await localDB.stories.get(id)
        if (story) {
          set(state => ({
            stories: [...state.stories, story],
          }))
          return story
        }
      } catch (err) {
        console.error('fetchStoryById:', err)
      }
    },
    createStory: async (story: IStory) => {
      try {
        set(state => ({
          stories: [...state.stories, story],
        }))
        await localDB.stories.add(story)
        return story
      } catch (err) {
        console.error('createStory:', err)
      }
    },
    updateStory: async (storyId, updatedFields) => {
      try {
        const updatedFieldsWithDate = { ...updatedFields, updated_at: new Date().toISOString() }
        set(state => ({
          stories: state.stories.map(story =>
            story.id === storyId ? { ...story, ...updatedFieldsWithDate } : story,
          ),
        }))
        await localDB.stories.update(storyId, updatedFieldsWithDate)
      } catch (err) {
        console.error('updateStory:', err)
      }
    },
    deleteStory: async storyId => {
      try {
        const { stories } = get()
        const story = stories.find(story => story.id === storyId) || null

        set(state => ({
          stories: state.stories.filter(story => story.id !== storyId),
        }))

        if (story?.sceneIds) {
          await Promise.all(story.sceneIds.map(partsId => localDB.scenes.delete(partsId)))
        }

        await localDB.stories.delete(storyId)
      } catch (err) {
        console.error('deleteStory:', err)
      }
    },
    changeCurrentStep: async (step: GenerationStep) => {
      set({ currentStep: step })
    },
    getAllStories: () => {
      const { stories } = get()
      const storiesCopy = [...stories]
      storiesCopy.sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      )
      return storiesCopy
    },
    getStoryById: storyId => {
      if (!storyId) return null
      const { stories } = get()
      return stories.find(story => story.id === storyId) || null
    },
    clearDB: () => {
      clearDatabase()
    },
  })),
)
