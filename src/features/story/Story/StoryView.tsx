'use client'

import { FC, useCallback, useMemo } from 'react'
import { UnorderedListOutlined } from '@ant-design/icons'
import { Button, Dropdown, MenuProps } from 'antd'
import { ActionBar } from '@/components/ActionBar/ActionBar'
import { Heading } from '@/components/Heading/Heading'
import { LLMImageModel, LLMTextModel } from '@/features/llm/types'
import { ScenesList } from '@/features/scene/ScenesList/ScenesList'
import { useSceneStore } from '@/features/scene/sceneStore'
import { IScene } from '@/features/scene/type'
import { StoryCover } from '@/features/story/StoryCover/StoryCover'
import { StoryForm } from '@/features/story/StoryForm/StoryForm'
import { StoryMeta } from '@/features/story/StoryMeta/StoryMeta'
import { StoryMetaForm } from '@/features/story/StoryMetaForm/StoryMetaForm'
import { StoryResponse } from '@/features/story/StoryResponse/StoryResponse'
import { StoryScenesActions } from '@/features/story/StoryScenesActions/StoryScenesActions'
import { CompactShortScene, IStory, StoryOptions } from '../type'
import styles from './Story.module.scss'

type StoryProps = {
  story: IStory
  generatedScene: string | null
  isStoryGenerating: boolean
  isSummaryGenerating: boolean
  isMetaGenerating: boolean
  isCoverGenerating: boolean
  formattedResponse: CompactShortScene[] | null
  onUpdate: (story: IStory) => void
  onStoryGenerate: (story: IStory) => void
  onStoryCancel: () => void
  onScenesGenerate: () => void
  onMetaGenerate: (model: LLMTextModel, context: string) => void
  onCoverGenerate: (model: LLMImageModel) => void
}

export const StoryView: FC<StoryProps> = ({
  story,
  generatedScene,
  isStoryGenerating,
  isSummaryGenerating,
  isMetaGenerating,
  isCoverGenerating,
  formattedResponse,
  onUpdate,
  onStoryGenerate,
  onStoryCancel,
  onScenesGenerate,
  onMetaGenerate,
  onCoverGenerate,
}) => {
  const { getSceneById } = useSceneStore()

  const scenesList = useMemo(() => {
    const list: IScene[] = []
    story.sceneIds?.forEach(id => {
      const item = getSceneById(id)
      if (item) {
        list.push(item)
      }
    })
    return list
  }, [getSceneById, story.sceneIds])

  const handleTitleUpdate = useCallback(
    (title: string) => {
      onUpdate({ ...story, title })
    },
    [onUpdate, story],
  )

  const handleStoryGenerate = useCallback(
    (options: StoryOptions) => {
      onUpdate({ ...story, ...options })
      onStoryGenerate({ ...story, ...options })
    },
    [onStoryGenerate, onUpdate, story],
  )

  const handleMetaGenerate = (model: LLMTextModel) => {
    const context = scenesList.map(scene => scene.summary).join('\n')
    if (context) {
      onMetaGenerate(model, context)
    }
  }

  const NameSelector = () => {
    if (!story.names?.length) return null

    const items: MenuProps['items'] = story.names.map((name, index) => ({
      key: index,
      label: (
        <span className={styles.nameOption} onClick={() => handleTitleUpdate(name)}>
          {name}
        </span>
      ),
    }))

    return (
      <Dropdown
        menu={{ items }}
        placement="bottomRight"
        trigger={['click']}
        arrow={{ pointAtCenter: true }}
        className={styles.nameSelector}
      >
        <Button icon={<UnorderedListOutlined />} />
      </Dropdown>
    )
  }

  if (!story) return null

  return (
    <article className={styles.story}>
      <Heading
        isCentered
        title={story.title}
        onChange={handleTitleUpdate}
        actions={<NameSelector />}
      />

      {!scenesList.length && !isStoryGenerating ? (
        <div className={styles.content}>
          {!formattedResponse ? (
            <StoryForm story={story} onGenerate={handleStoryGenerate} />
          ) : (
            <StoryResponse
              response={formattedResponse}
              onCancel={onStoryCancel}
              onGenerate={onScenesGenerate}
            />
          )}
        </div>
      ) : (
        <>
          {story.scenesNum === story.sceneIds.length && story.summary && (
            <>
              <StoryCover
                story={story}
                isGenerating={isCoverGenerating}
                onGenerate={onCoverGenerate}
              />
              <StoryMeta story={story} isGenerating={isMetaGenerating} />
            </>
          )}

          <ScenesList
            list={scenesList}
            generatedScene={generatedScene}
            isStoryGenerating={isStoryGenerating && story.scenesNum !== story.sceneIds.length}
            isSummaryGenerating={isSummaryGenerating}
          />

          {!isStoryGenerating && (
            <ActionBar
              actionStart={
                !story.summary && (
                  <StoryMetaForm
                    story={story}
                    isGenerating={isMetaGenerating}
                    onGenerate={handleMetaGenerate}
                  />
                )
              }
              actionEnd={
                story.scenesNum === story.sceneIds.length && <StoryScenesActions story={story} />
              }
            />
          )}
        </>
      )}
    </article>
  )
}
