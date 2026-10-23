import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Star,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  Flame,
  Layers,
  Sparkles,
  BarChart3,
  ExternalLink,
  ChevronRight,
  Info,
  RefreshCw,
  Coins,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Typography } from '@/components/common/Typography'
import {
  mockMarketItems,
  mockMarketSummaryStats,
  MarketItem,
} from '@/mock/marketsPageData'
import { formatCurrency, formatPercentage } from '@/utils/formatters'
import { MarketSparkline } from '@/components/markets/MarketSparkline'

type TabType = 'all' | 'spot' | 'gainers' | 'losers' | 'watchlist'
type SortField = 'price' | 'change' | 'volume' | 'marketCap'
type SortDirection = 'asc' | 'desc' | null

export const Markets: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Persistent Watchlist state
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cp_markets_watchlist')
      return saved ? JSON.parse(saved) : ['bitcoin', 'ethereum', 'solana', 'ripple']
    } catch {
      return ['bitcoin', 'ethereum', 'solana', 'ripple']
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('cp_markets_watchlist', JSON.stringify(watchlist))
    } catch {
      // ignore
    }
  }, [watchlist])

  const toggleWatchlist = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setWatchlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 600)
  }

  // Handle column sort toggle
  const handleSort = (field: SortField) => {
    if (sortField !== field) {
      setSortField(field)
      setSortDirection('desc')
    } else if (sortDirection === 'desc') {
      setSortDirection('asc')
    } else {
      setSortField(null)
      setSortDirection(null)
    }
  }

  // Filter & sort markets list
  const processedMarkets = useMemo(() => {
    let result = [...mockMarketItems]

    // 1. Filter by Tab
    if (activeTab === 'spot') {
      result = result.filter((m) => m.category === 'spot')
    } else if (activeTab === 'gainers') {
      result = result.filter((m) => m.change24h > 0).sort((a, b) => b.change24h - a.change24h)
    } else if (activeTab === 'losers') {
      result = result.filter((m) => m.change24h < 0).sort((a, b) => a.change24h - b.change24h)
    } else if (activeTab === 'watchlist') {
      result = result.filter((m) => watchlist.includes(m.id))
    }

    // 2. Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.symbol.toLowerCase().includes(q) ||
          m.pair.toLowerCase().includes(q)
      )
    }

    // 3. Apply Column Sorting (if user clicked a column header)
    if (sortField && sortDirection) {
      result.sort((a, b) => {
        let valA = 0
        let valB = 0

        if (sortField === 'price') {
          valA = a.priceUsd
          valB = b.priceUsd
        } else if (sortField === 'change') {
          valA = a.change24h
          valB = b.change24h
        } else if (sortField === 'volume') {
          valA = a.volume24hUsd
          valB = b.volume24hUsd
        } else if (sortField === 'marketCap') {
          valA = a.marketCapUsd
          valB = b.marketCapUsd
        }

        return sortDirection === 'asc' ? valA - valB : valB - valA
      })
    }

    return result
  }, [activeTab, searchQuery, sortField, sortDirection, watchlist])

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-cp-text-muted/50 group-hover:text-cp-text-secondary" />
    }
    if (sortDirection === 'asc') {
      return <ArrowUp className="w-3.5 h-3.5 text-cp-gold font-bold" />
    }
    return <ArrowDown className="w-3.5 h-3.5 text-cp-gold font-bold" />
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Demonstration Notice */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 rounded-xl bg-cp-elevated border border-cp-gold/30 text-xs shadow-sm">
        <div className="flex items-center gap-2.5">
          <Badge variant="gold" size="sm" withDot pulseDot className="shrink-0">
            ILLUSTRATIVE DATA
          </Badge>
          <span className="text-cp-text-secondary leading-relaxed">
            Market prices, changes, and volume data displayed on this page are simulated demonstration quotes for platform evaluation. Not live prices.
          </span>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-cp-text-muted hover:text-cp-gold hover:bg-cp-card transition-colors disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={cn('w-3.5 h-3.5', isRefreshing && 'animate-spin text-cp-gold')} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh Quotes'}</span>
        </button>
      </div>

      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-cp-text-muted mb-1.5">
            <Link to="/dashboard" className="hover:text-cp-gold transition-colors">CoinPlus</Link>
            <ChevronRight className="w-3.5 h-3.5 text-cp-border-light" />
            <span className="text-cp-gold font-medium">Markets</span>
          </nav>
          <Typography variant="h1" className="text-2xl sm:text-3xl font-extrabold text-cp-text-primary">
            Live Crypto Markets
          </Typography>
          <Typography variant="body-sm" color="secondary" className="mt-1">
            Browse real-time market depth, explore top 24h gainers, and manage your custom watchlist.
          </Typography>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/trade">
            <Button variant="primary" size="md">
              Launch Trade Engine
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. Market Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Metric 1: Total Market Cap */}
        <Card variant="default" padding="sm" className="space-y-1">
          <span className="text-[11px] font-semibold text-cp-text-muted uppercase tracking-wider block">
            Total Market Cap
          </span>
          <div className="font-mono text-base sm:text-lg font-bold text-cp-text-primary">
            ${(mockMarketSummaryStats.totalMarketCap / 1_000_000_000_000).toFixed(2)}T
          </div>
          <span className="inline-flex items-center text-xs font-mono font-semibold text-cp-positive">
            +{mockMarketSummaryStats.marketCapChange24h}%
          </span>
        </Card>

        {/* Metric 2: 24h Volume */}
        <Card variant="default" padding="sm" className="space-y-1">
          <span className="text-[11px] font-semibold text-cp-text-muted uppercase tracking-wider block">
            24h Trading Vol
          </span>
          <div className="font-mono text-base sm:text-lg font-bold text-cp-text-primary">
            ${(mockMarketSummaryStats.totalVolume24h / 1_000_000_000).toFixed(2)}B
          </div>
          <span className="inline-flex items-center text-xs font-mono font-semibold text-cp-positive">
            +{mockMarketSummaryStats.volumeChange24h}%
          </span>
        </Card>

        {/* Metric 3: BTC Dominance */}
        <Card variant="default" padding="sm" className="space-y-1">
          <span className="text-[11px] font-semibold text-cp-text-muted uppercase tracking-wider block">
            BTC Dominance
          </span>
          <div className="font-mono text-base sm:text-lg font-bold text-cp-gold">
            {mockMarketSummaryStats.btcDominance}%
          </div>
          <span className="inline-flex items-center text-xs font-mono font-semibold text-cp-positive">
            +{mockMarketSummaryStats.btcDominanceChange}%
          </span>
        </Card>

        {/* Metric 4: Gas Tracker */}
        <Card variant="default" padding="sm" className="space-y-1">
          <span className="text-[11px] font-semibold text-cp-text-muted uppercase tracking-wider block">
            ETH Gas Tracker
          </span>
          <div className="font-mono text-base sm:text-lg font-bold text-cp-positive">
            {mockMarketSummaryStats.ethGasGwei} Gwei
          </div>
          <span className="text-[11px] text-cp-text-muted">Instant execution</span>
        </Card>

        {/* Metric 5: Top 24h Gainer */}
        <Card variant="gold" padding="sm" className="space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-cp-gold uppercase tracking-wider block">
            Top Gainer
          </span>
          <div className="font-mono text-base sm:text-lg font-bold text-cp-text-primary">
            {mockMarketSummaryStats.topGainerSymbol}
          </div>
          <span className="inline-flex items-center text-xs font-mono font-bold text-cp-positive">
            +{mockMarketSummaryStats.topGainerPercentage}%
          </span>
        </Card>
      </div>

      {/* 2. Main Market Explorer Card */}
      <Card variant="default" padding="none" className="overflow-hidden">
        {/* Controls Bar: Tabs + Search */}
        <div className="p-4 sm:p-5 border-b border-cp-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-cp-card">
          {/* Tabs: All, Spot, Gainers, Losers, Watchlist */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap',
                activeTab === 'all'
                  ? 'bg-cp-gold text-cp-bg shadow-sm'
                  : 'text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-elevated'
              )}
            >
              All ({mockMarketItems.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('spot')}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap',
                activeTab === 'spot'
                  ? 'bg-cp-gold text-cp-bg shadow-sm'
                  : 'text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-elevated'
              )}
            >
              Spot Pairs
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('gainers')}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1',
                activeTab === 'gainers'
                  ? 'bg-cp-positive text-cp-bg shadow-sm'
                  : 'text-cp-text-secondary hover:text-cp-positive hover:bg-cp-elevated'
              )}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Gainers</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('losers')}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1',
                activeTab === 'losers'
                  ? 'bg-cp-negative text-cp-text-primary shadow-sm'
                  : 'text-cp-text-secondary hover:text-cp-negative hover:bg-cp-elevated'
              )}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Losers</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('watchlist')}
              className={cn(
                'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5',
                activeTab === 'watchlist'
                  ? 'bg-cp-gold/20 text-cp-gold border border-cp-gold/40'
                  : 'text-cp-text-secondary hover:text-cp-gold hover:bg-cp-elevated'
              )}
            >
              <Star className={cn('w-3.5 h-3.5', watchlist.length > 0 && 'fill-cp-gold text-cp-gold')} />
              <span>Watchlist</span>
              <Badge variant="gold" size="sm" className="px-1.5 py-0 text-[10px]">
                {watchlist.length}
              </Badge>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-cp-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search coin (BTC, ETH, SOL, XRP)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cp-elevated border border-cp-border rounded-xl pl-9 pr-8 py-2 text-xs text-cp-text-primary placeholder:text-cp-text-muted focus:outline-none focus:border-cp-gold focus:ring-1 focus:ring-cp-gold/40 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cp-text-muted hover:text-cp-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 3. Desktop / Tablet Market Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-cp-border bg-cp-elevated/40 text-cp-text-muted text-[11px] font-semibold uppercase tracking-wider select-none">
                <th className="py-3.5 px-4 w-12 text-center">Fav</th>
                <th className="py-3.5 px-4">Asset / Pair</th>
                <th
                  onClick={() => handleSort('price')}
                  className="py-3.5 px-4 cursor-pointer hover:text-cp-text-primary transition-colors group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Price</span>
                    {renderSortIndicator('price')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('change')}
                  className="py-3.5 px-4 cursor-pointer hover:text-cp-text-primary transition-colors group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>24h Change</span>
                    {renderSortIndicator('change')}
                  </div>
                </th>
                <th className="py-3.5 px-4">24h High / Low</th>
                <th
                  onClick={() => handleSort('volume')}
                  className="py-3.5 px-4 cursor-pointer hover:text-cp-text-primary transition-colors group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>24h Volume</span>
                    {renderSortIndicator('volume')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('marketCap')}
                  className="py-3.5 px-4 cursor-pointer hover:text-cp-text-primary transition-colors group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Market Cap</span>
                    {renderSortIndicator('marketCap')}
                  </div>
                </th>
                <th className="py-3.5 px-4">7D Trend</th>
                <th className="py-3.5 px-4 text-right">Trade</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-cp-border/60 font-mono">
              {processedMarkets.length === 0 ? (
                /* Empty Search / Filter State */
                <tr>
                  <td colSpan={9} className="py-16 text-center text-cp-text-muted font-sans">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-cp-elevated text-cp-gold mx-auto flex items-center justify-center">
                        <Search className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-bold text-cp-text-primary">
                        No markets found
                      </h4>
                      <p className="text-xs text-cp-text-muted">
                        {searchQuery
                          ? `No trading pairs match "${searchQuery}". Check your spelling or try another asset symbol like BTC, ETH, or SOL.`
                          : activeTab === 'watchlist'
                          ? 'Your watchlist is currently empty. Click the star icon next to any coin to pin it here.'
                          : 'No markets available in this category.'}
                      </p>
                      {(searchQuery || activeTab !== 'all') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSearchQuery('')
                            setActiveTab('all')
                          }}
                        >
                          Clear Filters & Search
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                processedMarkets.map((asset) => {
                  const isFav = watchlist.includes(asset.id)
                  const isPos = asset.change24h >= 0

                  return (
                    <tr
                      key={asset.id}
                      className="hover:bg-cp-elevated/40 transition-colors group cursor-pointer"
                    >
                      {/* Star Watchlist Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={(e) => toggleWatchlist(asset.id, e)}
                          className="p-1 text-cp-text-muted hover:text-cp-gold transition-colors"
                          title={isFav ? 'Remove from watchlist' : 'Add to watchlist'}
                          aria-label={`Toggle watchlist for ${asset.name}`}
                        >
                          <Star
                            className={cn(
                              'w-4 h-4 transition-transform duration-150 active:scale-125',
                              isFav ? 'fill-cp-gold text-cp-gold' : 'hover:fill-cp-gold/20'
                            )}
                          />
                        </button>
                      </td>

                      {/* Coin Icon, Name & Ticker */}
                      <td className="py-3.5 px-4 font-sans">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-cp-elevated border border-cp-border flex items-center justify-center font-mono font-bold text-xs text-cp-gold shadow-sm shrink-0">
                            {asset.symbol}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-sm text-cp-text-primary">
                                {asset.pair}
                              </span>
                              {asset.symbol === 'BTC' && (
                                <Badge variant="gold" size="sm" className="text-[9px] py-0">
                                  #1
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-cp-text-muted block">
                              {asset.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Last Price */}
                      <td className="py-3.5 px-4 font-semibold text-cp-text-primary text-sm">
                        {formatCurrency(asset.priceUsd)}
                      </td>

                      {/* 24h Change */}
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={isPos ? 'positive' : 'negative'}
                          size="sm"
                          className="font-mono font-bold"
                        >
                          {isPos ? '+' : ''}
                          {asset.change24h.toFixed(2)}%
                        </Badge>
                      </td>

                      {/* 24h High / Low */}
                      <td className="py-3.5 px-4 text-xs text-cp-text-secondary">
                        <div className="text-cp-text-primary">
                          H: {formatCurrency(asset.high24h)}
                        </div>
                        <div className="text-cp-text-muted text-[11px]">
                          L: {formatCurrency(asset.low24h)}
                        </div>
                      </td>

                      {/* 24h Volume */}
                      <td className="py-3.5 px-4 text-cp-text-primary font-medium">
                        ${(asset.volume24hUsd / 1_000_000_000).toFixed(2)}B
                      </td>

                      {/* Market Cap */}
                      <td className="py-3.5 px-4 text-cp-text-secondary">
                        ${(asset.marketCapUsd / 1_000_000_000).toFixed(2)}B
                      </td>

                      {/* Sparkline */}
                      <td className="py-3.5 px-4">
                        <MarketSparkline data={asset.sparkline} isPositive={isPos} />
                      </td>

                      {/* Action Trade Button */}
                      <td className="py-3.5 px-4 text-right">
                        <Link to="/trade">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs py-1 px-3 group-hover:border-cp-gold group-hover:text-cp-gold"
                          >
                            Trade
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Mobile Stacked Market Cards (Screens < 768px) */}
        <div className="md:hidden divide-y divide-cp-border/60">
          {processedMarkets.length === 0 ? (
            /* Mobile Empty State */
            <div className="py-12 px-4 text-center space-y-3">
              <Search className="w-8 h-8 text-cp-text-muted mx-auto" />
              <h4 className="text-sm font-bold text-cp-text-primary">No markets found</h4>
              <p className="text-xs text-cp-text-muted">
                {searchQuery
                  ? `No results for "${searchQuery}".`
                  : 'No markets matching the selected tab.'}
              </p>
              {(searchQuery || activeTab !== 'all') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('')
                    setActiveTab('all')
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            processedMarkets.map((asset) => {
              const isFav = watchlist.includes(asset.id)
              const isPos = asset.change24h >= 0

              return (
                <div
                  key={asset.id}
                  className="p-4 hover:bg-cp-elevated/30 active:bg-cp-elevated/60 transition-colors space-y-3"
                >
                  {/* Top row: Star, Coin, Price, 24h Change */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={(e) => toggleWatchlist(asset.id, e)}
                        className="p-1 text-cp-text-muted"
                        aria-label="Toggle watchlist"
                      >
                        <Star
                          className={cn(
                            'w-4 h-4',
                            isFav ? 'fill-cp-gold text-cp-gold' : 'text-cp-text-muted'
                          )}
                        />
                      </button>

                      <div className="w-8 h-8 rounded-full bg-cp-elevated border border-cp-border flex items-center justify-center font-mono font-bold text-xs text-cp-gold">
                        {asset.symbol}
                      </div>

                      <div>
                        <span className="font-bold text-sm text-cp-text-primary block font-sans">
                          {asset.pair}
                        </span>
                        <span className="text-xs text-cp-text-muted block font-sans">
                          {asset.name}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-sm font-bold text-cp-text-primary block">
                        {formatCurrency(asset.priceUsd)}
                      </span>
                      <Badge
                        variant={isPos ? 'positive' : 'negative'}
                        size="sm"
                        className="font-mono mt-0.5"
                      >
                        {isPos ? '+' : ''}
                        {asset.change24h.toFixed(2)}%
                      </Badge>
                    </div>
                  </div>

                  {/* Bottom row: Volume, Market Cap & Trade Link */}
                  <div className="flex items-center justify-between pt-2 border-t border-cp-border/40 text-xs font-mono">
                    <div className="flex items-center gap-3 text-cp-text-muted">
                      <div>
                        <span>Vol: </span>
                        <span className="text-cp-text-primary font-semibold">
                          ${(asset.volume24hUsd / 1_000_000_000).toFixed(1)}B
                        </span>
                      </div>
                      <div>
                        <span>Cap: </span>
                        <span className="text-cp-text-primary font-semibold">
                          ${(asset.marketCapUsd / 1_000_000_000).toFixed(1)}B
                        </span>
                      </div>
                    </div>

                    <Link to="/trade">
                      <Button variant="primary" size="sm" className="text-xs py-1 px-3">
                        Trade
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer Statistics Banner */}
        <div className="p-4 sm:px-6 bg-cp-elevated/40 border-t border-cp-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cp-text-muted">
          <div>
            Showing <span className="text-cp-text-primary font-bold">{processedMarkets.length}</span> pairs • {watchlist.length} pinned to watchlist
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono">Order Engine Latency: &lt;1ms</span>
            <Link to="/trade" className="text-cp-gold hover:underline font-semibold flex items-center gap-1">
              <span>Open Spot Terminal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Markets
