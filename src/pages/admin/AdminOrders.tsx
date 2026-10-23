import React, { useState, useMemo } from 'react'
import {
  ArrowLeftRight,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  X,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { AdminOrderRecord, INITIAL_ADMIN_ORDERS } from '@/mock/adminData'
import { formatUSD } from '@/utils/formatters'

export const AdminOrders: React.FC = () => {
  const [orders] = useState<AdminOrderRecord[]>(INITIAL_ADMIN_ORDERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [pairFilter, setPairFilter] = useState<'all' | 'BTC/USDT' | 'ETH/USDT' | 'SOL/USDT' | 'XRP/USDT'>('all')
  const [sideFilter, setSideFilter] = useState<'all' | 'buy' | 'sell'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'filled' | 'cancelled'>('all')
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderRecord | null>(null)

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.orderRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.pair.toLowerCase().includes(searchQuery.toLowerCase())

      const matchPair = pairFilter === 'all' || o.pair === pairFilter
      const matchSide = sideFilter === 'all' || o.side === sideFilter
      const matchStatus = statusFilter === 'all' || o.status === statusFilter

      return matchSearch && matchPair && matchSide && matchStatus
    })
  }, [orders, searchQuery, pairFilter, sideFilter, statusFilter])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-cp-text-primary tracking-tight">
            Order Book & Trade Execution Logs
          </h1>
          <p className="text-xs text-cp-text-muted mt-0.5">
            Monitor simulated high-frequency spot limit orders, market fills, and cancellation metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="gold" size="sm">
            Total Mock Orders: {orders.length}
          </Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="bg-[#0c121c] border-cp-border">
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cp-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search by order ref, user name, or pair..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141d2b] border border-cp-border rounded-xl pl-9 pr-3 py-2 text-xs text-cp-text-primary placeholder:text-cp-text-muted/60 focus:outline-none focus:border-cp-gold/60"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Pair Selector */}
            <select
              value={pairFilter}
              onChange={(e) => setPairFilter(e.target.value as any)}
              className="bg-[#141d2b] border border-cp-border rounded-lg px-2.5 py-1.5 text-xs text-cp-text-primary focus:outline-none"
            >
              <option value="all">All Pairs</option>
              <option value="BTC/USDT">BTC/USDT</option>
              <option value="ETH/USDT">ETH/USDT</option>
              <option value="SOL/USDT">SOL/USDT</option>
              <option value="XRP/USDT">XRP/USDT</option>
            </select>

            {/* Side Filter */}
            <div className="flex items-center gap-1">
              {(['all', 'buy', 'sell'] as const).map((side) => (
                <button
                  key={side}
                  type="button"
                  onClick={() => setSideFilter(side)}
                  className={`px-2.5 py-1.5 rounded-lg border font-semibold transition-all uppercase text-[11px] ${
                    sideFilter === side
                      ? 'bg-cp-gold text-cp-bg border-cp-gold'
                      : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border-cp-border'
                  }`}
                >
                  {side}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-[#141d2b] border border-cp-border rounded-lg px-2.5 py-1.5 text-xs text-cp-text-primary focus:outline-none capitalize"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="filled">Filled</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="bg-[#0c121c] border-cp-border overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-cp-text-muted space-y-2">
            <ArrowLeftRight className="w-8 h-8 text-cp-text-muted mx-auto" />
            <p>No orders match the selected filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-cp-border bg-cp-elevated/40 text-cp-text-muted uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Pair</th>
                  <th className="py-3 px-4">Side & Type</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-right">Amount / Filled</th>
                  <th className="py-3 px-4 text-right">Total (USD)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created At</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cp-border/50 text-cp-text-secondary">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-cp-elevated/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-cp-gold">
                      {o.orderRef}
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-cp-text-primary block">{o.userName}</span>
                        <span className="text-[10px] text-cp-text-muted font-mono block">{o.userId}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-cp-text-primary">
                      {o.pair}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-bold uppercase text-[11px] ${
                            o.side === 'buy' ? 'text-cp-positive' : 'text-cp-negative'
                          }`}
                        >
                          {o.side}
                        </span>
                        <span className="text-[10px] text-cp-text-muted capitalize">({o.type})</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-cp-text-primary">
                      {formatUSD(o.price)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-cp-text-secondary">
                      {o.filled} / {o.amount}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-cp-gold">
                      {formatUSD(o.totalUsd)}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        variant={o.status === 'filled' ? 'positive' : o.status === 'open' ? 'gold' : 'neutral'}
                        size="sm"
                        className="capitalize"
                      >
                        {o.status}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-cp-text-muted">
                      {o.createdAt}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(o)}
                        className="px-2.5 py-1 rounded-lg bg-cp-elevated hover:bg-cp-card border border-cp-border text-cp-text-secondary hover:text-cp-gold transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ORDER DETAIL MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative w-full max-w-md bg-[#0c121c] border border-cp-border rounded-2xl shadow-2xl p-6 z-10 animate-fadeIn space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-cp-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-cp-text-primary">
                    Order: {selectedOrder.orderRef}
                  </h3>
                  <Badge
                    variant={selectedOrder.status === 'filled' ? 'positive' : selectedOrder.status === 'open' ? 'gold' : 'neutral'}
                    size="sm"
                    className="capitalize"
                  >
                    {selectedOrder.status}
                  </Badge>
                </div>
                <span className="text-xs text-cp-text-muted">
                  Account: <strong>{selectedOrder.userName}</strong> ({selectedOrder.userId})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3.5 text-xs">
              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase">Market Pair</span>
                <span className="font-bold text-base text-cp-text-primary mt-0.5 block">{selectedOrder.pair}</span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase">Side & Order Type</span>
                <span
                  className={`font-bold text-base uppercase mt-0.5 block ${
                    selectedOrder.side === 'buy' ? 'text-cp-positive' : 'text-cp-negative'
                  }`}
                >
                  {selectedOrder.side} ({selectedOrder.type})
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase">Execution Price</span>
                <span className="font-mono text-cp-text-primary font-bold mt-0.5 block">
                  {formatUSD(selectedOrder.price)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase">Filled / Target Amount</span>
                <span className="font-mono text-cp-text-primary font-bold mt-0.5 block">
                  {selectedOrder.filled} / {selectedOrder.amount}
                </span>
              </div>

              <div className="col-span-2 p-3 rounded-xl bg-cp-elevated/40 border border-cp-border flex items-center justify-between">
                <span className="text-cp-text-muted text-[10px] uppercase">Total Order Value:</span>
                <span className="font-mono text-base font-bold text-cp-gold">
                  {formatUSD(selectedOrder.totalUsd)}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-cp-border text-xs text-cp-text-muted">
              <span>Placed: {selectedOrder.createdAt}</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrders
