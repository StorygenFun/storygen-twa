'use client'

import { FC, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import { Heading } from '@/components/Heading/Heading'
import { Spinner } from '@/components/Spinner/Spinner'
import { DEFAULT_IMAGE_MODEL, DEFAULT_TEXT_MODEL } from '@/features/llm/constants'
import { Language } from '@/features/localization/types'
import { useTranslation } from '@/i18n/client'
import { UUID } from '@/types/common'
import { StoriesList } from '../StoriesList/StoriesList'
import { StoryCreateModal } from '../StoryCreateModal/StoryCreateModal'
import { useFetchAllStories } from '../hooks/fetch-stories.hook'
import { useStoryStore } from '../storyStore'

export const StoriesWrapper: FC = () => {
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language as Language

  useFetchAllStories()
  const { isStoriesLoading, createStory, getAllStories, deleteStory } = useStoryStore()

  const storiesList = getAllStories()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleCreateStory = async (title: string) => {
    return await createStory({
      id: uuidv4(),
      title,
      description: '',
      prompt: '',
      summary: '',
      summary_en: '',
      sceneIds: [],
      scenesNum: 5,
      textModel: DEFAULT_TEXT_MODEL,
      imageModel: DEFAULT_IMAGE_MODEL,
      lang: currentLanguage,
      isSimple: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  }

  const handleStoryDelete = async (id: UUID) => {
    await deleteStory(id)
  }

  if (isStoriesLoading) {
    return <Spinner content={t('StoryPage.storiesLoading')} />
  }

  return (
    <>
      {storiesList?.length > 0 && (
        <Heading
          actions={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              {t('StoryPage.createNewStory')}
            </Button>
          }
        >
          {t('StoryPage.yourStories')}
        </Heading>
      )}

      <StoriesList
        list={storiesList}
        onStart={() => setIsCreateModalOpen(true)}
        onStoryDelete={id => handleStoryDelete(id)}
      />

      <StoryCreateModal
        isOpen={isCreateModalOpen}
        onSubmit={handleCreateStory}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  )
}
