'use client'

import { FC } from 'react'
import {
  CHAIN,
  Locales,
  SendTransactionRequest,
  TonConnectButton,
  useIsConnectionRestored,
  useTonAddress,
  useTonConnectUI,
  useTonWallet,
} from '@tonconnect/ui-react'

export const TonUser: FC = () => {
  const connectionRestored = useIsConnectionRestored()
  const userFriendlyAddress = useTonAddress()
  const wallet = useTonWallet()
  console.log('🚀 ~ wallet:', wallet)

  const [tonConnectUI, setOptions] = useTonConnectUI()

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

  const handleLanguageChange = (lang: string) => {
    setOptions({ language: lang as Locales })
  }

  const logout = async () => {
    await tonConnectUI.disconnect()
  }

  if (!connectionRestored) {
    return <div>Please wait...</div>
  }

  return (
    <div>
      {userFriendlyAddress ? (
        <>
          <button onClick={logout}>{formatAddress(userFriendlyAddress)}</button>
          <div>
            <label>language</label>
            <select onChange={e => handleLanguageChange(e.target.value)}>
              <option value="en">en</option>
              <option value="ru">ru</option>
            </select>
          </div>
          <button onClick={() => tonConnectUI.sendTransaction(transaction)}>
            Send transaction
          </button>
        </>
      ) : (
        <TonConnectButton />
      )}
    </div>
  )
}
