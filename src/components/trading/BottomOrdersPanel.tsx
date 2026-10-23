import React, { useState } from 'react'
import {
  ClipboardList,
  History,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { ActiveOrder } from '@/mock/tradingData'
import { formatCurrency, formatCrypto } from '@/utils/formatters'

export interface BottomOrdersPanelProps {
  openOrders: ActiveOrder[]
  orderHistory: ActiveOrder[]
  onCancelOrder: (orderId: string) => void
}

export const BottomOrdersPanel: React.FC<BottomOrdersPanelProps> = ({
  openOrders,
  orderHistory,
  onCancelOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'open' | 'history' | 'trades'>('open')

  return (
    <div className="w-full bg-cp-card border-t border-cp-border flex flex-col select-none text-xs">
      {/* Tabs Header */}
      <div className="px-4 sm:px-6 py-2.5 border-b border-cp-border flex items-center justify-between bg-cp-card">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {/* Tab 1: Open Orders */}
          <button
            type="button"
            onClick={() => setActiveTab('open')}
            className={cn(
              'px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap',
              activeTab === 'open'
                ? 'bg-cp-gold text-cp-bg shadow-sm'
                : 'text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated'
            )}
          >
            <span>Open Orders</span>
            <Badge
              variant={activeTab === 'open' ? 'neutral' : 'gold'}
              size="sm"
              className="text-[10px] py-0"
            >
              {openOrders.length}
            </Badge>
          </button>

          {/* Tab 2: Order History */}
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={cn(
              'px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap',
              activeTab === 'history'
                ? 'bg-cp-gold text-cp-bg shadow-sm'
                : 'text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated'
            )}
          >
            Order History
          </button>

          {/* Tab 3: Trade History */}
          <button
            type="button"
            onClick={() => setActiveTab('trades')}
            className={cn(
              'px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap',
              activeTab === 'trades'
                ? 'bg-cp-gold text-cp-bg shadow-sm'
                : 'text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated'
            )}
          >
            Trade History
          </button>
        </div>

        {activeTab === 'open' && openOrders.length > 0 && (
          <button
            type="button"
            onClick={() => openOrders.forEach((o) => onCancelOrder(o.id))}
            className="text-[11px] text-cp-negative hover:underline font-semibold"
          >
            Cancel All
          </button>
        )}
      </div>

      {/* Content: Open Orders */}
      {activeTab === 'open' && (
        <div className="overflow-x-auto">
          {openOrders.length === 0 ? (
            <div className="py-12 text-center text-cp-text-muted font-sans space-y-1">
              <ClipboardList className="w-8 h-8 mx-auto text-cp-text-muted/60" />
              <p className="text-sm font-semibold text-cp-text-primary">No open orders</p>
              <p className="text-xs">Your active limit and stop orders will appear here.</p>
            </div>
          ) : (
            <table className="w-full text-left font-mono">
              <thead>
                <tr className="border-b border-cp-border/40 text-[10px] text-cp-text-muted uppercase tracking-wider bg-cp-elevated/30">
                  <th className="py-2.5 px-4 font-sans">Date/Time</th>
                  <th className="py-2.5 px-4 font-sans">Pair</th>
                  <th className="py-2.5 px-4 font-sans">Type</th>
                  <th className="py-2.5 px-4 font-sans">Side</th>
                  <th className="py-2.5 px-4">Price</th>
                  <th className="py-2.5 px-4">Amount</th>
                  <th className="py-2.5 px-4">Filled</th>
                  <th className="py-2.5 px-4">Total</th>
                  <th className="py-2.5 px-4 text-right font-sans">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cp-border/40">
                {openOrders.map((ord) => {
                  const isBuy = ord.side === 'buy'

                  return (
                    <tr key={ord.id} className="hover:bg-cp-elevated/40 transition-colors">
                      <td className="py-3 px-4 text-cp-text-muted text-[11px] font-sans">
                        {ord.time}
                      </td>
                      <td className="py-3 px-4 font-bold text-cp-text-primary">
                        {ord.pair}
                      </td>
                      <td className="py-3 px-4 text-cp-text-secondary capitalize font-sans">
                        {ord.type.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            'font-bold uppercase text-xs font-sans',
                            isBuy ? 'text-cp-positive' : 'text-cp-negative'
                          )}
                        >
                          {ord.side}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-cp-text-primary">
                        {formatCurrency(ord.price)}
                      </td>
                      <td className="py-3 px-4 text-cp-text-secondary">{ord.amount}</td>
                      <td className="py-3 px-4 text-cp-text-muted">
                        {((ord.filled / ord.amount) * 100).toFixed(0)}%
                      </td>
                      <td className="py-3 px-4 font-semibold text-cp-gold">
                        {formatCurrency(ord.total)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => onCancelOrder(ord.id)}
                          className="px-2 py-0.5 rounded text-[11px] font-sans font-semibold text-cp-negative hover:bg-cp-negative/10 transition-colors"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Content: Order History */}
      {activeTab === 'history' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono">
            <thead>
              <tr className="border-b border-cp-border/40 text-[10px] text-cp-text-muted uppercase tracking-wider bg-cp-elevated/30">
                <th className="py-2.5 px-4 font-sans">Date/Time</th>
                <th className="py-2.5 px-4 font-sans">Pair</th>
                <th className="py-2.5 px-4 font-sans">Type</th>
                <th className="py-2.5 px-4 font-sans">Side</th>
                <th className="py-2.5 px-4">Executed Price</th>
                <th className="py-2.5 px-4">Filled / Amount</th>
                <th className="py-2.5 px-4">Total Value</th>
                <th className="py-2.5 px-4 text-right font-sans">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cp-border/40">
              {orderHistory.map((ord) => {
                const isBuy = ord.side === 'buy'

                return (
                  <tr key={ord.id} className="hover:bg-cp-elevated/40 transition-colors">
                    <td className="py-3 px-4 text-cp-text-muted text-[11px] font-sans">
                      {ord.time}
                    </td>
                    <td className="py-3 px-4 font-bold text-cp-text-primary">
                      {ord.pair}
                    </td>
                    <td className="py-3 px-4 text-cp-text-secondary capitalize font-sans">
                      {ord.type.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          'font-bold uppercase text-xs font-sans',
                          isBuy ? 'text-cp-positive' : 'text-cp-negative'
                        )}
                      >
                        {ord.side}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-cp-text-primary">
                      {formatCurrency(ord.price)}
                    </td>
                    <td className="py-3 px-4 text-cp-text-secondary">
                      {ord.filled} / {ord.amount}
                    </td>
                    <td className="py-3 px-4 font-semibold text-cp-text-primary">
                      {formatCurrency(ord.total)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Badge
                        variant={
                          ord.status === 'filled'
                            ? 'positive'
                            : ord.status === 'cancelled'
                            ? 'negative'
                            : 'neutral'
                        }
                        size="sm"
                        className="text-[10px] py-0"
                      >
                        {ord.status}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Content: Trade History */}
      {activeTab === 'trades' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono">
            <thead>
              <tr className="border-b border-cp-border/40 text-[10px] text-cp-text-muted uppercase tracking-wider bg-cp-elevated/30">
                <th className="py-2.5 px-4 font-sans">Timestamp</th>
                <th className="py-2.5 px-4 font-sans">Pair</th>
                <th className="py-2.5 px-4 font-sans">Side</th>
                <th className="py-2.5 px-4">Fill Price</th>
                <th className="py-2.5 px-4">Filled Amount</th>
                <th className="py-2.5 px-4">Total</th>
                <th className="py-2.5 px-4 text-right font-sans">Fee Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cp-border/40">
              <tr className="hover:bg-cp-elevated/40 transition-colors">
                <td className="py-3 px-4 text-cp-text-muted text-[11px] font-sans">
                  Oct 20 05:22:15
                </td>
                <td className="py-3 px-4 font-bold text-cp-text-primary">BTC/USDT</td>
                <td className="py-3 px-4 text-cp-positive font-bold font-sans">BUY</td>
                <td className="py-3 px-4 text-cp-text-primary">$67,500.00</td>
                <td className="py-3 px-4 text-cp-text-secondary">0.1500 BTC</td>
                <td className="py-3 px-4 font-semibold text-cp-text-primary">$10,125.00</td>
                <td className="py-3 px-4 text-right text-cp-gold font-sans">$2.025 USDT</td>
              </tr>
              <tr className="hover:bg-cp-elevated/40 transition-colors">
                <td className="py-3 px-4 text-cp-text-muted text-[11px] font-sans">
                  Oct 19 16:45:10
                </td>
                <td className="py-3 px-4 font-bold text-cp-text-primary">BNB/USDT</td>
                <td className="py-3 px-4 text-cp-positive font-bold font-sans">BUY</td>
                <td className="py-3 px-4 text-cp-text-primary">$590.20</td>
                <td className="py-3 px-4 text-cp-text-secondary">2.00 BNB</td>
                <td className="py-3 px-4 font-semibold text-cp-text-primary">$1,180.40</td>
                <td className="py-3 px-4 text-right text-cp-gold font-sans">$0.236 USDT</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default BottomOrdersPanel
