import type { Metadata } from 'next'
import { Hero } from '@/components/Hero/Hero'
import { createTranslation } from '@/i18n/server'

export const metadata: Metadata = {
  title: 'StoryGen',
  description: 'Your story generator',
}

export default async function Home() {
  const { t } = await createTranslation()

  return (
    <>
      <Hero
        title={t('HomePage.title')}
        imageUrl="/images/storygen.fun-hero.webp"
        ctaText={t('HomePage.cta')}
        ctaUrl="/projects"
      />
    </>
  )
}
