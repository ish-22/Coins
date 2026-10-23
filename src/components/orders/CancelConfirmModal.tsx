import React from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { OpenOrderRecord } from '@/mock/ordersPageData'
import { formatUSD } from '@/utils/formatters'

export interface CancelConfirmModalProps {
  isOpen: boolean
  order: OpenOrderRecord | null
  onConfirm: (orderId: string) => void
  onClose: () => void
}

export const CancelConfirmModal: React.FC<CancelConfirmModalProps> = ({
  isOpen,
  order,
  onConfirm,
  onClose,
}) => {
  if (!isOpen || !order) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-cp-elevated border border-cp-border shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-cp-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cp-negative/10 border border-cp-negative/30 flex items-center justify-center text-cp-negative">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-cp-text-primary">Cancel Open Order</h3>
              <p className="text-xs text-cp-text-secondary">Confirm order cancellation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Details Card */}
        <div className="p-5 space-y-4 text-sm">
          <p className="text-cp-text-secondary text-xs">
            Are you sure you want to cancel this pending order? Any unfilled quantity will be removed from the order book and returned to your available balance.
          </p>

          <div className="p-4 rounded-xl bg-cp-card border border-cp-border space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-cp-text-secondary">Order ID</span>
              <span className="font-mono font-bold text-cp-text-primary">{order.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-cp-text-secondary">Pair & Side</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-cp-text-primary">{order.pair}</span>
                <Badge variant={order.side === 'buy' ? 'positive' : 'negative'} size="sm">
                  {order.side.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-cp-text-secondary">Price</span>
              <span className="font-mono font-bold text-cp-text-primary">{formatUSD(order.price)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-cp-text-secondary">Amount (Unfilled)</span>
              <span className="font-mono text-cp-text-primary">
                {(order.amount - order.filled).toFixed(4)} {order.pair.split('/')[0]}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-cp-text-secondary">Remaining Value</span>
              <span className="font-mono font-bold text-cp-gold">
                {formatUSD((order.amount - order.filled) * order.price)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-cp-border bg-cp-card/50 flex items-center justify-end gap-3">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Keep Order
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onConfirm(order.id)}
          >
            Confirm Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
