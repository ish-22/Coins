import React from 'react'
import {
  X,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { formatCurrency, formatCrypto } from '@/utils/formatters'

export interface OrderConfirmationData {
  side: 'buy' | 'sell'
  type: 'limit' | 'market' | 'stop_limit'
  price: number
  stopPrice?: number
  amount: number
  total: number
  fee: number
  pairSymbol: string
  baseAsset: string
  quoteAsset: string
}

export interface OrderConfirmationModalProps {
  isOpen: boolean
  data: OrderConfirmationData | null
  onConfirm: () => void
  onClose: () => void
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  data,
  onConfirm,
  onClose,
}) => {
  if (!isOpen || !data) return null

  const isBuy = data.side === 'buy'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-md rounded-2xl bg-cp-elevated border border-cp-border shadow-elevated overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-cp-border flex items-center justify-between bg-cp-card">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                'p-2 rounded-xl text-cp-bg',
                isBuy ? 'bg-cp-positive' : 'bg-cp-negative'
              )}
            >
              {isBuy ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-base text-cp-text-primary">
                Confirm Order Placement
              </h3>
              <span className="text-xs text-cp-text-muted">
                {data.pairSymbol} Spot Terminal
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Details Body */}
        <div className="p-5 space-y-4 text-xs font-mono">
          {/* Side & Type Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-cp-card border border-cp-border">
            <div className="flex items-center gap-2">
              <Badge
                variant={isBuy ? 'positive' : 'negative'}
                size="md"
                className="font-bold uppercase tracking-wider"
              >
                {data.side}
              </Badge>
              <span className="font-sans font-bold text-sm text-cp-text-primary">
                {data.pairSymbol}
              </span>
            </div>
            <span className="font-sans font-semibold text-cp-gold uppercase text-xs">
              {data.type.replace('_', ' ')} Order
            </span>
          </div>

          {/* Breakdown List */}
          <div className="space-y-2.5 px-1 text-cp-text-secondary">
            {data.stopPrice && (
              <div className="flex justify-between py-1 border-b border-cp-border/40">
                <span className="font-sans text-cp-text-muted">Stop Price:</span>
                <span className="text-cp-text-primary font-bold">
                  {formatCurrency(data.stopPrice)}
                </span>
              </div>
            )}

            <div className="flex justify-between py-1 border-b border-cp-border/40">
              <span className="font-sans text-cp-text-muted">Order Price:</span>
              <span className="text-cp-text-primary font-bold">
                {data.type === 'market' ? 'Market Best Price' : formatCurrency(data.price)}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-cp-border/40">
              <span className="font-sans text-cp-text-muted">Order Amount:</span>
              <span className="text-cp-text-primary font-bold">
                {formatCrypto(data.amount, data.baseAsset)}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-cp-border/40">
              <span className="font-sans text-cp-text-muted">Estimated Total:</span>
              <span className="text-cp-gold font-bold text-sm">
                {formatCurrency(data.total)}
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="font-sans text-cp-text-muted">Estimated Maker Fee:</span>
              <span className="text-cp-text-primary font-medium">
                ≈ ${data.fee.toFixed(4)} {data.quoteAsset}
              </span>
            </div>
          </div>

          {/* Demonstration Disclaimer Notice */}
          <div className="p-3 rounded-xl bg-cp-card border border-cp-gold/30 text-[11px] text-cp-text-muted font-sans flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-cp-gold shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              This order execution is simulated in demonstration mode. No real capital will be deducted or traded.
            </p>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 sm:p-5 border-t border-cp-border bg-cp-card flex items-center justify-end gap-3">
          <Button variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant={isBuy ? 'success' : 'danger'}
            size="md"
            onClick={onConfirm}
            className="font-bold uppercase tracking-wider"
          >
            Confirm {data.side} Order
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmationModal
