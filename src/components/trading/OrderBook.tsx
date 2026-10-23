import React, { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Layers,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { OrderBookEntry } from '@/mock/tradingData'
import { formatCurrency } from '@/utils/formatters'

export interface OrderBookProps {
  asks: OrderBookEntry[]
  bids: OrderBookEntry[]
  currentPrice: number
  baseAsset: string
  quoteAsset: string
  onSelectPrice?: (price: number) => void
}

export const OrderBook: React.FC<OrderBookProps> = ({
  asks,
  bids,
  currentPrice,
  baseAsset,
  quoteAsset,
  onSelectPrice,
}) => {
  const [viewMode, setViewMode] = useState<'both' | 'bids' | 'asks'>('both')
  const [precision, setPrecision] = useState<'0.01' | '0.1' | '1'>('0.01')

  const visibleAsks = viewMode === 'bids' ? [] : viewMode === 'both' ? asks.slice(-8) : asks
  const visibleBids = viewMode === 'asks' ? [] : viewMode === 'both' ? bids.slice(0, 8) : bids

  return (
    <div className="w-full bg-cp-card border-b lg:border-b-0 lg:border-r border-cp-border flex flex-col select-none text-xs font-mono">
      {/* Order Book Header */}
      <div className="p-3 border-b border-cp-border flex items-center justify-between bg-cp-card">
        <span className="font-sans font-bold text-cp-text-primary text-xs">
          Order Book
        </span>

        {/* View Mode Icons & Precision */}
        <div className="flex items-center gap-2">
          {/* Both / Bids / Asks switcher */}
          <div className="flex items-center p-0.5 rounded bg-cp-elevated border border-cp-border">
            <button
              type="button"
              onClick={() => setViewMode('both')}
              className={cn(
                'px-1.5 py-0.5 text-[10px] font-semibold rounded',
                viewMode === 'both' ? 'bg-cp-card text-cp-gold' : 'text-cp-text-muted'
              )}
              title="Default Order Book"
            >
              Both
            </button>
            <button
              type="button"
              onClick={() => setViewMode('bids')}
              className={cn(
                'px-1.5 py-0.5 text-[10px] font-semibold rounded',
                viewMode === 'bids' ? 'bg-cp-card text-cp-positive' : 'text-cp-text-muted'
              )}
              title="Buy Orders Only"
            >
              Bids
            </button>
            <button
              type="button"
              onClick={() => setViewMode('asks')}
              className={cn(
                'px-1.5 py-0.5 text-[10px] font-semibold rounded',
                viewMode === 'asks' ? 'bg-cp-card text-cp-negative' : 'text-cp-text-muted'
              )}
              title="Sell Orders Only"
            >
              Asks
            </button>
          </div>

          {/* Precision Selector */}
          <div className="px-1.5 py-0.5 rounded bg-cp-elevated border border-cp-border text-[10px] text-cp-text-secondary">
            {precision}
          </div>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-3 px-3 py-1.5 text-[10px] font-semibold text-cp-text-muted border-b border-cp-border/40 uppercase">
        <div>Price ({quoteAsset})</div>
        <div className="text-right">Size ({baseAsset})</div>
        <div className="text-right">Total ({quoteAsset})</div>
      </div>

      {/* Asks (Sell Orders - Red) */}
      <div className="flex-1 overflow-hidden flex flex-col justify-end space-y-0.5 p-1">
        {visibleAsks.map((ask) => (
          <div
            key={ask.price}
            onClick={() => onSelectPrice?.(ask.price)}
            className="relative grid grid-cols-3 px-2 py-0.5 hover:bg-cp-elevated/80 transition-colors cursor-pointer group"
          >
            {/* Red Depth Visualization Bar */}
            <div
              className="absolute right-0 top-0 bottom-0 bg-cp-negative/15 transition-all pointer-events-none"
              style={{ width: `${ask.depthPercent}%` }}
            />

            <span className="text-cp-negative font-semibold z-10 group-hover:underline">
              {ask.price.toFixed(2)}
            </span>
            <span className="text-right text-cp-text-secondary z-10">{ask.amount}</span>
            <span className="text-right text-cp-text-muted z-10">{ask.total.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* Mid Spread Price Strip */}
      <div className="px-3 py-2 my-1 bg-cp-elevated/70 border-y border-cp-border/60 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-sm text-cp-positive">
          <TrendingUp className="w-4 h-4" />
          <span>{formatCurrency(currentPrice)}</span>
        </div>
        <div className="text-[11px] text-cp-text-muted">
          Spread: <span className="text-cp-text-primary">$0.50</span> (0.001%)
        </div>
      </div>

      {/* Bids (Buy Orders - Green) */}
      <div className="flex-1 overflow-hidden flex flex-col space-y-0.5 p-1">
        {visibleBids.map((bid) => (
          <div
            key={bid.price}
            onClick={() => onSelectPrice?.(bid.price)}
            className="relative grid grid-cols-3 px-2 py-0.5 hover:bg-cp-elevated/80 transition-colors cursor-pointer group"
          >
            {/* Green Depth Visualization Bar */}
            <div
              className="absolute right-0 top-0 bottom-0 bg-cp-positive/15 transition-all pointer-events-none"
              style={{ width: `${bid.depthPercent}%` }}
            />

            <span className="text-cp-positive font-semibold z-10 group-hover:underline">
              {bid.price.toFixed(2)}
            </span>
            <span className="text-right text-cp-text-secondary z-10">{bid.amount}</span>
            <span className="text-right text-cp-text-muted z-10">{bid.total.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrderBook
