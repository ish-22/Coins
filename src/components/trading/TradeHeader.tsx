import React, { useState, useRef, useEffect } from 'react'
import {
  ChevronDown,
  Search,
  Star,
  TrendingUp,
  TrendingDown,
  Activity,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { Badge } from '@/components/common/Badge'
import { TradingPairConfig, TRADING_PAIRS } from '@/mock/tradingData'
import { formatCurrency, formatPercentage } from '@/utils/formatters'

export interface TradeHeaderProps {
  currentPair: TradingPairConfig
  onSelectPair: (pair: TradingPairConfig) => void
  allPairs?: TradingPairConfig[]
}

export const TradeHeader: React.FC<TradeHeaderProps> = ({
  currentPair,
  onSelectPair,
  allPairs,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const pairList = allPairs && allPairs.length > 0 ? allPairs : TRADING_PAIRS

  const filteredPairs = pairList.filter(
    (p) =>
      p.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.baseAsset.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const isPos = currentPair.change24h >= 0

  return (
    <div className="w-full bg-cp-card border-b border-cp-border px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 select-none">
      {/* Left: Pair Selector Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2.5 p-2 rounded-xl bg-cp-elevated border border-cp-border hover:border-cp-gold/60 transition-all focus:outline-none"
        >
          <div className="w-7 h-7 rounded-full bg-cp-card border border-cp-border flex items-center justify-center font-mono font-bold text-xs text-cp-gold shadow-sm">
            {currentPair.baseAsset}
          </div>

          <div className="text-left">
            <span className="font-bold text-sm sm:text-base text-cp-text-primary block font-mono leading-none">
              {currentPair.symbol}
            </span>
            <span className="text-[10px] text-cp-text-muted">Spot Trading</span>
          </div>

          <ChevronDown
            className={cn(
              'w-4 h-4 text-cp-text-muted transition-transform duration-200',
              dropdownOpen && 'rotate-180 text-cp-gold'
            )}
          />
        </button>

        {/* Pair Selection Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 rounded-xl bg-cp-elevated border border-cp-border shadow-elevated z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Search within dropdown */}
            <div className="p-2.5 border-b border-cp-border">
              <div className="relative">
                <Search className="w-4 h-4 text-cp-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search pairs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-cp-card border border-cp-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-cp-text-primary placeholder:text-cp-text-muted focus:outline-none focus:border-cp-gold"
                  autoFocus
                />
              </div>
            </div>

            {/* Pairs list */}
            <div className="max-h-64 overflow-y-auto divide-y divide-cp-border/40">
              {filteredPairs.map((p) => {
                const pairPos = p.change24h >= 0
                const isSelected = p.id === currentPair.id

                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectPair(p)
                      setDropdownOpen(false)
                      setSearchQuery('')
                    }}
                    className={cn(
                      'p-2.5 px-3 flex items-center justify-between hover:bg-cp-card transition-colors cursor-pointer',
                      isSelected && 'bg-cp-gold/10'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-cp-text-primary">
                        {p.symbol}
                      </span>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-xs text-cp-text-primary block font-semibold">
                        {formatCurrency(p.price)}
                      </span>
                      <span
                        className={cn(
                          'text-[10px] font-semibold',
                          pairPos ? 'text-cp-positive' : 'text-cp-negative'
                        )}
                      >
                        {pairPos ? '+' : ''}
                        {p.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Center: Live Price & 24h Metrics Strip */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono">
        {/* Current Price */}
        <div>
          <span className="text-[10px] font-sans text-cp-text-muted block">Spot Price</span>
          <span
            className={cn(
              'text-lg sm:text-xl font-bold tracking-tight',
              isPos ? 'text-cp-positive' : 'text-cp-negative'
            )}
          >
            {formatCurrency(currentPair.price)}
          </span>
        </div>

        {/* 24h Change */}
        <div>
          <span className="text-[10px] font-sans text-cp-text-muted block">24h Change</span>
          <span
            className={cn(
              'font-semibold flex items-center',
              isPos ? 'text-cp-positive' : 'text-cp-negative'
            )}
          >
            {isPos ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
            {isPos ? '+' : ''}
            {currentPair.change24h.toFixed(2)}%
          </span>
        </div>

        {/* 24h High */}
        <div className="hidden sm:block">
          <span className="text-[10px] font-sans text-cp-text-muted block">24h High</span>
          <span className="text-cp-text-primary font-medium">
            {formatCurrency(currentPair.high24h)}
          </span>
        </div>

        {/* 24h Low */}
        <div className="hidden sm:block">
          <span className="text-[10px] font-sans text-cp-text-muted block">24h Low</span>
          <span className="text-cp-text-primary font-medium">
            {formatCurrency(currentPair.low24h)}
          </span>
        </div>

        {/* 24h Volume */}
        <div className="hidden md:block">
          <span className="text-[10px] font-sans text-cp-text-muted block">
            24h Volume ({currentPair.baseAsset})
          </span>
          <span className="text-cp-text-primary font-medium">
            {currentPair.volume24hBtc.toLocaleString()} {currentPair.baseAsset}
          </span>
        </div>

        <div className="hidden lg:block">
          <span className="text-[10px] font-sans text-cp-text-muted block">24h Turnover (USDT)</span>
          <span className="text-cp-gold font-medium">
            ${(currentPair.volume24hUsdt / 1_000_000).toFixed(2)}M
          </span>
        </div>
      </div>

      {/* Right: Simulated Badge */}
      <div className="hidden xl:flex items-center gap-2">
        <Badge variant="gold" size="sm" withDot pulseDot>
          Simulated Matching Engine
        </Badge>
      </div>
    </div>
  )
}

export default TradeHeader
