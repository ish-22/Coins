import React, { useEffect, useState } from 'react'
import { Activity, Clock } from 'lucide-react'
import { cn } from '@/utils/cn'
import { MarketTrade, generateRecentTrades } from '@/mock/tradingData'
import { marketService } from '@/services/marketService'

export interface RecentTradesProps {
  basePrice: number
  baseAsset: string
  quoteAsset: string
}

export const RecentTrades: React.FC<RecentTradesProps> = ({
  basePrice,
  baseAsset,
  quoteAsset,
}) => {
  const [trades, setTrades] = useState<MarketTrade[]>(() =>
    generateRecentTrades(basePrice)
  )

  // Fetch real live trades from backend API and stream updates
  useEffect(() => {
    let isMounted = true
    const pairId = `${baseAsset}-${quoteAsset}`

    const loadLiveTrades = () => {
      marketService.getRecentTrades(pairId)
        .then((data) => {
          if (isMounted && data && data.length > 0) {
            setTrades(data)
          }
        })
        .catch(() => {})
    }

    loadLiveTrades()
    const interval = setInterval(loadLiveTrades, 4000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [baseAsset, quoteAsset])

  return (
    <div className="w-full bg-cp-card border-b lg:border-b-0 border-cp-border flex flex-col select-none text-xs font-mono">
      {/* Header */}
      <div className="p-3 border-b border-cp-border flex items-center justify-between bg-cp-card">
        <span className="font-sans font-bold text-cp-text-primary text-xs flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-cp-gold" />
          <span>Market Trades</span>
        </span>
        <span className="text-[10px] text-cp-text-muted flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cp-positive animate-ping" />
          <span>Live Stream</span>
        </span>
      </div>

      {/* Columns Header */}
      <div className="grid grid-cols-3 px-3 py-1.5 text-[10px] font-semibold text-cp-text-muted border-b border-cp-border/40 uppercase">
        <div>Price ({quoteAsset})</div>
        <div className="text-right">Size ({baseAsset})</div>
        <div className="text-right">Time</div>
      </div>

      {/* Trades List */}
      <div className="flex-1 overflow-y-auto max-h-[380px] divide-y divide-cp-border/20 p-1">
        {trades.map((t) => {
          const isBuy = t.side === 'buy'

          return (
            <div
              key={t.id}
              className="grid grid-cols-3 px-2 py-1 hover:bg-cp-elevated/60 transition-colors animate-in fade-in duration-200"
            >
              <span
                className={cn(
                  'font-semibold',
                  isBuy ? 'text-cp-positive' : 'text-cp-negative'
                )}
              >
                {t.price.toFixed(2)}
              </span>
              <span className="text-right text-cp-text-secondary">{t.amount}</span>
              <span className="text-right text-cp-text-muted text-[11px]">{t.time}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecentTrades
