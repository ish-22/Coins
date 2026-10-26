import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  BarChart3,
  Wallet,
  ArrowRight,
} from 'lucide-react'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { MarketSparkline } from '@/components/markets/MarketSparkline'
import { marketService } from '@/services'
import { formatCurrency, formatPercentage } from '@/utils/formatters'
import type { TradingPairConfig } from '@/mock/tradingData'

const buildPreviewSeries = (basePrice: number, movement: number, count = 12) => {
  const volatility = Math.max(Math.abs(movement) / 100, 0.008)
  let current = basePrice * (1 - volatility * 0.9)

  return Array.from({ length: count }, (_, index) => {
    const wave = Math.sin(index * 0.8)
    const step = basePrice * volatility * (0.22 + (index / count) * 0.6)
    current = current + wave * (basePrice * volatility * 0.45) + step
    return Number(current.toFixed(2))
  })
}

const buildDepthRows = (basePrice: number, spread: number) => {
  const askBase = basePrice * (1 + spread)
  const bidBase = basePrice * (1 - spread)

  return {
    asks: [
      { price: askBase, amount: basePrice / 15000 },
      { price: askBase * 0.998, amount: basePrice / 12000 },
      { price: askBase * 0.996, amount: basePrice / 18000 },
    ],
    bids: [
      { price: bidBase, amount: basePrice / 13000 },
      { price: bidBase * 0.998, amount: basePrice / 16000 },
      { price: bidBase * 0.996, amount: basePrice / 21000 },
    ],
  }
}

export const ProductPreviewTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'markets' | 'trade' | 'portfolio'>('trade')
  const [tickers, setTickers] = useState<TradingPairConfig[]>([])

  useEffect(() => {
    let isMounted = true

    const loadPreviewData = async () => {
      try {
        const data = await marketService.getTickers()
        if (!isMounted) return
        setTickers(data)
      } catch {
        if (isMounted) setTickers([])
      }
    }

    loadPreviewData()

    return () => {
      isMounted = false
    }
  }, [])

  const previewTickers = useMemo(
    () => [...tickers].sort((a, b) => b.volume24hUsdt - a.volume24hUsdt).slice(0, 4),
    [tickers]
  )

  const primaryPair = previewTickers[0] ?? {
    symbol: 'BTC/USDT',
    baseAsset: 'BTC',
    quoteAsset: 'USDT',
    price: 68000,
    change24h: 2.4,
    high24h: 69000,
    low24h: 67000,
    volume24hUsdt: 1_940_000_000,
  }

  const primarySeries = useMemo(
    () => buildPreviewSeries(primaryPair.price, primaryPair.change24h),
    [primaryPair]
  )

  const marketRows = useMemo(
    () =>
      previewTickers.map((pair) => ({
        ...pair,
        sparkline: buildPreviewSeries(pair.price, pair.change24h, 8),
      })),
    [previewTickers]
  )

  const depth = useMemo(
    () => buildDepthRows(primaryPair.price, 0.0008),
    [primaryPair.price]
  )

  const portfolioAssets = useMemo(() => {
    const assetWeights = previewTickers.length
      ? previewTickers.map((pair, index) => ({
          asset: pair.baseAsset,
          value: pair.price * (index === 0 ? 2.8 : index === 1 ? 1.6 : index === 2 ? 1.1 : 0.7),
        }))
      : [
          { asset: 'BTC', value: 32000 },
          { asset: 'ETH', value: 18000 },
          { asset: 'SOL', value: 12000 },
        ]

    const total = assetWeights.reduce((sum, item) => sum + item.value, 0) || 1

    return assetWeights.map((item) => ({
      ...item,
      percent: (item.value / total) * 100,
    }))
  }, [previewTickers])

  const portfolioTotal = portfolioAssets.reduce((sum, item) => sum + item.value, 0)
  const availableFunds = portfolioTotal * 0.72
  const activeOrders = portfolioTotal * 0.28

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('trade')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'trade'
              ? 'bg-cp-gold text-cp-bg shadow-gold-sm font-bold scale-[1.02]'
              : 'bg-cp-card border border-cp-border text-cp-text-secondary hover:text-cp-text-primary'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Pro Trading Terminal</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('markets')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'markets'
              ? 'bg-cp-gold text-cp-bg shadow-gold-sm font-bold scale-[1.02]'
              : 'bg-cp-card border border-cp-border text-cp-text-secondary hover:text-cp-text-primary'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Live Market Depth</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('portfolio')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'portfolio'
              ? 'bg-cp-gold text-cp-bg shadow-gold-sm font-bold scale-[1.02]'
              : 'bg-cp-card border border-cp-border text-cp-text-secondary hover:text-cp-text-primary'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Portfolio & Custody</span>
        </button>
      </div>

      <div className="rounded-2xl border border-cp-border bg-cp-card shadow-2xl overflow-hidden p-4 sm:p-6 transition-all duration-300">
        {activeTab === 'trade' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-3.5 rounded-xl bg-cp-elevated border border-cp-border flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-sm text-cp-text-primary font-mono">
                  {primaryPair.symbol}
                </span>
                <Badge variant="gold" size="sm">Spot Pro</Badge>
                <span className="text-base font-bold font-mono text-cp-positive">
                  {formatCurrency(primaryPair.price)}
                </span>
                <span
                  className={`font-mono font-semibold text-[11px] ${
                    primaryPair.change24h >= 0 ? 'text-cp-positive' : 'text-cp-negative'
                  }`}
                >
                  {formatPercentage(primaryPair.change24h)}
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px] text-cp-text-secondary">
                <span>24h High: {formatCurrency(primaryPair.high24h)}</span>
                <span>•</span>
                <span>24h Low: {formatCurrency(primaryPair.low24h)}</span>
                <span>•</span>
                <span>Vol: {formatCurrency(primaryPair.volume24hUsdt, 'USD', true)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 p-4 rounded-xl bg-cp-elevated border border-cp-border space-y-3">
                <div className="flex items-center justify-between text-xs text-cp-text-secondary">
                  <span className="font-semibold text-cp-text-primary">Interactive Candlestick Engine</span>
                  <div className="flex items-center gap-1.5 font-mono text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-cp-card text-cp-gold font-bold">1H</span>
                    <span>4H</span>
                    <span>1D</span>
                    <span>1W</span>
                  </div>
                </div>

                <div className="h-44 w-full bg-cp-card/80 rounded-lg border border-cp-border/50 p-2 flex items-end justify-between gap-1 overflow-hidden">
                  {primarySeries.map((value, index) => {
                    const isGreen = index % 2 === 0
                    const previousValue = primarySeries[index - 1] ?? value
                    const bodyHeight = Math.max(8, Math.abs(value - previousValue) * 2.2)

                    return (
                      <div key={`${value}-${index}`} className="flex-1 flex flex-col items-center justify-end h-full">
                        <div
                          className={`w-[1.5px] ${isGreen ? 'bg-cp-positive' : 'bg-cp-negative'}`}
                          style={{ height: `${Math.max(18, Math.abs(value * 0.0009) * 120)}px` }}
                        />
                        <div
                          className={`w-full max-w-[14px] rounded-sm ${
                            isGreen ? 'bg-cp-positive' : 'bg-cp-negative'
                          }`}
                          style={{ height: `${bodyHeight}px` }}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-cp-elevated border border-cp-border space-y-2 text-xs">
                <span className="font-semibold text-cp-text-primary block text-[11px] uppercase">
                  Order Book Depth
                </span>

                <div className="space-y-1 font-mono text-[11px]">
                  {depth.asks.map((row, idx) => (
                    <div key={`ask-${idx}`} className="flex justify-between text-cp-negative">
                      <span>{formatCurrency(row.price)}</span>
                      <span className="text-cp-text-secondary">{row.amount.toFixed(4)} {primaryPair.baseAsset}</span>
                    </div>
                  ))}
                </div>

                <div className="py-1 px-2 rounded bg-cp-card border border-cp-border text-center font-bold font-mono text-xs text-cp-positive">
                  {formatCurrency(primaryPair.price)} (Spread {formatCurrency((depth.asks[0].price - depth.bids[0].price))})
                </div>

                <div className="space-y-1 font-mono text-[11px]">
                  {depth.bids.map((row, idx) => (
                    <div key={`bid-${idx}`} className="flex justify-between text-cp-positive">
                      <span>{formatCurrency(row.price)}</span>
                      <span className="text-cp-text-secondary">{row.amount.toFixed(4)} {primaryPair.baseAsset}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-cp-text-secondary">
                Live market conditions are pulled from the backend feed for the active trading pair.
              </span>
              <Link to="/trade">
                <Button variant="primary" size="sm" className="h-8 text-xs">
                  Launch Trading Terminal <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'markets' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-cp-elevated text-cp-text-secondary uppercase text-[11px] font-semibold border-b border-cp-border">
                  <tr>
                    <th className="py-2.5 px-3">Asset</th>
                    <th className="py-2.5 px-3">Price (USD)</th>
                    <th className="py-2.5 px-3">24h Change</th>
                    <th className="py-2.5 px-3">24h Volume</th>
                    <th className="py-2.5 px-3">7d Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cp-border/50 font-mono text-xs">
                  {marketRows.map((pair) => (
                    <tr key={pair.id || pair.symbol} className="hover:bg-cp-elevated/40">
                      <td className="py-3 px-3 font-bold font-sans text-cp-text-primary">
                        {pair.baseAsset} ({pair.baseAsset})
                      </td>
                      <td className="py-3 px-3 font-bold text-cp-text-primary">{formatCurrency(pair.price)}</td>
                      <td
                        className={`py-3 px-3 font-bold ${
                          pair.change24h >= 0 ? 'text-cp-positive' : 'text-cp-negative'
                        }`}
                      >
                        {formatPercentage(pair.change24h)}
                      </td>
                      <td className="py-3 px-3 text-cp-text-secondary">
                        {formatCurrency(pair.volume24hUsdt, 'USD', true)}
                      </td>
                      <td className="py-3 px-3">
                        <MarketSparkline
                          data={pair.sparkline}
                          isPositive={pair.change24h >= 0}
                          width={70}
                          height={20}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-cp-text-secondary">
                Search, sort, filter by Gainers/Losers, and pin to Watchlist.
              </span>
              <Link to="/markets">
                <Button variant="primary" size="sm" className="h-8 text-xs">
                  Explore Live Markets <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-cp-elevated border border-cp-border">
                <span className="text-[11px] text-cp-text-secondary block">Total Balance</span>
                <span className="text-lg font-bold font-mono text-cp-gold">
                  {formatCurrency(portfolioTotal)}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-cp-elevated border border-cp-border">
                <span className="text-[11px] text-cp-text-secondary block">Available Funds</span>
                <span className="text-lg font-bold font-mono text-cp-positive">
                  {formatCurrency(availableFunds)}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-cp-elevated border border-cp-border">
                <span className="text-[11px] text-cp-text-secondary block">In Active Orders</span>
                <span className="text-lg font-bold font-mono text-cp-text-primary">
                  {formatCurrency(activeOrders)}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-cp-elevated border border-cp-border space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-cp-text-primary">Asset Allocation</span>
                <span className="text-cp-text-secondary font-mono">{portfolioAssets.length} Assets</span>
              </div>
              <div className="w-full h-3 rounded-full bg-cp-card overflow-hidden flex">
                {portfolioAssets.map((asset, index) => (
                  <div
                    key={`${asset.asset}-${index}`}
                    style={{ width: `${asset.percent}%` }}
                    className={[
                      'h-full',
                      index % 5 === 0 ? 'bg-[#F0B93A]' : '',
                      index % 5 === 1 ? 'bg-[#38BDF8]' : '',
                      index % 5 === 2 ? 'bg-[#00D6A0]' : '',
                      index % 5 === 3 ? 'bg-[#A855F7]' : '',
                      index % 5 === 4 ? 'bg-[#F59E0B]' : '',
                    ].join(' ')}
                    title={`${asset.asset} ${asset.percent.toFixed(1)}%`}
                  />
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-cp-text-secondary font-mono pt-1">
                {portfolioAssets.map((asset, index) => (
                  <span key={`${asset.asset}-label-${index}`} className="flex items-center gap-1">
                    <span
                      className={[
                        'w-2 h-2 rounded-full',
                        index % 5 === 0 ? 'bg-[#F0B93A]' : '',
                        index % 5 === 1 ? 'bg-[#38BDF8]' : '',
                        index % 5 === 2 ? 'bg-[#00D6A0]' : '',
                        index % 5 === 3 ? 'bg-[#A855F7]' : '',
                        index % 5 === 4 ? 'bg-[#F59E0B]' : '',
                      ].join(' ')}
                    />
                    {asset.asset} {asset.percent.toFixed(1)}%
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-cp-text-secondary">
                Portfolio values and allocation are recalculated from live market pricing.
              </span>
              <Link to="/wallet">
                <Button variant="primary" size="sm" className="h-8 text-xs">
                  View Wallet <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
