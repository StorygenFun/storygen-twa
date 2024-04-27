'use client'

import { FC } from 'react'
import { DeleteOutlined, FileImageOutlined } from '@ant-design/icons'
import { Button, Card, Popconfirm } from 'antd'
import Link from 'next/link'
import { useTranslation } from '@/i18n/client'
import { UUID } from '../../../types/common'
import { IStory } from '../type'
import styles from './StoryCard.module.scss'

const { Meta } = Card

type Props = {
  story: IStory
  onDelete?: (id: UUID) => void
}

export const StoryCard: FC<Props> = ({ story, onDelete }) => {
  const { t } = useTranslation()
  const updated_at = new Date(story.updated_at).toLocaleString()

  return (
    <Card
      className={styles.card}
      cover={
        <Link href={`/projects/${story.id}`} className={styles.cover}>
          {story.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="example" src={story.cover} className={styles.image} />
          ) : (
            <div className={styles.placeholder}>
              <FileImageOutlined className={styles.placeholderIcon} />
              <br />
              No cover
            </div>
          )}
        </Link>
      }
      actions={[
        <div key={1}>{updated_at}</div>,
        <Popconfirm
          key={2}
          title={t('StoryPage.removeStory')}
          onConfirm={() => (onDelete ? onDelete(story.id) : {})}
          okText={t('actions.yes')}
          cancelText={t('actions.no')}
        >
          <Button type="text" icon={<DeleteOutlined />} />
        </Popconfirm>,
      ]}
      hoverable
    >
      <Meta
        title={
          <Link href={`/projects/${story.id}`} className={styles.title}>
            {story.title}
          </Link>
        }
        description={story.description}
      />
    </Card>
  )
}
