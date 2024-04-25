import { createClient } from '@/utils/supabase/server'

export default async function Index() {
  const canInitSupabaseClient = () => {
    try {
      createClient()
      return true
    } catch (e) {
      return false
    }
  }

  const isSupabaseConnected = canInitSupabaseClient()

  return (
    <div>
      <nav>
        <div>{isSupabaseConnected ? <div>Login please!</div> : <div>Hello bro!</div>}</div>
      </nav>
    </div>
  )
}
