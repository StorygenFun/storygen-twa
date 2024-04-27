import { FC } from 'react'
import { DeleteOutlined, FileImageOutlined } from '@ant-design/icons'
import { Button, Card } from 'antd'
import Link from 'next/link'
import { UUID } from '../../../types/common'
import { IStory } from '../type'
import styles from './StoryCard.module.scss'

const { Meta } = Card

type Props = {
  story: IStory
  onDelete?: (id: UUID) => void
}

export const StoryCard: FC<Props> = ({ story, onDelete }) => {
  const updatedAt = new Date(story.updatedAt).toLocaleString()
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
        <Button
          key={1}
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => (onDelete ? onDelete(story.id) : {})}
        />,
      ]}
      hoverable
    >
      <Meta
        title={
          <Link href={`/projects/${story.id}`} className={styles.title}>
            {story.title}
          </Link>
        }
        description={
          <>
            <div>{story.description}</div>
            <div>{updatedAt}</div>
          </>
        }
      />
    </Card>
  )
}
