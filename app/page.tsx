import { OpenAiConnector } from '@/components/OpenAiConnector'

export default async function Index() {
  return (
    <div>
      <nav>
        <div>HOMEPAGE</div>
        <OpenAiConnector />
      </nav>
    </div>
  )
}
