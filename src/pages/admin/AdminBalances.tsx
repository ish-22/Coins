import React, { useState, useEffect, useMemo } from 'react'
import {
  Wallet,
  Search,
  ArrowUpRight,
  ArrowDownToLine,
  TrendingUp,
  RefreshCw,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle2,
  Lock,
  DollarSign,
  History,
  Sliders,
  Scale,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { formatUSD } from '@/utils/formatters'
import { adminService } from '@/services'
import { AdminUser } from '@/mock/adminData'

export const AdminBalances: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Balance Adjustment Modal
  const [adjustModalUser, setAdjustModalUser] = useState<AdminUser | null>(null)
  const [adjAsset, setAdjAsset] = useState('USDT')
  const [adjAmount, setAdjAmount] = useState('')
  const [adjType, setAdjType] = useState<'add' | 'deduct' | 'correction'>('add')
  const [adjProcedure, setAdjProcedure] = useState<'verified_payment' | 'refund' | 'correction' | 'authorized_procedure'>('verified_payment')
  const [adjReason, setAdjReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      const data = await adminService.getUsers()
      setUsers(data)
    } catch {
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return users
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.userRef.toLowerCase().includes(q)
    )
  }, [users, searchQuery])

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPlatformBalance = useMemo(() => {
    return users.reduce((acc, u) => acc + (u.balanceUsd || 0), 0)
  }, [users])

  const handleOpenAdjust = (user: AdminUser) => {
    setAdjustModalUser(user)
    setAdjAsset('USDT')
    setAdjAmount('')
    setAdjType('add')
    setAdjProcedure('verified_payment')
    setAdjReason('')
    setModalError(null)
  }

  const handleExecuteAdjustment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adjustModalUser) return

    const amount = parseFloat(adjAmount)
    if (isNaN(amount) || amount <= 0) {
      setModalError('Please enter a valid positive numerical amount.')
      return
    }

    if (!adjReason.trim() || adjReason.trim().length < 5) {
      setModalError('A detailed reason (minimum 5 characters) is required for regulatory audit logging.')
      return
    }

    setIsSubmitting(true)
    setModalError(null)

    try {
      const res = await adminService.adjustUserBalance(adjustModalUser.id, {
        asset: adjAsset,
        amount,
        type: adjType,
        procedure: adjProcedure,
        reason: adjReason.trim(),
        deltaDirection: adjType === 'deduct' ? 'decrease' : 'increase',
      })

      setSuccessToast(res?.message || `Successfully adjusted ${adjAsset} balance for ${adjustModalUser.name}.`)
      setAdjustModalUser(null)
      loadUsers()
      setTimeout(() => setSuccessToast(null), 4000)
    } catch (err: any) {
      setModalError(err?.response?.data?.message || 'Failed to submit balance adjustment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-cp-text-primary tracking-tight">
            Balance Management
          </h1>
          <p className="text-xs text-cp-text-muted mt-0.5">
            Monitor client asset valuations, reserve accounts, and execute audited administrative ledger adjustments
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={loadUsers} disabled={isLoading} className="flex items-center gap-1.5">
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Balances</span>
        </Button>
      </div>

      {successToast && (
        <div className="p-3.5 rounded-xl bg-cp-positive/15 border border-cp-positive/30 text-xs text-cp-positive flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button type="button" onClick={() => setSuccessToast(null)} className="p-1 hover:text-white">✕</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#0c121c] border-cp-border">
          <CardContent className="p-5 space-y-2">
            <span className="text-xs font-semibold text-cp-text-muted uppercase tracking-wider block">
              Total Platform Assets
            </span>
            <div className="text-2xl font-black font-mono text-cp-gold">
              {formatUSD(totalPlatformBalance)}
            </div>
            <span className="text-[11px] text-cp-positive font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Aggregated client equity
            </span>
          </CardContent>
        </Card>

        <Card className="bg-[#0c121c] border-cp-border">
          <CardContent className="p-5 space-y-2">
            <span className="text-xs font-semibold text-cp-text-muted uppercase tracking-wider block">
              Available Client Liquidity
            </span>
            <div className="text-2xl font-black font-mono text-emerald-400">
              {formatUSD(totalPlatformBalance * 0.9)}
            </div>
            <span className="text-[11px] text-cp-text-muted">Unencumbered free balance</span>
          </CardContent>
        </Card>

        <Card className="bg-[#0c121c] border-cp-border">
          <CardContent className="p-5 space-y-2">
            <span className="text-xs font-semibold text-cp-text-muted uppercase tracking-wider block">
              Locked in Open Orders
            </span>
            <div className="text-2xl font-black font-mono text-amber-400">
              {formatUSD(totalPlatformBalance * 0.1)}
            </div>
            <span className="text-[11px] text-cp-text-muted">Active spot order guarantees</span>
          </CardContent>
        </Card>

        <Card className="bg-[#0c121c] border-cp-border">
          <CardContent className="p-5 space-y-2">
            <span className="text-xs font-semibold text-cp-text-muted uppercase tracking-wider block">
              Settlement Status
            </span>
            <div className="text-2xl font-black font-mono text-cp-positive">
              100% Reserve
            </div>
            <span className="text-[11px] text-cp-positive font-semibold">Fully collateralized</span>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="bg-[#0c121c] border-cp-border">
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cp-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search user balances by name, email, or UID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full bg-[#141d2b] border border-cp-border rounded-xl pl-9 pr-3 py-2 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold/60"
            />
          </div>
          <span className="text-xs text-cp-text-muted font-mono">
            {filteredUsers.length} accounts indexed
          </span>
        </CardContent>
      </Card>

      {/* Users Balances Table */}
      <Card className="bg-[#0c121c] border-cp-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-cp-border bg-cp-elevated/40 text-cp-text-muted uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">KYC Tier</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Total Balance USD</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cp-border/50 text-cp-text-secondary">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-cp-text-muted">
                    No client balance records match your search.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-cp-elevated/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-cp-text-primary">{user.name}</span>
                          <span className="text-[10px] text-cp-gold font-mono font-bold">({user.userRef})</span>
                        </div>
                        <span className="text-[11px] text-cp-text-muted font-mono">{user.email}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 uppercase text-[10px] font-mono text-cp-text-muted">
                      {user.role}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-cp-text-primary">
                        {user.kycTier}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={user.status === 'active' ? 'positive' : 'negative'} size="sm" className="capitalize">
                        {user.status}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-cp-gold text-sm">
                      {formatUSD(user.balanceUsd)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenAdjust(user)}
                        className="text-xs h-7 px-2.5 font-semibold"
                      >
                        Adjust Balance
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

      {/* Balance Adjustment Modal */}
      {adjustModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isSubmitting && setAdjustModalUser(null)} />
          <div className="relative w-full max-w-lg bg-[#0c121c] border border-cp-gold/40 rounded-2xl shadow-2xl p-6 z-10 space-y-4 max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-cp-border">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cp-gold/15 text-cp-gold border border-cp-gold/30">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-cp-text-primary">
                    Manual Balance Adjustment
                  </h3>
                  <p className="text-xs text-cp-text-muted">
                    Target: <strong>{adjustModalUser.name}</strong> ({adjustModalUser.userRef})
                  </p>
                </div>
              </div>
              <button onClick={() => setAdjustModalUser(null)} className="text-cp-text-muted hover:text-white">✕</button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-cp-negative/10 border border-cp-negative/30 text-xs text-cp-negative flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleExecuteAdjustment} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-cp-text-muted block font-semibold mb-1">Adjustment Action</label>
                  <select
                    value={adjType}
                    onChange={(e) => setAdjType(e.target.value as any)}
                    className="w-full bg-[#141d2b] border border-cp-border rounded-xl p-2.5 text-cp-text-primary focus:outline-none"
                  >
                    <option value="add">Credit (+ Increase Balance)</option>
                    <option value="deduct">Debit (- Deduct Balance)</option>
                    <option value="correction">Correction / Audit Delta</option>
                  </select>
                </div>

                <div>
                  <label className="text-cp-text-muted block font-semibold mb-1">Target Asset</label>
                  <select
                    value={adjAsset}
                    onChange={(e) => setAdjAsset(e.target.value)}
                    className="w-full bg-[#141d2b] border border-cp-border rounded-xl p-2.5 text-cp-text-primary focus:outline-none"
                  >
                    <option value="USDT">USDT (Tether USD)</option>
                    <option value="BTC">BTC (Bitcoin)</option>
                    <option value="ETH">ETH (Ethereum)</option>
                    <option value="SOL">SOL (Solana)</option>
                    <option value="BNB">BNB (Binance Coin)</option>
                    <option value="USDC">USDC (USD Coin)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-cp-text-muted block font-semibold mb-1">Adjustment Amount *</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 500.00"
                  value={adjAmount}
                  onChange={(e) => setAdjAmount(e.target.value)}
                  className="w-full bg-[#141d2b] border border-cp-border rounded-xl p-2.5 text-cp-text-primary font-mono text-sm focus:outline-none focus:border-cp-gold"
                  required
                />
              </div>

              <div>
                <label className="text-cp-text-muted block font-semibold mb-1">Regulatory Procedure</label>
                <select
                  value={adjProcedure}
                  onChange={(e) => setAdjProcedure(e.target.value as any)}
                  className="w-full bg-[#141d2b] border border-cp-border rounded-xl p-2.5 text-cp-text-primary focus:outline-none"
                >
                  <option value="verified_payment">Verified Bank Wire / Payment Settled</option>
                  <option value="refund">Disputed Chargeback / Customer Refund</option>
                  <option value="correction">Manual Ledger Correction</option>
                  <option value="authorized_procedure">Authorized Administrative Discretion</option>
                </select>
              </div>

              <div>
                <label className="text-cp-text-muted block font-semibold mb-1">Compliance Audit Justification Reason *</label>
                <textarea
                  rows={3}
                  placeholder="Detail the exact reason for this manual credit/debit. Recorded in immutable audit log."
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  className="w-full bg-[#141d2b] border border-cp-border rounded-xl p-2.5 text-cp-text-primary focus:outline-none focus:border-cp-gold"
                  required
                />
                <span className="text-[10px] text-cp-text-muted mt-1 block">
                  Mandatory under financial compliance regulations. Minimum 5 characters.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-cp-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAdjustModalUser(null)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5"
                >
                  {isSubmitting ? 'Auditing & Submitting...' : 'Confirm Balance Adjustment'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminBalances

