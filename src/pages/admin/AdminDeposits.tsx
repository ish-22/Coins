import React, { useState, useMemo, useEffect } from 'react'
import {
  ArrowDownToLine,
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  X,
  Copy,
  Check,
  Wallet,
  Settings2,
  Plus,
  RefreshCw,
  AlertTriangle,
  User,
  ShieldCheck,
  Filter,
  DollarSign,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { AdminDepositRecord, AdminDepositMethod } from '@/mock/adminData'
import { formatUSD } from '@/utils/formatters'
import { adminService } from '@/services'

export const AdminDeposits: React.FC = () => {
  const [deposits, setDeposits] = useState<AdminDepositRecord[]>([])
  const [depositMethods, setDepositMethods] = useState<AdminDepositMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMethods, setIsLoadingMethods] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'rejected'>('all')
  const [assetFilter, setAssetFilter] = useState<string>('all')
  const [userFilter, setUserFilter] = useState<{ userId: string; userName: string; email?: string } | null>(null)
  const [selectedDeposit, setSelectedDeposit] = useState<AdminDepositRecord | null>(null)

  // Notification toast
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Deposit Methods Modal
  const [isMethodModalOpen, setIsMethodModalOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<AdminDepositMethod | null>(null)
  const [isSavingMethod, setIsSavingMethod] = useState(false)

  // Add New Method Form in Modal
  const [isAddingMethod, setIsAddingMethod] = useState(false)
  const [newMethodData, setNewMethodData] = useState<{
    asset: string
    name: string
    network: string
    address: string
    minDeposit: number
    confirmations: number
    memoRequired: boolean
    memo: string
  }>({
    asset: 'USDT',
    name: 'Tether USD (Arbitrum)',
    network: 'Arbitrum One',
    address: '',
    minDeposit: 10,
    confirmations: 20,
    memoRequired: false,
    memo: '',
  })

  // Review Action Modal (Approve / Reject)
  const [reviewAction, setReviewAction] = useState<{
    type: 'approve' | 'reject'
    deposit: AdminDepositRecord
  } | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  // Auto-dismiss notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  // Load deposits from backend
  const loadDeposits = async () => {
    try {
      setIsLoading(true)
      setLoadError(null)
      const liveDeposits = await adminService.getDeposits()
      setDeposits(liveDeposits)
    } catch (error: any) {
      setLoadError(error?.response?.data?.message || 'Unable to load deposit ledger from the API.')
      setDeposits([])
    } finally {
      setIsLoading(false)
    }
  }

  // Load supported deposit methods and current wallet addresses
  const loadDepositMethods = async () => {
    try {
      setIsLoadingMethods(true)
      const methods = await adminService.getDepositMethods()
      setDepositMethods(methods)
    } catch (err: any) {
      console.error('Failed to load deposit methods', err)
    } finally {
      setIsLoadingMethods(false)
    }
  }

  useEffect(() => {
    loadDeposits()
    loadDepositMethods()
  }, [])

  // Filtered deposits
  const filteredDeposits = useMemo(() => {
    return deposits.filter((d) => {
      // User filter
      if (userFilter && d.userId !== userFilter.userId) {
        return false
      }

      // Search query (ref, user, email, txHash, address)
      const q = searchQuery.toLowerCase()
      const matchSearch =
        !searchQuery ||
        d.depositRef.toLowerCase().includes(q) ||
        d.userName.toLowerCase().includes(q) ||
        (d.userEmail && d.userEmail.toLowerCase().includes(q)) ||
        (d.userRef && d.userRef.toLowerCase().includes(q)) ||
        d.userId.toLowerCase().includes(q) ||
        d.txHash.toLowerCase().includes(q) ||
        d.destinationAddress.toLowerCase().includes(q)

      // Status filter
      let matchStatus = true
      if (statusFilter !== 'all') {
        if (statusFilter === 'completed') {
          matchStatus = d.status === 'completed'
        } else if (statusFilter === 'pending') {
          matchStatus = d.status === 'pending' || (d.status as string) === 'confirming'
        } else if (statusFilter === 'rejected') {
          matchStatus = d.status === 'rejected' || (d.status as string) === 'failed'
        }
      }

      // Asset filter
      const matchAsset = assetFilter === 'all' || d.asset.toUpperCase() === assetFilter.toUpperCase()

      return matchSearch && matchStatus && matchAsset
    })
  }, [deposits, searchQuery, statusFilter, assetFilter, userFilter])

  // Count summaries
  const pendingCount = useMemo(
    () => deposits.filter((d) => d.status === 'pending' || (d.status as string) === 'confirming').length,
    [deposits]
  )
  const completedCount = useMemo(() => deposits.filter((d) => d.status === 'completed').length, [deposits])
  const rejectedCount = useMemo(
    () => deposits.filter((d) => d.status === 'rejected' || (d.status as string) === 'failed').length,
    [deposits]
  )

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    }
  }

  // Handle Approve / Reject Deposit
  const handleConfirmReview = async () => {
    if (!reviewAction) return
    const { type, deposit } = reviewAction

    if (type === 'reject' && !rejectionReason.trim()) {
      setNotification({
        type: 'error',
        message: 'A rejection reason is mandatory when rejecting a deposit.',
      })
      return
    }

    try {
      setIsSubmittingReview(true)
      const res = await adminService.reviewDeposit(deposit.id, type, rejectionReason)
      setNotification({
        type: 'success',
        message:
          type === 'approve'
            ? `Deposit ${deposit.depositRef} approved! User balance credited with +${deposit.amount} ${deposit.asset}.`
            : `Deposit ${deposit.depositRef} rejected. Rejection reason recorded and user notified.`,
      })
      setReviewAction(null)
      setRejectionReason('')
      if (selectedDeposit?.id === deposit.id) {
        setSelectedDeposit(null)
      }
      await loadDeposits()
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to review deposit. Please try again.',
      })
    } finally {
      setIsSubmittingReview(false)
    }
  }

  // Handle Save Updated Wallet Address / Method
  const handleSaveMethod = async (method: AdminDepositMethod) => {
    try {
      setIsSavingMethod(true)
      const updatedMethods = depositMethods.map((m) => (m.id === method.id ? method : m))
      const res = await adminService.updateDepositMethods(updatedMethods)
      setDepositMethods(res.methods)
      setEditingMethod(null)
      setNotification({
        type: 'success',
        message: `Updated deposit address for ${method.asset} (${method.network}). User panel reflects change immediately!`,
      })
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to update deposit method wallet address.',
      })
    } finally {
      setIsSavingMethod(false)
    }
  }

  // Handle Add New Supported Deposit Method
  const handleAddNewMethod = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMethodData.address.trim()) {
      setNotification({ type: 'error', message: 'Deposit wallet address is required.' })
      return
    }

    try {
      setIsSavingMethod(true)
      const newMethod: AdminDepositMethod = {
        id: `dep-${newMethodData.asset.toLowerCase()}-${Date.now()}`,
        asset: newMethodData.asset.toUpperCase(),
        name: newMethodData.name,
        network: newMethodData.network,
        address: newMethodData.address.trim(),
        minDeposit: Number(newMethodData.minDeposit),
        confirmations: Number(newMethodData.confirmations),
        memoRequired: newMethodData.memoRequired,
        memo: newMethodData.memoRequired ? newMethodData.memo.trim() : null,
        enabled: true,
      }

      const updated = [...depositMethods, newMethod]
      const res = await adminService.updateDepositMethods(updated)
      setDepositMethods(res.methods)
      setIsAddingMethod(false)
      setNewMethodData({
        asset: 'USDT',
        name: 'Tether USD',
        network: '',
        address: '',
        minDeposit: 10,
        confirmations: 12,
        memoRequired: false,
        memo: '',
      })
      setNotification({
        type: 'success',
        message: `Supported deposit method for ${newMethod.asset} (${newMethod.network}) created successfully!`,
      })
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to add new deposit method.',
      })
    } finally {
      setIsSavingMethod(false)
    }
  }

  // Toggle Method Enabled / Disabled
  const handleToggleMethod = async (method: AdminDepositMethod) => {
    try {
      const updatedMethods = depositMethods.map((m) => (m.id === method.id ? { ...m, enabled: !m.enabled } : m))
      const res = await adminService.updateDepositMethods(updatedMethods)
      setDepositMethods(res.methods)
      setNotification({
        type: 'success',
        message: `${method.asset} (${method.network}) deposit method is now ${!method.enabled ? 'Enabled' : 'Disabled'}.`,
      })
    } catch (err: any) {
      setNotification({ type: 'error', message: 'Failed to toggle deposit method.' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between shadow-lg animate-fadeIn text-xs ${
            notification.type === 'success'
              ? 'bg-cp-positive/10 border-cp-positive/30 text-cp-positive'
              : 'bg-cp-negative/10 border-cp-negative/30 text-cp-negative'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span className="font-semibold">{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-cp-text-primary tracking-tight">
              Deposit Management
            </h1>
            <Badge variant="gold" size="sm">
              Live Gateway
            </Badge>
          </div>
          <p className="text-xs text-cp-text-muted mt-1">
            Configure destination wallet addresses, approve user incoming deposits, audit on-chain transactions, and
            manage supported deposit methods.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={loadDeposits}
            className="flex items-center gap-1.5"
            disabled={isLoading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Ledger</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsMethodModalOpen(true)}
            className="flex items-center gap-1.5 shadow-md"
          >
            <Wallet className="w-4 h-4" />
            <span>Manage Wallet Addresses & Methods</span>
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-[#0c121c] border-cp-border p-4">
          <span className="text-[10px] text-cp-text-muted uppercase font-bold tracking-wider block">
            Total Deposits
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-2xl font-black text-cp-text-primary font-mono">
              {deposits.length}
            </span>
            <ArrowDownToLine className="w-4 h-4 text-cp-gold opacity-80" />
          </div>
        </Card>

        <Card
          className={`border p-4 cursor-pointer transition-all ${
            statusFilter === 'pending'
              ? 'bg-cp-gold/10 border-cp-gold'
              : 'bg-[#0c121c] border-cp-border hover:border-cp-gold/40'
          }`}
          onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
        >
          <span className="text-[10px] text-cp-gold uppercase font-bold tracking-wider block">
            Pending Review
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-2xl font-black text-cp-gold font-mono">
              {pendingCount}
            </span>
            <Clock className="w-4 h-4 text-cp-gold" />
          </div>
        </Card>

        <Card
          className={`border p-4 cursor-pointer transition-all ${
            statusFilter === 'completed'
              ? 'bg-cp-positive/10 border-cp-positive'
              : 'bg-[#0c121c] border-cp-border hover:border-cp-positive/40'
          }`}
          onClick={() => setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed')}
        >
          <span className="text-[10px] text-cp-positive uppercase font-bold tracking-wider block">
            Successful (Completed)
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-2xl font-black text-cp-positive font-mono">
              {completedCount}
            </span>
            <CheckCircle2 className="w-4 h-4 text-cp-positive" />
          </div>
        </Card>

        <Card
          className={`border p-4 cursor-pointer transition-all ${
            statusFilter === 'rejected'
              ? 'bg-cp-negative/10 border-cp-negative'
              : 'bg-[#0c121c] border-cp-border hover:border-cp-negative/40'
          }`}
          onClick={() => setStatusFilter(statusFilter === 'rejected' ? 'all' : 'rejected')}
        >
          <span className="text-[10px] text-cp-negative uppercase font-bold tracking-wider block">
            Rejected Deposits
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-2xl font-black text-cp-negative font-mono">
              {rejectedCount}
            </span>
            <XCircle className="w-4 h-4 text-cp-negative" />
          </div>
        </Card>
      </div>

      {/* User Filter Indicator Banner */}
      {userFilter && (
        <div className="p-3 bg-cp-gold/10 border border-cp-gold/30 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-cp-gold">
            <User className="w-4 h-4" />
            <span>
              Showing deposits for trader: <strong>{userFilter.userName}</strong> (UID: {userFilter.userId}
              {userFilter.email ? ` • ${userFilter.email}` : ''})
            </span>
          </div>
          <button
            type="button"
            onClick={() => setUserFilter(null)}
            className="text-[11px] font-bold text-cp-gold hover:underline flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear User Filter</span>
          </button>
        </div>
      )}

      {/* Search and Filter Controls */}
      <Card className="bg-[#0c121c] border-cp-border">
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cp-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search by deposit ref, trader name, email, txHash, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141d2b] border border-cp-border rounded-xl pl-9 pr-3 py-2 text-xs text-cp-text-primary placeholder:text-cp-text-muted/60 focus:outline-none focus:border-cp-gold/60"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Status Tabs */}
            <div className="flex items-center gap-1">
              {(
                [
                  { id: 'all', label: 'All Deposits' },
                  { id: 'pending', label: `Pending (${pendingCount})` },
                  { id: 'completed', label: `Successful (${completedCount})` },
                  { id: 'rejected', label: `Rejected (${rejectedCount})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                    statusFilter === tab.id
                      ? 'bg-cp-gold text-cp-bg border-cp-gold shadow'
                      : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border-cp-border'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Asset Filter */}
            <select
              value={assetFilter}
              onChange={(e) => setAssetFilter(e.target.value)}
              className="bg-[#141d2b] border border-cp-border rounded-lg px-2.5 py-1.5 text-xs text-cp-text-primary focus:outline-none"
            >
              <option value="all">All Assets</option>
              <option value="BTC">BTC (Bitcoin)</option>
              <option value="ETH">ETH (Ethereum)</option>
              <option value="USDT">USDT (Tether)</option>
              <option value="SOL">SOL (Solana)</option>
              <option value="XRP">XRP (Ripple)</option>
              <option value="BNB">BNB</option>
              <option value="USDC">USDC</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Deposits Table */}
      <Card className="bg-[#0c121c] border-cp-border overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-cp-text-muted space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin text-cp-gold mx-auto" />
            <p>Loading live deposit ledger from the database...</p>
          </div>
        ) : filteredDeposits.length === 0 ? (
          <div className="p-12 text-center text-xs text-cp-text-muted space-y-2">
            <ArrowDownToLine className="w-8 h-8 text-cp-text-muted mx-auto" />
            <p>No deposit requests found matching the current criteria.</p>
            {userFilter && (
              <Button variant="outline" size="sm" onClick={() => setUserFilter(null)} className="mt-2">
                Clear User Filter
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-cp-border bg-cp-elevated/40 text-cp-text-muted uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-4">Deposit Ref</th>
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Asset & Amount</th>
                  <th className="py-3 px-4">Network</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Destination Address</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cp-border/50 text-cp-text-secondary">
                {filteredDeposits.map((d) => (
                  <tr key={d.id} className="hover:bg-cp-elevated/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-cp-gold">
                      {d.depositRef}
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-cp-text-primary">{d.userName}</span>
                          <button
                            type="button"
                            title="Filter ledger by this user"
                            onClick={() => setUserFilter({ userId: d.userId, userName: d.userName, email: d.userEmail })}
                            className="text-cp-text-muted hover:text-cp-gold transition-colors"
                          >
                            <Filter className="w-3 h-3" />
                          </button>
                        </div>
                        {d.userEmail && (
                          <span className="text-[11px] text-cp-text-muted block truncate max-w-[150px]">
                            {d.userEmail}
                          </span>
                        )}
                        <span className="text-[10px] text-cp-text-muted font-mono block">
                          UID: {d.userRef || d.userId}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-mono font-bold text-cp-positive block">
                          +{d.amount} {d.asset}
                        </span>
                        <span className="text-[10px] text-cp-text-muted font-mono block">
                          ≈ {formatUSD(d.amountUsd)}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-cp-elevated border border-cp-border text-[11px] font-medium text-cp-text-secondary">
                        {d.network}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <Badge
                          variant={
                            d.status === 'completed'
                              ? 'positive'
                              : d.status === 'pending' || (d.status as string) === 'confirming'
                              ? 'gold'
                              : 'negative'
                          }
                          size="sm"
                          className="capitalize"
                        >
                          {d.status}
                        </Badge>
                        <span className="text-[10px] text-cp-text-muted font-mono block">
                          {d.confirmations} / {d.requiredConfirmations || 12} blocks
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-cp-text-muted max-w-[140px] truncate">
                        <span title={d.destinationAddress}>
                          {d.destinationAddress.slice(0, 6)}...{d.destinationAddress.slice(-4)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(d.destinationAddress, `addr-${d.id}`)}
                          className="text-cp-text-muted hover:text-cp-gold"
                        >
                          {copiedKey === `addr-${d.id}` ? (
                            <Check className="w-3 h-3 text-cp-positive" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-cp-text-muted">
                      {d.createdAt}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedDeposit(d)}
                          className="px-2.5 py-1 rounded-lg bg-cp-elevated hover:bg-cp-card border border-cp-border text-cp-text-secondary hover:text-cp-gold transition-colors inline-flex items-center gap-1 text-[11px]"
                          title="Inspect Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>

                        {(d.status === 'pending' || (d.status as string) === 'confirming') && (
                          <>
                            <button
                              type="button"
                              onClick={() => setReviewAction({ type: 'approve', deposit: d })}
                              className="px-2 py-1 rounded-lg bg-cp-positive/10 hover:bg-cp-positive/20 border border-cp-positive/30 text-cp-positive transition-colors text-[11px] font-semibold"
                              title="Approve & Credit Balance"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setRejectionReason('')
                                setReviewAction({ type: 'reject', deposit: d })
                              }}
                              className="px-2 py-1 rounded-lg bg-cp-negative/10 hover:bg-cp-negative/20 border border-cp-negative/30 text-cp-negative transition-colors text-[11px] font-semibold"
                              title="Reject Deposit"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ========================================================================= */}
      {/* 1. MANAGE WALLET ADDRESSES & METHODS MODAL */}
      {/* ========================================================================= */}
      {isMethodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMethodModalOpen(false)} />

          <div className="relative w-full max-w-3xl bg-[#0c121c] border border-cp-border rounded-2xl shadow-2xl p-6 z-10 animate-fadeIn space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-cp-border pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cp-gold/10 text-cp-gold">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-cp-text-primary">
                    Deposit Wallet Addresses & Supported Methods
                  </h3>
                  <p className="text-xs text-cp-text-muted">
                    Updating any wallet address here immediately updates the User Panel's Deposit Page.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMethodModalOpen(false)}
                className="p-1 rounded-lg text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick action bar */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-cp-text-secondary font-semibold">
                Active Deposit Channels ({depositMethods.length})
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddingMethod(!isAddingMethod)}
                className="flex items-center gap-1.5 text-xs text-cp-gold border-cp-gold/40"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingMethod ? 'Cancel New Channel' : 'Add Supported Method'}</span>
              </Button>
            </div>

            {/* Add New Method Form */}
            {isAddingMethod && (
              <form onSubmit={handleAddNewMethod} className="p-4 rounded-xl bg-[#141d2b] border border-cp-gold/40 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-cp-border">
                  <span className="font-bold text-cp-gold uppercase text-[11px]">Add New Deposit Asset/Network</span>
                  <button type="button" onClick={() => setIsAddingMethod(false)} className="text-cp-text-muted hover:text-cp-text-primary">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-cp-text-muted uppercase block font-semibold mb-1">Asset Symbol</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. USDT, BTC"
                      value={newMethodData.asset}
                      onChange={(e) => setNewMethodData({ ...newMethodData, asset: e.target.value.toUpperCase() })}
                      className="w-full bg-[#0c121c] border border-cp-border rounded-lg px-2.5 py-1.5 text-cp-text-primary focus:outline-none focus:border-cp-gold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-cp-text-muted uppercase block font-semibold mb-1">Method Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tether (Arbitrum)"
                      value={newMethodData.name}
                      onChange={(e) => setNewMethodData({ ...newMethodData, name: e.target.value })}
                      className="w-full bg-[#0c121c] border border-cp-border rounded-lg px-2.5 py-1.5 text-cp-text-primary focus:outline-none focus:border-cp-gold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-cp-text-muted uppercase block font-semibold mb-1">Network</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Arbitrum One"
                      value={newMethodData.network}
                      onChange={(e) => setNewMethodData({ ...newMethodData, network: e.target.value })}
                      className="w-full bg-[#0c121c] border border-cp-border rounded-lg px-2.5 py-1.5 text-cp-text-primary focus:outline-none focus:border-cp-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-cp-text-muted uppercase block font-semibold mb-1">Destination Wallet Address</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full on-chain destination address..."
                    value={newMethodData.address}
                    onChange={(e) => setNewMethodData({ ...newMethodData, address: e.target.value })}
                    className="w-full bg-[#0c121c] border border-cp-border rounded-lg px-2.5 py-1.5 font-mono text-cp-text-primary focus:outline-none focus:border-cp-gold"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] text-cp-text-muted uppercase block font-semibold mb-1">Min Deposit</label>
                    <input
                      type="number"
                      step="any"
                      value={newMethodData.minDeposit}
                      onChange={(e) => setNewMethodData({ ...newMethodData, minDeposit: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#0c121c] border border-cp-border rounded-lg px-2.5 py-1.5 text-cp-text-primary font-mono focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-cp-text-muted uppercase block font-semibold mb-1">Confirmations</label>
                    <input
                      type="number"
                      value={newMethodData.confirmations}
                      onChange={(e) => setNewMethodData({ ...newMethodData, confirmations: parseInt(e.target.value, 10) || 1 })}
                      className="w-full bg-[#0c121c] border border-cp-border rounded-lg px-2.5 py-1.5 text-cp-text-primary font-mono focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2 flex items-center gap-3 pt-4">
                    <label className="flex items-center gap-2 cursor-pointer text-cp-text-secondary">
                      <input
                        type="checkbox"
                        checked={newMethodData.memoRequired}
                        onChange={(e) => setNewMethodData({ ...newMethodData, memoRequired: e.target.checked })}
                        className="rounded border-cp-border text-cp-gold focus:ring-cp-gold"
                      />
                      <span>Requires Memo/Tag</span>
                    </label>
                    {newMethodData.memoRequired && (
                      <input
                        type="text"
                        placeholder="Memo/Tag"
                        value={newMethodData.memo}
                        onChange={(e) => setNewMethodData({ ...newMethodData, memo: e.target.value })}
                        className="flex-1 bg-[#0c121c] border border-cp-border rounded-lg px-2 py-1 font-mono text-cp-text-primary"
                      />
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" type="button" onClick={() => setIsAddingMethod(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" type="submit" disabled={isSavingMethod}>
                    {isSavingMethod ? 'Saving...' : 'Save & Enable Channel'}
                  </Button>
                </div>
              </form>
            )}

            {/* List of Methods */}
            <div className="space-y-3">
              {isLoadingMethods ? (
                <div className="p-8 text-center text-xs text-cp-text-muted">Loading deposit channels...</div>
              ) : (
                depositMethods.map((method) => {
                  const isEditingThis = editingMethod?.id === method.id
                  return (
                    <div
                      key={method.id}
                      className="p-4 rounded-xl bg-cp-elevated/40 border border-cp-border space-y-3 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cp-border/50 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-cp-gold text-sm font-mono">{method.asset}</span>
                          <span className="text-xs font-semibold text-cp-text-primary">{method.name}</span>
                          <span className="px-2 py-0.5 rounded bg-[#141d2b] border border-cp-border text-[10px] text-cp-text-secondary">
                            {method.network}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleMethod(method)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                              method.enabled
                                ? 'bg-cp-positive/10 text-cp-positive border border-cp-positive/30'
                                : 'bg-cp-negative/10 text-cp-negative border border-cp-negative/30'
                            }`}
                          >
                            {method.enabled ? 'Enabled' : 'Disabled'}
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingMethod(isEditingThis ? null : { ...method })}
                            className="px-2.5 py-1 rounded bg-cp-card hover:bg-cp-elevated border border-cp-border text-[11px] text-cp-text-secondary hover:text-cp-gold transition-colors"
                          >
                            {isEditingThis ? 'Cancel' : 'Edit Address'}
                          </button>
                        </div>
                      </div>

                      {/* Display or Edit form */}
                      {isEditingThis ? (
                        <div className="space-y-3 pt-1 text-xs">
                          <div>
                            <label className="text-[10px] text-cp-text-muted uppercase font-bold block mb-1">
                              Deposit Wallet Address
                            </label>
                            <input
                              type="text"
                              value={editingMethod.address}
                              onChange={(e) =>
                                setEditingMethod({ ...editingMethod, address: e.target.value })
                              }
                              className="w-full bg-[#141d2b] border border-cp-gold rounded-lg px-3 py-2 font-mono text-xs text-cp-text-primary focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="text-[10px] text-cp-text-muted uppercase font-bold block mb-1">
                                Min Deposit
                              </label>
                              <input
                                type="number"
                                step="any"
                                value={editingMethod.minDeposit}
                                onChange={(e) =>
                                  setEditingMethod({
                                    ...editingMethod,
                                    minDeposit: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="w-full bg-[#141d2b] border border-cp-border rounded-lg px-2.5 py-1.5 font-mono text-cp-text-primary focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-cp-text-muted uppercase font-bold block mb-1">
                                Confirmations Required
                              </label>
                              <input
                                type="number"
                                value={editingMethod.confirmations}
                                onChange={(e) =>
                                  setEditingMethod({
                                    ...editingMethod,
                                    confirmations: parseInt(e.target.value, 10) || 1,
                                  })
                                }
                                className="w-full bg-[#141d2b] border border-cp-border rounded-lg px-2.5 py-1.5 font-mono text-cp-text-primary focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-cp-text-muted uppercase font-bold block mb-1">
                                Memo / Tag (Optional)
                              </label>
                              <input
                                type="text"
                                value={editingMethod.memo || ''}
                                onChange={(e) =>
                                  setEditingMethod({
                                    ...editingMethod,
                                    memo: e.target.value,
                                    memoRequired: !!e.target.value,
                                  })
                                }
                                placeholder="None"
                                className="w-full bg-[#141d2b] border border-cp-border rounded-lg px-2.5 py-1.5 font-mono text-cp-text-primary focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-1">
                            <Button variant="outline" size="sm" onClick={() => setEditingMethod(null)}>
                              Cancel
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleSaveMethod(editingMethod)}
                              disabled={isSavingMethod}
                            >
                              {isSavingMethod ? 'Saving...' : 'Save & Publish to User Panel'}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div className="sm:col-span-2">
                            <span className="text-[10px] text-cp-text-muted uppercase block">
                              Active Destination Address
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-cp-text-primary break-all text-[11px]">
                                {method.address}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(method.address, method.id)}
                                className="text-cp-text-muted hover:text-cp-gold shrink-0"
                              >
                                {copiedKey === method.id ? (
                                  <Check className="w-3.5 h-3.5 text-cp-positive" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] text-cp-text-muted uppercase block">Rules</span>
                            <span className="text-[11px] text-cp-text-secondary block mt-0.5 font-mono">
                              Min: {method.minDeposit} {method.asset} • {method.confirmations} confs
                              {method.memo ? ` • Tag: ${method.memo}` : ''}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>

            <div className="pt-2 flex justify-end border-t border-cp-border">
              <Button variant="outline" size="sm" onClick={() => setIsMethodModalOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DEPOSIT TRANSACTION INSPECTION DRAWER */}
      {/* ========================================================================= */}
      {selectedDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedDeposit(null)} />

          <div className="relative w-full max-w-lg bg-[#0c121c] border border-cp-border rounded-2xl shadow-2xl p-6 z-10 animate-fadeIn space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-cp-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-cp-text-primary">
                    Deposit: {selectedDeposit.depositRef}
                  </h3>
                  <Badge
                    variant={
                      selectedDeposit.status === 'completed'
                        ? 'positive'
                        : selectedDeposit.status === 'pending' ||
                          (selectedDeposit.status as string) === 'confirming'
                        ? 'gold'
                        : 'negative'
                    }
                    size="sm"
                    className="capitalize"
                  >
                    {selectedDeposit.status}
                  </Badge>
                </div>
                <span className="text-xs text-cp-text-muted">
                  Beneficiary: <strong>{selectedDeposit.userName}</strong> ({selectedDeposit.userRef || selectedDeposit.userId})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDeposit(null)}
                className="p-1 rounded-lg text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3.5 text-xs">
              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase">Amount & Asset</span>
                <span className="font-mono text-base font-bold text-cp-positive mt-0.5 block">
                  +{selectedDeposit.amount} {selectedDeposit.asset}
                </span>
                <span className="text-[10px] text-cp-text-muted font-mono">
                  ≈ {formatUSD(selectedDeposit.amountUsd)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase">Blockchain Network</span>
                <span className="font-semibold text-cp-text-primary mt-1 block">
                  {selectedDeposit.network}
                </span>
                <span className="text-[10px] text-cp-gold font-mono block mt-0.5">
                  Confirmations: {selectedDeposit.confirmations} / {selectedDeposit.requiredConfirmations || 12}
                </span>
              </div>

              <div className="col-span-2 p-3 rounded-xl bg-cp-elevated/40 border border-cp-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-cp-text-muted text-[10px] uppercase">User Details</span>
                  <button
                    type="button"
                    onClick={() => {
                      setUserFilter({
                        userId: selectedDeposit.userId,
                        userName: selectedDeposit.userName,
                        email: selectedDeposit.userEmail,
                      })
                      setSelectedDeposit(null)
                    }}
                    className="text-cp-gold hover:underline text-[10px] flex items-center gap-1"
                  >
                    <Filter className="w-3 h-3" />
                    <span>View All Deposits By Trader</span>
                  </button>
                </div>
                <div className="text-cp-text-primary font-medium text-xs">
                  {selectedDeposit.userName} {selectedDeposit.userEmail ? `• ${selectedDeposit.userEmail}` : ''}
                </div>
                <span className="text-[11px] text-cp-text-muted font-mono block">
                  User ID: {selectedDeposit.userId}
                </span>
              </div>

              <div className="col-span-2 p-3 rounded-xl bg-cp-elevated/40 border border-cp-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-cp-text-muted text-[10px] uppercase">Transaction Hash</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedDeposit.txHash, 'drawer-hash')}
                    className="text-cp-gold hover:underline text-[10px] flex items-center gap-1"
                  >
                    {copiedKey === 'drawer-hash' ? (
                      <Check className="w-3 h-3 text-cp-positive" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedKey === 'drawer-hash' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <span className="font-mono text-cp-text-primary block text-xs break-all">
                  {selectedDeposit.txHash}
                </span>
              </div>

              <div className="col-span-2 p-3 rounded-xl bg-cp-elevated/40 border border-cp-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-cp-text-muted text-[10px] uppercase">Destination Deposit Address</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedDeposit.destinationAddress, 'drawer-addr')}
                    className="text-cp-gold hover:underline text-[10px] flex items-center gap-1"
                  >
                    {copiedKey === 'drawer-addr' ? (
                      <Check className="w-3 h-3 text-cp-positive" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedKey === 'drawer-addr' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <span className="font-mono text-cp-text-secondary block text-xs break-all">
                  {selectedDeposit.destinationAddress}
                </span>
              </div>

              {selectedDeposit.rejectionReason && (
                <div className="col-span-2 p-3 rounded-xl bg-cp-negative/10 border border-cp-negative/30 text-cp-negative text-xs space-y-1">
                  <span className="font-bold text-[10px] uppercase block">Rejection Reason</span>
                  <p>{selectedDeposit.rejectionReason}</p>
                </div>
              )}
            </div>

            {/* Review Action Buttons if Pending */}
            {(selectedDeposit.status === 'pending' || (selectedDeposit.status as string) === 'confirming') && (
              <div className="p-3 rounded-xl bg-[#141d2b] border border-cp-border space-y-2">
                <span className="text-[10px] font-bold text-cp-text-muted uppercase block">
                  Administrative Action Required
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setReviewAction({ type: 'approve', deposit: selectedDeposit })
                    }}
                  >
                    Approve & Credit Balance
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-cp-negative border-cp-negative/40 hover:bg-cp-negative/10"
                    onClick={() => {
                      setRejectionReason('')
                      setReviewAction({ type: 'reject', deposit: selectedDeposit })
                    }}
                  >
                    Reject Deposit
                  </Button>
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between border-t border-cp-border text-xs text-cp-text-muted">
              <span>Timestamp: {selectedDeposit.createdAt}</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedDeposit(null)}>
                Close Drawer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. APPROVE / REJECT CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {reviewAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setReviewAction(null)} />

          <div className="relative w-full max-w-md bg-[#0c121c] border border-cp-border rounded-2xl shadow-2xl p-6 z-10 animate-fadeIn space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-xl ${
                  reviewAction.type === 'approve'
                    ? 'bg-cp-positive/10 text-cp-positive'
                    : 'bg-cp-negative/10 text-cp-negative'
                }`}
              >
                {reviewAction.type === 'approve' ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <XCircle className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-cp-text-primary">
                  {reviewAction.type === 'approve' ? 'Approve & Credit Deposit' : 'Reject Deposit Request'}
                </h3>
                <p className="text-xs text-cp-text-muted">
                  Ref: {reviewAction.deposit.depositRef} • {reviewAction.deposit.userName}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-cp-elevated/40 border border-cp-border text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-cp-text-muted">Deposit Amount:</span>
                <span className="font-mono font-bold text-cp-positive">
                  +{reviewAction.deposit.amount} {reviewAction.deposit.asset}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-cp-text-muted">Estimated USD:</span>
                <span className="font-mono text-cp-text-secondary">
                  {formatUSD(reviewAction.deposit.amountUsd)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-cp-text-muted">Network:</span>
                <span className="text-cp-text-secondary">{reviewAction.deposit.network}</span>
              </div>
            </div>

            {reviewAction.type === 'approve' ? (
              <p className="text-xs text-cp-text-secondary leading-relaxed">
                Approving this request will immediately mark status as <strong>Completed</strong>, credit the user's
                available balance with <strong>+{reviewAction.deposit.amount} {reviewAction.deposit.asset}</strong>,
                and log the compliance action in the system audit trail.
              </p>
            ) : (
              <div className="space-y-2 text-xs">
                <label className="text-cp-text-muted font-bold block uppercase text-[10px]">
                  Reason for Rejection <span className="text-cp-negative">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Transaction hash not found on blockchain / Incorrect deposit address..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-[#141d2b] border border-cp-border rounded-xl p-3 text-xs text-cp-text-primary placeholder:text-cp-text-muted/60 focus:outline-none focus:border-cp-negative"
                />
                <p className="text-[10px] text-cp-text-muted">
                  This explanation will be permanently recorded and displayed to the user in their deposit status.
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-cp-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReviewAction(null)}
                disabled={isSubmittingReview}
              >
                Cancel
              </Button>
              <Button
                variant={reviewAction.type === 'approve' ? 'primary' : 'danger'}
                size="sm"
                onClick={handleConfirmReview}
                disabled={isSubmittingReview}
              >
                {isSubmittingReview
                  ? 'Processing...'
                  : reviewAction.type === 'approve'
                  ? 'Confirm Approval'
                  : 'Confirm Rejection'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDeposits
