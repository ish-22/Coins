import React, { useState, useEffect, useMemo } from 'react'
import {
  TrendingUp,
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  BarChart3,
  Award,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { formatUSD } from '@/utils/formatters'
import { adminService } from '@/services'
import { AdminOrderRecord } from '@/mock/adminData'

export const AdminTradingHistory: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrderRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [pairFilter, setPairFilter] = useState('all')
  const [sideFilter, setSideFilter] = useState<'all' | 'buy' | 'sell'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'filled' | 'open' | 'cancelled'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const loadTradingHistory = async () => {
    try {
      setIsLoading(true)
      const data = await adminService.getOrders()
      setOrders(data)
    } catch {
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTradingHistory()
  }, [])

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.pair.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.userId && o.userId.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchPair = pairFilter === 'all' || o.pair === pairFilter
      const matchSide = sideFilter === 'all' || o.side === sideFilter
      const matchStatus = statusFilter === 'all' || o.status === statusFilter

      return matchSearch && matchPair && matchSide && matchStatus
    })
  }, [orders, searchQuery, pairFilter, sideFilter, statusFilter])

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const pairsList = useMemo(() => {
    const set = new Set(orders.map((o) => o.pair))
    return Array.from(set)
  }, [orders])

  const totalVolume = useMemo(() => {
    return filteredOrders.reduce((acc, o) => acc + (o.totalUsd || (o.price * o.amount) || 0), 0)
  }, [filteredOrders])

  const filledCount = useMemo(() => {
    return filteredOrders.filter((o) => o.status === 'filled').length
  }, [filteredOrders])

  const handleExportCsv = () => {
    const headers = ['Order ID', 'Pair', 'Side', 'Type', 'Price USD', 'Amount', 'Filled', 'Total USD', 'Status', 'Timestamp']
    const rows = filteredOrders.map((o) => [
      o.id,
      o.pair,
      o.side.toUpperCase(),
      o.type.toUpperCase(),
      o.price,
      o.amount,
      o.filled,
      o.totalUsd || (o.price * o.amount),
      o.status.toUpperCase(),
      `"${o.createdAt}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `coinplus-trading-history-${Date.now()}.csv`
    link.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-cp-text-primary tracking-tight">
            Trading History
          </h1>
          <p className="text-xs text-cp-text-muted mt-0.5">
            Audit spot order executions, matched transactions, and order book historical depth
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCsv} className="flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-cp-gold" />
            <span>Export CSV</span>
          </Button>

          <Button variant="primary" size="sm" onClick={loadTradingHistory} disabled={isLoading} className="flex items-center gap-1.5">
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#0c121c] border-cp-border">
          <CardContent className="p-5 space-y-2">
            <span className="text-xs font-semibold text-cp-text-muted uppercase tracking-wider block">
              Total Executed Volume
            </span>
            <div className="text-2xl font-black font-mono text-cp-gold">
              {formatUSD(totalVolume)}
            </div>
            <span className="text-[11px] text-cp-positive font-semibold">Matched Spot Depth</span>
          </CardContent>
        </Card>

        <Card className="bg-[#0c121c] border-cp-border">
          <CardContent className="p-5 space-y-2">
            <span className="text-xs font-semibold text-cp-text-muted uppercase tracking-wider block">
              Filled Executions
            </span>
            <div className="text-2xl font-black font-mono text-emerald-400">
              {filledCount.toLocaleString()}
            </div>
            <span className="text-[11px] text-cp-text-muted">100% Settled Orders</span>
          </CardContent>
        </Card>

        <Card className="bg-[#0c121c] border-cp-border">
          <CardContent className="p-5 space-y-2">
            <span className="text-xs font-semibold text-cp-text-muted uppercase tracking-wider block">
              Total Orders Logged
            </span>
            <div className="text-2xl font-black font-mono text-cp-text-primary">
              {filteredOrders.length.toLocaleString()}
            </div>
            <span className="text-[11px] text-cp-text-muted">Across all spot books</span>
          </CardContent>
        </Card>

        <Card className="bg-[#0c121c] border-cp-border">
          <CardContent className="p-5 space-y-2">
            <span className="text-xs font-semibold text-cp-text-muted uppercase tracking-wider block">
              Order Fill Rate
            </span>
            <div className="text-2xl font-black font-mono text-cp-gold">
              {filteredOrders.length > 0 ? Math.round((filledCount / filteredOrders.length) * 100) : 0}%
            </div>
            <span className="text-[11px] text-cp-positive font-semibold">Matching latency &lt; 0.5ms</span>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="bg-[#0c121c] border-cp-border">
        <CardContent className="p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cp-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search by Order ID, Trading Pair, or User ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full bg-[#141d2b] border border-cp-border rounded-xl pl-9 pr-3 py-2 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold/60"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={pairFilter}
              onChange={(e) => {
                setPairFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="bg-[#141d2b] border border-cp-border rounded-lg px-2.5 py-1.5 text-xs text-cp-text-primary focus:outline-none"
            >
              <option value="all">All Trading Pairs</option>
              {pairsList.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <select
              value={sideFilter}
              onChange={(e) => {
                setSideFilter(e.target.value as any)
                setCurrentPage(1)
              }}
              className="bg-[#141d2b] border border-cp-border rounded-lg px-2.5 py-1.5 text-xs text-cp-text-primary focus:outline-none uppercase"
            >
              <option value="all">All Sides (BUY & SELL)</option>
              <option value="buy">BUY Only</option>
              <option value="sell">SELL Only</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any)
                setCurrentPage(1)
              }}
              className="bg-[#141d2b] border border-cp-border rounded-lg px-2.5 py-1.5 text-xs text-cp-text-primary focus:outline-none capitalize"
            >
              <option value="all">All Statuses</option>
              <option value="filled">Filled</option>
              <option value="open">Open</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="bg-[#0c121c] border-cp-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-cp-border bg-cp-elevated/40 text-cp-text-muted uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Pair</th>
                <th className="py-3 px-4">Side</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4 text-right">Amount / Filled</th>
                <th className="py-3 px-4 text-right">Total USD</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cp-border/50 text-cp-text-secondary">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-cp-text-muted">
                    No order records found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-cp-elevated/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-cp-gold">
                      {ord.id}
                    </td>

                    <td className="py-3 px-4 font-bold text-cp-text-primary">
                      {ord.pair}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ord.side === 'buy'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {ord.side}
                      </span>
                    </td>

                    <td className="py-3 px-4 uppercase text-[10px] font-mono text-cp-text-muted">
                      {ord.type}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-cp-text-primary">
                      {formatUSD(ord.price)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono">
                      {ord.filled} / {ord.amount}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-cp-gold">
                      {formatUSD(ord.totalUsd || (ord.price * ord.amount))}
                    </td>

                    <td className="py-3 px-4">
                      <Badge
                        variant={ord.status === 'filled' ? 'positive' : ord.status === 'cancelled' ? 'neutral' : 'gold'}
                        size="sm"
                        className="capitalize"
                      >
                        {ord.status}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-cp-text-muted whitespace-nowrap">
                      {ord.createdAt}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-3 border-t border-cp-border flex items-center justify-between text-xs text-cp-text-muted">
            <span>Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default AdminTradingHistory
