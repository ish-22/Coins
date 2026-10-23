import apiClient from './apiClient'
import { WalletAssetItem, WalletTransactionItem } from '@/mock/walletData'

export interface WalletSummaryResponse {
  totalBalanceUsd: number
  totalBalanceBtc: number
  totalBalanceEur: number
  availableBalanceUsd: number
  availableBalanceBtc: number
  lockedBalanceUsd: number
  lockedBalanceBtc: number
  change24hUsd: number
  change24hPercentage: number
  totalAssetsCount: number
  verificationTier: string
  dailyWithdrawRemainingUsd: number
}

export const walletService = {
  async getSummary(): Promise<WalletSummaryResponse> {
    const res = await apiClient.get<{ summary: WalletSummaryResponse }>('/wallet/summary')
    return res.data.summary
  },

  async getAssets(): Promise<WalletAssetItem[]> {
    const res = await apiClient.get<{ assets: WalletAssetItem[] }>('/wallet/assets')
    return res.data.assets
  },

  async getTransactions(): Promise<WalletTransactionItem[]> {
    const res = await apiClient.get<{ transactions: WalletTransactionItem[] }>('/wallet/transactions')
    return res.data.transactions
  },

  async getDepositAddress(asset: string, network?: string) {
    const res = await apiClient.get('/wallet/deposit/address', {
      params: { asset, network },
    })
    return res.data
  },

  async simulateDeposit(payload: { asset: string; amount: number; network?: string }) {
    const res = await apiClient.post('/wallet/deposit/simulate', payload)
    return res.data
  },

  async withdraw(payload: {
    asset: string
    network: string
    address: string
    amount: number
    memo?: string
  }) {
    const res = await apiClient.post('/wallet/withdraw', payload)
    return res.data
  },

  async getWatchlist(): Promise<string[]> {
    const res = await apiClient.get<{ watchlist: string[] }>('/wallet/watchlist')
    return res.data.watchlist
  },

  async toggleWatchlist(assetSymbol: string): Promise<string[]> {
    const res = await apiClient.post<{ watchlist: string[] }>('/wallet/watchlist', {
      assetSymbol,
    })
    return res.data.watchlist
  },
}

export default walletService
