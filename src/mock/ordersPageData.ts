/**
 * CoinPlus Stable Demonstration Data for "My Trades & Orders" (/orders)
 * NOTE: Simulated demonstration data. Not connected to real exchange or matching engine.
 */

export type OrderSide = 'buy' | 'sell'
export type OrderType = 'limit' | 'market' | 'stop_limit'
export type OpenOrderStatus = 'open' | 'partially_filled'
export type OrderHistoryStatus = 'filled' | 'cancelled' | 'expired' | 'partially_filled'

export interface OpenOrderRecord {
  id: string
  pair: string
  side: OrderSide
  type: OrderType
  price: number
  amount: number
  filled: number
  total: number
  status: OpenOrderStatus
  dateTime: string // ISO or formatted
  stopPrice?: number
  feeEstimate: number
}

export interface OrderHistoryRecord {
  id: string
  pair: string
  side: OrderSide
  type: OrderType
  price: number
  avgPrice: number
  amount: number
  executed: number
  total: number
  status: OrderHistoryStatus
  createdAt: string
  updatedAt: string
  fee: number
  feeAsset: string
  triggerCondition?: string
}

export interface TradeHistoryRecord {
  id: string
  orderId: string
  pair: string
  side: OrderSide
  execPrice: number
  amount: number
  totalValue: number
  fee: number
  feeAsset: string
  role: 'maker' | 'taker'
  dateTime: string
}

// Initial demonstration Open Orders
export const INITIAL_OPEN_ORDERS_DATA: OpenOrderRecord[] = [
  {
    id: 'ORD-882194',
    pair: 'BTC/USDT',
    side: 'buy',
    type: 'limit',
    price: 67200.0,
    amount: 0.25,
    filled: 0.08,
    total: 16800.0,
    status: 'partially_filled',
    dateTime: '2026-10-20 08:45:12',
    feeEstimate: 3.36,
  },
  {
    id: 'ORD-882103',
    pair: 'ETH/USDT',
    side: 'sell',
    type: 'limit',
    price: 3750.0,
    amount: 1.8,
    filled: 0.0,
    total: 6750.0,
    status: 'open',
    dateTime: '2026-10-20 07:15:30',
    feeEstimate: 1.35,
  },
  {
    id: 'ORD-881944',
    pair: 'SOL/USDT',
    side: 'buy',
    type: 'limit',
    price: 178.5,
    amount: 15.0,
    filled: 5.0,
    total: 2677.5,
    status: 'partially_filled',
    dateTime: '2026-10-19 22:30:15',
    feeEstimate: 0.54,
  },
  {
    id: 'ORD-881850',
    pair: 'BNB/USDT',
    side: 'buy',
    type: 'stop_limit',
    price: 580.0,
    stopPrice: 585.0,
    amount: 4.5,
    filled: 0.0,
    total: 2610.0,
    status: 'open',
    dateTime: '2026-10-19 18:22:04',
    feeEstimate: 0.52,
  },
  {
    id: 'ORD-881720',
    pair: 'XRP/USDT',
    side: 'sell',
    type: 'limit',
    price: 0.625,
    amount: 2500.0,
    filled: 0.0,
    total: 1562.5,
    status: 'open',
    dateTime: '2026-10-19 14:10:00',
    feeEstimate: 0.31,
  },
]

// Initial demonstration Order History
export const INITIAL_ORDER_HISTORY_DATA: OrderHistoryRecord[] = [
  {
    id: 'ORD-880942',
    pair: 'BTC/USDT',
    side: 'buy',
    type: 'limit',
    price: 66800.0,
    avgPrice: 66795.5,
    amount: 0.5,
    executed: 0.5,
    total: 33397.75,
    status: 'filled',
    createdAt: '2026-10-19 09:20:11',
    updatedAt: '2026-10-19 09:25:34',
    fee: 6.68,
    feeAsset: 'USDT',
  },
  {
    id: 'ORD-880612',
    pair: 'ETH/USDT',
    side: 'sell',
    type: 'market',
    price: 3640.0,
    avgPrice: 3638.2,
    amount: 2.5,
    executed: 2.5,
    total: 9095.5,
    status: 'filled',
    createdAt: '2026-10-18 16:45:00',
    updatedAt: '2026-10-18 16:45:02',
    fee: 3.64,
    feeAsset: 'USDT',
  },
  {
    id: 'ORD-880450',
    pair: 'SOL/USDT',
    side: 'sell',
    type: 'stop_limit',
    price: 192.0,
    avgPrice: 0.0,
    amount: 20.0,
    executed: 0.0,
    total: 3840.0,
    status: 'cancelled',
    createdAt: '2026-10-18 11:15:20',
    updatedAt: '2026-10-18 14:02:10',
    fee: 0.0,
    feeAsset: 'USDT',
    triggerCondition: 'Mark <= 190.00 USDT',
  },
  {
    id: 'ORD-880198',
    pair: 'DOGE/USDT',
    side: 'buy',
    type: 'limit',
    price: 0.142,
    avgPrice: 0.142,
    amount: 15000.0,
    executed: 15000.0,
    total: 2130.0,
    status: 'filled',
    createdAt: '2026-10-17 21:05:44',
    updatedAt: '2026-10-17 21:40:12',
    fee: 0.42,
    feeAsset: 'USDT',
  },
  {
    id: 'ORD-879854',
    pair: 'BNB/USDT',
    side: 'sell',
    type: 'limit',
    price: 610.0,
    avgPrice: 610.0,
    amount: 5.0,
    executed: 2.0,
    total: 1220.0,
    status: 'partially_filled',
    createdAt: '2026-10-17 14:32:00',
    updatedAt: '2026-10-17 18:00:00',
    fee: 0.49,
    feeAsset: 'USDT',
  },
  {
    id: 'ORD-879410',
    pair: 'BTC/USDT',
    side: 'buy',
    type: 'limit',
    price: 64500.0,
    avgPrice: 0.0,
    amount: 0.3,
    executed: 0.0,
    total: 19350.0,
    status: 'expired',
    createdAt: '2026-10-16 08:00:00',
    updatedAt: '2026-10-16 23:59:59',
    fee: 0.0,
    feeAsset: 'USDT',
  },
  {
    id: 'ORD-878990',
    pair: 'XRP/USDT',
    side: 'buy',
    type: 'limit',
    price: 0.585,
    avgPrice: 0.5848,
    amount: 4000.0,
    executed: 4000.0,
    total: 2339.2,
    status: 'filled',
    createdAt: '2026-10-15 19:12:30',
    updatedAt: '2026-10-15 19:18:05',
    fee: 0.47,
    feeAsset: 'USDT',
  },
  {
    id: 'ORD-878540',
    pair: 'ETH/USDT',
    side: 'buy',
    type: 'limit',
    price: 3480.0,
    avgPrice: 0.0,
    amount: 1.0,
    executed: 0.0,
    total: 3480.0,
    status: 'cancelled',
    createdAt: '2026-10-14 10:20:00',
    updatedAt: '2026-10-14 12:45:00',
    fee: 0.0,
    feeAsset: 'USDT',
  },
]

// Initial demonstration Trade History (Fills)
export const INITIAL_TRADE_HISTORY_DATA: TradeHistoryRecord[] = [
  {
    id: 'TRD-904812',
    orderId: 'ORD-882194',
    pair: 'BTC/USDT',
    side: 'buy',
    execPrice: 67200.0,
    amount: 0.08,
    totalValue: 5376.0,
    fee: 1.075,
    feeAsset: 'USDT',
    role: 'maker',
    dateTime: '2026-10-20 08:52:19',
  },
  {
    id: 'TRD-904650',
    orderId: 'ORD-881944',
    pair: 'SOL/USDT',
    side: 'buy',
    execPrice: 178.5,
    amount: 5.0,
    totalValue: 892.5,
    fee: 0.178,
    feeAsset: 'USDT',
    role: 'maker',
    dateTime: '2026-10-19 22:45:01',
  },
  {
    id: 'TRD-904128',
    orderId: 'ORD-880942',
    pair: 'BTC/USDT',
    side: 'buy',
    execPrice: 66795.5,
    amount: 0.5,
    totalValue: 33397.75,
    fee: 6.68,
    feeAsset: 'USDT',
    role: 'maker',
    dateTime: '2026-10-19 09:25:34',
  },
  {
    id: 'TRD-903980',
    orderId: 'ORD-880612',
    pair: 'ETH/USDT',
    side: 'sell',
    execPrice: 3638.2,
    amount: 2.5,
    totalValue: 9095.5,
    fee: 3.64,
    feeAsset: 'USDT',
    role: 'taker',
    dateTime: '2026-10-18 16:45:02',
  },
  {
    id: 'TRD-903512',
    orderId: 'ORD-880198',
    pair: 'DOGE/USDT',
    side: 'buy',
    execPrice: 0.142,
    amount: 15000.0,
    totalValue: 2130.0,
    fee: 0.426,
    feeAsset: 'USDT',
    role: 'maker',
    dateTime: '2026-10-17 21:40:12',
  },
  {
    id: 'TRD-903244',
    orderId: 'ORD-879854',
    pair: 'BNB/USDT',
    side: 'sell',
    execPrice: 610.0,
    amount: 2.0,
    totalValue: 1220.0,
    fee: 0.488,
    feeAsset: 'USDT',
    role: 'maker',
    dateTime: '2026-10-17 15:10:45',
  },
  {
    id: 'TRD-902890',
    orderId: 'ORD-878990',
    pair: 'XRP/USDT',
    side: 'buy',
    execPrice: 0.5848,
    amount: 4000.0,
    totalValue: 2339.2,
    fee: 0.468,
    feeAsset: 'USDT',
    role: 'taker',
    dateTime: '2026-10-15 19:18:05',
  },
]

export const TRADING_PAIRS_LIST = [
  'All Pairs',
  'BTC/USDT',
  'ETH/USDT',
  'SOL/USDT',
  'BNB/USDT',
  'XRP/USDT',
  'DOGE/USDT',
]
