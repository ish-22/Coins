/**
 * CoinPlus — Live Crypto Prices Hook
 * Fetches real-time market data from CoinGecko's free public API.
 * Updates every 30 seconds automatically.
 */

import { useState, useEffect, useCallback } from 'react'
import { MarketItem } from '@/mock/marketsPageData'

// Coins to track (CoinGecko IDs)
const COIN_IDS = [
  'bitcoin',
  'ethereum',
  'tether',
  'solana',
  'binancecoin',
  'ripple',
  'dogecoin',
  'cardano',
  'avalanche-2',
  'chainlink',
  'near',
  'pepe',
  'sui',
]

// Static metadata that doesn't come from the price API
const COIN_META: Record<string, { symbol: string; pair: string; baseAsset: string; circulatingSupply: string; category: 'spot' | 'gainers' | 'losers'; isFavoriteDefault?: boolean }> = {
  bitcoin:      { symbol: 'BTC',  pair: 'BTC/USDT',  baseAsset: 'BTC',  circulatingSupply: '19.7M BTC',  category: 'spot', isFavoriteDefault: true },
  ethereum:     { symbol: 'ETH',  pair: 'ETH/USDT',  baseAsset: 'ETH',  circulatingSupply: '120.2M ETH', category: 'spot', isFavoriteDefault: true },
  tether:       { symbol: 'USDT', pair: 'USDT/USD',  baseAsset: 'USDT', circulatingSupply: '118.4B USDT', category: 'spot' },
  solana:       { symbol: 'SOL',  pair: 'SOL/USDT',  baseAsset: 'SOL',  circulatingSupply: '462M SOL',   category: 'spot', isFavoriteDefault: true },
  binancecoin:  { symbol: 'BNB',  pair: 'BNB/USDT',  baseAsset: 'BNB',  circulatingSupply: '153.8M BNB', category: 'spot' },
  ripple:       { symbol: 'XRP',  pair: 'XRP/USDT',  baseAsset: 'XRP',  circulatingSupply: '57.2B XRP',  category: 'spot', isFavoriteDefault: true },
  dogecoin:     { symbol: 'DOGE', pair: 'DOGE/USDT', baseAsset: 'DOGE', circulatingSupply: '143.6B DOGE', category: 'spot' },
  cardano:      { symbol: 'ADA',  pair: 'ADA/USDT',  baseAsset: 'ADA',  circulatingSupply: '35.2B ADA',  category: 'spot' },
  'avalanche-2':{ symbol: 'AVAX', pair: 'AVAX/USDT', baseAsset: 'AVAX', circulatingSupply: '406M AVAX',  category: 'spot' },
  chainlink:    { symbol: 'LINK', pair: 'LINK/USDT', baseAsset: 'LINK', circulatingSupply: '587M LINK',  category: 'spot' },
  near:         { symbol: 'NEAR', pair: 'NEAR/USDT', baseAsset: 'NEAR', circulatingSupply: '1.11B NEAR', category: 'spot' },
  pepe:         { symbol: 'PEPE', pair: 'PEPE/USDT', baseAsset: 'PEPE', circulatingSupply: '420.69T PEPE', category: 'spot' },
  sui:          { symbol: 'SUI',  pair: 'SUI/USDT',  baseAsset: 'SUI',  circulatingSupply: '3.1B SUI',   category: 'spot' },
}

export type LivePriceStatus = 'loading' | 'live' | 'error' | 'stale'

export interface LiveMarketSummary {
  totalMarketCap: number
  marketCapChange24h: number
  totalVolume24h: number
  btcDominance: number
}

export interface UseLivePricesReturn {
  coins: MarketItem[]
  summary: LiveMarketSummary
  status: LivePriceStatus
  lastUpdated: Date | null
  refresh: () => void
}

const REFRESH_INTERVAL_MS = 30_000 // 30 seconds

export function useLivePrices(): UseLivePricesReturn {
  const [coins, setCoins] = useState<MarketItem[]>([])
  const [summary, setSummary] = useState<LiveMarketSummary>({
    totalMarketCap: 0,
    marketCapChange24h: 0,
    totalVolume24h: 0,
    btcDominance: 0,
  })
  const [status, setStatus] = useState<LivePriceStatus>('loading')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchPrices = useCallback(async () => {
    try {
      const ids = COIN_IDS.join(',')
      const [priceRes, globalRes] = await Promise.all([
        fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h`,
          { signal: AbortSignal.timeout(10000) }
        ),
        fetch('https://api.coingecko.com/api/v3/global', { signal: AbortSignal.timeout(10000) }),
      ])

      if (!priceRes.ok || !globalRes.ok) throw new Error('API error')

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const priceData: any[] = await priceRes.json()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const globalData: any = await globalRes.json()

      // Build MarketItem array
      const mapped: MarketItem[] = priceData.map((coin) => {
        const meta = COIN_META[coin.id] ?? {
          symbol: coin.symbol.toUpperCase(),
          pair: `${coin.symbol.toUpperCase()}/USDT`,
          baseAsset: coin.symbol.toUpperCase(),
          circulatingSupply: `${(coin.circulating_supply / 1e6).toFixed(1)}M ${coin.symbol.toUpperCase()}`,
          category: 'spot' as const,
        }

        // Sparkline from last 7d → take last 6 points (24h proxy)
        const rawSparkline: number[] = coin.sparkline_in_7d?.price ?? []
        const sparkSlice = rawSparkline.slice(-6)

        const change24h = coin.price_change_percentage_24h ?? 0

        return {
          id: coin.id,
          name: coin.name,
          symbol: meta.symbol,
          pair: meta.pair,
          baseAsset: meta.baseAsset,
          quoteAsset: 'USDT',
          priceUsd: coin.current_price ?? 0,
          change24h: parseFloat(change24h.toFixed(2)),
          high24h: coin.high_24h ?? 0,
          low24h: coin.low_24h ?? 0,
          volume24hUsd: coin.total_volume ?? 0,
          marketCapUsd: coin.market_cap ?? 0,
          circulatingSupply: meta.circulatingSupply,
          sparkline: sparkSlice.length > 0 ? sparkSlice : [coin.current_price],
          category: meta.category,
          isFavoriteDefault: meta.isFavoriteDefault,
        }
      })

      setCoins(mapped)

      // Global summary
      const g = globalData.data
      const totalMcap: number = g.total_market_cap?.usd ?? 0
      const totalVol: number = g.total_volume?.usd ?? 0
      const mcapChange: number = g.market_cap_change_percentage_24h_usd ?? 0
      const btcDom: number = g.market_cap_percentage?.btc ?? 0

      setSummary({
        totalMarketCap: totalMcap,
        marketCapChange24h: parseFloat(mcapChange.toFixed(2)),
        totalVolume24h: totalVol,
        btcDominance: parseFloat(btcDom.toFixed(1)),
      })

      setStatus('live')
      setLastUpdated(new Date())
    } catch {
      setStatus((prev) => (prev === 'live' ? 'stale' : 'error'))
    }
  }, [])

  useEffect(() => {
    fetchPrices()
    const timer = setInterval(fetchPrices, REFRESH_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [fetchPrices])

  return { coins, summary, status, lastUpdated, refresh: fetchPrices }
}
