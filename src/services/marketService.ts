import apiClient from './apiClient'
import { TradingPairConfig, CandleData, OrderBookEntry, MarketTrade } from '@/mock/tradingData'

export const marketService = {
  async getTickers(): Promise<TradingPairConfig[]> {
    const res = await apiClient.get<{ pairs: TradingPairConfig[] }>('/markets/tickers')
    return res.data.pairs
  },

  async getOrderBook(pair: string): Promise<{ asks: OrderBookEntry[]; bids: OrderBookEntry[] }> {
    const res = await apiClient.get<{ asks: OrderBookEntry[]; bids: OrderBookEntry[] }>(
      `/markets/${encodeURIComponent(pair)}/orderbook`
    )
    return { asks: res.data.asks, bids: res.data.bids }
  },

  async getRecentTrades(pair: string): Promise<MarketTrade[]> {
    const res = await apiClient.get<{ trades: MarketTrade[] }>(
      `/markets/${encodeURIComponent(pair)}/trades`
    )
    return res.data.trades
  },

  async getCandles(pair: string, timeframe: string = '1h'): Promise<CandleData[]> {
    const res = await apiClient.get<{ candles: CandleData[] }>(
      `/markets/${encodeURIComponent(pair)}/candles?timeframe=${timeframe}`
    )
    return res.data.candles
  },
}

export default marketService
