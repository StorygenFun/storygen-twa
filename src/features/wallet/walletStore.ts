import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export type WalletData = 'walletAddress' | 'walletPublicKey'

type WalletState = {
  walletAddress: string | null
  walletPublicKey: string | null
  updateWalletData: (key: WalletData, value: string | null) => void
  clearWallet: () => void
}

export const useWalletStore = create<WalletState>()(
  devtools(
    persist(
      set => ({
        walletAddress: null,
        walletPublicKey: null,
        updateWalletData: (key: WalletData, value: string | null) => set(() => ({ [key]: value })),
        clearWallet: () => set(() => ({ walletAddress: null, walletPublicKey: null })),
      }),
      { name: 'walletStore' },
    ),
  ),
)
