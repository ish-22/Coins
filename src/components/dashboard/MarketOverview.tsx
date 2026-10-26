import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  TrendingDown,
  Star,
  Search,
  ArrowRight,
  Flame,
  Award,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { Card, CardHeader, CardTitle } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { DashboardMarketAsset } from '@/mock/dashboardData'
import { formatCurrency } from '@/utils/formatters'
import { marketService } from '@/services'

export const MarketOverview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'core' | 'gainers' | 'losers' | 'favorites'>('core')
  const [searchQuery, setSearchQuery] = useState('')
  const [assets, setAssets] = useState<DashboardMarketAsset[]>([])
  const [favorites, setFavorites] = useState<string[]>(['BTC-USDT', 'ETH-USDT', 'SOL-USDT', 'XRP-USDT'])

  const normalizeTicker = (pair: any): DashboardMarketAsset => {
    const symbol = String(pair.symbol || pair.baseAsset || 'BTC')
    const [baseSymbol = 'BTC', quoteSymbol = 'USDT'] = symbol.split('/')
    const price = Number(pair.price ?? 0)
    const change24h = Number(pair.change24h ?? 0)
    const basePrice = Math.max(price, 0.0001)

    return {
      id: String(pair.id || `${baseSymbol}-${quoteSymbol}`),
      symbol: baseSymbol,
      pair: `${baseSymbol}/${quoteSymbol}`,
      name: baseSymbol,
      priceUsd: price,
      change24h,
      high24h: Number(pair.high24h ?? price * 1.02),
      low24h: Number(pair.low24h ?? price * 0.98),
      volume24hUsd: Number(pair.volume24hUsdt ?? 0),
      sparkline: Array.from({ length: 6 }, (_, index) => {
        const variance = ((index - 2.5) * (Math.abs(change24h) || 0.5)) / 10
        return Number((basePrice * (1 + variance / 100)).toFixed(4))
      }),
      category: 'core',
      isFavorite: favorites.includes(String(pair.id || `${baseSymbol}-${quoteSymbol}`)),
    }
  }

  useEffect(() => {
    let isMounted = true

    const loadTickers = async () => {
      try {
        const pairs = await marketService.getTickers()
        if (isMounted) {
          setAssets((pairs ?? []).map(normalizeTicker))
        }
      } catch {
        if (isMounted) setAssets([])
      }
    }

    loadTickers()

    return () => {
      isMounted = false
    }
  }, [])

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const getTabAssets = (): DashboardMarketAsset[] => {
    switch (activeTab) {
      case 'core':
        return assets.filter((m) => ['BTC', 'ETH', 'SOL', 'BNB', 'XRP'].includes(m.symbol))
      case 'gainers':
        return [...assets].sort((a, b) => b.change24h - a.change24h).slice(0, 5)
      case 'losers':
        return [...assets].sort((a, b) => a.change24h - b.change24h).slice(0, 5)
      case 'favorites':
        return assets.filter((m) => favorites.includes(m.id))
      default:
        return assets
    }
  }

  const tabAssets = getTabAssets()
  const filteredAssets = tabAssets.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.pair.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Mini sparkline renderer
  const renderSparkline = (data: number[], isPos: boolean) => {
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    const width = 80
    const height = 28

    const pts = data.map((val, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((val - min) / range) * (height - 6) - 3
      return `${x},${y}`
    })

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={isPos ? '#00D6A0' : '#FF5364'}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={pts.join(' ')}
        />
      </svg>
    )
  }

  return (
    <Card variant="default" padding="none" className="overflow-hidden">
      {/* Header with Title and Search */}
      <div className="p-4 sm:p-6 border-b border-cp-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg sm:text-xl">Market Overview</CardTitle>
            <Badge variant="neutral" size="sm">
              Spot & Perpetual
            </Badge>
          </div>
          <p className="text-xs text-cp-text-muted mt-1">
            Simulated demonstration quotes for major pairs, gainers, losers, and personal favorites.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-cp-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search market..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cp-elevated border border-cp-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-cp-text-primary placeholder:text-cp-text-muted focus:outline-none focus:border-cp-gold"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 sm:px-6 pt-3 border-b border-cp-border flex items-center gap-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('core')}
          className={cn(
            'px-3.5 py-2 text-xs font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5',
            activeTab === 'core'
              ? 'text-cp-gold border-cp-gold bg-cp-card'
              : 'text-cp-text-muted border-transparent hover:text-cp-text-primary'
          )}
        >
          <Award className="w-3.5 h-3.5 text-cp-gold" />
          <span>Core Markets (BTC, ETH, SOL, BNB, XRP)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gainers')}
          className={cn(
            'px-3.5 py-2 text-xs font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5',
            activeTab === 'gainers'
              ? 'text-cp-positive border-cp-positive bg-cp-card'
              : 'text-cp-text-muted border-transparent hover:text-cp-text-primary'
          )}
        >
          <Flame className="w-3.5 h-3.5 text-cp-positive" />
          <span>Top Gainers</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('losers')}
          className={cn(
            'px-3.5 py-2 text-xs font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5',
            activeTab === 'losers'
              ? 'text-cp-negative border-cp-negative bg-cp-card'
              : 'text-cp-text-muted border-transparent hover:text-cp-text-primary'
          )}
        >
          <TrendingDown className="w-3.5 h-3.5 text-cp-negative" />
          <span>Top Losers</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('favorites')}
          className={cn(
            'px-3.5 py-2 text-xs font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5',
            activeTab === 'favorites'
              ? 'text-cp-gold border-cp-gold bg-cp-card'
              : 'text-cp-text-muted border-transparent hover:text-cp-text-primary'
          )}
        >
          <Star className="w-3.5 h-3.5 text-cp-gold" />
          <span>Favourites ({favorites.length})</span>
        </button>
      </div>

      {/* Desktop / Tablet Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-cp-border text-cp-text-muted text-[11px] font-semibold uppercase tracking-wider">
              <th className="py-3 px-4 w-10">Fav</th>
              <th className="py-3 px-4">Market / Asset</th>
              <th className="py-3 px-4">Last Price</th>
              <th className="py-3 px-4">24h Change</th>
              <th className="py-3 px-4">24h High / Low</th>
              <th className="py-3 px-4">24h Volume</th>
              <th className="py-3 px-4">7D Trend</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cp-border/60 font-mono">
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-cp-text-muted font-sans">
                  No markets found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredAssets.map((asset) => {
                const isFav = favorites.includes(asset.id)
                const isPos = asset.change24h >= 0

                return (
                  <tr
                    key={asset.id}
                    className="hover:bg-cp-elevated/60 transition-colors group cursor-pointer"
                  >
                    {/* Star Favorite Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(asset.id, e)}
                        className="p-1 text-cp-text-muted hover:text-cp-gold transition-colors"
                        aria-label="Toggle favorite"
                      >
                        <Star
                          className={cn(
                            'w-4 h-4',
                            isFav ? 'fill-cp-gold text-cp-gold' : 'hover:fill-cp-gold/30'
                          )}
                        />
                      </button>
                    </td>

                    {/* Market Symbol & Name */}
                    <td className="py-3.5 px-4 font-sans">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-cp-elevated border border-cp-border flex items-center justify-center font-mono font-bold text-xs text-cp-gold">
                          {asset.symbol}
                        </div>
                        <div>
                          <span className="font-bold text-cp-text-primary text-sm block">
                            {asset.pair}
                          </span>
                          <span className="text-[11px] text-cp-text-muted block">
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

                    {/* 24h High & Low */}
                    <td className="py-3.5 px-4 text-cp-text-secondary text-[11px]">
                      <div>H: {formatCurrency(asset.high24h)}</div>
                      <div className="text-cp-text-muted">L: {formatCurrency(asset.low24h)}</div>
                    </td>

                    {/* 24h Volume */}
                    <td className="py-3.5 px-4 text-cp-text-secondary">
                      ${(asset.volume24hUsd / 1_000_000_000).toFixed(2)}B
                    </td>

                    {/* Mini Sparkline */}
                    <td className="py-3.5 px-4">
                      {renderSparkline(asset.sparkline, isPos)}
                    </td>

                    {/* Trade Action Link */}
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

      {/* Mobile Stacked Card View */}
      <div className="sm:hidden divide-y divide-cp-border/60">
        {filteredAssets.length === 0 ? (
          <div className="py-10 text-center text-cp-text-muted text-xs">
            No markets in this category.
          </div>
        ) : (
          filteredAssets.map((asset) => {
            const isFav = favorites.includes(asset.id)
            const isPos = asset.change24h >= 0

            return (
              <Link
                key={asset.id}
                to="/trade"
                className="p-4 flex items-center justify-between hover:bg-cp-elevated/40 active:bg-cp-elevated transition-colors"
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(asset.id, e)}
                    className="p-1 text-cp-text-muted"
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
                    <span className="text-sm font-bold text-cp-text-primary block">
                      {asset.pair}
                    </span>
                    <span className="text-xs text-cp-text-muted font-mono block">
                      Vol: ${(asset.volume24hUsd / 1_000_000_000).toFixed(1)}B
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
              </Link>
            )
          })
        )}
      </div>

      {/* Footer link to Markets */}
      <div className="p-3 sm:px-6 bg-cp-elevated/40 border-t border-cp-border flex items-center justify-between text-xs">
        <span className="text-cp-text-muted">
          Showing {filteredAssets.length} pairs (Demonstration Data)
        </span>
        <Link
          to="/markets"
          className="text-cp-gold font-semibold hover:underline flex items-center gap-1"
        >
          <span>View All 150+ Markets</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  )
}

export default MarketOverview
