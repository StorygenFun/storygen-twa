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
import { useWalletStore } from '@/features/wallet/walletStore'
import { useTranslation } from '@/i18n/client'
import { StoryMetaForm } from '../StoryMetaForm/StoryMetaForm'
import { IStory } from '../type'
import { formatBrief } from '../utils/story.utils'
import styles from './Story.module.scss'

type StoryProps = {
  story: IStory
  isStoryGenerating: boolean
  scenesList: IScene[] | undefined
  onChange: (stroy: IStory) => void
  onChangeTitle: (title: string) => void
  onGenerateStart: () => void
  onGenerateScenes: () => void
  onGenerateMeta: (textModel?: LLMTextModel) => void
  onGenerateCover: (imageModel: LLMImageModel) => void
}

export const StoryView: FC<StoryProps> = ({
  story,
  isStoryGenerating,
  scenesList,
  onChange,
  onChangeTitle,
  onGenerateStart,
  onGenerateScenes,
  onGenerateMeta,
  onGenerateCover,
}) => {
  const { t } = useTranslation()
  const formattedBrief = story?.brief ? formatBrief(story?.brief) : null
  const { isDebugMode } = useWalletStore()

  const isControlsVisible = !story.isSimple || isDebugMode

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
      {isDebugMode ? (
        <Heading
          isCentered
          title={story.title}
          onChange={onChangeTitle}
          actions={<NameSelector />}
        />
      ) : (
        <Heading isCentered title={story.title} />
      )}

      {!story.brief && !isStoryGenerating && (
        <StoryForm story={story} onChange={onChange} onGenerate={onGenerateStart} />
      )}

      {formattedBrief && story.sceneIds.length === 0 && (
        <StoryBrief brief={formattedBrief} onClear={() => onChange({ ...story, brief: null })} />
      )}

      {story.brief && !story.sceneIds.length && isControlsVisible && (
        <ActionBar
          actionEnd={
            <Button type="primary" disabled={isStoryGenerating} onClick={onGenerateScenes}>
              {t('StoryPage.generateFullStory')}
            </Button>
          }
        />
      )}

      {story.summary_en && (
        <StoryCover story={story} isGenerating={isStoryGenerating} onGenerate={onGenerateCover} />
      )}

      {story.summary_en && <StoryMeta story={story} isGenerating={isStoryGenerating} />}

      {scenesList && scenesList.length > 0 && (
        <ScenesList
          story={story}
          scenes={scenesList}
          isStoryGenerating={isStoryGenerating && story.scenesNum !== story.sceneIds.length}
          isSummaryGenerating={isStoryGenerating}
        />
      )}

      {story.brief &&
        !story.summary_en &&
        scenesList &&
        scenesList.length === story.scenesNum &&
        isControlsVisible && (
          <StoryMetaForm
            story={story}
            isStoryGenerating={isStoryGenerating}
            isDebugMode={isDebugMode}
            onGenerate={onGenerateMeta}
          />
        )}
    </article>
  )
}
