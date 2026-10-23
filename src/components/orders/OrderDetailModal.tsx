import React, { useState } from 'react'
import {
  X,
  Copy,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Layers,
  Percent,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import {
  OpenOrderRecord,
  OrderHistoryRecord,
  TradeHistoryRecord,
} from '@/mock/ordersPageData'
import { formatUSD, formatNumber } from '@/utils/formatters'

export type DetailRecord =
  | { kind: 'open'; data: OpenOrderRecord }
  | { kind: 'history'; data: OrderHistoryRecord }
  | { kind: 'trade'; data: TradeHistoryRecord }

export interface OrderDetailModalProps {
  isOpen: boolean
  record: DetailRecord | null
  onClose: () => void
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  record,
  onClose,
}) => {
  const [copiedId, setCopiedId] = useState(false)

  if (!isOpen || !record) return null

  const handleCopy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedId(true)
      setTimeout(() => setCopiedId(false), 2000)
    }
  }

  // Render content based on kind
  if (record.kind === 'open') {
    const o = record.data
    const fillPercent = o.amount > 0 ? Math.min(100, Math.round((o.filled / o.amount) * 100)) : 0
    const [baseAsset, quoteAsset] = o.pair.split('/')

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
        <div className="w-full max-w-lg rounded-2xl bg-cp-elevated border border-cp-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-5 border-b border-cp-border flex items-center justify-between bg-cp-card/50">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                  o.side === 'buy'
                    ? 'bg-cp-positive/10 text-cp-positive border border-cp-positive/30'
                    : 'bg-cp-negative/10 text-cp-negative border border-cp-negative/30'
                }`}
              >
                {o.side === 'buy' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-cp-text-primary">Open Order Details</h3>
                  <Badge variant={o.side === 'buy' ? 'positive' : 'negative'} size="sm">
                    {o.side.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-cp-text-secondary font-mono">{o.pair} • Limit Order</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-elevated transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-5 text-sm">
            {/* Order Status & Progress */}
            <div className="p-4 rounded-xl bg-cp-card border border-cp-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-cp-text-secondary">Execution Status</span>
                <Badge variant={o.status === 'partially_filled' ? 'gold' : 'neutral'} size="sm" withDot>
                  {o.status === 'partially_filled' ? 'Partially Filled' : 'Open / In Book'}
                </Badge>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-cp-text-secondary">Fill Progress</span>
                  <span className="font-semibold text-cp-gold">{fillPercent}% Filled</span>
                </div>
                <div className="w-full h-2 rounded-full bg-cp-elevated overflow-hidden">
                  <div
                    className="h-full bg-cp-gold transition-all duration-300 rounded-full"
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-cp-text-secondary font-mono mt-1">
                  <span>Filled: {o.filled} {baseAsset}</span>
                  <span>Total: {o.amount} {baseAsset}</span>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-cp-card border border-cp-border">
                <span className="text-xs text-cp-text-secondary block mb-1">Limit Price</span>
                <span className="text-base font-bold font-mono text-cp-text-primary">
                  {formatUSD(o.price)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-cp-card border border-cp-border">
                <span className="text-xs text-cp-text-secondary block mb-1">Total Order Value</span>
                <span className="text-base font-bold font-mono text-cp-gold">
                  {formatUSD(o.total)}
                </span>
              </div>
            </div>

            {/* Detailed Row List */}
            <div className="divide-y divide-cp-border/50 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-cp-text-secondary">Order ID</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-cp-text-primary font-semibold">{o.id}</span>
                  <button
                    onClick={() => handleCopy(o.id)}
                    className="p-1 rounded text-cp-text-secondary hover:text-cp-gold transition-colors"
                  >
                    {copiedId ? <CheckCircle2 className="w-3.5 h-3.5 text-cp-positive" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-cp-text-secondary">Order Placed</span>
                <span className="font-mono text-cp-text-primary">{o.dateTime}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-cp-text-secondary">Order Type</span>
                <span className="font-semibold uppercase text-cp-text-primary">{o.type}</span>
              </div>
              {o.stopPrice && (
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-cp-text-secondary">Stop Trigger Price</span>
                  <span className="font-mono text-cp-gold font-bold">{formatUSD(o.stopPrice)}</span>
                </div>
              )}
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-cp-text-secondary">Estimated Maker Fee (0.02%)</span>
                <span className="font-mono text-cp-text-primary">{formatUSD(o.feeEstimate)}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-cp-text-secondary">Simulated Matching Engine</span>
                <span className="text-cp-text-secondary flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-cp-positive" /> CP-ENGINE-01 (Demo)
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-cp-border bg-cp-card/50 flex justify-end">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close Details
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (record.kind === 'history') {
    const o = record.data
    const [baseAsset, quoteAsset] = o.pair.split('/')

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
        <div className="w-full max-w-lg rounded-2xl bg-cp-elevated border border-cp-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-5 border-b border-cp-border flex items-center justify-between bg-cp-card/50">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                  o.side === 'buy'
                    ? 'bg-cp-positive/10 text-cp-positive border border-cp-positive/30'
                    : 'bg-cp-negative/10 text-cp-negative border border-cp-negative/30'
                }`}
              >
                {o.side === 'buy' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-cp-text-primary">Historical Order Summary</h3>
                  <Badge variant={o.side === 'buy' ? 'positive' : 'negative'} size="sm">
                    {o.side.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-cp-text-secondary font-mono">{o.pair} • {o.type.toUpperCase()}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-elevated transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-5 text-sm">
            {/* Status card */}
            <div className="p-4 rounded-xl bg-cp-card border border-cp-border flex items-center justify-between">
              <div>
                <span className="text-xs text-cp-text-secondary block">Final Order Status</span>
                <span className="font-bold text-cp-text-primary capitalize">{o.status}</span>
              </div>
              <Badge
                variant={
                  o.status === 'filled'
                    ? 'positive'
                    : o.status === 'partially_filled'
                    ? 'gold'
                    : 'neutral'
                }
                size="md"
                withDot
              >
                {o.status.toUpperCase()}
              </Badge>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-cp-card border border-cp-border">
                <span className="text-xs text-cp-text-secondary block mb-1">Avg Executed Price</span>
                <span className="text-base font-bold font-mono text-cp-text-primary">
                  {o.avgPrice > 0 ? formatUSD(o.avgPrice) : formatUSD(o.price)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-cp-card border border-cp-border">
                <span className="text-xs text-cp-text-secondary block mb-1">Executed Total</span>
                <span className="text-base font-bold font-mono text-cp-gold">
                  {formatUSD(o.total)}
                </span>
              </div>
            </div>

            {/* Full Details */}
            <div className="divide-y divide-cp-border/50 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-cp-text-secondary">Order ID</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-cp-text-primary font-semibold">{o.id}</span>
                  <button
                    onClick={() => handleCopy(o.id)}
                    className="p-1 rounded text-cp-text-secondary hover:text-cp-gold transition-colors"
                  >
                    {copiedId ? <CheckCircle2 className="w-3.5 h-3.5 text-cp-positive" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-cp-text-secondary">Order Quantity</span>
                <span className="font-mono text-cp-text-primary font-semibold">
                  {o.amount} {baseAsset}
                </span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-cp-text-secondary">Executed Quantity</span>
                <span className="font-mono text-cp-text-primary font-semibold">
                  {o.executed} {baseAsset} (
                  {o.amount > 0 ? Math.round((o.executed / o.amount) * 100) : 0}%)
                </span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-cp-text-secondary">Trading Fee</span>
                <span className="font-mono text-cp-text-primary">
                  {o.fee > 0 ? `${o.fee} ${o.feeAsset}` : '0.00 USDT'}
                </span>
              </div>
              {o.triggerCondition && (
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-cp-text-secondary">Trigger Condition</span>
                  <span className="font-mono text-cp-gold">{o.triggerCondition}</span>
                </div>
              )}
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-cp-text-secondary">Created Time</span>
                <span className="font-mono text-cp-text-primary">{o.createdAt}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-cp-text-secondary">Settlement Time</span>
                <span className="font-mono text-cp-text-primary">{o.updatedAt}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-cp-border bg-cp-card/50 flex justify-end">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Trade history fill record
  const t = record.data
  const [baseAsset, quoteAsset] = t.pair.split('/')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-cp-elevated border border-cp-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-cp-border flex items-center justify-between bg-cp-card/50">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                t.side === 'buy'
                  ? 'bg-cp-positive/10 text-cp-positive border border-cp-positive/30'
                  : 'bg-cp-negative/10 text-cp-negative border border-cp-negative/30'
              }`}
            >
              {t.side === 'buy' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-cp-text-primary">Execution Fill Record</h3>
                <Badge variant={t.side === 'buy' ? 'positive' : 'negative'} size="sm">
                  {t.side.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-cp-text-secondary font-mono">{t.pair} • Trade ID {t.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Key trade numbers */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-cp-card border border-cp-border">
              <span className="text-xs text-cp-text-secondary block mb-1">Execution Price</span>
              <span className="text-base font-bold font-mono text-cp-text-primary">
                {formatUSD(t.execPrice)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-cp-card border border-cp-border">
              <span className="text-xs text-cp-text-secondary block mb-1">Total Executed Value</span>
              <span className="text-base font-bold font-mono text-cp-gold">
                {formatUSD(t.totalValue)}
              </span>
            </div>
          </div>

          <div className="divide-y divide-cp-border/50 text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-cp-text-secondary">Trade Execution ID</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-cp-text-primary font-semibold">{t.id}</span>
                <button
                  onClick={() => handleCopy(t.id)}
                  className="p-1 rounded text-cp-text-secondary hover:text-cp-gold transition-colors"
                >
                  {copiedId ? <CheckCircle2 className="w-3.5 h-3.5 text-cp-positive" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-cp-text-secondary">Associated Order ID</span>
              <span className="font-mono text-cp-text-primary">{t.orderId}</span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-cp-text-secondary">Executed Quantity</span>
              <span className="font-mono text-cp-text-primary font-bold">
                {t.amount} {baseAsset}
              </span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-cp-text-secondary">Liquidity Role</span>
              <Badge variant={t.role === 'maker' ? 'gold' : 'neutral'} size="sm">
                {t.role.toUpperCase()}
              </Badge>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-cp-text-secondary">Fee Deducted</span>
              <span className="font-mono text-cp-text-primary">
                {t.fee} {t.feeAsset}
              </span>
            </div>
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-cp-text-secondary">Execution Timestamp</span>
              <span className="font-mono text-cp-text-primary">{t.dateTime}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cp-border bg-cp-card/50 flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
