import { Container } from '@/components/Container/Container'
import { Story } from '@/features/story/Story/StoryController'

export default function ProjectPage({ params }: any) {
  const storyId = params.id

  return (
    <Container>
      <Story
        storyId={storyId}
        siteUrl={process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:4480'}
        serviceWallet={process.env.NEXT_PUBLIC_SERVICE_WALLET}
      />
    </Container>
  )
}
