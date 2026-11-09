import React, { useState, useEffect, useMemo } from 'react'
import {
  History,
  Search,
  Filter,
  Download,
  ArrowDownToLine,
  ArrowUpFromLine,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Wallet,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { formatUSD } from '@/utils/formatters'
import { adminService } from '@/services'

export const AdminTransactions: React.FC = () => {
  const [deposits, setDeposits] = useState<any[]>([])
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'deposit' | 'withdrawal'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'rejected'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const loadAllTransactions = async () => {
    try {
      setIsLoading(true)
      const [depData, withData] = await Promise.allSettled([
        adminService.getDeposits(),
        adminService.getWithdrawals(),
      ])

      if (depData.status === 'fulfilled') setDeposits(depData.value)
      if (withData.status === 'fulfilled') setWithdrawals(withData.value)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAllTransactions()
  }, [])

  const combinedTransactions = useMemo(() => {
    const depList = deposits.map((d) => ({
      ...d,
      txType: 'deposit',
      amountVal: d.amount,
      assetSymbol: d.asset,
      timestamp: d.timestamp || d.createdAt || 'Recent',
      hashOrAddress: d.txHash || d.address || 'Network Confirmation',
    }))

    const withList = withdrawals.map((w) => ({
      ...w,
      txType: 'withdrawal',
      amountVal: w.amount,
      assetSymbol: w.asset,
      timestamp: w.timestamp || w.createdAt || 'Recent',
      hashOrAddress: w.destinationAddress || w.address || w.txHash || 'Payout Vault',
    }))

    let all = [...depList, ...withList]

    if (typeFilter !== 'all') {
      all = all.filter((t) => t.txType === typeFilter)
    }

    if (statusFilter !== 'all') {
      all = all.filter((t) => {
        const s = (t.status || '').toLowerCase()
        if (statusFilter === 'completed') return s === 'completed' || s === 'approved'
        if (statusFilter === 'pending') return s === 'pending' || s === 'processing' || s === 'pending_review'
        if (statusFilter === 'rejected') return s === 'rejected'
        return true
      })
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      all = all.filter(
        (t) =>
          (t.id && String(t.id).toLowerCase().includes(q)) ||
          (t.assetSymbol && t.assetSymbol.toLowerCase().includes(q)) ||
          (t.hashOrAddress && t.hashOrAddress.toLowerCase().includes(q)) ||
          (t.userName && t.userName.toLowerCase().includes(q))
      )
    }

    return all
  }, [deposits, withdrawals, typeFilter, statusFilter, searchQuery])

  const totalPages = Math.ceil(combinedTransactions.length / itemsPerPage) || 1
  const paginatedTransactions = combinedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalInflow = useMemo(() => {
    return deposits.reduce((acc, d) => acc + (d.valueUsd || (d.amount * 1) || 0), 0)
  }, [deposits])

  const totalOutflow = useMemo(() => {
    return withdrawals.reduce((acc, w) => acc + (w.valueUsd || (w.amount * 1) || 0), 0)
  }, [withdrawals])

  const handleExportCsv = () => {
    const headers = ['Tx ID', 'Type', 'Asset', 'Amount', 'Value USD', 'Network', 'Destination / Hash', 'Status', 'Timestamp']
    const rows = combinedTransactions.map((t) => [
      t.id,
      t.txType.toUpperCase(),
      t.assetSymbol,
      t.amountVal,
      t.valueUsd || 0,
      t.network || 'Mainnet',
      `"${t.hashOrAddress}"`,
      t.status.toUpperCase(),
      `"${t.timestamp}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `coinplus-transactions-${Date.now()}.csv`
    link.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-cp-text-primary tracking-tight">
            Transaction History
          </h1>
          <p className="text-xs text-cp-text-muted mt-0.5">
            Unified institutional treasury ledger covering on-chain deposits, client withdrawals, and clearing movements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCsv} className="flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-cp-gold" />
            <span>Export CSV</span>
          </Button>

          <Button variant="primary" size="sm" onClick={loadAllTransactions} disabled={isLoading} className="flex items-center gap-1.5">
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Ledger</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#0c121c] border-cp-border">
          <CardContent className="p-5 space-y-2">
            <span className="text-xs font-semibold text-cp-text-muted uppercase tracking-wider block">
              Total Inflows (Deposits)
            </span>
            <div className="text-2xl font-black font-mono text-emerald-400">
              {formatUSD(totalInflow)}
            </div>
            <span className="text-[11px] text-cp-text-muted">{deposits.length} recorded deposits</span>
          </CardContent>
        </Card>

        <Card className="bg-[#0c121c] border-cp-border">
          <CardContent className="p-5 space-y-2">
            <span className="text-xs font-semibold text-cp-text-muted uppercase tracking-wider block">
              Total Outflows (Withdrawals)
            </span>
            <div className="text-2xl font-black font-mono text-amber-400">
              {formatUSD(totalOutflow)}
            </div>
            <span className="text-[11px] text-cp-text-muted">{withdrawals.length} authorized payouts</span>
          </CardContent>
        </Card>

        <Card className="bg-[#0c121c] border-cp-border">
          <CardContent className="p-5 space-y-2">
            <span className="text-xs font-semibold text-cp-text-muted uppercase tracking-wider block">
              Net Capital Retention
            </span>
            <div className="text-2xl font-black font-mono text-cp-gold">
              {formatUSD(Math.max(0, totalInflow - totalOutflow))}
            </div>
            <span className="text-[11px] text-cp-positive font-semibold">Positive treasury reserve</span>
          </CardContent>
        </Card>

        <Card className="bg-[#0c121c] border-cp-border">
          <CardContent className="p-5 space-y-2">
            <span className="text-xs font-semibold text-cp-text-muted uppercase tracking-wider block">
              Total Ledger Records
            </span>
            <div className="text-2xl font-black font-mono text-cp-text-primary">
              {combinedTransactions.length}
            </div>
            <span className="text-[11px] text-cp-text-muted">Settlement queue active</span>
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
              placeholder="Search by Tx ID, Asset, Address, or TxHash..."
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
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as any)
                setCurrentPage(1)
              }}
              className="bg-[#141d2b] border border-cp-border rounded-lg px-2.5 py-1.5 text-xs text-cp-text-primary focus:outline-none"
            >
              <option value="all">All Movements (Deposits & Withdrawals)</option>
              <option value="deposit">Deposits Only</option>
              <option value="withdrawal">Withdrawals Only</option>
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
              <option value="completed">Completed / Approved</option>
              <option value="pending">Pending / Processing</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="bg-[#0c121c] border-cp-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-cp-border bg-cp-elevated/40 text-cp-text-muted uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Asset & Amount</th>
                <th className="py-3 px-4">Value USD</th>
                <th className="py-3 px-4">Network & Hash / Address</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cp-border/50 text-cp-text-secondary">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-cp-text-muted">
                    No transaction records match your filters.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx) => (
                  <tr key={tx.id || Math.random()} className="hover:bg-cp-elevated/20 transition-colors">
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                          tx.txType === 'deposit'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {tx.txType === 'deposit' ? <ArrowDownToLine className="w-3 h-3" /> : <ArrowUpFromLine className="w-3 h-3" />}
                        {tx.txType}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-cp-gold">
                      {tx.id}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-cp-text-primary">
                      {tx.amountVal} {tx.assetSymbol}
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-cp-gold">
                      {formatUSD(tx.valueUsd || tx.amountVal * 1)}
                    </td>

                    <td className="py-3 px-4 max-w-xs truncate font-mono text-[11px]">
                      <span className="text-cp-text-primary block font-sans">{tx.network || 'Mainnet'}</span>
                      <span className="text-cp-text-muted truncate block">{tx.hashOrAddress}</span>
                    </td>

                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          tx.status === 'completed' || tx.status === 'approved'
                            ? 'positive'
                            : tx.status === 'rejected'
                            ? 'negative'
                            : 'gold'
                        }
                        size="sm"
                        className="capitalize"
                      >
                        {tx.status}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-cp-text-muted whitespace-nowrap">
                      {tx.timestamp}
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

export default AdminTransactions

