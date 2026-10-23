import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Star,
  Search,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Info,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  X,
  Layers,
  BarChart2,
  ExternalLink,
} from 'lucide-react'
import { Card, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Typography } from '@/components/common/Typography'
import { MarketItem, mockMarketItems } from '@/mock/marketsPageData'
import { formatCurrency, formatPercentage } from '@/utils/formatters'
import { MarketSparkline } from '@/components/markets/MarketSparkline'
import { AddAssetModal } from '@/components/watchlist/AddAssetModal'

type FilterCategory = 'all' | 'gainers' | 'losers' | 'high_volume'

export const Watchlist: React.FC = () => {
  // Watchlist persisted state (synced with Markets page storage key)
  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cp_markets_watchlist')
      return saved ? JSON.parse(saved) : ['bitcoin', 'ethereum', 'solana', 'ripple']
    } catch {
      return ['bitcoin', 'ethereum', 'solana', 'ripple']
    }
  })

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all')

  // Modals & Feedback
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Persist to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem('cp_markets_watchlist', JSON.stringify(watchlistIds))
    } catch {
      // ignore
    }
  }, [watchlistIds])

  // Trigger feedback toast helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Add Asset Handler
  const handleAddAsset = (asset: MarketItem) => {
    if (watchlistIds.includes(asset.id)) return
    setWatchlistIds((prev) => [...prev, asset.id])
    triggerToast(`Added ${asset.name} (${asset.symbol}) to your watchlist.`)
  }

  // Remove Asset Handler
  const handleRemoveAsset = (id: string, assetName: string, symbol: string) => {
    setWatchlistIds((prev) => prev.filter((item) => item !== id))
    triggerToast(`Removed ${assetName} (${symbol}) from your watchlist.`)
  }

  // Quick Suggested Pin
  const handleQuickAdd = (coinId: string) => {
    const coin = mockMarketItems.find((c) => c.id === coinId)
    if (coin) handleAddAsset(coin)
  }

  // Get full MarketItem objects for watched IDs
  const watchedAssets = useMemo(() => {
    return mockMarketItems.filter((item) => watchlistIds.includes(item.id))
  }, [watchlistIds])

  // Filtered Watched Assets by search and category
  const filteredAssets = useMemo(() => {
    let result = [...watchedAssets]

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (asset) =>
          asset.name.toLowerCase().includes(q) ||
          asset.symbol.toLowerCase().includes(q) ||
          asset.pair.toLowerCase().includes(q)
      )
    }

    // Category filter
    if (activeCategory === 'gainers') {
      result = result.filter((a) => a.change24h > 0)
    } else if (activeCategory === 'losers') {
      result = result.filter((a) => a.change24h < 0)
    } else if (activeCategory === 'high_volume') {
      result = result.filter((a) => a.volume24hUsd >= 5_000_000_000)
    }

    return result
  }, [watchedAssets, searchQuery, activeCategory])

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    if (watchedAssets.length === 0) {
      return {
        count: 0,
        avgChange: 0,
        topGainer: null,
        totalVolume: 0,
      }
    }

    const totalChange = watchedAssets.reduce((acc, curr) => acc + curr.change24h, 0)
    const avgChange = totalChange / watchedAssets.length
    const totalVolume = watchedAssets.reduce((acc, curr) => acc + curr.volume24hUsd, 0)

    const topGainer = [...watchedAssets].sort((a, b) => b.change24h - a.change24h)[0]

    return {
      count: watchedAssets.length,
      avgChange,
      topGainer: topGainer && topGainer.change24h > 0 ? topGainer : null,
      totalVolume,
    }
  }, [watchedAssets])

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-cp-elevated border border-cp-gold text-cp-text-primary shadow-2xl animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-cp-gold shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cp-text-primary">
              My Watchlist
            </h1>
            <Badge variant="gold" size="sm" withDot>
              {watchlistIds.length} Pinned
            </Badge>
          </div>
          <p className="text-sm text-cp-text-secondary">
            Review and monitor your saved cryptocurrencies and trading pairs.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Asset
          </Button>
          <Link to="/markets">
            <Button variant="secondary" size="sm">
              Live Markets
            </Button>
          </Link>
        </div>
      </div>

      {/* Demonstration Notice */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-cp-card/90 border border-cp-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cp-gold/10 border border-cp-gold/30 flex items-center justify-center text-cp-gold shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div className="text-xs text-cp-text-secondary">
            <span className="font-semibold text-cp-text-primary">Demonstration Data:</span> All
            prices, volume metrics, and sparklines represent illustrative market data. CoinPlus
            does not execute live trades or connect to public exchange APIs in this demo.
          </div>
        </div>
        <div className="text-xs font-mono text-cp-gold shrink-0 self-end sm:self-auto bg-cp-elevated px-2.5 py-1 rounded-md border border-cp-border">
          Storage: Local Browser
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Watched Assets */}
        <Card className="p-4 bg-cp-card border-cp-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-cp-text-secondary font-medium">Watched Pairs</span>
            <Star className="w-4 h-4 fill-cp-gold text-cp-gold" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cp-text-primary">
            {summaryMetrics.count} <span className="text-xs font-normal text-cp-text-secondary">Coins</span>
          </div>
          <div className="text-[11px] text-cp-text-secondary mt-1">
            {mockMarketItems.length - summaryMetrics.count} more available in Markets
          </div>
        </Card>

        {/* Avg 24h Movement */}
        <Card className="p-4 bg-cp-card border-cp-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-cp-text-secondary font-medium">Avg 24h Movement</span>
            {summaryMetrics.avgChange >= 0 ? (
              <TrendingUp className="w-4 h-4 text-cp-positive" />
            ) : (
              <TrendingDown className="w-4 h-4 text-cp-negative" />
            )}
          </div>
          <div
            className={`text-xl sm:text-2xl font-bold font-mono ${
              summaryMetrics.avgChange >= 0 ? 'text-cp-positive' : 'text-cp-negative'
            }`}
          >
            {summaryMetrics.count > 0 ? formatPercentage(summaryMetrics.avgChange) : '0.00%'}
          </div>
          <div className="text-[11px] text-cp-text-secondary mt-1">
            Weighted portfolio average
          </div>
        </Card>

        {/* Top Performer */}
        <Card className="p-4 bg-cp-card border-cp-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-cp-text-secondary font-medium">Top Performer</span>
            <Sparkles className="w-4 h-4 text-cp-gold" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cp-text-primary">
            {summaryMetrics.topGainer ? summaryMetrics.topGainer.symbol : '--'}
          </div>
          <div className="text-[11px] text-cp-positive font-mono mt-1">
            {summaryMetrics.topGainer
              ? `${formatPercentage(summaryMetrics.topGainer.change24h)} (24h)`
              : 'No positive mover'}
          </div>
        </Card>

        {/* Watched 24h Volume */}
        <Card className="p-4 bg-cp-card border-cp-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-cp-text-secondary font-medium">Watchlist Volume</span>
            <BarChart2 className="w-4 h-4 text-cp-text-secondary" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cp-gold">
            {formatCurrency(summaryMetrics.totalVolume, 'USD', true)}
          </div>
          <div className="text-[11px] text-cp-text-secondary mt-1">
            Simulated 24h turnover
          </div>
        </Card>
      </div>

      {/* Main Watchlist Container */}
      <Card className="border-cp-border bg-cp-card overflow-hidden">
        {/* Controls Bar: Search & Category Filter */}
        <div className="p-4 border-b border-cp-border bg-cp-elevated/40 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cp-text-secondary" />
            <input
              type="text"
              placeholder="Search watchlist by coin name, ticker, or pair..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cp-card border border-cp-border rounded-lg pl-9 pr-8 py-2 text-xs text-cp-text-primary placeholder:text-cp-text-secondary/60 focus:outline-none focus:border-cp-gold transition-colors"
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

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === 'all'
                  ? 'bg-cp-gold text-cp-bg'
                  : 'bg-cp-card text-cp-text-secondary hover:text-cp-text-primary border border-cp-border'
              }`}
            >
              All ({watchedAssets.length})
            </button>
            <button
              onClick={() => setActiveCategory('gainers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === 'gainers'
                  ? 'bg-cp-positive text-cp-bg'
                  : 'bg-cp-card text-cp-text-secondary hover:text-cp-positive border border-cp-border'
              }`}
            >
              Gainers
            </button>
            <button
              onClick={() => setActiveCategory('losers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === 'losers'
                  ? 'bg-cp-negative text-cp-bg'
                  : 'bg-cp-card text-cp-text-secondary hover:text-cp-negative border border-cp-border'
              }`}
            >
              Losers
            </button>
            <button
              onClick={() => setActiveCategory('high_volume')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === 'high_volume'
                  ? 'bg-cp-elevated text-cp-gold border border-cp-gold'
                  : 'bg-cp-card text-cp-text-secondary hover:text-cp-gold border border-cp-border'
              }`}
            >
              High Volume (&gt;$5B)
            </button>
          </div>
        </div>

        {/* Content Body */}
        {watchedAssets.length === 0 ? (
          /* Empty Watchlist State */
          <div className="py-16 px-4 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-cp-elevated border border-cp-border flex items-center justify-center mx-auto text-cp-gold shadow-lg">
              <Star className="w-7 h-7 stroke-cp-gold stroke-[1.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-cp-text-primary">Your Watchlist is Empty</h3>
              <p className="text-xs text-cp-text-secondary max-w-md mx-auto mt-1">
                You have not pinned any cryptocurrency pairs yet. Pin your favorite assets to monitor
                real-time trends, high/low price swings, and trade quickly.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Your First Asset
              </Button>
              <Link to="/markets">
                <Button variant="secondary" size="sm">
                  Browse Live Markets
                </Button>
              </Link>
            </div>

            {/* Quick Suggestions */}
            <div className="pt-6 border-t border-cp-border/50 max-w-sm mx-auto">
              <span className="text-[11px] text-cp-text-secondary block mb-2">
                Quickly Pin Popular Assets:
              </span>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handleQuickAdd('bitcoin')}
                  className="px-2.5 py-1 rounded-md bg-cp-elevated hover:border-cp-gold border border-cp-border text-xs text-cp-text-primary font-mono transition-colors"
                >
                  + BTC
                </button>
                <button
                  onClick={() => handleQuickAdd('ethereum')}
                  className="px-2.5 py-1 rounded-md bg-cp-elevated hover:border-cp-gold border border-cp-border text-xs text-cp-text-primary font-mono transition-colors"
                >
                  + ETH
                </button>
                <button
                  onClick={() => handleQuickAdd('solana')}
                  className="px-2.5 py-1 rounded-md bg-cp-elevated hover:border-cp-gold border border-cp-border text-xs text-cp-text-primary font-mono transition-colors"
                >
                  + SOL
                </button>
                <button
                  onClick={() => handleQuickAdd('ripple')}
                  className="px-2.5 py-1 rounded-md bg-cp-elevated hover:border-cp-gold border border-cp-border text-xs text-cp-text-primary font-mono transition-colors"
                >
                  + XRP
                </button>
              </div>
            </div>
          </div>
        ) : filteredAssets.length === 0 ? (
          /* Empty Search / Filter Match */
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-cp-elevated border border-cp-border flex items-center justify-center mx-auto text-cp-text-secondary">
              <Search className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-cp-text-primary">No Matching Watched Assets</h4>
            <p className="text-xs text-cp-text-secondary max-w-sm mx-auto">
              No assets in your watchlist match &quot;{searchQuery}&quot; under the selected filter.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('all')
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div>
            {/* Desktop Table View (Hidden on mobile) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-cp-elevated/60 text-cp-text-secondary uppercase text-[11px] font-semibold border-b border-cp-border">
                  <tr>
                    <th className="py-3 px-4 w-10 text-center">Pin</th>
                    <th className="py-3 px-4">Asset</th>
                    <th className="py-3 px-4">Price (USD)</th>
                    <th className="py-3 px-4">24h Change</th>
                    <th className="py-3 px-4">24h High / Low</th>
                    <th className="py-3 px-4">24h Volume</th>
                    <th className="py-3 px-4">7d Trend</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cp-border/50">
                  {filteredAssets.map((asset) => {
                    const isPos = asset.change24h >= 0

                    return (
                      <tr
                        key={asset.id}
                        className="hover:bg-cp-elevated/40 transition-colors group"
                      >
                        {/* Star / Unpin Toggle */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveAsset(asset.id, asset.name, asset.symbol)
                            }
                            className="p-1 text-cp-gold hover:text-cp-negative transition-colors"
                            title="Remove from watchlist"
                          >
                            <Star className="w-4 h-4 fill-cp-gold" />
                          </button>
                        </td>

                        {/* Asset Info */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-cp-elevated border border-cp-border flex items-center justify-center font-bold text-xs text-cp-gold">
                              {asset.symbol.slice(0, 3)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-cp-text-primary group-hover:text-cp-gold transition-colors">
                                  {asset.name}
                                </span>
                                <Badge variant="neutral" size="sm" className="text-[10px] px-1 py-0">
                                  {asset.symbol}
                                </Badge>
                              </div>
                              <span className="text-[11px] font-mono text-cp-text-secondary uppercase">
                                {asset.pair}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4 font-mono font-bold text-cp-text-primary">
                          {formatCurrency(asset.priceUsd)}
                        </td>

                        {/* 24h Change */}
                        <td className="py-3.5 px-4">
                          <div
                            className={`flex items-center font-mono font-bold text-xs ${
                              isPos ? 'text-cp-positive' : 'text-cp-negative'
                            }`}
                          >
                            {isPos ? (
                              <TrendingUp className="w-3.5 h-3.5 mr-1" />
                            ) : (
                              <TrendingDown className="w-3.5 h-3.5 mr-1" />
                            )}
                            {formatPercentage(asset.change24h)}
                          </div>
                        </td>

                        {/* 24h High / Low */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-cp-text-secondary">
                          <div>High: {formatCurrency(asset.high24h)}</div>
                          <div>Low: {formatCurrency(asset.low24h)}</div>
                        </td>

                        {/* 24h Volume */}
                        <td className="py-3.5 px-4 font-mono text-cp-text-secondary">
                          {formatCurrency(asset.volume24hUsd, 'USD', true)}
                        </td>

                        {/* Sparkline */}
                        <td className="py-3.5 px-4">
                          <MarketSparkline data={asset.sparkline} isPositive={isPos} />
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/trade?pair=${encodeURIComponent(asset.pair)}`}>
                              <Button
                                variant="primary"
                                size="sm"
                                className="h-7 text-xs px-3"
                              >
                                Trade
                              </Button>
                            </Link>
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveAsset(asset.id, asset.name, asset.symbol)
                              }
                              className="p-1.5 rounded-lg text-cp-text-secondary hover:text-cp-negative hover:bg-cp-card transition-colors"
                              title="Remove from watchlist"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (Visible on mobile screens) */}
            <div className="block md:hidden divide-y divide-cp-border/50">
              {filteredAssets.map((asset) => {
                const isPos = asset.change24h >= 0

                return (
                  <div key={asset.id} className="p-4 space-y-3 bg-cp-card">
                    {/* Header: Asset & Pin */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-cp-elevated border border-cp-border flex items-center justify-center font-bold text-xs text-cp-gold">
                          {asset.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-cp-text-primary">
                              {asset.name}
                            </span>
                            <span className="text-xs font-mono text-cp-text-secondary">
                              {asset.symbol}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-cp-text-secondary uppercase">
                            {asset.pair}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveAsset(asset.id, asset.name, asset.symbol)
                        }
                        className="p-1.5 rounded-lg text-cp-gold hover:text-cp-negative transition-colors"
                        title="Remove from watchlist"
                      >
                        <Star className="w-4 h-4 fill-cp-gold" />
                      </button>
                    </div>

                    {/* Middle: Price, 24h Change, & Sparkline */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-mono text-base font-bold text-cp-text-primary">
                          {formatCurrency(asset.priceUsd)}
                        </div>
                        <div
                          className={`flex items-center font-mono font-semibold text-xs mt-0.5 ${
                            isPos ? 'text-cp-positive' : 'text-cp-negative'
                          }`}
                        >
                          {isPos ? (
                            <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                          ) : (
                            <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                          )}
                          {formatPercentage(asset.change24h)}
                        </div>
                      </div>

                      <div className="shrink-0">
                        <MarketSparkline
                          data={asset.sparkline}
                          isPositive={isPos}
                          width={80}
                          height={28}
                        />
                      </div>
                    </div>

                    {/* Bottom: 24h Volume & Trade Action */}
                    <div className="flex items-center justify-between pt-2 border-t border-cp-border/40 text-xs">
                      <span className="text-cp-text-secondary font-mono">
                        Vol: {formatCurrency(asset.volume24hUsd, 'USD', true)}
                      </span>

                      <div className="flex items-center gap-2">
                        <Link to={`/trade?pair=${encodeURIComponent(asset.pair)}`}>
                          <Button variant="primary" size="sm" className="h-7 text-xs px-3">
                            Trade
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="p-4 border-t border-cp-border bg-cp-card/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-cp-text-secondary">
          <span>
            Displaying <strong className="text-cp-text-primary">{filteredAssets.length}</strong> of{' '}
            <strong className="text-cp-text-primary">{watchlistIds.length}</strong> pinned pairs
          </span>
          <Link
            to="/markets"
            className="flex items-center gap-1 text-cp-gold hover:underline font-semibold"
          >
            <span>Explore All {mockMarketItems.length} Markets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </Card>

      {/* Add Asset Modal */}
      <AddAssetModal
        isOpen={isAddModalOpen}
        currentWatchlistIds={watchlistIds}
        onAdd={handleAddAsset}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  )
}

export default Watchlist
