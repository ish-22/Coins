import { CryptoAsset } from '@/types'

export const mockCryptoAssets: CryptoAsset[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC/USDT',
    name: 'Bitcoin',
    priceUsd: 68450.25,
    change24h: 3.42,
    high24h: 69120.0,
    low24h: 66890.5,
    volume24h: 28450210000,
    sparkline: [66890, 67200, 67100, 67900, 68150, 68450],
  },
  {
    id: 'ethereum',
    symbol: 'ETH/USDT',
    name: 'Ethereum',
    priceUsd: 3624.8,
    change24h: -1.18,
    high24h: 3710.0,
    low24h: 3580.2,
    volume24h: 14230110000,
    sparkline: [3710, 3680, 3640, 3660, 3610, 3624],
  },
  {
    id: 'solana',
    symbol: 'SOL/USDT',
    name: 'Solana',
    priceUsd: 184.65,
    change24h: 8.75,
    high24h: 188.2,
    low24h: 169.5,
    volume24h: 5820400000,
    sparkline: [170, 172, 175, 178, 182, 184.6],
  },
  {
    id: 'binancecoin',
    symbol: 'BNB/USDT',
    name: 'BNB',
    priceUsd: 592.1,
    change24h: 0.85,
    high24h: 598.0,
    low24h: 585.3,
    volume24h: 1140000000,
    sparkline: [586, 588, 590, 589, 591, 592.1],
  },
]

export const mockMarketStats = {
  totalMarketCap: '$2.58T',
  total24hVolume: '$84.2B',
  btcDominance: '54.6%',
  gasPriceGwei: 18,
  systemStatus: 'Operational',
}
