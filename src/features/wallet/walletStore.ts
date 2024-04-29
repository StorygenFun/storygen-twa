import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export type WalletData = 'walletAddress' | 'walletPublicKey'

type WalletState = {
  walletAddress: string | null
  walletPublicKey: string | null
  isDebugMode: boolean
  updateWalletData: (key: WalletData, value: string | null) => void
  clearWallet: () => void
  changeDebugMode: (value: boolean) => void
}

export const useWalletStore = create<WalletState>()(
  devtools(
    persist(
      set => ({
        walletAddress: null,
        walletPublicKey: null,
        isDebugMode: false,
        updateWalletData: (key: WalletData, value: string | null) => set(() => ({ [key]: value })),
        clearWallet: () => set(() => ({ walletAddress: null, walletPublicKey: null })),
        changeDebugMode: (value: boolean) => set(() => ({ isDebugMode: value })),
      }),
      { name: 'walletStore' },
    ),
  ),
)
