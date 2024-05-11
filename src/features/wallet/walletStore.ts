import axios from 'axios'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export type WalletData = 'walletAddress' | 'walletPublicKey'

type WalletState = {
  promoCode: string | null
  promoCodeBalance: number | null
  walletAddress: string | null
  walletPublicKey: string | null
  isDebugMode: boolean
  updatePromoCode: (codeName: string | null) => void
  refreshCodeBalance: (codeName: string) => void
  reduceCodeBalance: (codeName: string, amount: number) => void
  updateWalletData: (key: WalletData, value: string | null) => void
  clearWallet: () => void
  changeDebugMode: (value: boolean) => void
}

export const useWalletStore = create<WalletState>()(
  devtools(
    persist(
      set => ({
        promoCode: null,
        promoCodeBalance: null,
        walletAddress: null,
        walletPublicKey: null,
        isDebugMode: false,
        updatePromoCode: (codeName: string | null) => set(() => ({ promoCode: codeName })),

        refreshCodeBalance: async (codeName: string) => {
          try {
            const { data } = await axios.get(`/api/code/${codeName}`)
            const tons = data[0].tons
            if (typeof tons !== 'number') {
              throw new Error('Invalid balance')
            }
            set(() => ({ promoCodeBalance: data[0].tons }))
            return data
          } catch (error: any) {
            throw new Error(error.message)
          }
        },

        reduceCodeBalance: async (codeName: string, amount: number) => {
          try {
            const { data } = await axios.patch(`/api/code/`, { code: codeName, amount })
            const tons = data[0].tons
            if (typeof tons !== 'number') {
              throw new Error('Invalid balance')
            }
            set(() => ({ promoCodeBalance: data[0].tons }))
            return data
          } catch (error: any) {
            throw new Error(error.message)
          }
        },

        updateWalletData: (key: WalletData, value: string | null) => set(() => ({ [key]: value })),
        clearWallet: () => set(() => ({ walletAddress: null, walletPublicKey: null })),
        changeDebugMode: (value: boolean) => set(() => ({ isDebugMode: value })),
      }),
      { name: 'walletStore' },
    ),
  ),
)
