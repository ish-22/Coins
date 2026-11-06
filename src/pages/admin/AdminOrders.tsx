import React, { useState, useMemo, useEffect } from 'react'
import {
  ArrowLeftRight,
  Search,
  Eye,
  X,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Sliders,
  Percent,
  Activity,
  User,
  Users,
  BarChart3,
  Lock,
  Scale,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Clock,
  Sparkles,
  Award,
} from 'lucide-react'
import { Card, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import {
  AdminOrderRecord,
  AdminTraderRecord,
  AdminTradingStats,
  AdminTradingConfig,
} from '@/mock/adminData'
import { formatUSD } from '@/utils/formatters'
import { adminService } from '@/services'

export const AdminOrders: React.FC = () => {
  // Navigation Tabs: 'trades' | 'traders' | 'settings' | 'simulation'
  const [activeTab, setActiveTab] = useState<'trades' | 'traders' | 'settings' | 'simulation'>('trades')

  // Live Data States
  const [orders, setOrders] = useState<AdminOrderRecord[]>([])
  const [traders, setTraders] = useState<AdminTraderRecord[]>([])
  const [stats, setStats] = useState<AdminTradingStats | null>(null)
  const [config, setConfig] = useState<AdminTradingConfig>({
    engine_status: 'active',
    base_maker_fee: 0.001,
    base_taker_fee: 0.0015,
    slippage_tolerance: 0.5,
    max_leverage: 10,
    unverified_daily_limit_usd: 0,
    tier1_daily_limit_usd: 10000,
    tier2_daily_limit_usd: 500000,
    tier3_daily_limit_usd: 5000000,
    simulation_win_rate: 65,
    demo_initial_balance_usd: 10000,
    demo_slippage_model: 'normal',
    market_integrity_protection: true,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isSavingConfig, setIsSavingConfig] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Orders Filter States
  const [orderSearchQuery, setOrderSearchQuery] = useState('')
  const [pairFilter, setPairFilter] = useState<'all' | 'BTC/USDT' | 'ETH/USDT' | 'SOL/USDT' | 'XRP/USDT'>('all')
  const [sideFilter, setSideFilter] = useState<'all' | 'buy' | 'sell'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'filled' | 'cancelled'>('all')
  const [outcomeFilter, setOutcomeFilter] = useState<'all' | 'winning' | 'losing'>('all')

  // Traders Filter States
  const [traderSearchQuery, setTraderSearchQuery] = useState('')
  const [traderRiskFilter, setTraderRiskFilter] = useState<'all' | 'Low' | 'Medium' | 'High'>('all')

  // Modal / Drawer States
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderRecord | null>(null)
  const [selectedTraderId, setSelectedTraderId] = useState<string | null>(null)
  const [traderPerformance, setTraderPerformance] = useState<{
    trader: AdminTraderRecord
    performance: any
    history: AdminOrderRecord[]
  } | null>(null)
  const [loadingPerformance, setLoadingPerformance] = useState(false)

  // Load live trading overview from backend
  const loadTradingData = async () => {
    try {
      setIsLoading(true)
      setLoadError(null)
      const data = await adminService.getTradingOverview()
      if (data) {
        setOrders(data.orders || [])
        setTraders(data.traders || [])
        setStats(data.stats || null)
        if (data.settings) {
          setConfig(data.settings)
        }
      }
    } catch (error: any) {
      setLoadError(error?.response?.data?.message || 'Unable to load trading data from the API.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTradingData()
  }, [])

  // Open Trader Performance Drawer
  const handleOpenTraderPerformance = async (traderId: string) => {
    setSelectedTraderId(traderId)
    setLoadingPerformance(true)
    try {
      const data = await adminService.getTraderPerformance(traderId)
      setTraderPerformance(data)
    } catch (err) {
      console.error('Failed to load trader performance', err)
    } finally {
      setLoadingPerformance(false)
    }
  }

  // Cancel Open Order
  const handleCancelOrder = async (orderId: string) => {
    try {
      await adminService.cancelOrder(orderId)
      setToastMessage(`Order ${orderId} cancelled by administrative action.`)
      setTimeout(() => setToastMessage(null), 3500)
      loadTradingData()
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: 'cancelled' } : null))
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to cancel order.')
    }
  }

  // Save Trading Configuration
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingConfig(true)
    try {
      const res = await adminService.updateTradingSettings(config)
      if (res?.settings) {
        setConfig(res.settings)
      }
      setToastMessage(res?.message || 'Trading management configuration saved successfully.')
      setTimeout(() => setToastMessage(null), 4000)
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update trading configuration.')
    } finally {
      setIsSavingConfig(false)
    }
  }

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.userName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        o.orderRef.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        o.pair.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        (o.userEmail && o.userEmail.toLowerCase().includes(orderSearchQuery.toLowerCase()))

      const matchPair = pairFilter === 'all' || o.pair === pairFilter
      const matchSide = sideFilter === 'all' || o.side === sideFilter
      const matchStatus = statusFilter === 'all' || o.status === statusFilter
      const matchOutcome =
        outcomeFilter === 'all' ||
        (outcomeFilter === 'winning' && o.status === 'filled' && o.isWin === true) ||
        (outcomeFilter === 'losing' && o.status === 'filled' && o.isWin === false)

      return matchSearch && matchPair && matchSide && matchStatus && matchOutcome
    })
  }, [orders, orderSearchQuery, pairFilter, sideFilter, statusFilter, outcomeFilter])

  // Filtered Traders
  const filteredTraders = useMemo(() => {
    return traders.filter((t) => {
      const matchSearch =
        t.name.toLowerCase().includes(traderSearchQuery.toLowerCase()) ||
        t.email.toLowerCase().includes(traderSearchQuery.toLowerCase()) ||
        t.userRef.toLowerCase().includes(traderSearchQuery.toLowerCase())

      const matchRisk = traderRiskFilter === 'all' || t.riskScore === traderRiskFilter

      return matchSearch && matchRisk
    })
  }, [traders, traderSearchQuery, traderRiskFilter])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-cp-text-primary tracking-tight">
              Trading Management System
            </h1>
            <Badge variant="gold" size="sm" className="font-mono">
              ENGINE {config.engine_status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-xs text-cp-text-muted mt-1">
            Monitor live and historical order books, review trader performance, enforce risk limits, and configure disclosed simulation parameters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadTradingData}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
            className="text-xs"
          >
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-cp-positive/15 border border-cp-positive/40 text-xs text-cp-positive flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
          <button type="button" onClick={() => setToastMessage(null)} className="p-1 hover:text-cp-text-primary">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {loadError && (
        <div className="p-3 rounded-xl bg-cp-negative/10 border border-cp-negative/30 text-xs text-cp-negative flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{loadError}</span>
        </div>
      )}

      {/* KPI Stats Overview Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <Card className="bg-[#0c121c] border-cp-border">
            <CardContent className="p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-cp-text-muted flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cp-gold" />
                Total Traded Volume
              </span>
              <p className="text-xl font-mono font-black text-cp-text-primary">
                {formatUSD(stats.totalVolumeUsd)}
              </p>
              <span className="text-[10px] text-cp-text-muted block">
                {stats.totalTradesCount} orders placed across platform
              </span>
            </CardContent>
          </Card>

          <Card className="bg-[#0c121c] border-cp-border">
            <CardContent className="p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-cp-text-muted flex items-center gap-1.5">
                <ArrowLeftRight className="w-3.5 h-3.5 text-cp-positive" />
                Active vs Filled Orders
              </span>
              <p className="text-xl font-mono font-black text-cp-text-primary">
                <span className="text-cp-gold">{stats.activeTradesCount} Active</span>
                <span className="text-cp-text-muted mx-1">/</span>
                <span className="text-cp-positive">{stats.completedTradesCount} Filled</span>
              </p>
              <span className="text-[10px] text-cp-text-muted block">
                Live order matching engine state
              </span>
            </CardContent>
          </Card>

          <Card className="bg-[#0c121c] border-cp-border">
            <CardContent className="p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-cp-text-muted flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-cp-gold" />
                Win / Loss Performance
              </span>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-mono font-black text-cp-positive">
                  {stats.platformWinRate}%
                </p>
                <span className="text-xs font-semibold text-cp-text-muted">Win Rate</span>
              </div>
              <span className="text-[10px] text-cp-text-muted block">
                {stats.totalWinningTrades} Wins vs {stats.totalLosingTrades} Losses
              </span>
            </CardContent>
          </Card>

          <Card className="bg-[#0c121c] border-cp-border">
            <CardContent className="p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-cp-text-muted flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cp-gold" />
                Registered Traders
              </span>
              <p className="text-xl font-mono font-black text-cp-gold">
                {stats.totalTradersCount}
              </p>
              <span className="text-[10px] text-cp-text-muted block">
                Total Net Realized PnL: <strong className={stats.totalPnlUsd >= 0 ? 'text-cp-positive' : 'text-cp-negative'}>{formatUSD(stats.totalPnlUsd)}</strong>
              </span>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Module Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-cp-border pb-2 overflow-x-auto scrollbar-none text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('trades')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
            activeTab === 'trades'
              ? 'bg-cp-gold text-cp-bg shadow-sm'
              : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border border-cp-border'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Active & Completed Trades ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('traders')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
            activeTab === 'traders'
              ? 'bg-cp-gold text-cp-bg shadow-sm'
              : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border border-cp-border'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Registered Traders & Performance ({traders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-cp-gold text-cp-bg shadow-sm'
              : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border border-cp-border'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Trading Limits & Risk Settings</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('simulation')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
            activeTab === 'simulation'
              ? 'bg-cp-gold text-cp-bg shadow-sm'
              : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border border-cp-border'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Disclosed Simulation & Win-Rate</span>
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 1: ACTIVE & COMPLETED TRADES MONITOR */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'trades' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Filters Bar */}
          <Card className="bg-[#0c121c] border-cp-border">
            <CardContent className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cp-text-muted pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by order ID, trader name, email, or pair..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full bg-[#141d2b] border border-cp-border rounded-xl pl-9 pr-3 py-2 text-xs text-cp-text-primary placeholder:text-cp-text-muted/60 focus:outline-none focus:border-cp-gold"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Pair Selector */}
                <select
                  value={pairFilter}
                  onChange={(e) => setPairFilter(e.target.value as any)}
                  className="bg-[#141d2b] border border-cp-border rounded-lg px-2.5 py-1.5 text-xs text-cp-text-primary focus:outline-none"
                >
                  <option value="all">All Pairs</option>
                  <option value="BTC/USDT">BTC/USDT</option>
                  <option value="ETH/USDT">ETH/USDT</option>
                  <option value="SOL/USDT">SOL/USDT</option>
                  <option value="XRP/USDT">XRP/USDT</option>
                </select>

                {/* Side Filter */}
                <div className="flex items-center gap-1">
                  {(['all', 'buy', 'sell'] as const).map((side) => (
                    <button
                      key={side}
                      type="button"
                      onClick={() => setSideFilter(side)}
                      className={`px-2.5 py-1.5 rounded-lg border font-semibold uppercase text-[11px] ${
                        sideFilter === side
                          ? 'bg-cp-gold text-cp-bg border-cp-gold'
                          : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border-cp-border'
                      }`}
                    >
                      {side}
                    </button>
                  ))}
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-[#141d2b] border border-cp-border rounded-lg px-2.5 py-1.5 text-xs text-cp-text-primary focus:outline-none capitalize"
                >
                  <option value="all">All Statuses</option>
                  <option value="open">Active (Open)</option>
                  <option value="filled">Completed (Filled)</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {/* Win / Loss Filter */}
                <select
                  value={outcomeFilter}
                  onChange={(e) => setOutcomeFilter(e.target.value as any)}
                  className="bg-[#141d2b] border border-cp-border rounded-lg px-2.5 py-1.5 text-xs text-cp-text-primary focus:outline-none capitalize"
                >
                  <option value="all">All Outcomes</option>
                  <option value="winning">Winning Trades</option>
                  <option value="losing">Losing Trades</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card className="bg-[#0c121c] border-cp-border overflow-hidden">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center text-xs text-cp-text-muted space-y-2">
                <ArrowLeftRight className="w-8 h-8 text-cp-text-muted mx-auto" />
                <p>No trade orders match your current filter settings.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-cp-border bg-cp-elevated/40 text-cp-text-muted uppercase text-[10px] tracking-wider font-semibold">
                      <th className="py-3 px-4">Order Ref</th>
                      <th className="py-3 px-4">Trader</th>
                      <th className="py-3 px-4">Market Pair</th>
                      <th className="py-3 px-4">Side / Type</th>
                      <th className="py-3 px-4 text-right">Execution Price</th>
                      <th className="py-3 px-4 text-right">Amount / Filled</th>
                      <th className="py-3 px-4 text-right">Total (USD)</th>
                      <th className="py-3 px-4 text-right">PnL Outcome</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cp-border/50 text-cp-text-secondary">
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-cp-elevated/30 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-cp-gold">
                          {o.orderRef}
                        </td>

                        <td className="py-3 px-4">
                          <div>
                            <span className="font-bold text-cp-text-primary block">{o.userName}</span>
                            <span className="text-[10px] text-cp-text-muted font-mono block">UID-{o.userId}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-bold text-cp-text-primary">
                          {o.pair}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`font-bold uppercase text-[11px] ${
                                o.side === 'buy' ? 'text-cp-positive' : 'text-cp-negative'
                              }`}
                            >
                              {o.side}
                            </span>
                            <span className="text-[10px] text-cp-text-muted capitalize">({o.type})</span>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right font-mono font-bold text-cp-text-primary">
                          {formatUSD(o.price)}
                        </td>

                        <td className="py-3 px-4 text-right font-mono text-cp-text-secondary">
                          {o.filled} / {o.amount}
                        </td>

                        <td className="py-3 px-4 text-right font-mono font-bold text-cp-gold">
                          {formatUSD(o.totalUsd)}
                        </td>

                        <td className="py-3 px-4 text-right font-mono">
                          {o.status === 'filled' ? (
                            <div className="inline-flex items-center gap-1">
                              <span
                                className={`font-bold ${
                                  (o.pnlUsd || 0) >= 0 ? 'text-cp-positive' : 'text-cp-negative'
                                }`}
                              >
                                {(o.pnlUsd || 0) >= 0 ? '+' : ''}
                                {formatUSD(o.pnlUsd || 0)}
                              </span>
                              <Badge
                                variant={(o.pnlUsd || 0) >= 0 ? 'positive' : 'negative'}
                                size="sm"
                                className="text-[9px] uppercase px-1 py-0"
                              >
                                {(o.pnlUsd || 0) >= 0 ? 'Win' : 'Loss'}
                              </Badge>
                            </div>
                          ) : (
                            <span className="text-cp-text-muted text-[11px]">—</span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              o.status === 'filled'
                                ? 'positive'
                                : o.status === 'open'
                                ? 'gold'
                                : 'neutral'
                            }
                            size="sm"
                            className="capitalize"
                          >
                            {o.status === 'open' ? 'Active' : o.status}
                          </Badge>
                        </td>

                        <td className="py-3 px-4 font-mono text-[11px] text-cp-text-muted">
                          {o.createdAt}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(o)}
                              className="px-2 py-1 rounded-lg bg-cp-elevated hover:bg-cp-card border border-cp-border text-cp-text-secondary hover:text-cp-gold transition-colors inline-flex items-center gap-1"
                              title="Inspect Order Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Details</span>
                            </button>

                            {o.status === 'open' && (
                              <button
                                type="button"
                                onClick={() => handleCancelOrder(o.id)}
                                className="px-2 py-1 rounded-lg bg-cp-negative/15 hover:bg-cp-negative/25 border border-cp-negative/30 text-cp-negative transition-colors text-[11px] font-semibold"
                                title="Cancel order and refund trader wallet"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 2: REGISTERED TRADERS & INDIVIDUAL PERFORMANCE */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'traders' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Filters Bar */}
          <Card className="bg-[#0c121c] border-cp-border">
            <CardContent className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cp-text-muted pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search traders by name, email, or user UID..."
                  value={traderSearchQuery}
                  onChange={(e) => setTraderSearchQuery(e.target.value)}
                  className="w-full bg-[#141d2b] border border-cp-border rounded-xl pl-9 pr-3 py-2 text-xs text-cp-text-primary placeholder:text-cp-text-muted/60 focus:outline-none focus:border-cp-gold"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-cp-text-muted uppercase font-bold">Risk Filter:</span>
                {(['all', 'Low', 'Medium', 'High'] as const).map((risk) => (
                  <button
                    key={risk}
                    type="button"
                    onClick={() => setTraderRiskFilter(risk)}
                    className={`px-2.5 py-1 rounded-lg border font-semibold text-[11px] capitalize ${
                      traderRiskFilter === risk
                        ? 'bg-cp-gold text-cp-bg border-cp-gold'
                        : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border-cp-border'
                    }`}
                  >
                    {risk}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Traders Table */}
          <Card className="bg-[#0c121c] border-cp-border overflow-hidden">
            {filteredTraders.length === 0 ? (
              <div className="p-12 text-center text-xs text-cp-text-muted space-y-2">
                <Users className="w-8 h-8 text-cp-text-muted mx-auto" />
                <p>No registered traders match your filter criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-cp-border bg-cp-elevated/40 text-cp-text-muted uppercase text-[10px] tracking-wider font-semibold">
                      <th className="py-3 px-4">Trader</th>
                      <th className="py-3 px-4">KYC Status</th>
                      <th className="py-3 px-4">Country</th>
                      <th className="py-3 px-4 text-center">Total Trades</th>
                      <th className="py-3 px-4 text-right">Traded Volume</th>
                      <th className="py-3 px-4 text-center">Win / Loss Ratio</th>
                      <th className="py-3 px-4 text-right">Win Rate %</th>
                      <th className="py-3 px-4 text-right">Total Net PnL</th>
                      <th className="py-3 px-4 text-center">Risk Score</th>
                      <th className="py-3 px-4 text-center">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cp-border/50 text-cp-text-secondary">
                    {filteredTraders.map((t) => (
                      <tr key={t.id} className="hover:bg-cp-elevated/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div>
                            <span className="font-bold text-cp-text-primary block">{t.name}</span>
                            <span className="text-[11px] text-cp-text-muted font-mono">{t.email}</span>
                            <span className="text-[10px] text-cp-gold font-mono block">{t.userRef}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 font-bold text-[11px] ${
                              t.kycTier.toUpperCase().includes('VERIFIED')
                                ? 'text-cp-positive'
                                : t.kycTier.toLowerCase().includes('in review')
                                ? 'text-cp-gold'
                                : 'text-cp-text-muted'
                            }`}
                          >
                            {t.kycTier.toUpperCase().includes('VERIFIED') ? '✓ VERIFIED' : t.kycTier}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-cp-text-secondary">
                          {t.country}
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono font-bold text-cp-text-primary">
                          {t.totalTrades}
                          <span className="text-[10px] text-cp-text-muted block">
                            ({t.openTrades} open, {t.filledTrades} filled)
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono font-bold text-cp-gold">
                          {formatUSD(t.volumeUsd)}
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono">
                          <span className="text-cp-positive font-bold">{t.winningTrades}W</span>
                          <span className="text-cp-text-muted mx-1">/</span>
                          <span className="text-cp-negative font-bold">{t.losingTrades}L</span>
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono font-bold">
                          <span
                            className={
                              t.winRate >= 50
                                ? 'text-cp-positive'
                                : t.totalTrades === 0
                                ? 'text-cp-text-muted'
                                : 'text-cp-negative'
                            }
                          >
                            {t.winRate}%
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono font-bold">
                          <span className={t.totalPnl >= 0 ? 'text-cp-positive' : 'text-cp-negative'}>
                            {t.totalPnl >= 0 ? '+' : ''}
                            {formatUSD(t.totalPnl)}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <Badge
                            variant={
                              t.riskScore === 'Low'
                                ? 'positive'
                                : t.riskScore === 'Medium'
                                ? 'gold'
                                : 'negative'
                            }
                            size="sm"
                          >
                            {t.riskScore}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleOpenTraderPerformance(t.id)}
                            className="text-xs px-2.5 py-1"
                          >
                            View Performance
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 3: TRADING LIMITS & RISK-MANAGEMENT SETTINGS */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveConfig} className="space-y-6 animate-fadeIn">
          {/* Engine Status & Fee Configuration */}
          <Card className="bg-[#0c121c] border-cp-border">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-cp-border pb-3">
                <SlidersHorizontal className="w-5 h-5 text-cp-gold" />
                <h3 className="text-sm font-bold text-cp-text-primary uppercase tracking-wide">
                  Spot Engine & Fee Architecture
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-cp-text-primary block">
                    Exchange Matching Engine Status
                  </label>
                  <select
                    value={config.engine_status}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, engine_status: e.target.value as any }))
                    }
                    className="w-full bg-[#141d2b] border border-cp-border rounded-xl px-3 py-2 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold"
                  >
                    <option value="active">Active (Normal Live Matching)</option>
                    <option value="maintenance">Maintenance (Emergency Trading Halt)</option>
                  </select>
                  <span className="text-[10px] text-cp-text-muted">
                    Setting to Maintenance halts order submission exchange-wide.
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-cp-text-primary block">
                    Base Maker Fee (%)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    min="0"
                    max="1"
                    value={config.base_maker_fee * 100}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        base_maker_fee: parseFloat(e.target.value) / 100 || 0,
                      }))
                    }
                    className="w-full bg-[#141d2b] border border-cp-border rounded-xl px-3 py-2 font-mono text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold"
                  />
                  <span className="text-[10px] text-cp-text-muted">Default limit order maker fee discount.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-cp-text-primary block">
                    Base Taker Fee (%)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    min="0"
                    max="1"
                    value={config.base_taker_fee * 100}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        base_taker_fee: parseFloat(e.target.value) / 100 || 0,
                      }))
                    }
                    className="w-full bg-[#141d2b] border border-cp-border rounded-xl px-3 py-2 font-mono text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold"
                  />
                  <span className="text-[10px] text-cp-text-muted">Instant market fill fee.</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tiered Daily Volume Limits */}
          <Card className="bg-[#0c121c] border-cp-border">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-cp-border pb-3">
                <ShieldCheck className="w-5 h-5 text-cp-positive" />
                <h3 className="text-sm font-bold text-cp-text-primary uppercase tracking-wide">
                  KYC Tiered Trading Volume Limits (USD / 24h)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div className="space-y-1.5 p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                  <label className="font-bold text-cp-negative block uppercase text-[10px]">
                    Unverified Account Limit
                  </label>
                  <div className="font-mono text-sm font-black text-cp-text-primary py-1.5">
                    $0 USD (Restricted)
                  </div>
                  <span className="text-[10px] text-cp-text-muted">
                    Trading is strictly restricted until approved by admin.
                  </span>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                  <label className="font-bold text-cp-text-primary block uppercase text-[10px]">
                    Tier 1 (Basic Identity) Limit
                  </label>
                  <input
                    type="number"
                    value={config.tier1_daily_limit_usd}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        tier1_daily_limit_usd: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full bg-[#141d2b] border border-cp-border rounded-lg px-2.5 py-1.5 font-mono text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold"
                  />
                  <span className="text-[10px] text-cp-text-muted">Daily trading limit for Tier 1 users.</span>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                  <label className="font-bold text-cp-positive block uppercase text-[10px]">
                    Tier 2 (Full Verified) Limit
                  </label>
                  <input
                    type="number"
                    value={config.tier2_daily_limit_usd}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        tier2_daily_limit_usd: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full bg-[#141d2b] border border-cp-border rounded-lg px-2.5 py-1.5 font-mono text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold"
                  />
                  <span className="text-[10px] text-cp-text-muted">Standard verified customer daily quota.</span>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                  <label className="font-bold text-cp-gold block uppercase text-[10px]">
                    Tier 3 (Institutional) Limit
                  </label>
                  <input
                    type="number"
                    value={config.tier3_daily_limit_usd}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        tier3_daily_limit_usd: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full bg-[#141d2b] border border-cp-border rounded-lg px-2.5 py-1.5 font-mono text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold"
                  />
                  <span className="text-[10px] text-cp-text-muted">High-volume corporate brokerage quota.</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Management & Guardrails */}
          <Card className="bg-[#0c121c] border-cp-border">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-cp-border pb-3">
                <ShieldAlert className="w-5 h-5 text-cp-negative" />
                <h3 className="text-sm font-bold text-cp-text-primary uppercase tracking-wide">
                  Risk Management & Anti-Slippage Controls
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-cp-text-primary block">
                    Max Slippage Tolerance (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="5.0"
                    value={config.slippage_tolerance}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        slippage_tolerance: parseFloat(e.target.value) || 0.5,
                      }))
                    }
                    className="w-full bg-[#141d2b] border border-cp-border rounded-xl px-3 py-2 font-mono text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold"
                  />
                  <span className="text-[10px] text-cp-text-muted">
                    Market orders that exceed this slippage boundary are rejected automatically.
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-cp-text-primary block">
                    Maximum Leverage Cap (Multiplier)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={config.max_leverage}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        max_leverage: parseInt(e.target.value) || 1,
                      }))
                    }
                    className="w-full bg-[#141d2b] border border-cp-border rounded-xl px-3 py-2 font-mono text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold"
                  />
                  <span className="text-[10px] text-cp-text-muted">
                    Platform-wide ceiling for margin positions.
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <Button variant="primary" size="sm" type="submit" disabled={isSavingConfig}>
                  {isSavingConfig ? 'Saving Settings...' : 'Save Risk & Trading Limits'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 4: DISCLOSED SIMULATION & WIN-RATE SETTINGS */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'simulation' && (
        <form onSubmit={handleSaveConfig} className="space-y-6 animate-fadeIn">
          {/* Statutory Market Integrity Disclosure */}
          <div className="p-5 rounded-2xl bg-[#141d2b] border border-cp-gold/40 shadow-card space-y-2 text-xs">
            <div className="flex items-center gap-2 text-cp-gold font-bold">
              <Scale className="w-5 h-5 shrink-0" />
              <span className="text-sm">Regulatory Disclosure & Market Integrity Compliance</span>
            </div>
            <p className="text-cp-text-secondary leading-relaxed">
              <strong>Mandatory Rule:</strong> For real-money trading, actual trading results must be determined by the market and the disclosed trading rules. Administrators must not secretly manipulate individual users' winning or losing outcomes.
            </p>
            <p className="text-[11px] text-cp-text-muted leading-relaxed">
              The parameters below apply exclusively to <strong>disclosed trading simulations and demo-account environments</strong>. Live order books are cryptographically audited and executed purely against matched liquidity.
            </p>
          </div>

          {/* Demo & Simulation Configuration Card */}
          <Card className="bg-[#0c121c] border-cp-border">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-cp-border pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cp-gold" />
                  <h3 className="text-sm font-bold text-cp-text-primary uppercase tracking-wide">
                    Disclosed Simulation & Demo Parameters
                  </h3>
                </div>
                <Badge variant="gold" size="sm">
                  Simulated Environment Only
                </Badge>
              </div>

              {/* Winning Rate Slider & Value */}
              <div className="space-y-3 p-4 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-xs text-cp-text-primary block">
                      Disclosed Simulated Win-Rate Parameter
                    </label>
                    <span className="text-[11px] text-cp-text-muted">
                      Target simulated winning percentage applied in demo accounts and paper trading mode.
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-mono font-black text-cp-gold">
                      {config.simulation_win_rate}%
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="5"
                    value={config.simulation_win_rate}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        simulation_win_rate: parseInt(e.target.value) || 65,
                      }))
                    }
                    className="w-full accent-[#d4af37] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-cp-text-muted font-mono">
                    <span>10% (Challenging)</span>
                    <span>50% (Market Neutral)</span>
                    <span>90% (Maximum Demo Boost)</span>
                  </div>
                </div>
              </div>

              {/* Demo Virtual Balance & Model */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-cp-text-primary block">
                    Demo Virtual Starting Capital (USD)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    min="1000"
                    max="1000000"
                    value={config.demo_initial_balance_usd}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        demo_initial_balance_usd: parseInt(e.target.value) || 10000,
                      }))
                    }
                    className="w-full bg-[#141d2b] border border-cp-border rounded-xl px-3 py-2 font-mono text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold"
                  />
                  <span className="text-[10px] text-cp-text-muted">
                    Default virtual balance assigned to newly initialized paper accounts.
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-cp-text-primary block">
                    Simulated Slippage Model
                  </label>
                  <select
                    value={config.demo_slippage_model}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        demo_slippage_model: e.target.value as any,
                      }))
                    }
                    className="w-full bg-[#141d2b] border border-cp-border rounded-xl px-3 py-2 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold"
                  >
                    <option value="tight">Tight Spread (0.02% simulated impact)</option>
                    <option value="normal">Realistic Spread (0.05% simulated impact)</option>
                    <option value="volatile">High Volatility (0.15% simulated impact)</option>
                  </select>
                  <span className="text-[10px] text-cp-text-muted">
                    Models order book market depth resistance in simulation.
                  </span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-cp-border">
                <span className="text-[11px] text-cp-text-muted flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cp-positive" />
                  Live Real-Money Manipulation Locked
                </span>
                <Button variant="primary" size="sm" type="submit" disabled={isSavingConfig}>
                  {isSavingConfig ? 'Saving Settings...' : 'Save Simulation Parameters'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ORDER DETAILS MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative w-full max-w-lg bg-[#0c121c] border border-cp-border rounded-2xl shadow-2xl p-6 z-10 animate-fadeIn space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-cp-border pb-3">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-cp-gold" />
                <h4 className="text-base font-bold text-cp-text-primary">
                  Order Details: {selectedOrder.orderRef}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-cp-text-muted hover:text-cp-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-[10px] text-cp-text-muted uppercase block">Trader</span>
                <span className="font-bold text-cp-text-primary mt-0.5 block">{selectedOrder.userName}</span>
                <span className="text-[10px] text-cp-gold font-mono">UID-{selectedOrder.userId}</span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-[10px] text-cp-text-muted uppercase block">Trading Pair</span>
                <span className="font-mono font-bold text-cp-text-primary mt-0.5 block">{selectedOrder.pair}</span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-[10px] text-cp-text-muted uppercase block">Side & Type</span>
                <span
                  className={`font-bold mt-0.5 block uppercase ${
                    selectedOrder.side === 'buy' ? 'text-cp-positive' : 'text-cp-negative'
                  }`}
                >
                  {selectedOrder.side} ({selectedOrder.type})
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-[10px] text-cp-text-muted uppercase block">Execution Price</span>
                <span className="font-mono font-bold text-cp-text-primary mt-0.5 block">
                  {formatUSD(selectedOrder.price)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-[10px] text-cp-text-muted uppercase block">Amount / Filled</span>
                <span className="font-mono text-cp-text-primary mt-0.5 block">
                  {selectedOrder.filled} / {selectedOrder.amount}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-[10px] text-cp-text-muted uppercase block">Total Value (USD)</span>
                <span className="font-mono font-bold text-cp-gold mt-0.5 block">
                  {formatUSD(selectedOrder.totalUsd)}
                </span>
              </div>
            </div>

            {selectedOrder.status === 'filled' && (
              <div className="p-3.5 rounded-xl bg-cp-elevated/60 border border-cp-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-cp-text-muted block font-semibold">
                    Realized Trade Outcome
                  </span>
                  <span
                    className={`font-mono text-base font-bold ${
                      (selectedOrder.pnlUsd || 0) >= 0 ? 'text-cp-positive' : 'text-cp-negative'
                    }`}
                  >
                    {(selectedOrder.pnlUsd || 0) >= 0 ? '+' : ''}
                    {formatUSD(selectedOrder.pnlUsd || 0)}
                  </span>
                </div>
                <Badge variant={(selectedOrder.pnlUsd || 0) >= 0 ? 'positive' : 'negative'} size="sm">
                  {(selectedOrder.pnlUsd || 0) >= 0 ? 'Winning Trade' : 'Losing Trade'}
                </Badge>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-cp-border">
              <span className="text-[11px] text-cp-text-muted">
                Status: <strong className="capitalize">{selectedOrder.status}</strong> • {selectedOrder.createdAt}
              </span>

              <div className="flex items-center gap-2">
                {selectedOrder.status === 'open' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-cp-negative border-cp-negative/40 hover:bg-cp-negative/10"
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                  >
                    Cancel Order
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => setSelectedOrder(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* INDIVIDUAL TRADER PERFORMANCE & HISTORY DRAWER */}
      {/* ───────────────────────────────────────────────────────────── */}
      {selectedTraderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            onClick={() => {
              setSelectedTraderId(null)
              setTraderPerformance(null)
            }}
          />

          <div className="relative w-full max-w-4xl bg-[#0c121c] border border-cp-border rounded-2xl shadow-2xl p-6 z-10 animate-fadeIn space-y-5 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-cp-border pb-3">
              <div className="flex items-center gap-2.5">
                <User className="w-5 h-5 text-cp-gold" />
                <div>
                  <h4 className="text-base font-bold text-cp-text-primary">
                    Trader Performance Profile
                  </h4>
                  {traderPerformance && (
                    <span className="text-xs text-cp-text-muted font-mono">
                      {traderPerformance.trader.name} ({traderPerformance.trader.email}) • {traderPerformance.trader.userRef}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedTraderId(null)
                  setTraderPerformance(null)
                }}
                className="p-1 text-cp-text-muted hover:text-cp-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingPerformance || !traderPerformance ? (
              <div className="p-12 text-center text-xs text-cp-text-muted space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin text-cp-gold mx-auto" />
                <p>Analyzing individual trade history and metrics...</p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Performance Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-cp-elevated/40 border border-cp-border space-y-1">
                    <span className="text-[10px] uppercase font-bold text-cp-text-muted block">
                      Win Rate %
                    </span>
                    <span
                      className={`text-xl font-mono font-black ${
                        traderPerformance.performance.winRate >= 50 ? 'text-cp-positive' : 'text-cp-negative'
                      }`}
                    >
                      {traderPerformance.performance.winRate}%
                    </span>
                    <span className="text-[10px] text-cp-text-muted block">
                      {traderPerformance.performance.winningTrades}W / {traderPerformance.performance.losingTrades}L
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-cp-elevated/40 border border-cp-border space-y-1">
                    <span className="text-[10px] uppercase font-bold text-cp-text-muted block">
                      Net Realized PnL
                    </span>
                    <span
                      className={`text-xl font-mono font-black ${
                        traderPerformance.performance.totalPnl >= 0 ? 'text-cp-positive' : 'text-cp-negative'
                      }`}
                    >
                      {traderPerformance.performance.totalPnl >= 0 ? '+' : ''}
                      {formatUSD(traderPerformance.performance.totalPnl)}
                    </span>
                    <span className="text-[10px] text-cp-text-muted block">Total Profit & Loss</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-cp-elevated/40 border border-cp-border space-y-1">
                    <span className="text-[10px] uppercase font-bold text-cp-text-muted block">
                      Total Traded Volume
                    </span>
                    <span className="text-xl font-mono font-black text-cp-gold">
                      {formatUSD(traderPerformance.performance.totalVolume)}
                    </span>
                    <span className="text-[10px] text-cp-text-muted block">
                      Across {traderPerformance.performance.totalTrades} orders
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-cp-elevated/40 border border-cp-border space-y-1">
                    <span className="text-[10px] uppercase font-bold text-cp-text-muted block">
                      Best Trade / Worst
                    </span>
                    <div className="font-mono text-xs font-bold space-y-0.5">
                      <span className="text-cp-positive block">
                        +{formatUSD(traderPerformance.performance.bestTrade)}
                      </span>
                      <span className="text-cp-negative block">
                        {formatUSD(traderPerformance.performance.worstTrade)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trader Historical Trades Table */}
                <div className="space-y-2">
                  <h5 className="font-bold text-cp-text-primary uppercase tracking-wider text-xs flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-cp-gold" />
                    Complete Trade Order History
                  </h5>

                  {traderPerformance.history.length === 0 ? (
                    <div className="p-8 text-center text-xs text-cp-text-muted bg-cp-elevated/20 rounded-xl border border-cp-border">
                      No trade orders recorded for this user yet.
                    </div>
                  ) : (
                    <div className="border border-cp-border rounded-xl overflow-hidden">
                      <div className="max-h-64 overflow-y-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-cp-border bg-cp-elevated/60 text-cp-text-muted uppercase text-[10px] font-semibold sticky top-0 bg-[#121a27]">
                              <th className="py-2.5 px-3">Order Ref</th>
                              <th className="py-2.5 px-3">Pair</th>
                              <th className="py-2.5 px-3">Side</th>
                              <th className="py-2.5 px-3 text-right">Price</th>
                              <th className="py-2.5 px-3 text-right">Amount</th>
                              <th className="py-2.5 px-3 text-right">Total USD</th>
                              <th className="py-2.5 px-3 text-right">PnL</th>
                              <th className="py-2.5 px-3">Status</th>
                              <th className="py-2.5 px-3">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-cp-border/40 text-cp-text-secondary">
                            {traderPerformance.history.map((h) => (
                              <tr key={h.id} className="hover:bg-cp-elevated/30">
                                <td className="py-2 px-3 font-mono font-bold text-cp-gold">{h.orderRef}</td>
                                <td className="py-2 px-3 font-bold text-cp-text-primary">{h.pair}</td>
                                <td className="py-2 px-3">
                                  <span
                                    className={`font-bold uppercase text-[10px] ${
                                      h.side === 'buy' ? 'text-cp-positive' : 'text-cp-negative'
                                    }`}
                                  >
                                    {h.side}
                                  </span>
                                </td>
                                <td className="py-2 px-3 text-right font-mono">{formatUSD(h.price)}</td>
                                <td className="py-2 px-3 text-right font-mono">{h.amount}</td>
                                <td className="py-2 px-3 text-right font-mono font-bold">{formatUSD(h.totalUsd)}</td>
                                <td className="py-2 px-3 text-right font-mono">
                                  {h.status === 'filled' ? (
                                    <span
                                      className={`font-bold ${
                                        (h.pnlUsd || 0) >= 0 ? 'text-cp-positive' : 'text-cp-negative'
                                      }`}
                                    >
                                      {(h.pnlUsd || 0) >= 0 ? '+' : ''}
                                      {formatUSD(h.pnlUsd || 0)}
                                    </span>
                                  ) : (
                                    '—'
                                  )}
                                </td>
                                <td className="py-2 px-3">
                                  <Badge
                                    variant={
                                      h.status === 'filled'
                                        ? 'positive'
                                        : h.status === 'open'
                                        ? 'gold'
                                        : 'neutral'
                                    }
                                    size="sm"
                                    className="capitalize text-[10px]"
                                  >
                                    {h.status}
                                  </Badge>
                                </td>
                                <td className="py-2 px-3 font-mono text-[10px] text-cp-text-muted">{h.createdAt}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-2 border-t border-cp-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTraderId(null)
                      setTraderPerformance(null)
                    }}
                  >
                    Close Trader View
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrders