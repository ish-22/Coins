import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ClipboardList,
  Search,
  Download,
  Filter,
  X,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Info,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Typography } from '@/components/common/Typography'
import {
  INITIAL_OPEN_ORDERS_DATA,
  INITIAL_ORDER_HISTORY_DATA,
  INITIAL_TRADE_HISTORY_DATA,
  OpenOrderRecord,
  OrderHistoryRecord,
  TradeHistoryRecord,
  TRADING_PAIRS_LIST,
  OrderSide,
} from '@/mock/ordersPageData'
import { formatUSD, formatCrypto } from '@/utils/formatters'
import { exportToCSV } from '@/utils/csvExport'
import {
  OrderDetailModal,
  CancelConfirmModal,
  DetailRecord,
} from '@/components/orders'

type TabType = 'open' | 'history' | 'trades'
type SortDirection = 'asc' | 'desc'

export const Orders: React.FC = () => {
  // Tabs
  const [activeTab, setActiveTab] = useState<TabType>('open')

  // Datasets
  const [openOrders, setOpenOrders] = useState<OpenOrderRecord[]>(INITIAL_OPEN_ORDERS_DATA)
  const [orderHistory, setOrderHistory] = useState<OrderHistoryRecord[]>(INITIAL_ORDER_HISTORY_DATA)
  const [tradeHistory, setTradeHistory] = useState<TradeHistoryRecord[]>(INITIAL_TRADE_HISTORY_DATA)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [pairFilter, setPairFilter] = useState('All Pairs')
  const [sideFilter, setSideFilter] = useState<'all' | 'buy' | 'sell'>('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  // Sorting
  const [sortField, setSortField] = useState<string>('dateTime')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  // Modals & Toast State
  const [selectedDetail, setSelectedDetail] = useState<DetailRecord | null>(null)
  const [cancelModalOrder, setCancelModalOrder] = useState<OpenOrderRecord | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Trigger Toast helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Handle Tab Switch (reset page and filters)
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setCurrentPage(1)
    setStatusFilter('all')
    if (tab === 'open') {
      setSortField('dateTime')
    } else if (tab === 'history') {
      setSortField('createdAt')
    } else {
      setSortField('dateTime')
    }
    setSortDirection('desc')
  }

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('')
    setPairFilter('All Pairs')
    setSideFilter('all')
    setStatusFilter('all')
    setDateFilter('all')
    setCurrentPage(1)
  }

  const isFilterActive =
    searchQuery.trim() !== '' ||
    pairFilter !== 'All Pairs' ||
    sideFilter !== 'all' ||
    statusFilter !== 'all' ||
    dateFilter !== 'all'

  // Cancel order handler
  const handleConfirmCancelOrder = (orderId: string) => {
    const target = openOrders.find((o) => o.id === orderId)
    if (!target) return

    // Remove from open orders
    setOpenOrders((prev) => prev.filter((o) => o.id !== orderId))

    // Add to order history as cancelled
    const now = new Date()
    const cancelledRecord: OrderHistoryRecord = {
      id: target.id,
      pair: target.pair,
      side: target.side,
      type: target.type,
      price: target.price,
      avgPrice: 0.0,
      amount: target.amount,
      executed: target.filled,
      total: target.total,
      status: 'cancelled',
      createdAt: target.dateTime,
      updatedAt: now.toISOString().replace('T', ' ').slice(0, 19),
      fee: 0,
      feeAsset: 'USDT',
    }

    setOrderHistory((prev) => [cancelledRecord, ...prev])
    setCancelModalOrder(null)
    triggerToast(`Order ${orderId} cancelled successfully!`)
  }

  // Sort toggle handler
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  // Filter & Sort for Open Orders
  const filteredOpenOrders = useMemo(() => {
    let result = [...openOrders]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (o) => o.pair.toLowerCase().includes(q) || o.id.toLowerCase().includes(q)
      )
    }

    if (pairFilter !== 'All Pairs') {
      result = result.filter((o) => o.pair === pairFilter)
    }

    if (sideFilter !== 'all') {
      result = result.filter((o) => o.side === sideFilter)
    }

    if (statusFilter !== 'all') {
      result = result.filter((o) => o.status === statusFilter)
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      if (sortField === 'dateTime') {
        comparison = a.dateTime.localeCompare(b.dateTime)
      } else if (sortField === 'price') {
        comparison = a.price - b.price
      } else if (sortField === 'amount') {
        comparison = a.amount - b.amount
      } else if (sortField === 'filled') {
        comparison = a.filled - b.filled
      } else if (sortField === 'total') {
        comparison = a.total - b.total
      } else if (sortField === 'pair') {
        comparison = a.pair.localeCompare(b.pair)
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [openOrders, searchQuery, pairFilter, sideFilter, statusFilter, sortField, sortDirection])

  // Filter & Sort for Order History
  const filteredOrderHistory = useMemo(() => {
    let result = [...orderHistory]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (o) => o.pair.toLowerCase().includes(q) || o.id.toLowerCase().includes(q)
      )
    }

    if (pairFilter !== 'All Pairs') {
      result = result.filter((o) => o.pair === pairFilter)
    }

    if (sideFilter !== 'all') {
      result = result.filter((o) => o.side === sideFilter)
    }

    if (statusFilter !== 'all') {
      result = result.filter((o) => o.status === statusFilter)
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      if (sortField === 'createdAt') {
        comparison = a.createdAt.localeCompare(b.createdAt)
      } else if (sortField === 'price') {
        comparison = a.price - b.price
      } else if (sortField === 'amount') {
        comparison = a.amount - b.amount
      } else if (sortField === 'executed') {
        comparison = a.executed - b.executed
      } else if (sortField === 'total') {
        comparison = a.total - b.total
      } else if (sortField === 'pair') {
        comparison = a.pair.localeCompare(b.pair)
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [orderHistory, searchQuery, pairFilter, sideFilter, statusFilter, sortField, sortDirection])

  // Filter & Sort for Trade History
  const filteredTradeHistory = useMemo(() => {
    let result = [...tradeHistory]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (t) =>
          t.pair.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.orderId.toLowerCase().includes(q)
      )
    }

    if (pairFilter !== 'All Pairs') {
      result = result.filter((t) => t.pair === pairFilter)
    }

    if (sideFilter !== 'all') {
      result = result.filter((t) => t.side === sideFilter)
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      if (sortField === 'dateTime') {
        comparison = a.dateTime.localeCompare(b.dateTime)
      } else if (sortField === 'execPrice') {
        comparison = a.execPrice - b.execPrice
      } else if (sortField === 'amount') {
        comparison = a.amount - b.amount
      } else if (sortField === 'totalValue') {
        comparison = a.totalValue - b.totalValue
      } else if (sortField === 'fee') {
        comparison = a.fee - b.fee
      } else if (sortField === 'pair') {
        comparison = a.pair.localeCompare(b.pair)
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [tradeHistory, searchQuery, pairFilter, sideFilter, sortField, sortDirection])

  // Get active dataset count & slice for pagination
  const currentDatasetLength =
    activeTab === 'open'
      ? filteredOpenOrders.length
      : activeTab === 'history'
      ? filteredOrderHistory.length
      : filteredTradeHistory.length

  const totalPages = Math.max(1, Math.ceil(currentDatasetLength / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, currentDatasetLength)

  const paginatedOpenOrders = useMemo(
    () => filteredOpenOrders.slice(startIndex, endIndex),
    [filteredOpenOrders, startIndex, endIndex]
  )

  const paginatedOrderHistory = useMemo(
    () => filteredOrderHistory.slice(startIndex, endIndex),
    [filteredOrderHistory, startIndex, endIndex]
  )

  const paginatedTradeHistory = useMemo(
    () => filteredTradeHistory.slice(startIndex, endIndex),
    [filteredTradeHistory, startIndex, endIndex]
  )

  // CSV Export handler
  const handleExportCSV = () => {
    const todayStr = new Date().toISOString().split('T')[0]

    if (activeTab === 'open') {
      exportToCSV(
        `coinplus-open-orders-${todayStr}`,
        filteredOpenOrders as unknown as Record<string, unknown>[],
        [
          { key: 'id', label: 'Order ID' },
          { key: 'pair', label: 'Trading Pair' },
          { key: 'side', label: 'Side' },
          { key: 'type', label: 'Type' },
          { key: 'price', label: 'Price (USDT)' },
          { key: 'amount', label: 'Amount' },
          { key: 'filled', label: 'Filled' },
          { key: 'total', label: 'Total Value (USDT)' },
          { key: 'status', label: 'Status' },
          { key: 'dateTime', label: 'Order Time' },
        ]
      )
      triggerToast(`Exported ${filteredOpenOrders.length} open orders to CSV.`)
    } else if (activeTab === 'history') {
      exportToCSV(
        `coinplus-order-history-${todayStr}`,
        filteredOrderHistory as unknown as Record<string, unknown>[],
        [
          { key: 'id', label: 'Order ID' },
          { key: 'pair', label: 'Trading Pair' },
          { key: 'side', label: 'Side' },
          { key: 'type', label: 'Type' },
          { key: 'price', label: 'Order Price' },
          { key: 'avgPrice', label: 'Avg Executed Price' },
          { key: 'amount', label: 'Total Amount' },
          { key: 'executed', label: 'Executed Amount' },
          { key: 'total', label: 'Executed Total (USDT)' },
          { key: 'status', label: 'Final Status' },
          { key: 'fee', label: 'Fee' },
          { key: 'feeAsset', label: 'Fee Asset' },
          { key: 'createdAt', label: 'Creation Time' },
          { key: 'updatedAt', label: 'Completion Time' },
        ]
      )
      triggerToast(`Exported ${filteredOrderHistory.length} historical orders to CSV.`)
    } else {
      exportToCSV(
        `coinplus-trade-fills-${todayStr}`,
        filteredTradeHistory as unknown as Record<string, unknown>[],
        [
          { key: 'id', label: 'Trade ID' },
          { key: 'orderId', label: 'Order ID' },
          { key: 'pair', label: 'Trading Pair' },
          { key: 'side', label: 'Side' },
          { key: 'execPrice', label: 'Execution Price (USDT)' },
          { key: 'amount', label: 'Executed Quantity' },
          { key: 'totalValue', label: 'Total Value (USDT)' },
          { key: 'fee', label: 'Fee Amount' },
          { key: 'feeAsset', label: 'Fee Asset' },
          { key: 'role', label: 'Liquidity Role' },
          { key: 'dateTime', label: 'Execution Time' },
        ]
      )
      triggerToast(`Exported ${filteredTradeHistory.length} trade executions to CSV.`)
    }
  }

  // Summary Metrics
  const totalOpenValue = openOrders.reduce((acc, curr) => acc + curr.total, 0)
  const totalOpenCount = openOrders.length

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-cp-elevated border border-cp-gold text-cp-text-primary shadow-2xl animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-cp-gold shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cp-text-primary">
              My Trades & Orders
            </h1>
            <Badge variant="gold" size="sm">
              Spot
            </Badge>
          </div>
          <p className="text-sm text-cp-text-secondary">
            Review your orders and trading activity.
          </p>
        </div>

        {/* Quick Shortcuts */}
        <div className="flex items-center gap-3">
          <Link to="/trade">
            <Button variant="primary" size="sm" leftIcon={<TrendingUp className="w-4 h-4" />}>
              New Trade
            </Button>
          </Link>
          <Link to="/wallet">
            <Button variant="secondary" size="sm">
              View Balances
            </Button>
          </Link>
        </div>
      </div>

      {/* Demonstration Notice Banner */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-cp-card/90 border border-cp-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cp-gold/10 border border-cp-gold/30 flex items-center justify-center text-cp-gold shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div className="text-xs text-cp-text-secondary">
            <span className="font-semibold text-cp-text-primary">Simulated Activity:</span> All
            records, order books, and fills reflect platform demonstration data. No real orders are
            routed to external live markets.
          </div>
        </div>
        <div className="text-xs font-mono text-cp-gold shrink-0 self-end sm:self-auto bg-cp-elevated px-2.5 py-1 rounded-md border border-cp-border">
          Engine: CP-DEMO-SIM
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 bg-cp-card border-cp-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-cp-text-secondary font-medium">Open Orders</span>
            <span className="w-2 h-2 rounded-full bg-cp-gold animate-pulse" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cp-text-primary">
            {totalOpenCount}
          </div>
          <div className="text-[11px] text-cp-text-secondary mt-1">
            Valuation: <span className="text-cp-gold font-mono">{formatUSD(totalOpenValue)}</span>
          </div>
        </Card>

        <Card className="p-4 bg-cp-card border-cp-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-cp-text-secondary font-medium">Order History</span>
            <ClipboardList className="w-4 h-4 text-cp-text-secondary" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cp-text-primary">
            {orderHistory.length}
          </div>
          <div className="text-[11px] text-cp-positive mt-1">
            {orderHistory.filter((o) => o.status === 'filled').length} Fully Filled
          </div>
        </Card>

        <Card className="p-4 bg-cp-card border-cp-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-cp-text-secondary font-medium">Total Trade Fills</span>
            <TrendingUp className="w-4 h-4 text-cp-positive" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cp-text-primary">
            {tradeHistory.length}
          </div>
          <div className="text-[11px] text-cp-text-secondary mt-1">
            Maker / Taker Executions
          </div>
        </Card>

        <Card className="p-4 bg-cp-card border-cp-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-cp-text-secondary font-medium">Standard Fee Tier</span>
            <Badge variant="gold" size="sm">VIP 1</Badge>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cp-gold">
            0.02% / 0.04%
          </div>
          <div className="text-[11px] text-cp-text-secondary mt-1">
            Maker: 0.02% • Taker: 0.04%
          </div>
        </Card>
      </div>

      {/* Main Tabbed Container */}
      <Card className="border-cp-border bg-cp-card overflow-hidden">
        {/* Tab Headers */}
        <div className="border-b border-cp-border bg-cp-elevated/40 px-4 sm:px-6 pt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => handleTabChange('open')}
              className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-2 ${
                activeTab === 'open'
                  ? 'border-cp-gold text-cp-gold bg-cp-card shadow-sm'
                  : 'border-transparent text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-card/50'
              }`}
            >
              <span>Open Orders</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === 'open'
                    ? 'bg-cp-gold/20 text-cp-gold'
                    : 'bg-cp-border text-cp-text-secondary'
                }`}
              >
                {openOrders.length}
              </span>
            </button>

            <button
              onClick={() => handleTabChange('history')}
              className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'border-cp-gold text-cp-gold bg-cp-card shadow-sm'
                  : 'border-transparent text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-card/50'
              }`}
            >
              <span>Order History</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === 'history'
                    ? 'bg-cp-gold/20 text-cp-gold'
                    : 'bg-cp-border text-cp-text-secondary'
                }`}
              >
                {orderHistory.length}
              </span>
            </button>

            <button
              onClick={() => handleTabChange('trades')}
              className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-2 ${
                activeTab === 'trades'
                  ? 'border-cp-gold text-cp-gold bg-cp-card shadow-sm'
                  : 'border-transparent text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-card/50'
              }`}
            >
              <span>Trade History</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === 'trades'
                    ? 'bg-cp-gold/20 text-cp-gold'
                    : 'bg-cp-border text-cp-text-secondary'
                }`}
              >
                {tradeHistory.length}
              </span>
            </button>
          </div>

          {/* Export CSV action button */}
          <div className="pb-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleExportCSV}
              className="border-cp-border hover:border-cp-gold hover:text-cp-gold text-xs h-8"
            >
              Export CSV
            </Button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 border-b border-cp-border bg-cp-card/60 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cp-text-secondary" />
            <input
              type="text"
              placeholder="Search by pair (e.g. BTC/USDT) or Order ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full bg-cp-elevated border border-cp-border rounded-lg pl-9 pr-8 py-2 text-xs text-cp-text-primary placeholder:text-cp-text-secondary/60 focus:outline-none focus:border-cp-gold transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cp-text-secondary hover:text-cp-text-primary"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Select Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Pair Selector */}
            <select
              value={pairFilter}
              onChange={(e) => {
                setPairFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="bg-cp-elevated border border-cp-border rounded-lg px-2.5 py-2 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold cursor-pointer"
            >
              {TRADING_PAIRS_LIST.map((pair) => (
                <option key={pair} value={pair}>
                  {pair}
                </option>
              ))}
            </select>

            {/* Side Selector */}
            <select
              value={sideFilter}
              onChange={(e) => {
                setSideFilter(e.target.value as 'all' | 'buy' | 'sell')
                setCurrentPage(1)
              }}
              className="bg-cp-elevated border border-cp-border rounded-lg px-2.5 py-2 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold cursor-pointer"
            >
              <option value="all">All Sides</option>
              <option value="buy">Buy Only</option>
              <option value="sell">Sell Only</option>
            </select>

            {/* Status Selector (for Open & History) */}
            {activeTab !== 'trades' && (
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="bg-cp-elevated border border-cp-border rounded-lg px-2.5 py-2 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold cursor-pointer"
              >
                <option value="all">All Statuses</option>
                {activeTab === 'open' ? (
                  <>
                    <option value="open">Open</option>
                    <option value="partially_filled">Partially Filled</option>
                  </>
                ) : (
                  <>
                    <option value="filled">Filled</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="expired">Expired</option>
                    <option value="partially_filled">Partially Filled</option>
                  </>
                )}
              </select>
            )}

            {/* Reset Button */}
            {isFilterActive && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-2.5 py-2 rounded-lg bg-cp-elevated hover:bg-cp-border/50 text-cp-gold text-xs font-semibold transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: OPEN ORDERS */}
        {activeTab === 'open' && (
          <div>
            {filteredOpenOrders.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-cp-elevated border border-cp-border flex items-center justify-center mx-auto text-cp-text-secondary">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-cp-text-primary">No Open Orders Found</h4>
                <p className="text-xs text-cp-text-secondary max-w-sm mx-auto">
                  {isFilterActive
                    ? 'No open orders match your applied filters. Try adjusting your search query or reset the filters.'
                    : 'You have no open limit or stop orders currently active in the market.'}
                </p>
                {isFilterActive ? (
                  <Button variant="secondary" size="sm" onClick={handleResetFilters}>
                    Clear Filters
                  </Button>
                ) : (
                  <Link to="/trade">
                    <Button variant="primary" size="sm" leftIcon={<TrendingUp className="w-4 h-4" />}>
                      Place an Order
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-cp-elevated/60 text-cp-text-secondary uppercase text-[11px] font-semibold border-b border-cp-border">
                    <tr>
                      <th
                        onClick={() => handleSort('pair')}
                        className="py-3 px-4 cursor-pointer hover:text-cp-gold select-none"
                      >
                        <div className="flex items-center gap-1">
                          <span>Trading Pair</span>
                          {sortField === 'pair' &&
                            (sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('dateTime')}
                        className="py-3 px-4 cursor-pointer hover:text-cp-gold select-none"
                      >
                        <div className="flex items-center gap-1">
                          <span>Date / Time</span>
                          {sortField === 'dateTime' &&
                            (sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                        </div>
                      </th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Side</th>
                      <th
                        onClick={() => handleSort('price')}
                        className="py-3 px-4 cursor-pointer hover:text-cp-gold select-none"
                      >
                        <div className="flex items-center gap-1">
                          <span>Limit Price</span>
                          {sortField === 'price' &&
                            (sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('amount')}
                        className="py-3 px-4 cursor-pointer hover:text-cp-gold select-none"
                      >
                        <div className="flex items-center gap-1">
                          <span>Amount</span>
                          {sortField === 'amount' &&
                            (sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('filled')}
                        className="py-3 px-4 cursor-pointer hover:text-cp-gold select-none"
                      >
                        <div className="flex items-center gap-1">
                          <span>Filled Amount</span>
                          {sortField === 'filled' &&
                            (sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('total')}
                        className="py-3 px-4 cursor-pointer hover:text-cp-gold select-none"
                      >
                        <div className="flex items-center gap-1">
                          <span>Total (USDT)</span>
                          {sortField === 'total' &&
                            (sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                        </div>
                      </th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cp-border/50">
                    {paginatedOpenOrders.map((o) => {
                      const fillPct =
                        o.amount > 0 ? Math.round((o.filled / o.amount) * 100) : 0
                      const baseAsset = o.pair.split('/')[0]

                      return (
                        <tr
                          key={o.id}
                          className="hover:bg-cp-elevated/40 transition-colors cursor-pointer group"
                          onClick={() => setSelectedDetail({ kind: 'open', data: o })}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-cp-text-primary group-hover:text-cp-gold transition-colors">
                                {o.pair}
                              </span>
                              <span className="text-[10px] font-mono text-cp-text-secondary/70">
                                {o.id}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono text-cp-text-secondary">
                            {o.dateTime}
                          </td>
                          <td className="py-3 px-4 uppercase font-semibold text-cp-text-secondary text-[11px]">
                            {o.type}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={o.side === 'buy' ? 'positive' : 'negative'}
                              size="sm"
                            >
                              {o.side.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-cp-text-primary">
                            {formatUSD(o.price)}
                          </td>
                          <td className="py-3 px-4 font-mono text-cp-text-primary">
                            {o.amount} {baseAsset}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-cp-text-primary">
                                {o.filled} ({fillPct}%)
                              </span>
                              <div className="w-12 h-1.5 rounded-full bg-cp-elevated overflow-hidden hidden sm:block">
                                <div
                                  className="h-full bg-cp-gold rounded-full"
                                  style={{ width: `${fillPct}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-cp-gold">
                            {formatUSD(o.total)}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={o.status === 'partially_filled' ? 'gold' : 'neutral'}
                              size="sm"
                              withDot
                            >
                              {o.status === 'partially_filled' ? 'Partial' : 'Open'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div
                              className="flex items-center justify-end gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedDetail({ kind: 'open', data: o })}
                                className="h-7 px-2 text-[11px] border-cp-border hover:border-cp-gold"
                              >
                                Details
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => setCancelModalOrder(o)}
                                className="h-7 px-2.5 text-[11px]"
                              >
                                Cancel
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ORDER HISTORY */}
        {activeTab === 'history' && (
          <div>
            {filteredOrderHistory.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-cp-elevated border border-cp-border flex items-center justify-center mx-auto text-cp-text-secondary">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-cp-text-primary">No Historical Orders Found</h4>
                <p className="text-xs text-cp-text-secondary max-w-sm mx-auto">
                  {isFilterActive
                    ? 'No orders match your filter criteria. Try resetting filters.'
                    : 'You do not have any filled, cancelled, or expired orders in your history yet.'}
                </p>
                {isFilterActive && (
                  <Button variant="secondary" size="sm" onClick={handleResetFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-cp-elevated/60 text-cp-text-secondary uppercase text-[11px] font-semibold border-b border-cp-border">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th
                        onClick={() => handleSort('pair')}
                        className="py-3 px-4 cursor-pointer hover:text-cp-gold select-none"
                      >
                        <div className="flex items-center gap-1">
                          <span>Trading Pair</span>
                          {sortField === 'pair' &&
                            (sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                        </div>
                      </th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Side</th>
                      <th
                        onClick={() => handleSort('price')}
                        className="py-3 px-4 cursor-pointer hover:text-cp-gold select-none"
                      >
                        <div className="flex items-center gap-1">
                          <span>Order Price</span>
                          {sortField === 'price' &&
                            (sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('amount')}
                        className="py-3 px-4 cursor-pointer hover:text-cp-gold select-none"
                      >
                        <div className="flex items-center gap-1">
                          <span>Amount</span>
                          {sortField === 'amount' &&
                            (sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('executed')}
                        className="py-3 px-4 cursor-pointer hover:text-cp-gold select-none"
                      >
                        <div className="flex items-center gap-1">
                          <span>Executed Amount</span>
                          {sortField === 'executed' &&
                            (sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('createdAt')}
                        className="py-3 px-4 cursor-pointer hover:text-cp-gold select-none"
                      >
                        <div className="flex items-center gap-1">
                          <span>Creation Date</span>
                          {sortField === 'createdAt' &&
                            (sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                        </div>
                      </th>
                      <th className="py-3 px-4">Final Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cp-border/50">
                    {paginatedOrderHistory.map((o) => {
                      const baseAsset = o.pair.split('/')[0]

                      return (
                        <tr
                          key={o.id}
                          className="hover:bg-cp-elevated/40 transition-colors cursor-pointer group"
                          onClick={() => setSelectedDetail({ kind: 'history', data: o })}
                        >
                          <td className="py-3 px-4 font-mono font-semibold text-cp-text-primary group-hover:text-cp-gold transition-colors">
                            {o.id}
                          </td>
                          <td className="py-3 px-4 font-bold text-cp-text-primary">
                            {o.pair}
                          </td>
                          <td className="py-3 px-4 uppercase font-semibold text-cp-text-secondary text-[11px]">
                            {o.type}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={o.side === 'buy' ? 'positive' : 'negative'}
                              size="sm"
                            >
                              {o.side.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-cp-text-primary">
                            {formatUSD(o.price)}
                          </td>
                          <td className="py-3 px-4 font-mono text-cp-text-secondary">
                            {o.amount} {baseAsset}
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-cp-text-primary">
                            {o.executed} {baseAsset}
                          </td>
                          <td className="py-3 px-4 font-mono text-cp-text-secondary">
                            {o.createdAt}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                o.status === 'filled'
                                  ? 'positive'
                                  : o.status === 'partially_filled'
                                  ? 'gold'
                                  : 'neutral'
                              }
                              size="sm"
                              withDot
                            >
                              {o.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div
                              className="flex items-center justify-end"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedDetail({ kind: 'history', data: o })}
                                className="h-7 px-2.5 text-[11px] border-cp-border hover:border-cp-gold"
                              >
                                View
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TRADE HISTORY (Fills) */}
        {activeTab === 'trades' && (
          <div>
            {filteredTradeHistory.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-cp-elevated border border-cp-border flex items-center justify-center mx-auto text-cp-text-secondary">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-cp-text-primary">No Trade Executions Found</h4>
                <p className="text-xs text-cp-text-secondary max-w-sm mx-auto">
                  {isFilterActive
                    ? 'No trades match your search parameters. Try clearing filters.'
                    : 'You have not executed any trade fills yet.'}
                </p>
                {isFilterActive && (
                  <Button variant="secondary" size="sm" onClick={handleResetFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-cp-elevated/60 text-cp-text-secondary uppercase text-[11px] font-semibold border-b border-cp-border">
                    <tr>
                      <th className="py-3 px-4">Trade ID</th>
                      <th
                        onClick={() => handleSort('pair')}
                        className="py-3 px-4 cursor-pointer hover:text-cp-gold select-none"
                      >
                        <div className="flex items-center gap-1">
                          <span>Trading Pair</span>
                          {sortField === 'pair' &&
                            (sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('execPrice')}
                        className="py-3 px-4 cursor-pointer hover:text-cp-gold select-none"
                      >
                        <div className="flex items-center gap-1">
                          <span>Execution Price</span>
                          {sortField === 'execPrice' &&
                            (sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('amount')}
                        className="py-3 px-4 cursor-pointer hover:text-cp-gold select-none"
                      >
                        <div className="flex items-center gap-1">
                          <span>Executed Amount</span>
                          {sortField === 'amount' &&
                            (sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('totalValue')}
                        className="py-3 px-4 cursor-pointer hover:text-cp-gold select-none"
                      >
                        <div className="flex items-center gap-1">
                          <span>Total Value</span>
                          {sortField === 'totalValue' &&
                            (sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('fee')}
                        className="py-3 px-4 cursor-pointer hover:text-cp-gold select-none"
                      >
                        <div className="flex items-center gap-1">
                          <span>Fee</span>
                          {sortField === 'fee' &&
                            (sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                        </div>
                      </th>
                      <th className="py-3 px-4">Side</th>
                      <th
                        onClick={() => handleSort('dateTime')}
                        className="py-3 px-4 cursor-pointer hover:text-cp-gold select-none"
                      >
                        <div className="flex items-center gap-1">
                          <span>Execution Time</span>
                          {sortField === 'dateTime' &&
                            (sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                        </div>
                      </th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cp-border/50">
                    {paginatedTradeHistory.map((t) => {
                      const baseAsset = t.pair.split('/')[0]

                      return (
                        <tr
                          key={t.id}
                          className="hover:bg-cp-elevated/40 transition-colors cursor-pointer group"
                          onClick={() => setSelectedDetail({ kind: 'trade', data: t })}
                        >
                          <td className="py-3 px-4 font-mono font-semibold text-cp-text-primary group-hover:text-cp-gold transition-colors">
                            {t.id}
                          </td>
                          <td className="py-3 px-4 font-bold text-cp-text-primary">
                            {t.pair}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-cp-text-primary">
                            {formatUSD(t.execPrice)}
                          </td>
                          <td className="py-3 px-4 font-mono text-cp-text-primary">
                            {t.amount} {baseAsset}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-cp-gold">
                            {formatUSD(t.totalValue)}
                          </td>
                          <td className="py-3 px-4 font-mono text-cp-text-secondary">
                            {t.fee} {t.feeAsset}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={t.side === 'buy' ? 'positive' : 'negative'}
                              size="sm"
                            >
                              {t.side.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 font-mono text-cp-text-secondary">
                            {t.dateTime}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div
                              className="flex items-center justify-end"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedDetail({ kind: 'trade', data: t })}
                                className="h-7 px-2.5 text-[11px] border-cp-border hover:border-cp-gold"
                              >
                                View
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Pagination Bar */}
        {currentDatasetLength > 0 && (
          <div className="p-4 border-t border-cp-border bg-cp-card/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cp-text-secondary">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="bg-cp-elevated border border-cp-border rounded-md px-2 py-1 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold cursor-pointer"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span className="ml-2 font-mono">
                Showing {currentDatasetLength > 0 ? startIndex + 1 : 0} - {endIndex} of{' '}
                {currentDatasetLength} records
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="h-8 w-8 p-0 border-cp-border flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="px-3 font-semibold text-cp-text-primary">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="h-8 w-8 p-0 border-cp-border flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      <OrderDetailModal
        isOpen={selectedDetail !== null}
        record={selectedDetail}
        onClose={() => setSelectedDetail(null)}
      />

      {/* Cancel Open Order Confirmation Modal */}
      <CancelConfirmModal
        isOpen={cancelModalOrder !== null}
        order={cancelModalOrder}
        onConfirm={handleConfirmCancelOrder}
        onClose={() => setCancelModalOrder(null)}
      />
    </div>
  )
}

export default Orders
