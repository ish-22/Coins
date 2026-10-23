import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  BarChart3,
  Wallet,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { MarketSparkline } from '@/components/markets/MarketSparkline'
import { formatUSD, formatCurrency, formatPercentage } from '@/utils/formatters'

export const ProductPreviewTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'markets' | 'trade' | 'portfolio'>('trade')

  return (
    <div className="space-y-4">
      {/* Tab Switcher Pills */}
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

      {/* Preview Card Shell */}
      <div className="rounded-2xl border border-cp-border bg-cp-card shadow-2xl overflow-hidden p-4 sm:p-6 transition-all duration-300">
        
        {/* VIEW 1: PRO TRADING TERMINAL PREVIEW */}
        {activeTab === 'trade' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Header Strip */}
            <div className="p-3.5 rounded-xl bg-cp-elevated border border-cp-border flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-sm text-cp-text-primary font-mono">BTC/USDT</span>
                <Badge variant="gold" size="sm">Spot Pro</Badge>
                <span className="text-base font-bold font-mono text-cp-positive">$68,450.25</span>
                <span className="text-cp-positive font-mono font-semibold text-[11px]">+3.42%</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px] text-cp-text-secondary">
                <span>24h High: $69,120.00</span>
                <span>•</span>
                <span>24h Low: $66,890.50</span>
                <span>•</span>
                <span>Vol: $1.94B</span>
              </div>
            </div>

            {/* Trading Grid Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Mini Chart Mock */}
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

                {/* SVG Visual Candlestick Representation */}
                <div className="h-44 w-full bg-cp-card/80 rounded-lg border border-cp-border/50 p-2 flex items-end justify-between gap-1 overflow-hidden">
                  {[
                    { open: 66, close: 72, high: 75, low: 64, isGreen: true },
                    { open: 72, close: 70, high: 74, low: 68, isGreen: false },
                    { open: 70, close: 78, high: 80, low: 69, isGreen: true },
                    { open: 78, close: 76, high: 82, low: 74, isGreen: false },
                    { open: 76, close: 84, high: 86, low: 75, isGreen: true },
                    { open: 84, close: 88, high: 90, low: 82, isGreen: true },
                    { open: 88, close: 85, high: 89, low: 83, isGreen: false },
                    { open: 85, close: 92, high: 94, low: 84, isGreen: true },
                    { open: 92, close: 96, high: 98, low: 90, isGreen: true },
                    { open: 96, close: 94, high: 97, low: 91, isGreen: false },
                    { open: 94, close: 99, high: 100, low: 92, isGreen: true },
                  ].map((c, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                      {/* High-Low Wick */}
                      <div
                        className={`w-[1.5px] ${c.isGreen ? 'bg-cp-positive' : 'bg-cp-negative'}`}
                        style={{ height: `${c.high - c.low + 10}px` }}
                      />
                      {/* Body */}
                      <div
                        className={`w-full max-w-[14px] rounded-sm ${
                          c.isGreen ? 'bg-cp-positive' : 'bg-cp-negative'
                        }`}
                        style={{ height: `${Math.max(8, Math.abs(c.close - c.open) * 2)}px` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini Order Book Depth Preview */}
              <div className="p-4 rounded-xl bg-cp-elevated border border-cp-border space-y-2 text-xs">
                <span className="font-semibold text-cp-text-primary block text-[11px] uppercase">
                  Order Book Depth
                </span>

                {/* Asks (Red) */}
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between text-cp-negative">
                    <span>68,520.00</span>
                    <span className="text-cp-text-secondary">0.450 BTC</span>
                  </div>
                  <div className="flex justify-between text-cp-negative">
                    <span>68,490.50</span>
                    <span className="text-cp-text-secondary">1.210 BTC</span>
                  </div>
                  <div className="flex justify-between text-cp-negative">
                    <span>68,465.00</span>
                    <span className="text-cp-text-secondary">0.820 BTC</span>
                  </div>
                </div>

                {/* Mid price */}
                <div className="py-1 px-2 rounded bg-cp-card border border-cp-border text-center font-bold font-mono text-xs text-cp-positive">
                  $68,450.25 (Spread: $5.00)
                </div>

                {/* Bids (Green) */}
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between text-cp-positive">
                    <span>68,445.00</span>
                    <span className="text-cp-text-secondary">0.950 BTC</span>
                  </div>
                  <div className="flex justify-between text-cp-positive">
                    <span>68,420.00</span>
                    <span className="text-cp-text-secondary">2.140 BTC</span>
                  </div>
                  <div className="flex justify-between text-cp-positive">
                    <span>68,390.00</span>
                    <span className="text-cp-text-secondary">1.800 BTC</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-cp-text-secondary">
                Full-featured terminal with limit, market, and stop-limit execution.
              </span>
              <Link to="/trade">
                <Button variant="primary" size="sm" className="h-8 text-xs">
                  Launch Trading Terminal <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* VIEW 2: LIVE MARKET DEPTH PREVIEW */}
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
                  <tr className="hover:bg-cp-elevated/40">
                    <td className="py-3 px-3 font-bold font-sans text-cp-text-primary">
                      Bitcoin (BTC)
                    </td>
                    <td className="py-3 px-3 font-bold text-cp-text-primary">$68,450.25</td>
                    <td className="py-3 px-3 text-cp-positive font-bold">+3.42%</td>
                    <td className="py-3 px-3 text-cp-text-secondary">$28.45B</td>
                    <td className="py-3 px-3">
                      <MarketSparkline data={[66890, 67200, 67100, 67900, 68150, 68450]} isPositive={true} width={70} height={20} />
                    </td>
                  </tr>
                  <tr className="hover:bg-cp-elevated/40">
                    <td className="py-3 px-3 font-bold font-sans text-cp-text-primary">
                      Ethereum (ETH)
                    </td>
                    <td className="py-3 px-3 font-bold text-cp-text-primary">$3,624.80</td>
                    <td className="py-3 px-3 text-cp-negative font-bold">-1.18%</td>
                    <td className="py-3 px-3 text-cp-text-secondary">$14.23B</td>
                    <td className="py-3 px-3">
                      <MarketSparkline data={[3710, 3680, 3690, 3640, 3610, 3624]} isPositive={false} width={70} height={20} />
                    </td>
                  </tr>
                  <tr className="hover:bg-cp-elevated/40">
                    <td className="py-3 px-3 font-bold font-sans text-cp-text-primary">
                      Solana (SOL)
                    </td>
                    <td className="py-3 px-3 font-bold text-cp-text-primary">$184.65</td>
                    <td className="py-3 px-3 text-cp-positive font-bold">+8.75%</td>
                    <td className="py-3 px-3 text-cp-text-secondary">$6.82B</td>
                    <td className="py-3 px-3">
                      <MarketSparkline data={[168, 172, 175, 179, 181, 184]} isPositive={true} width={70} height={20} />
                    </td>
                  </tr>
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

        {/* VIEW 3: PORTFOLIO & CUSTODY PREVIEW */}
        {activeTab === 'portfolio' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-cp-elevated border border-cp-border">
                <span className="text-[11px] text-cp-text-secondary block">Total Balance</span>
                <span className="text-lg font-bold font-mono text-cp-gold">$48,920.45</span>
              </div>
              <div className="p-3.5 rounded-xl bg-cp-elevated border border-cp-border">
                <span className="text-[11px] text-cp-text-secondary block">Available Funds</span>
                <span className="text-lg font-bold font-mono text-cp-positive">$36,450.25</span>
              </div>
              <div className="p-3.5 rounded-xl bg-cp-elevated border border-cp-border">
                <span className="text-[11px] text-cp-text-secondary block">In Active Orders</span>
                <span className="text-lg font-bold font-mono text-cp-text-primary">$12,470.20</span>
              </div>
            </div>

            {/* Asset Allocation Bar */}
            <div className="p-3.5 rounded-xl bg-cp-elevated border border-cp-border space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-cp-text-primary">Asset Allocation</span>
                <span className="text-cp-text-secondary font-mono">8 Assets</span>
              </div>
              <div className="w-full h-3 rounded-full bg-cp-card overflow-hidden flex">
                <div style={{ width: '42.6%' }} className="bg-[#F0B93A] h-full" title="BTC 42.6%" />
                <div style={{ width: '24.8%' }} className="bg-[#38BDF8] h-full" title="ETH 24.8%" />
                <div style={{ width: '15.2%' }} className="bg-[#00D6A0] h-full" title="USDT 15.2%" />
                <div style={{ width: '10.4%' }} className="bg-[#A855F7] h-full" title="SOL 10.4%" />
                <div style={{ width: '7.0%' }} className="bg-[#F59E0B] h-full" title="Others 7.0%" />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-cp-text-secondary font-mono pt-1">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F0B93A]" /> BTC 42.6%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#38BDF8]" /> ETH 24.8%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#00D6A0]" /> USDT 15.2%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#A855F7]" /> SOL 10.4%</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-cp-text-secondary">
                Complete custody overview with deposit and withdrawal workflows.
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
