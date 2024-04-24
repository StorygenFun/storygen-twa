import { GeistSans } from 'geist/font/sans'
import { Header } from '@/components/Header/Header'
import '../styles/main.scss'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:4480'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'StoryGen',
  description:
    'StoryGen is a Telegram bot that uses AI to generate personalized stories and covers, with transactions facilitated by TON cryptocurrency for fast and secure payments.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>
        <Header siteUrl={process.env.VERCEL_URL || 'https://storygen-fun.vercel.app'} />

        <main>{children}</main>
      </body>
    </html>
  )
}
