import { Container } from '@/components/Container/Container'
import { Story } from '@/features/story/Story/StoryController'
import { StoryDebug } from '@/features/story/StoryDebug/StoryDebug'

export default function ProjectPage({ params }: any) {
  const storyId = params.id

  return (
    <Container>
      <Story
        storyId={storyId}
        siteUrl={process.env.NEXT_PUBLIC_BASE_URL || 'https://storygen.fun'}
        serviceWallet={process.env.NEXT_PUBLIC_SERVICE_WALLET}
      />
      <StoryDebug storyId={storyId} />
    </Container>
  )
}
