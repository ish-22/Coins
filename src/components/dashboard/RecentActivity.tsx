import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  Sparkles,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Filter,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { Card, CardHeader, CardTitle } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import {
  mockRecentTransactions,
  mockRecentOrders,
  RecentTransaction,
  RecentOrder,
} from '@/mock/dashboardData'
import { formatCurrency, formatCrypto, truncateHash } from '@/utils/formatters'

export const RecentActivity: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'transactions'>('orders')
  const [statusFilter, setStatusFilter] = useState<'all' | 'filled' | 'open'>('all')

  const filteredOrders = mockRecentOrders.filter((ord) => {
    if (statusFilter === 'all') return true
    if (statusFilter === 'filled') return ord.status === 'filled'
    if (statusFilter === 'open') return ord.status === 'open' || ord.status === 'pending'
    return true
  })

  const getTxIcon = (type: RecentTransaction['type']) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownToLine className="w-4 h-4 text-cp-positive" />
      case 'withdrawal':
        return <ArrowUpFromLine className="w-4 h-4 text-cp-negative" />
      case 'trade_buy':
        return <ArrowLeftRight className="w-4 h-4 text-cp-positive" />
      case 'trade_sell':
        return <ArrowLeftRight className="w-4 h-4 text-cp-negative" />
      case 'earn_reward':
        return <Sparkles className="w-4 h-4 text-cp-gold" />
    }
  }

  const getOrderStatusBadge = (status: RecentOrder['status']) => {
    switch (status) {
      case 'filled':
        return (
          <Badge variant="positive" size="sm" withDot>
            Filled
          </Badge>
        )
      case 'open':
        return (
          <Badge variant="gold" size="sm" withDot pulseDot>
            Active (45%)
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="neutral" size="sm" withDot>
            Pending
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge variant="negative" size="sm">
            Cancelled
          </Badge>
        )
    }
  }

  return (
    <Card variant="default" padding="none" className="overflow-hidden">
      {/* Header with Switcher Tabs */}
      <div className="p-4 sm:p-6 border-b border-cp-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CardTitle className="text-lg">Trading & Account Activity</CardTitle>
          <Badge variant="neutral" size="sm">
            Mock Records
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Main Tab toggle */}
          <div className="p-1 rounded-xl bg-cp-elevated border border-cp-border flex items-center text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={cn(
                'px-3 py-1.5 rounded-lg font-bold transition-all',
                activeTab === 'orders'
                  ? 'bg-cp-card text-cp-gold border border-cp-gold/40 shadow-sm'
                  : 'text-cp-text-muted hover:text-cp-text-primary'
              )}
            >
              Recent Orders
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('transactions')}
              className={cn(
                'px-3 py-1.5 rounded-lg font-bold transition-all',
                activeTab === 'transactions'
                  ? 'bg-cp-card text-cp-gold border border-cp-gold/40 shadow-sm'
                  : 'text-cp-text-muted hover:text-cp-text-primary'
              )}
            >
              Transactions
            </button>
          </div>
        </div>
      </div>

      {/* Orders View */}
      {activeTab === 'orders' && (
        <div>
          {/* Subfilter pills */}
          <div className="px-4 sm:px-6 py-2.5 bg-cp-elevated/30 border-b border-cp-border flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-cp-text-muted font-medium">Filter:</span>
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={cn(
                  'px-2.5 py-0.5 rounded-full font-semibold',
                  statusFilter === 'all'
                    ? 'bg-cp-gold/20 text-cp-gold'
                    : 'text-cp-text-muted hover:text-cp-text-primary'
                )}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('open')}
                className={cn(
                  'px-2.5 py-0.5 rounded-full font-semibold',
                  statusFilter === 'open'
                    ? 'bg-cp-gold/20 text-cp-gold'
                    : 'text-cp-text-muted hover:text-cp-text-primary'
                )}
              >
                Open & Pending
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('filled')}
                className={cn(
                  'px-2.5 py-0.5 rounded-full font-semibold',
                  statusFilter === 'filled'
                    ? 'bg-cp-gold/20 text-cp-gold'
                    : 'text-cp-text-muted hover:text-cp-text-primary'
                )}
              >
                Filled
              </button>
            </div>

            <Link to="/orders" className="text-cp-gold hover:underline text-xs font-semibold">
              View All Orders
            </Link>
          </div>

          {/* Desktop Orders Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-cp-border text-cp-text-muted text-[11px] font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Market / Type</th>
                  <th className="py-3 px-4">Side</th>
                  <th className="py-3 px-4">Order Price</th>
                  <th className="py-3 px-4">Amount / Filled</th>
                  <th className="py-3 px-4">Total Value</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cp-border/60 font-mono">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-cp-text-muted font-sans">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="w-8 h-8 text-cp-text-muted" />
                        <span>No orders match the selected filter.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => {
                    const isBuy = ord.side === 'buy'

                    return (
                      <tr key={ord.id} className="hover:bg-cp-elevated/40 transition-colors">
                        <td className="py-3.5 px-4 font-sans">
                          <span className="font-bold text-cp-text-primary block">
                            {ord.pair}
                          </span>
                          <span className="text-[11px] text-cp-text-muted uppercase">
                            {ord.type}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={cn(
                              'font-bold uppercase text-xs',
                              isBuy ? 'text-cp-positive' : 'text-cp-negative'
                            )}
                          >
                            {ord.side}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-cp-text-primary">
                          {formatCurrency(ord.priceUsd)}
                        </td>

                        <td className="py-3.5 px-4 text-cp-text-secondary">
                          <div>
                            {ord.filledAmount} / {ord.amount}
                          </div>
                          <div className="w-20 bg-cp-elevated rounded-full h-1 mt-1 overflow-hidden">
                            <div
                              className="bg-cp-gold h-full"
                              style={{ width: `${ord.filledPercentage}%` }}
                            />
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-cp-text-primary">
                          {formatCurrency(ord.totalUsd)}
                        </td>

                        <td className="py-3.5 px-4">{getOrderStatusBadge(ord.status)}</td>

                        <td className="py-3.5 px-4 text-right text-cp-text-muted text-[11px]">
                          <div>{ord.date}</div>
                          <div>{ord.time}</div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Orders Cards */}
          <div className="sm:hidden divide-y divide-cp-border/60">
            {filteredOrders.length === 0 ? (
              <div className="py-8 text-center text-xs text-cp-text-muted">
                No orders found.
              </div>
            ) : (
              filteredOrders.map((ord) => {
                const isBuy = ord.side === 'buy'

                return (
                  <div key={ord.id} className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'text-xs font-bold uppercase px-1.5 py-0.5 rounded',
                            isBuy
                              ? 'bg-cp-positive/10 text-cp-positive'
                              : 'bg-cp-negative/10 text-cp-negative'
                          )}
                        >
                          {ord.side}
                        </span>
                        <span className="font-bold text-sm text-cp-text-primary font-sans">
                          {ord.pair}
                        </span>
                      </div>
                      {getOrderStatusBadge(ord.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                      <div>
                        <span className="text-cp-text-muted text-[11px] block">Price</span>
                        <span className="text-cp-text-primary font-semibold">
                          {formatCurrency(ord.priceUsd)}
                        </span>
                      </div>
                      <div>
                        <span className="text-cp-text-muted text-[11px] block">Total</span>
                        <span className="text-cp-text-primary font-semibold">
                          {formatCurrency(ord.totalUsd)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* Transactions View */}
      {activeTab === 'transactions' && (
        <div>
          {/* Subheader */}
          <div className="px-4 sm:px-6 py-2.5 bg-cp-elevated/30 border-b border-cp-border flex items-center justify-between text-xs">
            <span className="text-cp-text-muted">Recent on-chain & spot ledger activity</span>
            <Link to="/assets" className="text-cp-gold hover:underline font-semibold">
              Full Ledger
            </Link>
          </div>

          {/* Transactions List */}
          <div className="divide-y divide-cp-border/60">
            {mockRecentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-cp-elevated/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cp-elevated border border-cp-border shrink-0">
                    {getTxIcon(tx.type)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-cp-text-primary capitalize">
                        {tx.type.replace('_', ' ')} {tx.asset}
                      </span>
                      <Badge variant="positive" size="sm" className="text-[10px] py-0">
                        {tx.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-cp-text-muted mt-0.5">
                      <span>{tx.date} at {tx.time}</span>
                      {tx.txHash && (
                        <span className="font-mono text-cp-text-muted flex items-center gap-1 hover:text-cp-gold cursor-pointer">
                          <span>{truncateHash(tx.txHash)}</span>
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right font-mono">
                  <span
                    className={cn(
                      'text-sm font-bold block',
                      tx.type === 'deposit' || tx.type === 'earn_reward' || tx.type === 'trade_buy'
                        ? 'text-cp-positive'
                        : 'text-cp-text-primary'
                    )}
                  >
                    {tx.type === 'withdrawal' || tx.type === 'trade_sell' ? '-' : '+'}
                    {formatCrypto(tx.amount, tx.asset)}
                  </span>
                  <span className="text-xs text-cp-text-muted block">
                    ≈ {formatCurrency(tx.valueUsd)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 sm:px-6 bg-cp-elevated/40 border-t border-cp-border text-xs text-cp-text-muted flex items-center justify-between">
        <span>Displaying latest 5 records</span>
        <span className="font-mono text-[11px] text-cp-gold">Auto-synced</span>
      </div>
    </Card>
  )
}

export default RecentActivity
