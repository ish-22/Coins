import React, { useState, useMemo } from 'react'
import {
  ShieldCheck,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
  X,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { AdminKycCase, INITIAL_ADMIN_KYC_CASES } from '@/mock/adminData'

export const AdminKYC: React.FC = () => {
  const [cases, setCases] = useState<AdminKycCase[]>(INITIAL_ADMIN_KYC_CASES)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_review' | 'approved' | 'rejected'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCase, setSelectedCase] = useState<AdminKycCase | null>(null)

  // Decision Modal State
  const [decisionCase, setDecisionCase] = useState<AdminKycCase | null>(null)
  const [decisionType, setDecisionType] = useState<'approve' | 'reject' | null>(null)
  const [decisionReason, setDecisionReason] = useState('')
  const [decisionError, setDecisionError] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchSearch =
        c.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.caseRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.documentNumber.toLowerCase().includes(searchQuery.toLowerCase())

      const matchStatus = statusFilter === 'all' || c.status === statusFilter

      return matchSearch && matchStatus
    })
  }, [cases, searchQuery, statusFilter])

  const handleOpenDecision = (c: AdminKycCase, type: 'approve' | 'reject') => {
    setDecisionCase(c)
    setDecisionType(type)
    setDecisionReason(type === 'approve' ? 'All OCR document security checks passed. Valid biometric likeness.' : '')
    setDecisionError(null)
  }

  const handleConfirmDecision = () => {
    if (!decisionReason.trim()) {
      setDecisionError('A clear verification or rejection reason is required for administrative audit logs.')
      return
    }

    if (!decisionCase || !decisionType) return

    const newStatus = decisionType === 'approve' ? 'approved' : 'rejected'
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16)

    setCases((prev) =>
      prev.map((c) =>
        c.id === decisionCase.id
          ? {
              ...c,
              status: newStatus,
              reviewedAt: now,
              rejectionReason: decisionType === 'reject' ? decisionReason.trim() : undefined,
            }
          : c
      )
    )

    if (selectedCase?.id === decisionCase.id) {
      setSelectedCase((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              reviewedAt: now,
              rejectionReason: decisionType === 'reject' ? decisionReason.trim() : undefined,
            }
          : null
      )
    }

    setToastMessage(
      `Case ${decisionCase.caseRef} (${decisionCase.userName}) ${decisionType === 'approve' ? 'Approved' : 'Rejected'} successfully (Simulated).`
    )
    setTimeout(() => setToastMessage(null), 4000)

    setDecisionCase(null)
    setDecisionType(null)
    setDecisionReason('')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-cp-text-primary tracking-tight">
            KYC Identity Verification Queue
          </h1>
          <p className="text-xs text-cp-text-muted mt-0.5">
            Evaluate government identity documents, review proof of address records, and enforce compliance tiers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="gold" size="sm">
            Pending Queue: {cases.filter((c) => c.status === 'pending' || c.status === 'in_review').length}
          </Badge>
        </div>
      </div>

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
              placeholder="Search by name, email, case reference, or document ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141d2b] border border-cp-border rounded-xl pl-9 pr-3 py-2 text-xs text-cp-text-primary placeholder:text-cp-text-muted/60 focus:outline-none focus:border-cp-gold/60"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0 scrollbar-none">
            {(['all', 'pending', 'in_review', 'approved', 'rejected'] as const).map((st) => (
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

      {/* KYC Cases Table */}
      <Card className="bg-[#0c121c] border-cp-border overflow-hidden">
        {filteredCases.length === 0 ? (
          <div className="p-12 text-center text-xs text-cp-text-muted space-y-2">
            <ShieldCheck className="w-8 h-8 text-cp-text-muted mx-auto" />
            <p>No verification records match your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-cp-border bg-cp-elevated/40 text-cp-text-muted uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-4">Case Ref</th>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Requested Tier</th>
                  <th className="py-3 px-4">Document Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submitted At</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cp-border/50 text-cp-text-secondary">
                {filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-cp-elevated/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-cp-gold">
                      {c.caseRef}
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-cp-text-primary block">{c.userName}</span>
                        <span className="text-[11px] text-cp-text-muted block font-mono">{c.userEmail}</span>
                        <span className="text-[10px] text-cp-text-secondary block">{c.country}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-cp-text-primary">
                      {c.requestedTier}
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-cp-text-primary block">{c.documentType}</span>
                        <span className="text-[10px] font-mono text-cp-text-muted block">{c.documentNumber}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        variant={c.status === 'approved' ? 'positive' : c.status === 'rejected' ? 'negative' : 'gold'}
                        size="sm"
                        className="capitalize"
                      >
                        {c.status.replace('_', ' ')}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-cp-text-muted">
                      {c.submittedAt}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedCase(c)}
                          className="px-2.5 py-1 rounded-lg bg-cp-elevated hover:bg-cp-card border border-cp-border text-cp-text-secondary hover:text-cp-gold transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>

                        {(c.status === 'pending' || c.status === 'in_review') && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenDecision(c, 'approve')}
                              className="px-2.5 py-1 rounded-lg bg-cp-positive/15 hover:bg-cp-positive/25 border border-cp-positive/30 text-cp-positive transition-colors font-medium"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenDecision(c, 'reject')}
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

      {/* CASE REVIEW MODAL / DRAWER */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedCase(null)}
          />

          <div className="relative w-full max-w-2xl bg-[#0c121c] border border-cp-border rounded-2xl shadow-2xl overflow-hidden z-10 animate-fadeIn space-y-5 p-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-cp-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-cp-text-primary">
                    KYC Case: {selectedCase.caseRef}
                  </h3>
                  <Badge
                    variant={selectedCase.status === 'approved' ? 'positive' : selectedCase.status === 'rejected' ? 'negative' : 'gold'}
                    size="sm"
                    className="capitalize"
                  >
                    {selectedCase.status.replace('_', ' ')}
                  </Badge>
                </div>
                <span className="text-xs text-cp-text-muted">
                  Applicant: <strong>{selectedCase.userName}</strong> ({selectedCase.userEmail}) • {selectedCase.country}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                className="p-1 rounded-lg text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Details Grid */}
            <div className="grid grid-cols-2 gap-3.5 text-xs">
              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase">Document Type</span>
                <span className="font-semibold text-cp-text-primary mt-0.5 block">{selectedCase.documentType}</span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase">Document Number</span>
                <span className="font-mono text-cp-gold font-bold mt-0.5 block">{selectedCase.documentNumber}</span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase">Requested Compliance Tier</span>
                <span className="font-semibold text-cp-text-primary mt-0.5 block">{selectedCase.requestedTier}</span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase">Submission Timestamp</span>
                <span className="font-mono text-cp-text-muted mt-0.5 block">{selectedCase.submittedAt}</span>
              </div>
            </div>

            {/* Rejection notice if already rejected */}
            {selectedCase.rejectionReason && (
              <div className="p-3.5 rounded-xl bg-cp-negative/10 border border-cp-negative/30 text-xs text-cp-negative space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  Recorded Rejection Reason:
                </span>
                <p className="leading-relaxed">{selectedCase.rejectionReason}</p>
              </div>
            )}

            {/* Simulated Document Placeholders */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-cp-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cp-gold" />
                Simulated Uploaded Verification Files
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* ID Front */}
                <div className="p-3.5 rounded-xl bg-[#141d2b] border border-cp-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-cp-text-primary">Identity Card (Front)</span>
                    <span className="text-[10px] text-cp-text-muted font-mono">JPG • 2.4 MB</span>
                  </div>
                  <div className="h-28 rounded-lg bg-cp-card border border-dashed border-cp-border flex flex-col items-center justify-center text-cp-text-muted p-2 text-center">
                    <FileText className="w-6 h-6 text-cp-gold mb-1" />
                    <span className="text-[11px] font-mono">{selectedCase.idFrontPlaceholder}</span>
                    <span className="text-[9px] text-cp-text-muted">Simulated Document Graphic</span>
                  </div>
                </div>

                {/* ID Back */}
                <div className="p-3.5 rounded-xl bg-[#141d2b] border border-cp-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-cp-text-primary">Identity Card (Back)</span>
                    <span className="text-[10px] text-cp-text-muted font-mono">JPG • 1.9 MB</span>
                  </div>
                  <div className="h-28 rounded-lg bg-cp-card border border-dashed border-cp-border flex flex-col items-center justify-center text-cp-text-muted p-2 text-center">
                    <FileText className="w-6 h-6 text-cp-gold mb-1" />
                    <span className="text-[11px] font-mono">{selectedCase.idBackPlaceholder}</span>
                    <span className="text-[9px] text-cp-text-muted">Simulated Document Graphic</span>
                  </div>
                </div>

                {/* Proof of Address if Tier 2 */}
                {selectedCase.proofOfAddressPlaceholder && (
                  <div className="sm:col-span-2 p-3.5 rounded-xl bg-[#141d2b] border border-cp-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-cp-text-primary">
                        Proof of Address ({selectedCase.proofOfAddressType || 'Utility Bill'})
                      </span>
                      <span className="text-[10px] text-cp-text-muted font-mono">PDF • 1.1 MB</span>
                    </div>
                    <div className="h-20 rounded-lg bg-cp-card border border-dashed border-cp-border flex items-center justify-center gap-3 text-cp-text-muted p-2">
                      <FileText className="w-6 h-6 text-cp-positive" />
                      <div className="text-left">
                        <span className="text-[11px] font-mono text-cp-text-primary block">
                          {selectedCase.proofOfAddressPlaceholder}
                        </span>
                        <span className="text-[9px] text-cp-text-muted">Simulated Address Verification File</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Decision Buttons */}
            <div className="pt-3 flex items-center justify-between border-t border-cp-border">
              <span className="text-[11px] text-cp-text-muted">
                Status: <strong className="capitalize">{selectedCase.status.replace('_', ' ')}</strong>
              </span>

              {(selectedCase.status === 'pending' || selectedCase.status === 'in_review') ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-cp-negative border-cp-negative/40 hover:bg-cp-negative/15"
                    onClick={() => handleOpenDecision(selectedCase, 'reject')}
                  >
                    Reject Application
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenDecision(selectedCase, 'approve')}
                  >
                    Approve Application
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setSelectedCase(null)}>
                  Close Reviewer
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* APPROVE / REJECT CONFIRMATION MODAL */}
      {decisionCase && decisionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            onClick={() => setDecisionCase(null)}
          />

          <div className="relative w-full max-w-md bg-[#0c121c] border border-cp-border rounded-2xl shadow-2xl p-6 z-10 animate-fadeIn space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  decisionType === 'approve'
                    ? 'bg-cp-positive/15 text-cp-positive border border-cp-positive/30'
                    : 'bg-cp-negative/15 text-cp-negative border border-cp-negative/30'
                }`}
              >
                {decisionType === 'approve' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-cp-text-primary">
                  {decisionType === 'approve' ? 'Confirm KYC Approval' : 'Confirm KYC Rejection'}
                </h4>
                <p className="text-xs text-cp-text-muted">
                  Case: <strong>{decisionCase.caseRef}</strong> ({decisionCase.userName})
                </p>
              </div>
            </div>

            <p className="text-xs text-cp-text-secondary leading-relaxed bg-cp-elevated/40 p-3 rounded-lg border border-cp-border">
              {decisionType === 'approve'
                ? `Approving this demonstration case will elevate the customer account to ${decisionCase.requestedTier} with increased simulated daily limits.`
                : 'Rejecting this application will flag the verification case and record an official justification for the simulated applicant.'}
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-cp-text-secondary block">
                {decisionType === 'approve' ? 'Approval Notes *' : 'Rejection Reason *'}
              </label>
              <textarea
                rows={3}
                value={decisionReason}
                onChange={(e) => {
                  setDecisionReason(e.target.value)
                  if (decisionError) setDecisionError(null)
                }}
                placeholder={
                  decisionType === 'approve'
                    ? 'State compliance checks performed...'
                    : 'Explain reason (e.g. Document expired, unreadable text, name mismatch)...'
                }
                className="w-full bg-[#141d2b] border border-cp-border rounded-xl p-2.5 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold"
              />
              {decisionError && (
                <p className="text-xs text-cp-negative flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{decisionError}</span>
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-cp-border">
              <Button variant="outline" size="sm" onClick={() => setDecisionCase(null)}>
                Cancel
              </Button>
              <Button
                variant={decisionType === 'reject' ? 'outline' : 'primary'}
                size="sm"
                className={decisionType === 'reject' ? 'bg-cp-negative text-white hover:bg-cp-negative/90' : ''}
                onClick={handleConfirmDecision}
              >
                {decisionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminKYC
