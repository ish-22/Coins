import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'
import { cn } from '@/utils/cn'
import {
  TRADING_PAIRS,
  TradingPairConfig,
  generateOrderBook,
  INITIAL_OPEN_ORDERS,
  INITIAL_ORDER_HISTORY,
  ActiveOrder,
  OrderBookEntry,
} from '@/mock/tradingData'
import {
  TradeHeader,
  CandleChart,
  OrderBook,
  RecentTrades,
  OrderForm,
  OrderConfirmationModal,
  OrderConfirmationData,
  BottomOrdersPanel,
} from '@/components/trading'
import { tradeService, marketService, walletService } from '@/services'

export const Trade: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const pairParam = searchParams.get('pair')

  // Find initial pair from URL or default to BTC/USDT
  const initialPair =
    TRADING_PAIRS.find(
      (p) =>
        p.id === pairParam ||
        p.symbol.replace('/', '-') === pairParam ||
        p.symbol === pairParam
    ) || TRADING_PAIRS[0]

  const [currentPair, setCurrentPair] = useState<TradingPairConfig>(initialPair)
  const [tradingPairs, setTradingPairs] = useState<TradingPairConfig[]>(TRADING_PAIRS)
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null)

  // Account balances loaded from live database
  const [availableUsdt, setAvailableUsdt] = useState<number>(0)
  const [availableCrypto, setAvailableCrypto] = useState<number>(0)

  // Orders state loaded from live database
  const [openOrders, setOpenOrders] = useState<ActiveOrder[]>([])
  const [orderHistory, setOrderHistory] = useState<ActiveOrder[]>([])

  // Order Book state
  const [orderBook, setOrderBook] = useState<{
    asks: OrderBookEntry[]
    bids: OrderBookEntry[]
  }>(() => generateOrderBook(initialPair.price))

  // Confirmation Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [pendingOrder, setPendingOrder] = useState<OrderConfirmationData | null>(null)

  // Toast notification
  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'info'
    text: string
  } | null>(null)

  // Mobile middle pane switcher ('orderbook' | 'trades')
  const [mobileMiddleTab, setMobileMiddleTab] = useState<'orderbook' | 'trades'>('orderbook')

  // Update orderbook and URL when pair changes
  const handleSelectPair = (pair: TradingPairConfig) => {
    setCurrentPair(pair)
    setSelectedPrice(null)
    setOrderBook(generateOrderBook(pair.price))
    setSearchParams({ pair: pair.id })
  }

  // Fetch live wallet balances from backend
  const fetchWalletBalances = () => {
    walletService.getAssets()
      .then((assets) => {
        if (assets && assets.length > 0) {
          const usdtAsset = assets.find((a) => a.symbol === 'USDT')
          if (usdtAsset) setAvailableUsdt(usdtAsset.availableBalance)

          const baseCoin = assets.find((a) => a.symbol === currentPair.baseAsset)
          if (baseCoin) setAvailableCrypto(baseCoin.availableBalance)
        }
      })
      .catch(() => {})
  }

  useEffect(() => {
    fetchWalletBalances()
  }, [currentPair.baseAsset])

  // Load live orders
  useEffect(() => {
    let isMounted = true
    tradeService.getOrders()
      .then((res) => {
        if (isMounted) {
          setOpenOrders(res.openOrders || [])
          setOrderHistory(res.orderHistory || [])
        }
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [])

  // Poll live tickers & live orderbook from Binance backend
  useEffect(() => {
    let isMounted = true

    const fetchLiveTickersAndBook = () => {
      marketService.getTickers()
        .then((pairs) => {
          if (isMounted && pairs && pairs.length > 0) {
            setTradingPairs(pairs)
            const matched = pairs.find(
              (p) => p.id === currentPair.id || p.symbol === currentPair.symbol
            )
            if (matched) {
              setCurrentPair(matched)
            }
          }
        })
        .catch(() => {})

      marketService.getOrderBook(currentPair.id)
        .then((book) => {
          if (isMounted && book && book.asks && book.bids && book.asks.length > 0) {
            setOrderBook(book)
          }
        })
        .catch(() => {})
    }

    fetchLiveTickersAndBook()
    const timer = setInterval(fetchLiveTickersAndBook, 8000)

    return () => {
      isMounted = false
      clearInterval(timer)
    }
  }, [currentPair.id])

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  // Click on order book price
  const handlePriceClick = (price: number) => {
    setSelectedPrice(price)
  }

  // Trigger Confirmation Modal from Form
  const handleReviewOrder = (payload: {
    side: 'buy' | 'sell'
    type: 'limit' | 'market' | 'stop_limit'
    price: number
    stopPrice?: number
    amount: number
    total: number
    fee: number
  }) => {
    setPendingOrder({
      ...payload,
      pairSymbol: currentPair.symbol,
      baseAsset: currentPair.baseAsset,
      quoteAsset: currentPair.quoteAsset,
    })
    setModalOpen(true)
  }

  // Confirm order execution
  const handleConfirmOrder = async () => {
    if (!pendingOrder) return

    const now = new Date()
    const timeStr = now.toTimeString().split(' ')[0]

    const newOrder: ActiveOrder = {
      id: `ord-${Date.now().toString().slice(-4)}`,
      pair: pendingOrder.pairSymbol,
      side: pendingOrder.side,
      type: pendingOrder.type,
      price: pendingOrder.price,
      amount: pendingOrder.amount,
      filled: pendingOrder.type === 'market' ? pendingOrder.amount : 0,
      total: pendingOrder.total,
      status: pendingOrder.type === 'market' ? 'filled' : 'open',
      time: timeStr,
    }

    // Call live backend API
    try {
      const apiRes = await tradeService.placeOrder({
        pair: pendingOrder.pairSymbol,
        side: pendingOrder.side,
        type: pendingOrder.type,
        price: pendingOrder.price,
        amount: pendingOrder.amount,
        stopPrice: pendingOrder.stopPrice,
      })
      if (apiRes.order) {
        newOrder.id = apiRes.order.id
        newOrder.status = apiRes.order.status
      }
      fetchWalletBalances()
    } catch {
      // Graceful offline fallback
    }

    if (pendingOrder.side === 'buy') {
      setAvailableUsdt((prev) => Math.max(0, prev - pendingOrder.total))
      if (pendingOrder.type === 'market') {
        setAvailableCrypto((prev) => prev + pendingOrder.amount)
      }
    } else {
      setAvailableCrypto((prev) => Math.max(0, prev - pendingOrder.amount))
      if (pendingOrder.type === 'market') {
        setAvailableUsdt((prev) => prev + pendingOrder.total)
      }
    }

    if (newOrder.status === 'open') {
      setOpenOrders((prev) => [newOrder, ...prev])
      setToastMessage({
        type: 'success',
        text: `Limit Order Placed: ${pendingOrder.side.toUpperCase()} ${pendingOrder.amount} ${
          currentPair.baseAsset
        } at $${pendingOrder.price.toFixed(2)}`,
      })
    } else {
      setOrderHistory((prev) => [newOrder, ...prev])
      setToastMessage({
        type: 'success',
        text: `Market Order Executed: ${pendingOrder.side.toUpperCase()} ${pendingOrder.amount} ${
          currentPair.baseAsset
        } at market price!`,
      })
    }

    setModalOpen(false)
    setPendingOrder(null)
  }

  // Cancel an open order
  const handleCancelOrder = async (orderId: string) => {
    const orderToCancel = openOrders.find((o) => o.id === orderId)
    if (!orderToCancel) return

    try {
      await tradeService.cancelOrder(orderId)
      fetchWalletBalances()
    } catch {
      // Local fallback
    }

    setOpenOrders((prev) => prev.filter((o) => o.id !== orderId))

    // Refund capital
    if (orderToCancel.side === 'buy') {
      setAvailableUsdt((prev) => prev + orderToCancel.total)
    } else {
      setAvailableCrypto((prev) => prev + orderToCancel.amount)
    }

    // Add to history as cancelled
    setOrderHistory((prev) => [
      { ...orderToCancel, status: 'cancelled' },
      ...prev,
    ])

    setToastMessage({
      type: 'info',
      text: `Order ${orderId} cancelled. Funds returned to your available balance.`,
    })
  }

  return (
    <div className="w-full flex flex-col space-y-4 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-cp-elevated border border-cp-gold/60 text-cp-text-primary shadow-elevated animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-cp-positive shrink-0" />
          <span className="text-xs font-semibold">{toastMessage.text}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-cp-text-muted hover:text-cp-text-primary ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Multi-Column Terminal Container */}
      <div className="rounded-2xl border border-cp-border bg-cp-card overflow-hidden shadow-card">
        {/* Top Header: Pair Selector & 24h Ticker Strip */}
        <TradeHeader
          currentPair={currentPair}
          onSelectPair={handleSelectPair}
          allPairs={tradingPairs}
        />

        {/* Desktop Multi-column Grid / Mobile Stacked Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* Column 1: Candlestick Chart Pane (Desktop 6 cols / Mobile full) */}
          <div className="lg:col-span-6 xl:col-span-7 border-b lg:border-b-0 lg:border-r border-cp-border flex flex-col">
            <CandleChart
              basePrice={currentPair.price}
              pairSymbol={currentPair.symbol}
            />
          </div>

          {/* Column 2: Order Book & Recent Trades Pane (Desktop 3 cols / Mobile full with tabs) */}
          <div className="lg:col-span-3 xl:col-span-2.5 border-b lg:border-b-0 lg:border-r border-cp-border flex flex-col">
            {/* Mobile Tab Switcher for Order Book vs Trades */}
            <div className="lg:hidden flex items-center border-b border-cp-border p-1 bg-cp-card text-xs">
              <button
                type="button"
                onClick={() => setMobileMiddleTab('orderbook')}
                className={cn(
                  'flex-1 py-1.5 font-bold rounded-lg transition-colors',
                  mobileMiddleTab === 'orderbook'
                    ? 'bg-cp-gold text-cp-bg'
                    : 'text-cp-text-muted hover:text-cp-text-primary'
                )}
              >
                Order Book
              </button>
              <button
                type="button"
                onClick={() => setMobileMiddleTab('trades')}
                className={cn(
                  'flex-1 py-1.5 font-bold rounded-lg transition-colors',
                  mobileMiddleTab === 'trades'
                    ? 'bg-cp-gold text-cp-bg'
                    : 'text-cp-text-muted hover:text-cp-text-primary'
                )}
              >
                Recent Trades
              </button>
            </div>

            {/* Desktop View: Order Book stacked above Recent Trades */}
            <div className="hidden lg:flex flex-col h-full">
              <div className="flex-1 min-h-[300px]">
                <OrderBook
                  asks={orderBook.asks}
                  bids={orderBook.bids}
                  currentPrice={currentPair.price}
                  baseAsset={currentPair.baseAsset}
                  quoteAsset={currentPair.quoteAsset}
                  onSelectPrice={handlePriceClick}
                />
              </div>
              <div className="border-t border-cp-border min-h-[220px]">
                <RecentTrades
                  basePrice={currentPair.price}
                  baseAsset={currentPair.baseAsset}
                  quoteAsset={currentPair.quoteAsset}
                />
              </div>
            </div>

            {/* Mobile View: Controlled by mobileMiddleTab */}
            <div className="lg:hidden">
              {mobileMiddleTab === 'orderbook' ? (
                <OrderBook
                  asks={orderBook.asks}
                  bids={orderBook.bids}
                  currentPrice={currentPair.price}
                  baseAsset={currentPair.baseAsset}
                  quoteAsset={currentPair.quoteAsset}
                  onSelectPrice={handlePriceClick}
                />
              ) : (
                <RecentTrades
                  basePrice={currentPair.price}
                  baseAsset={currentPair.baseAsset}
                  quoteAsset={currentPair.quoteAsset}
                />
              )}
            </div>
          </div>

          {/* Column 3: Order Placement Form Pane (Desktop 3 cols / Mobile full) */}
          <div className="lg:col-span-3 xl:col-span-2.5 flex flex-col bg-cp-card">
            <OrderForm
              pair={currentPair}
              selectedPrice={selectedPrice}
              availableUsdt={availableUsdt}
              availableCrypto={availableCrypto}
              onReviewOrder={handleReviewOrder}
            />
          </div>
        </div>

        {/* Bottom Section: Open Orders, Order History, Trade History */}
        <BottomOrdersPanel
          openOrders={openOrders}
          orderHistory={orderHistory}
          onCancelOrder={handleCancelOrder}
        />
      </div>

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        isOpen={modalOpen}
        data={pendingOrder}
        onConfirm={handleConfirmOrder}
        onClose={() => {
          setModalOpen(false)
          setPendingOrder(null)
        }}
      />
    </div>
  )
}

export default Trade
