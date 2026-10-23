/**
 * CoinPlus Stable Demonstration Data for Live Markets
 * NOTE: All prices, market caps, and statistics are illustrative simulated data for platform demonstration.
 */

export interface MarketItem {
  id: string
  name: string
  symbol: string
  pair: string
  baseAsset: string
  quoteAsset: string
  priceUsd: number
  change24h: number
  high24h: number
  low24h: number
  volume24hUsd: number
  marketCapUsd: number
  circulatingSupply: string
  sparkline: number[]
  category: 'spot' | 'gainers' | 'losers'
  isFavoriteDefault?: boolean
}

export const mockMarketSummaryStats = {
  totalMarketCap: 2580420000000, // $2.58T
  marketCapChange24h: 2.84,
  totalVolume24h: 84250000000, // $84.25B
  volumeChange24h: 6.12,
  btcDominance: 54.6,
  btcDominanceChange: 0.35,
  ethGasGwei: 18,
  activeTradingPairs: 184,
  topGainerSymbol: 'SUI',
  topGainerPercentage: 16.42,
}

// Full required list containing BTC, ETH, USDT, SOL, BNB, XRP, DOGE + SUI, PEPE, NEAR, ADA, AVAX, LINK
export const mockMarketItems: MarketItem[] = [
  // 1. Bitcoin (BTC)
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    pair: 'BTC/USDT',
    baseAsset: 'BTC',
    quoteAsset: 'USDT',
    priceUsd: 68450.25,
    change24h: 3.42,
    high24h: 69120.0,
    low24h: 66890.5,
    volume24hUsd: 28450210000,
    marketCapUsd: 1351200000000,
    circulatingSupply: '19.7M BTC',
    sparkline: [66890, 67200, 67100, 67900, 68150, 68450],
    category: 'spot',
    isFavoriteDefault: true,
  },
  // 2. Ethereum (ETH)
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    pair: 'ETH/USDT',
    baseAsset: 'ETH',
    quoteAsset: 'USDT',
    priceUsd: 3624.8,
    change24h: -1.18,
    high24h: 3710.0,
    low24h: 3580.2,
    volume24hUsd: 14230110000,
    marketCapUsd: 435800000000,
    circulatingSupply: '120.2M ETH',
    sparkline: [3710, 3680, 3640, 3660, 3610, 3624.8],
    category: 'spot',
    isFavoriteDefault: true,
  },
  // 3. Tether (USDT)
  {
    id: 'tether',
    name: 'Tether USD',
    symbol: 'USDT',
    pair: 'USDT/USD',
    baseAsset: 'USDT',
    quoteAsset: 'USD',
    priceUsd: 1.0002,
    change24h: 0.02,
    high24h: 1.001,
    low24h: 0.9998,
    volume24hUsd: 45820000000,
    marketCapUsd: 118500000000,
    circulatingSupply: '118.5B USDT',
    sparkline: [1.0, 1.0001, 0.9999, 1.0003, 1.0002],
    category: 'spot',
    isFavoriteDefault: false,
  },
  // 4. Solana (SOL)
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    pair: 'SOL/USDT',
    baseAsset: 'SOL',
    quoteAsset: 'USDT',
    priceUsd: 184.65,
    change24h: 8.75,
    high24h: 188.2,
    low24h: 169.5,
    volume24hUsd: 5820400000,
    marketCapUsd: 86400000000,
    circulatingSupply: '468M SOL',
    sparkline: [170, 172, 175, 178, 182, 184.65],
    category: 'spot',
    isFavoriteDefault: true,
  },
  // 5. BNB Chain (BNB)
  {
    id: 'binancecoin',
    name: 'BNB',
    symbol: 'BNB',
    pair: 'BNB/USDT',
    baseAsset: 'BNB',
    quoteAsset: 'USDT',
    priceUsd: 592.1,
    change24h: 0.85,
    high24h: 598.0,
    low24h: 585.3,
    volume24hUsd: 1140000000,
    marketCapUsd: 87200000000,
    circulatingSupply: '147.2M BNB',
    sparkline: [586, 588, 590, 589, 591, 592.1],
    category: 'spot',
    isFavoriteDefault: false,
  },
  // 6. Ripple (XRP)
  {
    id: 'ripple',
    name: 'Ripple',
    symbol: 'XRP',
    pair: 'XRP/USDT',
    baseAsset: 'XRP',
    quoteAsset: 'USDT',
    priceUsd: 0.5842,
    change24h: 4.12,
    high24h: 0.601,
    low24h: 0.562,
    volume24hUsd: 1890300000,
    marketCapUsd: 32900000000,
    circulatingSupply: '56.3B XRP',
    sparkline: [0.562, 0.568, 0.575, 0.571, 0.581, 0.5842],
    category: 'spot',
    isFavoriteDefault: true,
  },
  // 7. Dogecoin (DOGE)
  {
    id: 'dogecoin',
    name: 'Dogecoin',
    symbol: 'DOGE',
    pair: 'DOGE/USDT',
    baseAsset: 'DOGE',
    quoteAsset: 'USDT',
    priceUsd: 0.1284,
    change24h: -4.65,
    high24h: 0.136,
    low24h: 0.127,
    volume24hUsd: 1120000000,
    marketCapUsd: 18700000000,
    circulatingSupply: '145.6B DOGE',
    sparkline: [0.136, 0.134, 0.131, 0.129, 0.1284],
    category: 'spot',
    isFavoriteDefault: false,
  },
  // 8. Sui (SUI) - High Gainer
  {
    id: 'sui',
    name: 'Sui Network',
    symbol: 'SUI',
    pair: 'SUI/USDT',
    baseAsset: 'SUI',
    quoteAsset: 'USDT',
    priceUsd: 2.14,
    change24h: 16.42,
    high24h: 2.22,
    low24h: 1.82,
    volume24hUsd: 940200000,
    marketCapUsd: 5890000000,
    circulatingSupply: '2.75B SUI',
    sparkline: [1.82, 1.88, 1.95, 2.05, 2.1, 2.14],
    category: 'spot',
    isFavoriteDefault: false,
  },
  // 9. Pepe (PEPE) - High Gainer
  {
    id: 'pepe',
    name: 'Pepe',
    symbol: 'PEPE',
    pair: 'PEPE/USDT',
    baseAsset: 'PEPE',
    quoteAsset: 'USDT',
    priceUsd: 0.00001048,
    change24h: 14.85,
    high24h: 0.000011,
    low24h: 0.0000091,
    volume24hUsd: 1250000000,
    marketCapUsd: 4410000000,
    circulatingSupply: '420.6T PEPE',
    sparkline: [0.0000091, 0.0000095, 0.0000099, 0.0000101, 0.00001048],
    category: 'spot',
    isFavoriteDefault: false,
  },
  // 10. NEAR Protocol (NEAR)
  {
    id: 'near',
    name: 'NEAR Protocol',
    symbol: 'NEAR',
    pair: 'NEAR/USDT',
    baseAsset: 'NEAR',
    quoteAsset: 'USDT',
    priceUsd: 5.42,
    change24h: 10.25,
    high24h: 5.58,
    low24h: 4.88,
    volume24hUsd: 490100000,
    marketCapUsd: 6320000000,
    circulatingSupply: '1.16B NEAR',
    sparkline: [4.88, 4.98, 5.12, 5.25, 5.38, 5.42],
    category: 'spot',
    isFavoriteDefault: false,
  },
  // 11. Cardano (ADA)
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    pair: 'ADA/USDT',
    baseAsset: 'ADA',
    quoteAsset: 'USDT',
    priceUsd: 0.3421,
    change24h: -3.82,
    high24h: 0.358,
    low24h: 0.339,
    volume24hUsd: 412000000,
    marketCapUsd: 12200000000,
    circulatingSupply: '35.6B ADA',
    sparkline: [0.358, 0.352, 0.349, 0.345, 0.3421],
    category: 'spot',
    isFavoriteDefault: false,
  },
  // 12. Avalanche (AVAX)
  {
    id: 'avalanche',
    name: 'Avalanche',
    symbol: 'AVAX',
    pair: 'AVAX/USDT',
    baseAsset: 'AVAX',
    quoteAsset: 'USDT',
    priceUsd: 26.8,
    change24h: -2.95,
    high24h: 27.9,
    low24h: 26.4,
    volume24hUsd: 388000000,
    marketCapUsd: 10850000000,
    circulatingSupply: '405M AVAX',
    sparkline: [27.9, 27.5, 27.1, 26.9, 26.8],
    category: 'spot',
    isFavoriteDefault: false,
  },
  // 13. Chainlink (LINK)
  {
    id: 'chainlink',
    name: 'Chainlink',
    symbol: 'LINK',
    pair: 'LINK/USDT',
    baseAsset: 'LINK',
    quoteAsset: 'USDT',
    priceUsd: 11.45,
    change24h: 2.15,
    high24h: 11.8,
    low24h: 11.1,
    volume24hUsd: 310000000,
    marketCapUsd: 6950000000,
    circulatingSupply: '608M LINK',
    sparkline: [11.1, 11.2, 11.35, 11.25, 11.45],
    category: 'spot',
    isFavoriteDefault: false,
  },
]
