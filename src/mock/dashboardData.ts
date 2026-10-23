/**
 * CoinPlus Stable Demonstration Data for Dashboard
 * NOTE: This is simulated demonstration data for platform showcase. Not real market data.
 */

export interface UserProfile {
  name: string
  email: string
  uid: string
  vipTier: number
  makerFee: string
  takerFee: string
  kycTier: string
  kycStatus: 'verified' | 'pending' | 'unverified'
  securityScore: number
  lastLogin: string
  antiPhishingCode: string
}

export interface PortfolioSummary {
  totalBalanceUsd: number
  totalBalanceBtc: number
  pnl24hUsd: number
  pnl24hPercentage: number
  availableBalanceUsd: number
  availableBalanceBtc: number
  lockedBalanceUsd: number
  lockedBalanceBtc: number
  allTimeRoiPercentage: number
  bestPerformerSymbol: string
  bestPerformerGain: string
}

export type ChartTimeframe = '1D' | '1W' | '1M' | '3M' | '1Y'

export interface ChartDataPoint {
  timestamp: string
  label: string
  value: number
  pnl: number
  volume: number
}

export interface DashboardMarketAsset {
  id: string
  symbol: string
  pair: string
  name: string
  priceUsd: number
  change24h: number
  high24h: number
  low24h: number
  volume24hUsd: number
  sparkline: number[]
  category: 'core' | 'gainers' | 'losers' | 'defi'
  isFavorite?: boolean
}

export interface RecentTransaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'trade_buy' | 'trade_sell' | 'earn_reward'
  asset: string
  amount: number
  valueUsd: number
  feeUsd: number
  status: 'completed' | 'processing' | 'failed'
  txHash?: string
  date: string
  time: string
}

export interface RecentOrder {
  id: string
  pair: string
  side: 'buy' | 'sell'
  type: 'limit' | 'market' | 'stop_limit'
  priceUsd: number
  amount: number
  filledAmount: number
  totalUsd: number
  filledPercentage: number
  status: 'filled' | 'open' | 'pending' | 'cancelled'
  date: string
  time: string
}

export interface AnnouncementItem {
  id: string
  title: string
  category: 'system' | 'listing' | 'security' | 'promo'
  summary: string
  date: string
  isPinned?: boolean
  link?: string
}

// 1. User Profile Data
export const mockUserProfile: UserProfile = {
  name: 'Alex Vance',
  email: 'alex.v@coinplus.io',
  uid: '884920',
  vipTier: 1,
  makerFee: '0.020%',
  takerFee: '0.040%',
  kycTier: 'Tier 2 (Advanced)',
  kycStatus: 'verified',
  securityScore: 98,
  lastLogin: 'Today at 07:15 UTC (London, UK)',
  antiPhishingCode: 'CP-SAFE-92',
}

// 2. Portfolio Summary Metrics
export const mockPortfolioSummary: PortfolioSummary = {
  totalBalanceUsd: 48920.45,
  totalBalanceBtc: 0.71468,
  pnl24hUsd: 2410.80,
  pnl24hPercentage: 5.18,
  availableBalanceUsd: 36450.25,
  availableBalanceBtc: 0.5325,
  lockedBalanceUsd: 12470.20,
  lockedBalanceBtc: 0.18218,
  allTimeRoiPercentage: 142.6,
  bestPerformerSymbol: 'SOL',
  bestPerformerGain: '+11.4%',
}

// 3. Performance Line Chart Data across 1D, 1W, 1M, 3M, 1Y
export const mockPortfolioChartHistory: Record<ChartTimeframe, ChartDataPoint[]> = {
  '1D': [
    { timestamp: '00:00', label: '00:00', value: 46510, pnl: 0, volume: 120 },
    { timestamp: '03:00', label: '03:00', value: 46840, pnl: 330, volume: 95 },
    { timestamp: '06:00', label: '06:00', value: 46420, pnl: -90, volume: 140 },
    { timestamp: '09:00', label: '09:00', value: 47190, pnl: 680, volume: 280 },
    { timestamp: '12:00', label: '12:00', value: 47850, pnl: 1340, volume: 320 },
    { timestamp: '15:00', label: '15:00', value: 47620, pnl: 1110, volume: 210 },
    { timestamp: '18:00', label: '18:00', value: 48310, pnl: 1800, volume: 390 },
    { timestamp: '21:00', label: '21:00', value: 48740, pnl: 2230, volume: 340 },
    { timestamp: 'Now', label: 'Now', value: 48920.45, pnl: 2410.8, volume: 410 },
  ],
  '1W': [
    { timestamp: 'Mon', label: 'Mon', value: 43200, pnl: 0, volume: 1200 },
    { timestamp: 'Tue', label: 'Tue', value: 44150, pnl: 950, volume: 1450 },
    { timestamp: 'Wed', label: 'Wed', value: 43900, pnl: 700, volume: 1100 },
    { timestamp: 'Thu', label: 'Thu', value: 45600, pnl: 2400, volume: 1800 },
    { timestamp: 'Fri', label: 'Fri', value: 46800, pnl: 3600, volume: 2200 },
    { timestamp: 'Sat', label: 'Sat', value: 47450, pnl: 4250, volume: 1600 },
    { timestamp: 'Sun', label: 'Sun', value: 48920.45, pnl: 5720.45, volume: 1950 },
  ],
  '1M': [
    { timestamp: 'Week 1', label: 'Week 1', value: 39800, pnl: 0, volume: 5400 },
    { timestamp: 'Week 2', label: 'Week 2', value: 41600, pnl: 1800, volume: 6200 },
    { timestamp: 'Week 3', label: 'Week 3', value: 44200, pnl: 4400, volume: 7100 },
    { timestamp: 'Week 4', label: 'Week 4', value: 48920.45, pnl: 9120.45, volume: 8400 },
  ],
  '3M': [
    { timestamp: 'Month 1', label: 'Month 1', value: 32400, pnl: 0, volume: 18200 },
    { timestamp: 'Month 2', label: 'Month 2', value: 38900, pnl: 6500, volume: 22400 },
    { timestamp: 'Month 3', label: 'Month 3', value: 48920.45, pnl: 16520.45, volume: 29100 },
  ],
  '1Y': [
    { timestamp: 'Q1', label: 'Q1', value: 20180, pnl: 0, volume: 62000 },
    { timestamp: 'Q2', label: 'Q2', value: 27400, pnl: 7220, volume: 74000 },
    { timestamp: 'Q3', label: 'Q3', value: 36800, pnl: 16620, volume: 89000 },
    { timestamp: 'Q4', label: 'Q4', value: 48920.45, pnl: 28740.45, volume: 104000 },
  ],
}

// 4. Market Overview Assets (BTC, ETH, SOL, BNB, XRP + Gainers & Losers)
export const mockDashboardMarkets: DashboardMarketAsset[] = [
  // Required 5 Core Markets
  {
    id: 'bitcoin',
    symbol: 'BTC',
    pair: 'BTC/USDT',
    name: 'Bitcoin',
    priceUsd: 68450.25,
    change24h: 3.42,
    high24h: 69120.0,
    low24h: 66890.5,
    volume24hUsd: 28450210000,
    sparkline: [66890, 67200, 67100, 67900, 68150, 68450],
    category: 'core',
    isFavorite: true,
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    pair: 'ETH/USDT',
    name: 'Ethereum',
    priceUsd: 3624.8,
    change24h: -1.18,
    high24h: 3710.0,
    low24h: 3580.2,
    volume24hUsd: 14230110000,
    sparkline: [3710, 3680, 3640, 3660, 3610, 3624],
    category: 'core',
    isFavorite: true,
  },
  {
    id: 'solana',
    symbol: 'SOL',
    pair: 'SOL/USDT',
    name: 'Solana',
    priceUsd: 184.65,
    change24h: 8.75,
    high24h: 188.2,
    low24h: 169.5,
    volume24hUsd: 5820400000,
    sparkline: [170, 172, 175, 178, 182, 184.6],
    category: 'core',
    isFavorite: true,
  },
  {
    id: 'binancecoin',
    symbol: 'BNB',
    pair: 'BNB/USDT',
    name: 'BNB',
    priceUsd: 592.1,
    change24h: 0.85,
    high24h: 598.0,
    low24h: 585.3,
    volume24hUsd: 1140000000,
    sparkline: [586, 588, 590, 589, 591, 592.1],
    category: 'core',
    isFavorite: false,
  },
  {
    id: 'ripple',
    symbol: 'XRP',
    pair: 'XRP/USDT',
    name: 'Ripple',
    priceUsd: 0.5842,
    change24h: 4.12,
    high24h: 0.601,
    low24h: 0.562,
    volume24hUsd: 1890300000,
    sparkline: [0.562, 0.568, 0.575, 0.571, 0.581, 0.5842],
    category: 'core',
    isFavorite: true,
  },

  // Top Gainers
  {
    id: 'sui',
    symbol: 'SUI',
    pair: 'SUI/USDT',
    name: 'Sui Network',
    priceUsd: 2.14,
    change24h: 16.42,
    high24h: 2.22,
    low24h: 1.82,
    volume24hUsd: 940200000,
    sparkline: [1.82, 1.88, 1.95, 2.05, 2.1, 2.14],
    category: 'gainers',
    isFavorite: false,
  },
  {
    id: 'pepe',
    symbol: 'PEPE',
    pair: 'PEPE/USDT',
    name: 'Pepe',
    priceUsd: 0.00001048,
    change24h: 14.85,
    high24h: 0.000011,
    low24h: 0.0000091,
    volume24hUsd: 1250000000,
    sparkline: [0.0000091, 0.0000095, 0.0000099, 0.0000101, 0.00001048],
    category: 'gainers',
    isFavorite: false,
  },
  {
    id: 'near',
    symbol: 'NEAR',
    pair: 'NEAR/USDT',
    name: 'NEAR Protocol',
    priceUsd: 5.42,
    change24h: 10.25,
    high24h: 5.58,
    low24h: 4.88,
    volume24hUsd: 490100000,
    sparkline: [4.88, 4.98, 5.12, 5.25, 5.38, 5.42],
    category: 'gainers',
    isFavorite: false,
  },

  // Top Losers
  {
    id: 'dogecoin',
    symbol: 'DOGE',
    pair: 'DOGE/USDT',
    name: 'Dogecoin',
    priceUsd: 0.1284,
    change24h: -4.65,
    high24h: 0.136,
    low24h: 0.127,
    volume24hUsd: 1120000000,
    sparkline: [0.136, 0.134, 0.131, 0.129, 0.1284],
    category: 'losers',
    isFavorite: false,
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    pair: 'ADA/USDT',
    name: 'Cardano',
    priceUsd: 0.3421,
    change24h: -3.82,
    high24h: 0.358,
    low24h: 0.339,
    volume24hUsd: 412000000,
    sparkline: [0.358, 0.352, 0.349, 0.345, 0.3421],
    category: 'losers',
    isFavorite: false,
  },
  {
    id: 'avalanche',
    symbol: 'AVAX',
    pair: 'AVAX/USDT',
    name: 'Avalanche',
    priceUsd: 26.8,
    change24h: -2.95,
    high24h: 27.9,
    low24h: 26.4,
    volume24hUsd: 388000000,
    sparkline: [27.9, 27.5, 27.1, 26.9, 26.8],
    category: 'losers',
    isFavorite: false,
  },
]

// 5. Recent Transactions
export const mockRecentTransactions: RecentTransaction[] = [
  {
    id: 'tx-101',
    type: 'deposit',
    asset: 'USDT',
    amount: 2000.0,
    valueUsd: 2000.0,
    feeUsd: 0.0,
    status: 'completed',
    txHash: '0x8f3c71a4...92e1',
    date: 'Oct 20, 2026',
    time: '06:40 UTC',
  },
  {
    id: 'tx-102',
    type: 'trade_buy',
    asset: 'ETH',
    amount: 1.5,
    valueUsd: 5437.2,
    feeUsd: 1.08,
    status: 'completed',
    date: 'Oct 19, 2026',
    time: '22:15 UTC',
  },
  {
    id: 'tx-103',
    type: 'trade_sell',
    asset: 'BTC',
    amount: 0.05,
    valueUsd: 3422.5,
    feeUsd: 0.68,
    status: 'completed',
    date: 'Oct 19, 2026',
    time: '18:30 UTC',
  },
  {
    id: 'tx-104',
    type: 'earn_reward',
    asset: 'USDT',
    amount: 14.25,
    valueUsd: 14.25,
    feeUsd: 0.0,
    status: 'completed',
    date: 'Oct 19, 2026',
    time: '00:00 UTC',
  },
  {
    id: 'tx-105',
    type: 'withdrawal',
    asset: 'USDC',
    amount: 500.0,
    valueUsd: 500.0,
    feeUsd: 2.5,
    status: 'completed',
    txHash: '0x2e11a88b...65ff',
    date: 'Oct 18, 2026',
    time: '14:22 UTC',
  },
  {
    id: 'tx-106',
    type: 'deposit',
    asset: 'BTC',
    amount: 0.2,
    valueUsd: 13690.0,
    feeUsd: 0.0,
    status: 'completed',
    txHash: '34a1b029...7f1a',
    date: 'Oct 17, 2026',
    time: '09:12 UTC',
  },
]

// 6. Recent Orders
export const mockRecentOrders: RecentOrder[] = [
  {
    id: 'ord-501',
    pair: 'BTC/USDT',
    side: 'buy',
    type: 'limit',
    priceUsd: 67500.0,
    amount: 0.15,
    filledAmount: 0.15,
    totalUsd: 10125.0,
    filledPercentage: 100,
    status: 'filled',
    date: 'Oct 20, 2026',
    time: '05:22 UTC',
  },
  {
    id: 'ord-502',
    pair: 'SOL/USDT',
    side: 'sell',
    type: 'limit',
    priceUsd: 188.0,
    amount: 10.0,
    filledAmount: 4.5,
    totalUsd: 1880.0,
    filledPercentage: 45,
    status: 'open',
    date: 'Oct 20, 2026',
    time: '07:10 UTC',
  },
  {
    id: 'ord-503',
    pair: 'ETH/USDT',
    side: 'buy',
    type: 'stop_limit',
    priceUsd: 3660.0,
    amount: 1.0,
    filledAmount: 0.0,
    totalUsd: 3660.0,
    filledPercentage: 0,
    status: 'pending',
    date: 'Oct 20, 2026',
    time: '04:50 UTC',
  },
  {
    id: 'ord-504',
    pair: 'BNB/USDT',
    side: 'buy',
    type: 'market',
    priceUsd: 590.2,
    amount: 2.0,
    filledAmount: 2.0,
    totalUsd: 1180.4,
    filledPercentage: 100,
    status: 'filled',
    date: 'Oct 19, 2026',
    time: '16:45 UTC',
  },
  {
    id: 'ord-505',
    pair: 'XRP/USDT',
    side: 'buy',
    type: 'limit',
    priceUsd: 0.56,
    amount: 1500.0,
    filledAmount: 0.0,
    totalUsd: 840.0,
    filledPercentage: 0,
    status: 'cancelled',
    date: 'Oct 18, 2026',
    time: '11:30 UTC',
  },
]

// 7. System Notifications and Announcements
export const mockAnnouncements: AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: 'Matching Engine V2.4 Upgrade Complete',
    category: 'system',
    summary: 'Sub-millisecond execution engine successfully upgraded with 0s downtime. Order matching latency reduced by 35%.',
    date: 'Oct 20, 2026',
    isPinned: true,
  },
  {
    id: 'ann-2',
    title: 'Zero-Fee BTC & ETH Maker Promotion Active',
    category: 'promo',
    summary: 'Enjoy 0.00% maker fees on all Spot BTC/USDT and ETH/USDT pairs for VIP Tier 1+ accounts throughout this month.',
    date: 'Oct 19, 2026',
    isPinned: true,
  },
  {
    id: 'ann-3',
    title: 'Monthly Proof of Reserves (100% Asset Backing)',
    category: 'security',
    summary: 'Merkle-tree cryptographic audit completed. CoinPlus maintains 104.2% reserve coverage for all customer deposits.',
    date: 'Oct 18, 2026',
  },
  {
    id: 'ann-4',
    title: 'SUI/USDT and NEAR/USDT Spot Markets Listed',
    category: 'listing',
    summary: 'New high-liquidity pairs are open for trading with cross-margin leverage up to 20x.',
    date: 'Oct 17, 2026',
  },
]
