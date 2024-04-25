'use client'

import { FC } from 'react'
// import { User } from '@supabase/supabase-js'
import {
  CHAIN,
  SendTransactionRequest,
  TonConnectButton,
  useIsConnectionRestored,
  useTonAddress,
  useTonConnectUI,
  useTonWallet,
} from '@tonconnect/ui-react'
// import { client } from '@/utils/supabase/client'
import styles from './TonUser.module.scss'

export const TonUser: FC = () => {
  const connectionRestored = useIsConnectionRestored()
  const userFriendlyAddress = useTonAddress()
  const wallet = useTonWallet()
  console.log('🚀 ~ wallet:', wallet)

  // const { address, publicKey } = wallet?.account || {}

  const [tonConnectUI] = useTonConnectUI()

  const transaction: SendTransactionRequest = {
    validUntil: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    network: CHAIN.TESTNET,
    messages: [
      {
        address: '0QDmiXPOTeV34BgpeV9IrLL1w3SfPSxmbVTu99uQcgy9J7X1',
        amount: '20000000',
      },
    ],
  }

  const formatAddress = (address: string) => {
    return address.slice(0, 4) + '...' + address.slice(-4)
  }

  // const [user, setUser] = useState<User | null>(null)

  // const authenticateWithSupabase = useCallback(async () => {
  //   if (address && publicKey) {
  //     const { data, error } = await client.auth.signInAnonymously({
  //       options: {
  //         data: { address, publicKey },
  //       },
  //     })
  //     console.log('🚀 ~ authenticateWithSupabase ~ data:', data)
  //     setUser(data?.user || null)
  //     console.error(error)
  //   }
  // }, [address, publicKey])

  // const checkUser = useCallback(async () => {
  //   const user = await client.auth.getUser()
  //   const userData = user?.data?.user
  //   console.log('🚀 ~ checkUser ~ userData:', userData)
  //   setUser(userData || null)
  //   if (!userData) {
  //     await authenticateWithSupabase()
  //   }
  // }, [authenticateWithSupabase])

  // useEffect(() => {
  //   if (!address || !!user) return
  //   if (!user) {
  //     checkUser()
  //   }
  // }, [address, checkUser, user])

  const handleLogout = async () => {
    await tonConnectUI.disconnect()
    // await client.auth.signOut()
    // setUser(null)
  }

  if (!connectionRestored) {
    return <div>Please wait...</div>
  }

  return (
    <div className={styles.tonUser}>
      {userFriendlyAddress ? (
        <>
          <button onClick={handleLogout}>{formatAddress(userFriendlyAddress)}</button>
          <button onClick={() => tonConnectUI.sendTransaction(transaction)}>
            Test transaction
          </button>
        </>
      ) : (
        <TonConnectButton />
      )}
    </div>
  )
}
