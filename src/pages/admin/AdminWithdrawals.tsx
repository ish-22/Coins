import React, { useState, useMemo, useEffect } from 'react'
import {
  ArrowUpFromLine,
  Search,
  Eye,
  CheckCircle2,
  X,
  XCircle,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react'
import { Card, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { AdminWithdrawalRecord } from '@/mock/adminData'
import { formatUSD } from '@/utils/formatters'
import { adminService } from '@/services'

export const AdminWithdrawals: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<AdminWithdrawalRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_review' | 'approved' | 'rejected'>('all')
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<AdminWithdrawalRecord | null>(null)

  // Review Workflow State
  const [actionRecord, setActionRecord] = useState<AdminWithdrawalRecord | null>(null)
  const [actionDecision, setActionDecision] = useState<'approve' | 'reject' | null>(null)
  const [actionReason, setActionReason] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const loadWithdrawals = async () => {
      try {
        setIsLoading(true)
        setLoadError(null)
        const liveWithdrawals = await adminService.getWithdrawals()
        if (isMounted) setWithdrawals(liveWithdrawals)
      } catch (error: any) {
        if (isMounted) {
          setLoadError(error?.response?.data?.message || 'Unable to load withdrawal review queue from the API.')
          setWithdrawals([])
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadWithdrawals()
    return () => {
      isMounted = false
    }
  }, [])

  const filteredWithdrawals = useMemo(() => {
    return withdrawals.filter((w) => {
      const matchSearch =
        w.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.withdrawalRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.destinationAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.asset.toLowerCase().includes(searchQuery.toLowerCase())

      const matchStatus = statusFilter === 'all' || w.status === statusFilter

      return matchSearch && matchStatus
    })
  }, [withdrawals, searchQuery, statusFilter])

  const handleOpenAction = (record: AdminWithdrawalRecord, decision: 'approve' | 'reject') => {
    setActionRecord(record)
    setActionDecision(decision)
    setActionReason(
      decision === 'approve'
        ? 'Destination address verified against user allowlist. Risk score evaluated as clean.'
        : ''
    )
    setActionError(null)
  }

  const handleConfirmAction = async () => {
    if (!actionReason.trim()) {
      setActionError('An explicit administrative note or justification is required.')
      return
    }

    if (!actionRecord || !actionDecision) return

    try {
      const response = await adminService.reviewWithdrawal(
        actionRecord.id,
        actionDecision,
        actionReason.trim()
      )

      const newStatus = actionDecision === 'approve' ? 'approved' : 'rejected'
      const now = new Date().toISOString().replace('T', ' ').slice(0, 16)

      setWithdrawals((prev) =>
        prev.map((w) =>
          w.id === actionRecord.id
            ? {
                ...w,
                status: newStatus,
                reviewedAt: now,
                rejectionReason: actionDecision === 'reject' ? actionReason.trim() : undefined,
              }
            : w
        )
      )

      if (selectedWithdrawal?.id === actionRecord.id) {
        setSelectedWithdrawal((prev) =>
          prev
            ? {
                ...prev,
                status: newStatus,
                reviewedAt: now,
                rejectionReason: actionDecision === 'reject' ? actionReason.trim() : undefined,
              }
            : null
        )
      }

      setToastMessage(
        response?.message ||
          `Withdrawal ${actionRecord.withdrawalRef} (${actionRecord.amount} ${actionRecord.asset}) ${actionDecision === 'approve' ? 'Approved' : 'Rejected'} successfully.`
      )
      setTimeout(() => setToastMessage(null), 4000)

      setActionRecord(null)
      setActionDecision(null)
      setActionReason('')
    } catch (err: any) {
      setActionError(err?.response?.data?.message || 'Failed to submit withdrawal decision to the database.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-cp-text-primary tracking-tight">
            Withdrawal Approvals & Risk Queue
          </h1>
          <p className="text-xs text-cp-text-muted mt-0.5">
            Audit off-ramp requests, evaluate destination address telemetry, and perform simulated payouts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="negative" size="sm">
            Pending Operator Review: {withdrawals.filter((w) => w.status === 'pending_review').length}
          </Badge>
        </div>
      </div>

      {loadError && (
        <div className="p-3 rounded-xl bg-cp-negative/10 border border-cp-negative/30 text-xs text-cp-negative">
          {loadError}
        </div>
      )}

      {isLoading && (
        <div className="p-4 rounded-xl border border-cp-border bg-cp-card text-xs text-cp-text-muted">
          Loading withdrawal queue from the live API...
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-cp-positive/15 border border-cp-positive/30 text-xs text-cp-positive flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button type="button" onClick={() => setToastMessage(null)} className="p-1 hover:text-cp-text-primary">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <Card className="bg-[#0c121c] border-cp-border">
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cp-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search by withdrawal ref, user, destination address, or asset..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141d2b] border border-cp-border rounded-xl pl-9 pr-3 py-2 text-xs text-cp-text-primary placeholder:text-cp-text-muted/60 focus:outline-none focus:border-cp-gold/60"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0 scrollbar-none">
            {(['all', 'pending_review', 'approved', 'rejected'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-all capitalize ${
                  statusFilter === st
                    ? 'bg-cp-gold text-cp-bg border-cp-gold'
                    : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border-cp-border'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Withdrawals Table */}
      <Card className="bg-[#0c121c] border-cp-border overflow-hidden">
        {filteredWithdrawals.length === 0 ? (
          <div className="p-12 text-center text-xs text-cp-text-muted space-y-2">
            <ArrowUpFromLine className="w-8 h-8 text-cp-text-muted mx-auto" />
            <p>No withdrawal records match your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-cp-border bg-cp-elevated/40 text-cp-text-muted uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-4">Ref</th>
                  <th className="py-3 px-4">Requester</th>
                  <th className="py-3 px-4">Asset & Amount</th>
                  <th className="py-3 px-4">Network</th>
                  <th className="py-3 px-4">Risk Telemetry</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Requested At</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cp-border/50 text-cp-text-secondary">
                {filteredWithdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-cp-elevated/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-cp-gold">
                      {w.withdrawalRef}
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-cp-text-primary block">{w.userName}</span>
                        <span className="text-[10px] text-cp-text-muted font-mono block">{w.userId}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-mono font-bold text-cp-negative block">
                          -{w.amount} {w.asset}
                        </span>
                        <span className="text-[10px] text-cp-text-muted font-mono block">
                          ≈ {formatUSD(w.amountUsd)} (Fee: {w.fee} {w.asset})
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-cp-elevated border border-cp-border text-[11px] font-medium text-cp-text-secondary">
                        {w.network}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        variant={w.riskScore === 'Low' ? 'positive' : w.riskScore === 'Medium' ? 'gold' : 'negative'}
                        size="sm"
                      >
                        Risk: {w.riskScore}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        variant={w.status === 'approved' ? 'positive' : w.status === 'rejected' ? 'negative' : 'gold'}
                        size="sm"
                        className="capitalize"
                      >
                        {w.status.replace('_', ' ')}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-cp-text-muted">
                      {w.createdAt}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedWithdrawal(w)}
                          className="px-2.5 py-1 rounded-lg bg-cp-elevated hover:bg-cp-card border border-cp-border text-cp-text-secondary hover:text-cp-gold transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>

                        {w.status === 'pending_review' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenAction(w, 'approve')}
                              className="px-2.5 py-1 rounded-lg bg-cp-positive/15 hover:bg-cp-positive/25 border border-cp-positive/30 text-cp-positive transition-colors font-medium"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenAction(w, 'reject')}
                              className="px-2.5 py-1 rounded-lg bg-cp-negative/15 hover:bg-cp-negative/25 border border-cp-negative/30 text-cp-negative transition-colors font-medium"
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

      {/* WITHDRAWAL DETAIL DRAWER */}
      {selectedWithdrawal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedWithdrawal(null)}
          />

          <div className="relative w-full max-w-lg bg-[#0c121c] border border-cp-border rounded-2xl shadow-2xl p-6 z-10 animate-fadeIn space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-cp-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-cp-text-primary">
                    Withdrawal: {selectedWithdrawal.withdrawalRef}
                  </h3>
                  <Badge
                    variant={selectedWithdrawal.status === 'approved' ? 'positive' : selectedWithdrawal.status === 'rejected' ? 'negative' : 'gold'}
                    size="sm"
                    className="capitalize"
                  >
                    {selectedWithdrawal.status.replace('_', ' ')}
                  </Badge>
                </div>
                <span className="text-xs text-cp-text-muted">
                  Requester: <strong>{selectedWithdrawal.userName}</strong> ({selectedWithdrawal.userId})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedWithdrawal(null)}
                className="p-1 rounded-lg text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3.5 text-xs">
              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase">Requested Payout</span>
                <span className="font-mono text-base font-bold text-cp-negative mt-0.5 block">
                  -{selectedWithdrawal.amount} {selectedWithdrawal.asset}
                </span>
                <span className="text-[10px] text-cp-text-muted font-mono">
                  ≈ {formatUSD(selectedWithdrawal.amountUsd)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase">Network & Fee</span>
                <span className="font-semibold text-cp-text-primary mt-0.5 block">
                  {selectedWithdrawal.network}
                </span>
                <span className="text-[10px] text-cp-gold font-mono block mt-0.5">
                  Fee: {selectedWithdrawal.fee} {selectedWithdrawal.asset}
                </span>
              </div>

              <div className="col-span-2 p-3 rounded-xl bg-cp-elevated/40 border border-cp-border space-y-1">
                <span className="text-cp-text-muted text-[10px] uppercase">Destination Crypto Address</span>
                <span className="font-mono text-cp-text-primary block text-xs break-all">
                  {selectedWithdrawal.destinationAddress}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase">Automated Risk Score</span>
                <Badge
                  variant={selectedWithdrawal.riskScore === 'Low' ? 'positive' : selectedWithdrawal.riskScore === 'Medium' ? 'gold' : 'negative'}
                  size="sm"
                  className="mt-1"
                >
                  {selectedWithdrawal.riskScore} Risk Flag
                </Badge>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase">Submission Timestamp</span>
                <span className="font-mono text-cp-text-muted mt-1 block">
                  {selectedWithdrawal.createdAt}
                </span>
              </div>
            </div>

            {selectedWithdrawal.rejectionReason && (
              <div className="p-3.5 rounded-xl bg-cp-negative/10 border border-cp-negative/30 text-xs text-cp-negative space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  Recorded Rejection Note:
                </span>
                <p className="leading-relaxed">{selectedWithdrawal.rejectionReason}</p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between border-t border-cp-border text-xs">
              <span className="text-cp-text-muted">Demonstration Review Pipeline</span>

              {selectedWithdrawal.status === 'pending_review' ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-cp-negative border-cp-negative/40 hover:bg-cp-negative/15"
                    onClick={() => handleOpenAction(selectedWithdrawal, 'reject')}
                  >
                    Reject Payout
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenAction(selectedWithdrawal, 'approve')}
                  >
                    Approve Payout
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setSelectedWithdrawal(null)}>
                  Close
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* APPROVE / REJECT WITHDRAWAL CONFIRMATION MODAL */}
      {actionRecord && actionDecision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            onClick={() => setActionRecord(null)}
          />

          <div className="relative w-full max-w-md bg-[#0c121c] border border-cp-border rounded-2xl shadow-2xl p-6 z-10 animate-fadeIn space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  actionDecision === 'approve'
                    ? 'bg-cp-positive/15 text-cp-positive border border-cp-positive/30'
                    : 'bg-cp-negative/15 text-cp-negative border border-cp-negative/30'
                }`}
              >
                {actionDecision === 'approve' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-cp-text-primary">
                  {actionDecision === 'approve' ? 'Authorize Withdrawal Payout' : 'Reject Withdrawal Request'}
                </h4>
                <p className="text-xs text-cp-text-muted">
                  Ref: <strong>{actionRecord.withdrawalRef}</strong> • {actionRecord.amount} {actionRecord.asset} ({actionRecord.userName})
                </p>
              </div>
            </div>

            <p className="text-xs text-cp-text-secondary leading-relaxed bg-cp-elevated/40 p-3 rounded-lg border border-cp-border">
              {actionDecision === 'approve'
                ? 'Simulated approval will mark this payout completed in the demonstration ledger. (No real cryptocurrency is dispatched).'
                : 'Rejecting this request will return simulated funds to the customer account and log an incident note.'}
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-cp-text-secondary block">
                {actionDecision === 'approve' ? 'Operator Authorization Note *' : 'Rejection Reason *'}
              </label>
              <textarea
                rows={3}
                value={actionReason}
                onChange={(e) => {
                  setActionReason(e.target.value)
                  if (actionError) setActionError(null)
                }}
                placeholder={
                  actionDecision === 'approve'
                    ? 'State risk checks performed...'
                    : 'Explain reason (e.g. Unconfirmed IP velocity, address allowlist mismatch)...'
                }
                className="w-full bg-[#141d2b] border border-cp-border rounded-xl p-2.5 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold"
              />
              {actionError && (
                <p className="text-xs text-cp-negative flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{actionError}</span>
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-cp-border">
              <Button variant="outline" size="sm" onClick={() => setActionRecord(null)}>
                Cancel
              </Button>
              <Button
                variant={actionDecision === 'reject' ? 'outline' : 'primary'}
                size="sm"
                className={actionDecision === 'reject' ? 'bg-cp-negative text-white hover:bg-cp-negative/90' : ''}
                onClick={handleConfirmAction}
              >
                {actionDecision === 'approve' ? 'Confirm Authorization' : 'Confirm Rejection'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminWithdrawals
