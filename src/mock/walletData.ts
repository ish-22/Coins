/**
 * CoinPlus Stable Demonstration Data for Wallet / Assets
 * NOTE: Simulated demonstration data. Not connected to real blockchain or exchange.
 */

export interface WalletAssetItem {
  id: string
  name: string
  symbol: string
  type: 'crypto' | 'stablecoin'
  iconBg: string
  availableBalance: number
  lockedBalance: number
  totalBalance: number
  priceUsd: number
  valueUsd: number
  change24h: number
  allocationPercentage: number
  network: string
  color: string
}

export interface WalletTransactionItem {
  id: string
  type: 'deposit' | 'withdrawal' | 'trade_buy' | 'trade_sell' | 'earn_yield'
  asset: string
  amount: number
  valueUsd: number
  feeUsd: number
  status: 'completed' | 'processing' | 'failed'
  txHash: string
  network: string
  address: string
  confirmations: string
  date: string
  time: string
  notes?: string
}

export const mockWalletSummary = {
  totalBalanceUsd: 48920.45,
  totalBalanceBtc: 0.71468,
  totalBalanceEur: 45180.20,
  availableBalanceUsd: 36450.25,
  availableBalanceBtc: 0.5325,
  lockedBalanceUsd: 12470.20,
  lockedBalanceBtc: 0.18218,
  change24hUsd: 2410.80,
  change24hPercentage: 5.18,
  totalAssetsCount: 8,
  verificationTier: 'Tier 2 (Verified)',
  dailyWithdrawRemainingUsd: 500000,
}

// 8 Core Assets: BTC, ETH, USDT, SOL, BNB, XRP, DOGE, and USDC
export const mockWalletAssets: WalletAssetItem[] = [
  // 1. Bitcoin (BTC)
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    type: 'crypto',
    iconBg: '#F0B93A',
    availableBalance: 0.2245,
    lockedBalance: 0.0800,
    totalBalance: 0.3045,
    priceUsd: 68450.25,
    valueUsd: 20843.10, // ~42.6% of portfolio
    change24h: 3.42,
    allocationPercentage: 42.6,
    network: 'Bitcoin Native (SegWit)',
    color: '#F0B93A',
  },
  // 2. Ethereum (ETH)
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    type: 'crypto',
    iconBg: '#38BDF8',
    availableBalance: 2.8500,
    lockedBalance: 0.5000,
    totalBalance: 3.3500,
    priceUsd: 3624.80,
    valueUsd: 12143.08, // ~24.8% of portfolio
    change24h: -1.18,
    allocationPercentage: 24.8,
    network: 'Ethereum (ERC-20)',
    color: '#38BDF8',
  },
  // 3. Tether USD (USDT)
  {
    id: 'tether',
    name: 'Tether USD',
    symbol: 'USDT',
    type: 'stablecoin',
    iconBg: '#00D6A0',
    availableBalance: 5850.00,
    lockedBalance: 1575.00,
    totalBalance: 7425.00,
    priceUsd: 1.0002,
    valueUsd: 7426.49, // ~15.2% of portfolio
    change24h: 0.02,
    allocationPercentage: 15.2,
    network: 'Tron (TRC-20) / ERC-20',
    color: '#00D6A0',
  },
  // 4. Solana (SOL)
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    type: 'crypto',
    iconBg: '#A855F7',
    availableBalance: 22.50,
    lockedBalance: 5.00,
    totalBalance: 27.50,
    priceUsd: 184.65,
    valueUsd: 5077.88, // ~10.4% of portfolio
    change24h: 8.75,
    allocationPercentage: 10.4,
    network: 'Solana Native',
    color: '#A855F7',
  },
  // 5. BNB Chain (BNB)
  {
    id: 'binancecoin',
    name: 'BNB',
    symbol: 'BNB',
    type: 'crypto',
    iconBg: '#F59E0B',
    availableBalance: 2.80,
    lockedBalance: 0.60,
    totalBalance: 3.40,
    priceUsd: 592.10,
    valueUsd: 2013.14, // ~4.1% of portfolio
    change24h: 0.85,
    allocationPercentage: 4.1,
    network: 'BNB Smart Chain (BEP-20)',
    color: '#F59E0B',
  },
  // 6. Ripple (XRP)
  {
    id: 'ripple',
    name: 'Ripple',
    symbol: 'XRP',
    type: 'crypto',
    iconBg: '#3B82F6',
    availableBalance: 1200.0,
    lockedBalance: 300.0,
    totalBalance: 1500.0,
    priceUsd: 0.5842,
    valueUsd: 876.30, // ~1.8% of portfolio
    change24h: 4.12,
    allocationPercentage: 1.8,
    network: 'XRPL Native',
    color: '#3B82F6',
  },
  // 7. Dogecoin (DOGE)
  {
    id: 'dogecoin',
    name: 'Dogecoin',
    symbol: 'DOGE',
    type: 'crypto',
    iconBg: '#EAB308',
    availableBalance: 4200.0,
    lockedBalance: 0.0,
    totalBalance: 4200.0,
    priceUsd: 0.1284,
    valueUsd: 539.28, // ~1.1% of portfolio
    change24h: -4.65,
    allocationPercentage: 1.1,
    network: 'Dogecoin Native',
    color: '#EAB308',
  },
]

// Detailed Transaction Ledger
export const mockWalletTransactions: WalletTransactionItem[] = [
  {
    id: 'tx-w1',
    type: 'deposit',
    asset: 'USDT',
    amount: 2000.0,
    valueUsd: 2000.4,
    feeUsd: 0.0,
    status: 'completed',
    txHash: '0x8f3c71a4819d9b2e04f7c11a2245bb318029e1f5',
    network: 'TRC-20 (Tron)',
    address: 'TX9Qe...48zK',
    confirmations: '32/32 Confirmed',
    date: 'Oct 20, 2026',
    time: '06:40 UTC',
    notes: 'Direct Tron network deposit credited to Spot Account',
  },
  {
    id: 'tx-w2',
    type: 'trade_buy',
    asset: 'ETH',
    amount: 1.5,
    valueUsd: 5437.2,
    feeUsd: 1.08,
    status: 'completed',
    txHash: '0x44a1b029ff8812c37719d2a019b8821948ac9120',
    network: 'Internal Settlement Engine',
    address: 'Match ID: MT-991420',
    confirmations: 'Instant Settlement',
    date: 'Oct 19, 2026',
    time: '22:15 UTC',
    notes: 'Spot Order Fill: Bought 1.5 ETH at $3,624.80 USDT',
  },
  {
    id: 'tx-w3',
    type: 'trade_sell',
    asset: 'BTC',
    amount: 0.05,
    valueUsd: 3422.5,
    feeUsd: 0.68,
    status: 'completed',
    txHash: '0x71e8821199a0b1298811d7f4ac91882019482011',
    network: 'Internal Settlement Engine',
    address: 'Match ID: MT-991204',
    confirmations: 'Instant Settlement',
    date: 'Oct 19, 2026',
    time: '18:30 UTC',
    notes: 'Spot Order Fill: Sold 0.05 BTC at $68,450.00 USDT',
  },
  {
    id: 'tx-w4',
    type: 'earn_yield',
    asset: 'USDT',
    amount: 14.25,
    valueUsd: 14.25,
    feeUsd: 0.0,
    status: 'completed',
    txHash: 'cp-yield-dist-88194',
    network: 'CoinPlus Staking Vault',
    address: 'Vault ID: CP-EARN-USDT-01',
    confirmations: 'Automated Payout',
    date: 'Oct 19, 2026',
    time: '00:00 UTC',
    notes: 'Daily flexible staking distribution (8.2% APY)',
  },
  {
    id: 'tx-w5',
    type: 'withdrawal',
    asset: 'USDT',
    amount: 500.0,
    valueUsd: 500.1,
    feeUsd: 1.0,
    status: 'completed',
    txHash: '0x2e11a88b65ff99bc88110948ac91208477192019',
    network: 'TRC-20 (Tron)',
    address: 'TV42j...88wM',
    confirmations: '32/32 Confirmed',
    date: 'Oct 18, 2026',
    time: '14:22 UTC',
    notes: 'Withdrawal to whitelisted cold storage address',
  },
  {
    id: 'tx-w6',
    type: 'deposit',
    asset: 'BTC',
    amount: 0.2,
    valueUsd: 13690.05,
    feeUsd: 0.0,
    status: 'completed',
    txHash: '34a1b0298812c37719d2a019b8821948ac912088194',
    network: 'Bitcoin Native (SegWit)',
    address: 'bc1q9...77xk',
    confirmations: '6/6 Blocks Confirmed',
    date: 'Oct 17, 2026',
    time: '09:12 UTC',
    notes: 'External wallet deposit verified on block 867,492',
  },
]
