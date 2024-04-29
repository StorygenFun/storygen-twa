import type { Metadata } from 'next'
import { Container } from '@/components/Container/Container'
import { Heading } from '@/components/Heading/Heading'
// import { OpenAiConnector } from '@/components/OpenAiConnector'
import { createTranslation } from '@/i18n/server'

export const metadata: Metadata = {
  title: 'StoryGen',
  description: 'Your story generator',
}

export default async function Home() {
  const { t } = await createTranslation()

  return (
    <Container>
      <Heading>HomePage</Heading>
      {/* <OpenAiConnector /> */}
      {t('HomePage.title')}
    </Container>
  )
}
