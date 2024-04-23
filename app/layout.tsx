import { GeistSans } from 'geist/font/sans'
import Link from 'next/link'

const defaultUrl = process.env.NEXT_BASE_URL
  ? `https://${process.env.NEXT_BASE_URL}`
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
        <header>
          <nav>
            <Link href="/">Home</Link> | <Link href="/projects">Projects</Link>
          </nav>
        </header>

        <main>{children}</main>
      </body>
    </html>
  )
}
