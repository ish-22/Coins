/**
 * CoinPlus Stable Demonstration Data for Trading Terminal
 * NOTE: All data is simulated for platform showcase. Not connected to real exchange.
 */

export interface TradingPairConfig {
  id: string
  symbol: string
  baseAsset: string
  quoteAsset: string
  price: number
  change24h: number
  high24h: number
  low24h: number
  volume24hBtc: number
  volume24hUsdt: number
  priceDecimals: number
  amountDecimals: number
  minAmount: number
  makerFee: number
  takerFee: number
}

export interface CandleData {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface OrderBookEntry {
  price: number
  amount: number
  total: number
  depthPercent: number
}

export interface MarketTrade {
  id: string
  price: number
  amount: number
  time: string
  side: 'buy' | 'sell'
}

export interface ActiveOrder {
  id: string
  pair: string
  side: 'buy' | 'sell'
  type: 'limit' | 'market' | 'stop_limit'
  price: number
  amount: number
  filled: number
  total: number
  status: 'open' | 'pending' | 'filled' | 'cancelled'
  time: string
}

export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1D' | '1W'

// Available Trading Pairs
export const TRADING_PAIRS: TradingPairConfig[] = [
  {
    id: 'BTC-USDT',
    symbol: 'BTC/USDT',
    baseAsset: 'BTC',
    quoteAsset: 'USDT',
    price: 68450.25,
    change24h: 3.42,
    high24h: 69120.0,
    low24h: 66890.5,
    volume24hBtc: 28450.21,
    volume24hUsdt: 1948500000,
    priceDecimals: 2,
    amountDecimals: 4,
    minAmount: 0.0001,
    makerFee: 0.0002, // 0.02%
    takerFee: 0.0004, // 0.04%
  },
  {
    id: 'ETH-USDT',
    symbol: 'ETH/USDT',
    baseAsset: 'ETH',
    quoteAsset: 'USDT',
    price: 3624.8,
    change24h: -1.18,
    high24h: 3710.0,
    low24h: 3580.2,
    volume24hBtc: 14230.11,
    volume24hUsdt: 515800000,
    priceDecimals: 2,
    amountDecimals: 3,
    minAmount: 0.001,
    makerFee: 0.0002,
    takerFee: 0.0004,
  },
  {
    id: 'SOL-USDT',
    symbol: 'SOL/USDT',
    baseAsset: 'SOL',
    quoteAsset: 'USDT',
    price: 184.65,
    change24h: 8.75,
    high24h: 188.2,
    low24h: 169.5,
    volume24hBtc: 5820.4,
    volume24hUsdt: 1074000000,
    priceDecimals: 2,
    amountDecimals: 2,
    minAmount: 0.01,
    makerFee: 0.0002,
    takerFee: 0.0004,
  },
  {
    id: 'BNB-USDT',
    symbol: 'BNB/USDT',
    baseAsset: 'BNB',
    quoteAsset: 'USDT',
    price: 592.1,
    change24h: 0.85,
    high24h: 598.0,
    low24h: 585.3,
    volume24hBtc: 1140.0,
    volume24hUsdt: 675000000,
    priceDecimals: 1,
    amountDecimals: 2,
    minAmount: 0.01,
    makerFee: 0.0002,
    takerFee: 0.0004,
  },
  {
    id: 'XRP-USDT',
    symbol: 'XRP/USDT',
    baseAsset: 'XRP',
    quoteAsset: 'USDT',
    price: 0.5842,
    change24h: 4.12,
    high24h: 0.601,
    low24h: 0.562,
    volume24hBtc: 1890.3,
    volume24hUsdt: 1104000000,
    priceDecimals: 4,
    amountDecimals: 1,
    minAmount: 1,
    makerFee: 0.0002,
    takerFee: 0.0004,
  },
  {
    id: 'DOGE-USDT',
    symbol: 'DOGE/USDT',
    baseAsset: 'DOGE',
    quoteAsset: 'USDT',
    price: 0.1284,
    change24h: -4.65,
    high24h: 0.136,
    low24h: 0.127,
    volume24hBtc: 1120.0,
    volume24hUsdt: 143800000,
    priceDecimals: 4,
    amountDecimals: 0,
    minAmount: 10,
    makerFee: 0.0002,
    takerFee: 0.0004,
  },
]

// Generates realistic candlestick datasets based on a base price and timeframe
export function generateCandles(basePrice: number, timeframe: Timeframe): CandleData[] {
  const count = 36
  const candles: CandleData[] = []
  let currentPrice = basePrice * 0.96

  const volatility =
    timeframe === '1m'
      ? 0.0015
      : timeframe === '5m'
      ? 0.003
      : timeframe === '15m'
      ? 0.005
      : timeframe === '1h'
      ? 0.008
      : timeframe === '4h'
      ? 0.015
      : timeframe === '1D'
      ? 0.025
      : 0.045

  for (let i = 0; i < count; i++) {
    const isBull = Math.sin(i * 0.7) + (Math.random() - 0.45) > 0
    const delta = currentPrice * volatility * (Math.random() * 0.8 + 0.2)
    const open = currentPrice
    const close = isBull ? open + delta : open - delta
    const high = Math.max(open, close) + currentPrice * volatility * Math.random() * 0.6
    const low = Math.min(open, close) - currentPrice * volatility * Math.random() * 0.6
    const volume = Math.floor(Math.random() * 180 + 30)

    let timeLabel = ''
    if (timeframe === '1D' || timeframe === '1W') {
      timeLabel = `Oct ${1 + (i % 30)}`
    } else {
      const hour = (8 + Math.floor(i / 2)) % 24
      const min = (i % 2) * 30
      timeLabel = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
    }

    candles.push({
      time: timeLabel,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    })

    currentPrice = close
  }

  // Ensure last candle matches basePrice
  candles[candles.length - 1].close = basePrice
  candles[candles.length - 1].high = Math.max(
    candles[candles.length - 1].high,
    basePrice
  )
  candles[candles.length - 1].low = Math.min(
    candles[candles.length - 1].low,
    basePrice
  )

  return candles
}

// Initial Order Book Depth Generator
export function generateOrderBook(basePrice: number): {
  asks: OrderBookEntry[]
  bids: OrderBookEntry[]
} {
  const asks: OrderBookEntry[] = []
  const bids: OrderBookEntry[] = []
  let accumulatedAsk = 0
  let accumulatedBid = 0

  // 12 Asks (Sell Orders, above price, lowest to highest)
  for (let i = 1; i <= 12; i++) {
    const price = Number((basePrice + i * 2.5).toFixed(2))
    const amount = Number((Math.random() * 0.8 + 0.1).toFixed(4))
    accumulatedAsk += amount
    asks.push({
      price,
      amount,
      total: Number((price * amount).toFixed(2)),
      depthPercent: 0,
    })
  }

  // Calculate accumulated depth percent for Asks
  asks.forEach((a) => {
    a.depthPercent = Math.min(100, (a.total / (basePrice * 4)) * 100)
  })

  // 12 Bids (Buy Orders, below price, highest to lowest)
  for (let i = 1; i <= 12; i++) {
    const price = Number((basePrice - i * 2.5).toFixed(2))
    const amount = Number((Math.random() * 0.9 + 0.15).toFixed(4))
    accumulatedBid += amount
    bids.push({
      price,
      amount,
      total: Number((price * amount).toFixed(2)),
      depthPercent: 0,
    })
  }

  // Calculate accumulated depth percent for Bids
  bids.forEach((b) => {
    b.depthPercent = Math.min(100, (b.total / (basePrice * 4)) * 100)
  })

  return { asks: asks.reverse(), bids }
}

// Initial Recent Trades Stream
export function generateRecentTrades(basePrice: number): MarketTrade[] {
  const trades: MarketTrade[] = []
  const now = new Date()

  for (let i = 0; i < 20; i++) {
    const side = Math.random() > 0.48 ? 'buy' : 'sell'
    const delta = (Math.random() - 0.5) * 12
    const price = Number((basePrice + delta).toFixed(2))
    const amount = Number((Math.random() * 0.65 + 0.02).toFixed(4))

    const tradeTime = new Date(now.getTime() - i * 3500)
    const time = tradeTime.toTimeString().split(' ')[0]

    trades.push({
      id: `tr-${Date.now()}-${i}`,
      price,
      amount,
      time,
      side,
    })
  }

  return trades
}

// Initial User Open Orders & Trade History
export const INITIAL_OPEN_ORDERS: ActiveOrder[] = [
  {
    id: 'ord-881',
    pair: 'BTC/USDT',
    side: 'buy',
    type: 'limit',
    price: 67200.0,
    amount: 0.15,
    filled: 0.05,
    total: 10080.0,
    status: 'open',
    time: '08:12:44',
  },
  {
    id: 'ord-882',
    pair: 'BTC/USDT',
    side: 'sell',
    type: 'limit',
    price: 69250.0,
    amount: 0.1,
    filled: 0.0,
    total: 6925.0,
    status: 'open',
    time: '07:45:10',
  },
]

export const INITIAL_ORDER_HISTORY: ActiveOrder[] = [
  {
    id: 'ord-750',
    pair: 'BTC/USDT',
    side: 'buy',
    type: 'limit',
    price: 66800.0,
    amount: 0.25,
    filled: 0.25,
    total: 16700.0,
    status: 'filled',
    time: 'Oct 19 21:14',
  },
  {
    id: 'ord-751',
    pair: 'BTC/USDT',
    side: 'sell',
    type: 'market',
    price: 68100.0,
    amount: 0.12,
    filled: 0.12,
    total: 8172.0,
    status: 'filled',
    time: 'Oct 19 14:30',
  },
  {
    id: 'ord-752',
    pair: 'ETH/USDT',
    side: 'buy',
    type: 'stop_limit',
    price: 3550.0,
    amount: 1.5,
    filled: 0.0,
    total: 5325.0,
    status: 'cancelled',
    time: 'Oct 18 19:40',
  },
]
