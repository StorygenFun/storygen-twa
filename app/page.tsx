import { createClient } from '@/utils/supabase/server'
import AuthButton from '../components/AuthButton'

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
        <div>{isSupabaseConnected && <AuthButton />}</div>
      </nav>
    </div>
  )
}
