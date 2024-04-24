import { GeistSans } from 'geist/font/sans'
import { Header } from '@/components/Header/Header'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

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
        <Header />

        <main>{children}</main>
      </body>
    </html>
  )
}
