'use client'

import { FC } from 'react'
import { UnorderedListOutlined } from '@ant-design/icons'
import { Button, Dropdown, MenuProps } from 'antd'
import { ActionBar } from '@/components/ActionBar/ActionBar'
import { Heading } from '@/components/Heading/Heading'
import { LLMImageModel, LLMTextModel } from '@/features/llm/types'
import { ScenesList } from '@/features/scene/ScenesList/ScenesList'
import { IScene } from '@/features/scene/type'
import { StoryBrief } from '@/features/story/StoryBrief/StoryBrief'
import { StoryCover } from '@/features/story/StoryCover/StoryCover'
import { StoryForm } from '@/features/story/StoryForm/StoryForm'
import { StoryMeta } from '@/features/story/StoryMeta/StoryMeta'
import { StoryMetaForm } from '@/features/story/StoryMetaForm/StoryMetaForm'
import { StoryScenesActions } from '@/features/story/StoryScenesActions/StoryScenesActions'
import { IStory, StoryOptions } from '../type'
import { formatBrief } from '../utils/story.utils'
import styles from './Story.module.scss'

type StoryProps = {
  story: IStory
  generatedScene: string | null
  isStoryGenerating: boolean
  isSummaryGenerating: boolean
  isMetaGenerating: boolean
  isCoverGenerating: boolean
  scenesList: IScene[] | undefined
  onChangeTitle: (title: string) => void
  onClearStory: () => void
  onGenerateStart: (options: StoryOptions) => void
  onGenerateScenes: () => void
  onGenerateMeta: (textModel: LLMTextModel) => void
  onGenerateCover: (imageModel: LLMImageModel) => void
}

export const StoryView: FC<StoryProps> = ({
  story,
  generatedScene,
  isStoryGenerating,
  isSummaryGenerating,
  isMetaGenerating,
  isCoverGenerating,
  scenesList,
  onChangeTitle,
  onGenerateStart,
  onClearStory,
  onGenerateScenes,
  onGenerateMeta,
  onGenerateCover,
}) => {
  const formattedBrief = story?.brief ? formatBrief(story?.brief) : null

  const NameSelector = () => {
    if (!story.names?.length) return null

    const items: MenuProps['items'] = story.names.map((name, index) => ({
      key: index,
      label: (
        <span className={styles.nameOption} onClick={() => onChangeTitle(name)}>
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
      <Heading isCentered title={story.title} onChange={onChangeTitle} actions={<NameSelector />} />

      {!scenesList?.length && !isStoryGenerating ? (
        <div className={styles.content}>
          {!formattedBrief ? (
            <StoryForm story={story} onGenerate={onGenerateStart} />
          ) : (
            <StoryBrief
              brief={formattedBrief}
              onCancel={onClearStory}
              onGenerate={onGenerateScenes}
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
                onGenerate={onGenerateCover}
              />
              <StoryMeta story={story} isGenerating={isMetaGenerating} />
            </>
          )}

          {scenesList && (
            <ScenesList
              list={scenesList}
              generatedScene={generatedScene}
              isStoryGenerating={isStoryGenerating && story.scenesNum !== story.sceneIds.length}
              isSummaryGenerating={isSummaryGenerating}
            />
          )}

          {!isStoryGenerating && (
            <ActionBar
              actionStart={
                !story.summary && (
                  <StoryMetaForm
                    story={story}
                    isGenerating={isMetaGenerating}
                    onGenerate={onGenerateMeta}
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
