import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Eye,
  EyeOff,
  RefreshCw,
  Sparkles,
  PieChart as PieChartIcon,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  SlidersHorizontal,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Typography } from '@/components/common/Typography'
import { walletService, WalletSummaryResponse } from '@/services/walletService'
import { WalletAssetItem, WalletTransactionItem } from '@/mock/walletData'
import { formatCurrency, formatCrypto } from '@/utils/formatters'

export const Assets: React.FC = () => {
  const [summary, setSummary] = useState<WalletSummaryResponse | null>(null)
  const [assets, setAssets] = useState<WalletAssetItem[]>([])
  const [transactions, setTransactions] = useState<WalletTransactionItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const [hideBalances, setHideBalances] = useState<boolean>(false)

  // Filters & search
  const [searchQuery, setSearchQuery] = useState('')
  const [hideZeroBalances, setHideZeroBalances] = useState(false)
  const [assetTab, setAssetTab] = useState<'all' | 'crypto' | 'stablecoin'>('all')

  const loadWalletData = async () => {
    try {
      const [sum, asts, txs] = await Promise.all([
        walletService.getSummary().catch(() => null),
        walletService.getAssets().catch(() => []),
        walletService.getTransactions().catch(() => []),
      ])

      if (sum) setSummary(sum)
      if (asts) setAssets(asts)
      if (txs) setTransactions(txs)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadWalletData()
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadWalletData()
    setTimeout(() => setIsRefreshing(false), 600)
  }

  const maskValue = (val: string) => (hideBalances ? '••••••••' : val)

  const totalUsd = summary?.totalBalanceUsd ?? 0
  const availableUsd = summary?.availableBalanceUsd ?? 0
  const lockedUsd = summary?.lockedBalanceUsd ?? 0
  const totalBtc = summary?.totalBalanceBtc ?? 0

  const availablePercent =
    totalUsd > 0 ? ((availableUsd / totalUsd) * 100).toFixed(1) : '0.0'
  const lockedPercent =
    totalUsd > 0 ? ((lockedUsd / totalUsd) * 100).toFixed(1) : '0.0'

  // Filtered Assets list
  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      if (hideZeroBalances && a.totalBalance <= 0) return false
      if (assetTab !== 'all' && a.type !== assetTab) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        return a.name.toLowerCase().includes(q) || a.symbol.toLowerCase().includes(q)
      }
      return true
    })
  }, [assets, hideZeroBalances, assetTab, searchQuery])

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Live Sync Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 rounded-xl bg-cp-elevated border border-cp-gold/30 text-xs shadow-sm">
        <div className="flex items-center gap-2.5">
          <Badge variant="gold" size="sm" withDot pulseDot className="shrink-0">
            DATABASE SYNCED
          </Badge>
          <span className="text-cp-text-secondary leading-relaxed">
            Real-time multi-asset balances, hot/cold custody status, and transaction history.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-cp-text-muted hover:text-cp-gold hover:bg-cp-card transition-colors disabled:opacity-50"
            title="Refresh database wallet feeds"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isRefreshing && 'animate-spin text-cp-gold')} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Balances'}</span>
          </button>
        </div>
      </div>

      {/* Page Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-cp-text-muted mb-1.5">
            <Link to="/dashboard" className="hover:text-cp-gold transition-colors">CoinPlus</Link>
            <ChevronRight className="w-3.5 h-3.5 text-cp-border-light" />
            <span className="text-cp-gold font-medium">Wallet & Assets</span>
          </nav>

          <Typography variant="h1" className="text-2xl sm:text-3xl font-extrabold text-cp-text-primary">
            Asset Custody & Balances
          </Typography>

          <Typography variant="body-sm" color="secondary" className="mt-1 max-w-2xl">
            Live database valuation of your institutional crypto assets, spot holdings, and available margins.
          </Typography>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setHideBalances(!hideBalances)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cp-card border border-cp-border hover:border-cp-gold/40 text-xs font-semibold text-cp-text-secondary hover:text-cp-gold transition-colors"
          >
            {hideBalances ? (
              <>
                <Eye className="w-4 h-4 text-cp-gold" />
                <span>Show Balance</span>
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 text-cp-gold" />
                <span>Hide Balance</span>
              </>
            )}
          </button>

          <Link to="/deposit">
            <Button variant="primary" size="sm" leftIcon={<ArrowDownToLine className="w-4 h-4" />}>
              Deposit
            </Button>
          </Link>
          <Link to="/withdraw">
            <Button variant="secondary" size="sm" leftIcon={<ArrowUpFromLine className="w-4 h-4" />}>
              Withdraw
            </Button>
          </Link>
          <Link to="/trade">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeftRight className="w-4 h-4 text-cp-gold" />}>
              Trade
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total Valuation */}
        <Card variant="gold" padding="md" className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-cp-text-muted font-semibold uppercase tracking-wider">
              Total Valuation
            </span>
            <Badge variant="gold" size="sm">Portfolio</Badge>
          </div>
          <div>
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-cp-text-primary tracking-tight">
              {maskValue(formatCurrency(totalUsd))}
            </div>
            <div className="font-mono text-xs text-cp-text-muted mt-0.5">
              ≈ {maskValue(`${totalBtc.toFixed(5)} BTC`)}
            </div>
          </div>
          <div className="pt-2 border-t border-cp-border/60 flex items-center justify-between text-xs">
            <span className="text-cp-text-muted">Custody Status:</span>
            <span className="text-cp-positive font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Multi-Sig Secure
            </span>
          </div>
        </Card>

        {/* Card 2: Available Funds */}
        <Card variant="default" padding="md" className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-cp-text-muted font-semibold uppercase tracking-wider">
              Available Cash
            </span>
            <Badge variant="neutral" size="sm">{availablePercent}%</Badge>
          </div>
          <div>
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-cp-positive tracking-tight">
              {maskValue(formatCurrency(availableUsd))}
            </div>
            <div className="font-mono text-xs text-cp-text-muted mt-0.5">
              Ready to trade / withdraw
            </div>
          </div>
          <div className="pt-2 border-t border-cp-border/60">
            <div className="w-full bg-cp-elevated rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-cp-positive h-full rounded-full transition-all"
                style={{ width: `${availablePercent}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Card 3: In Orders / Locked */}
        <Card variant="default" padding="md" className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-cp-text-muted font-semibold uppercase tracking-wider">
              In Orders / Locked
            </span>
            <Badge variant="neutral" size="sm">{lockedPercent}%</Badge>
          </div>
          <div>
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-cp-text-primary tracking-tight">
              {maskValue(formatCurrency(lockedUsd))}
            </div>
            <div className="font-mono text-xs text-cp-text-muted mt-0.5">
              Open Limit Orders & Escrow
            </div>
          </div>
          <div className="pt-2 border-t border-cp-border/60">
            <div className="w-full bg-cp-elevated rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-cp-gold h-full rounded-full transition-all"
                style={{ width: `${lockedPercent}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Card 4: Verified Quotas */}
        <Card variant="default" padding="md" className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-cp-text-muted font-semibold uppercase tracking-wider">
              Daily Limit
            </span>
            <Badge variant="positive" size="sm">Tier 2</Badge>
          </div>
          <div>
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-cp-text-primary tracking-tight">
              $500,000
            </div>
            <div className="font-mono text-xs text-cp-text-muted mt-0.5">
              Remaining Daily Off-Ramp Quota
            </div>
          </div>
          <div className="pt-2 border-t border-cp-border/60 flex items-center justify-between text-xs">
            <span className="text-cp-text-muted">Total Assets:</span>
            <span className="text-cp-gold font-mono font-bold">
              {assets.length} Active Coins
            </span>
          </div>
        </Card>
      </div>

      {/* Main Asset Table & Search Toolbar */}
      <Card variant="default" padding="none" className="overflow-hidden border-cp-border">
        {/* Toolbar Header */}
        <div className="p-4 sm:p-5 border-b border-cp-border bg-cp-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setAssetTab('all')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                assetTab === 'all'
                  ? 'bg-cp-gold text-cp-bg shadow-sm'
                  : 'text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-elevated'
              )}
            >
              All Assets ({assets.length})
            </button>
            <button
              type="button"
              onClick={() => setAssetTab('crypto')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                assetTab === 'crypto'
                  ? 'bg-cp-gold text-cp-bg shadow-sm'
                  : 'text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-elevated'
              )}
            >
              Crypto
            </button>
            <button
              type="button"
              onClick={() => setAssetTab('stablecoin')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                assetTab === 'stablecoin'
                  ? 'bg-cp-gold text-cp-bg shadow-sm'
                  : 'text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-elevated'
              )}
            >
              Stablecoins
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-cp-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search coin or symbol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-cp-elevated border border-cp-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-cp-text-primary placeholder:text-cp-text-muted focus:outline-none focus:border-cp-gold font-sans"
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-cp-text-secondary cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hideZeroBalances}
                onChange={(e) => setHideZeroBalances(e.target.checked)}
                className="rounded border-cp-border text-cp-gold focus:ring-0 bg-cp-elevated"
              />
              <span>Hide 0 balances</span>
            </label>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-cp-border/50 text-[10px] text-cp-text-muted uppercase tracking-wider bg-cp-elevated/40">
                <th className="py-3 px-4 sm:px-6 font-sans">Asset</th>
                <th className="py-3 px-4 font-sans text-right">Price</th>
                <th className="py-3 px-4 font-sans text-right">24h Change</th>
                <th className="py-3 px-4 font-sans text-right">Available</th>
                <th className="py-3 px-4 font-sans text-right">In Orders</th>
                <th className="py-3 px-4 font-sans text-right">Total Balance</th>
                <th className="py-3 px-4 font-sans text-right">Valuation (USD)</th>
                <th className="py-3 px-4 sm:px-6 font-sans text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cp-border/40">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-cp-text-muted font-sans">
                    No assets found matching your search.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => {
                  const isPos = asset.change24h >= 0
                  return (
                    <tr
                      key={asset.id}
                      className="hover:bg-cp-elevated/40 transition-colors group"
                    >
                      {/* Asset Symbol & Name */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-cp-bg shrink-0 shadow-sm"
                            style={{ backgroundColor: asset.iconBg || asset.color || '#F0B93A' }}
                          >
                            {asset.symbol.slice(0, 3)}
                          </div>
                          <div>
                            <span className="font-bold text-cp-text-primary block font-sans">
                              {asset.name}
                            </span>
                            <span className="text-[10px] text-cp-text-muted font-mono">
                              {asset.symbol} • {asset.network}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Price USD */}
                      <td className="py-3.5 px-4 text-right text-cp-text-primary">
                        {formatCurrency(asset.priceUsd)}
                      </td>

                      {/* 24h Change */}
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={cn(
                            'inline-flex items-center gap-0.5 font-bold',
                            isPos ? 'text-cp-positive' : 'text-cp-negative'
                          )}
                        >
                          {isPos ? '+' : ''}
                          {asset.change24h.toFixed(2)}%
                        </span>
                      </td>

                      {/* Available Balance */}
                      <td className="py-3.5 px-4 text-right text-cp-positive font-bold">
                        {maskValue(formatCrypto(asset.availableBalance, asset.symbol))}
                      </td>

                      {/* Locked Balance */}
                      <td className="py-3.5 px-4 text-right text-cp-text-muted">
                        {maskValue(formatCrypto(asset.lockedBalance, asset.symbol))}
                      </td>

                      {/* Total Balance */}
                      <td className="py-3.5 px-4 text-right font-bold text-cp-text-primary">
                        {maskValue(formatCrypto(asset.totalBalance, asset.symbol))}
                      </td>

                      {/* Valuation USD */}
                      <td className="py-3.5 px-4 text-right font-bold text-cp-gold">
                        {maskValue(formatCurrency(asset.valueUsd))}
                      </td>

                      {/* Quick Action Links */}
                      <td className="py-3.5 px-4 sm:px-6 text-right font-sans">
                        <div className="flex items-center justify-end gap-2 text-xs">
                          <Link
                            to={`/trade?pair=${asset.symbol}-USDT`}
                            className="text-cp-gold hover:underline font-semibold"
                          >
                            Trade
                          </Link>
                          <span className="text-cp-border">|</span>
                          <Link
                            to={`/deposit?coin=${asset.symbol}`}
                            className="text-cp-text-muted hover:text-cp-text-primary transition-colors"
                          >
                            Deposit
                          </Link>
                          <span className="text-cp-border">|</span>
                          <Link
                            to={`/withdraw?coin=${asset.symbol}`}
                            className="text-cp-text-muted hover:text-cp-text-primary transition-colors"
                          >
                            Withdraw
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info strip */}
        <div className="p-4 bg-cp-elevated/40 border-t border-cp-border text-xs text-cp-text-muted flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Displaying {filteredAssets.length} of {assets.length} custody assets synced from MySQL database
          </span>
          <Link to="/orders" className="text-cp-gold hover:underline font-semibold">
            View All Spot Orders & Fills →
          </Link>
        </div>
      </Card>
    </div>
  )
}

export default Assets
