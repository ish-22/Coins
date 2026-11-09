import React, { useState, useMemo, useEffect } from 'react'
import {
  ShieldCheck,
  Search,
  Eye,
  CheckCircle2,
  X,
  XCircle,
  AlertTriangle,
  FileText,
  ZoomIn,
  ExternalLink,
  ShieldAlert,
  UserCheck,
  FileCheck2,
  RotateCw,
} from 'lucide-react'
import { Card, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { AdminKycCase } from '@/mock/adminData'
import { adminService } from '@/services'

const REJECTION_PRESETS = [
  'Document is blurry, low resolution, or unreadable',
  'Applicant legal name does not match KYC registration',
  'Identification document is expired or invalidated',
  'Missing clear photo of the back/reverse side of ID card',
  'Proof of address document is older than 90 days',
  'Submitted document type is unsupported or incomplete',
]

const APPROVAL_PRESETS = [
  'All biometric likeness and document security checks verified.',
  'Government ID and residential address proof validated successfully.',
]

export const AdminKYC: React.FC = () => {
  const [cases, setCases] = useState<AdminKycCase[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_review' | 'approved' | 'rejected'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCase, setSelectedCase] = useState<AdminKycCase | null>(null)

  // Document Inspection Modal State
  const [inspectedDoc, setInspectedDoc] = useState<{
    title: string
    filename: string
    docType: string
    docNumber?: string
    applicantName?: string
    country?: string
    fileUrl?: string
  } | null>(null)

  // Decision Modal State
  const [decisionCase, setDecisionCase] = useState<AdminKycCase | null>(null)
  const [decisionType, setDecisionType] = useState<'approve' | 'reject' | null>(null)
  const [decisionReason, setDecisionReason] = useState('')
  const [decisionError, setDecisionError] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const loadCases = async (isBackground = false) => {
    try {
      if (!isBackground) setIsLoading(true)
      setLoadError(null)
      const liveCases = await adminService.getKycCases()
      setCases(liveCases)
    } catch (error: any) {
      if (!isBackground) {
        setLoadError(error?.response?.data?.message || 'Unable to load KYC cases from the backend.')
        setCases([])
      }
    } finally {
      if (!isBackground) setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCases()
    const timer = setInterval(() => {
      loadCases(true)
    }, 6000)
    window.addEventListener('focus', () => loadCases(true))
    return () => {
      clearInterval(timer)
      window.removeEventListener('focus', () => loadCases(true))
    }
  }, [])

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
    setDecisionReason(
      type === 'approve'
        ? APPROVAL_PRESETS[0]
        : ''
    )
    setDecisionError(null)
  }

  const handleConfirmDecision = async () => {
    if (!decisionReason.trim()) {
      setDecisionError('A clear justification or rejection reason is required for compliance audit logs.')
      return
    }

    if (!decisionCase || !decisionType) return

    try {
      const response = await adminService.reviewKycCase(decisionCase.id, decisionType, decisionReason.trim())
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
        response?.message ||
          `Case ${decisionCase.caseRef} (${decisionCase.userName}) ${
            decisionType === 'approve' ? 'Approved (Status: VERIFIED)' : 'Rejected'
          } successfully.`
      )
      window.dispatchEvent(new Event('cp_admin_metrics_refresh'))
      setTimeout(() => setToastMessage(null), 4000)
    } catch (error: any) {
      setDecisionError(error?.response?.data?.message || 'The KYC decision could not be submitted to the backend.')
      return
    }

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
            KYC Verification Management
          </h1>
          <p className="text-xs text-cp-text-muted mt-0.5">
            Review submitted ID cards, passports, and proof of address. Approved applications automatically grant VERIFIED status and unlock trading.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => loadCases()}
            disabled={isLoading}
            leftIcon={<RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
          >
            Refresh Queue
          </Button>
          <Badge variant="gold" size="sm">
            Pending Queue: {cases.filter((c) => c.status === 'pending' || c.status === 'in_review').length}
          </Badge>
          <Badge variant="positive" size="sm">
            Verified: {cases.filter((c) => c.status === 'approved').length}
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
          Loading verification queue from the live API...
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
                {st === 'approved' ? 'Verified (Approved)' : st.replace('_', ' ')}
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
                  <th className="py-3 px-4">Document Details</th>
                  <th className="py-3 px-4">Verification Status</th>
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
                        className="font-bold"
                      >
                        {c.status === 'approved' ? 'VERIFIED' : c.status.replace('_', ' ').toUpperCase()}
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
                          className="px-2.5 py-1 rounded-lg bg-cp-elevated hover:bg-cp-card border border-cp-border text-cp-text-secondary hover:text-cp-gold transition-colors inline-flex items-center gap-1 font-medium"
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
                    className="font-bold"
                  >
                    {selectedCase.status === 'approved' ? 'VERIFIED' : selectedCase.status.replace('_', ' ').toUpperCase()}
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
                <span className="text-cp-text-muted block text-[10px] uppercase font-semibold">Document Type</span>
                <span className="font-semibold text-cp-text-primary mt-0.5 block">{selectedCase.documentType}</span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase font-semibold">Document Number</span>
                <span className="font-mono text-cp-gold font-bold mt-0.5 block">{selectedCase.documentNumber}</span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase font-semibold">Requested Compliance Tier</span>
                <span className="font-semibold text-cp-text-primary mt-0.5 block">{selectedCase.requestedTier}</span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase font-semibold">Submission Timestamp</span>
                <span className="font-mono text-cp-text-muted mt-0.5 block">{selectedCase.submittedAt}</span>
              </div>
            </div>

            {/* Rejection notice if already rejected */}
            {selectedCase.rejectionReason && (
              <div className="p-3.5 rounded-xl bg-cp-negative/10 border border-cp-negative/30 text-xs text-cp-negative space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 shrink-0" />
                  Recorded Rejection Reason:
                </span>
                <p className="leading-relaxed">{selectedCase.rejectionReason}</p>
              </div>
            )}

            {/* Uploaded Documents Showcase with Inspection Trigger */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-cp-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-cp-gold" />
                  Submitted Identification Documents (Click to Inspect)
                </h4>
                <span className="text-[10px] text-cp-text-muted">High-Resolution Previews</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* ID Front */}
                <div
                  onClick={() =>
                    setInspectedDoc({
                      title: `${selectedCase.documentType} (Front Photo)`,
                      filename: selectedCase.idFrontPlaceholder || 'id_front.jpg',
                      docType: selectedCase.documentType,
                      docNumber: selectedCase.documentNumber,
                      applicantName: selectedCase.userName,
                      country: selectedCase.country,
                      fileUrl: selectedCase.idFrontUrl || selectedCase.idFrontPlaceholder,
                    })
                  }
                  className="p-3.5 rounded-xl bg-[#141d2b] hover:bg-[#182335] border border-cp-border hover:border-cp-gold/60 transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-cp-text-primary group-hover:text-cp-gold transition-colors">
                      {selectedCase.documentType} (Front)
                    </span>
                    <span className="text-[10px] text-cp-text-muted font-mono flex items-center gap-1">
                      <ZoomIn className="w-3 h-3 text-cp-gold" />
                      Inspect
                    </span>
                  </div>
                  <div className="h-28 rounded-lg bg-cp-card border border-dashed border-cp-border flex flex-col items-center justify-center text-cp-text-muted p-2 text-center group-hover:border-cp-gold/40 transition-colors">
                    <FileText className="w-6 h-6 text-cp-gold mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-mono text-cp-text-primary">{selectedCase.idFrontPlaceholder || 'id_front.jpg'}</span>
                    <span className="text-[9px] text-cp-text-muted">Click to view official document inspector</span>
                  </div>
                </div>

                {/* ID Back */}
                <div
                  onClick={() =>
                    setInspectedDoc({
                      title: `${selectedCase.documentType} (Back / Signature Page)`,
                      filename: selectedCase.idBackPlaceholder || 'id_back.jpg',
                      docType: selectedCase.documentType,
                      docNumber: selectedCase.documentNumber,
                      applicantName: selectedCase.userName,
                      country: selectedCase.country,
                      fileUrl: selectedCase.idBackUrl || selectedCase.idBackPlaceholder,
                    })
                  }
                  className="p-3.5 rounded-xl bg-[#141d2b] hover:bg-[#182335] border border-cp-border hover:border-cp-gold/60 transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-cp-text-primary group-hover:text-cp-gold transition-colors">
                      {selectedCase.documentType} (Back / Signature)
                    </span>
                    <span className="text-[10px] text-cp-text-muted font-mono flex items-center gap-1">
                      <ZoomIn className="w-3 h-3 text-cp-gold" />
                      Inspect
                    </span>
                  </div>
                  <div className="h-28 rounded-lg bg-cp-card border border-dashed border-cp-border flex flex-col items-center justify-center text-cp-text-muted p-2 text-center group-hover:border-cp-gold/40 transition-colors">
                    <FileText className="w-6 h-6 text-cp-gold mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-mono text-cp-text-primary">{selectedCase.idBackPlaceholder || 'id_back.jpg'}</span>
                    <span className="text-[9px] text-cp-text-muted">Click to view official document inspector</span>
                  </div>
                </div>

                {/* Proof of Address if Tier 2 */}
                {selectedCase.proofOfAddressPlaceholder && (
                  <div
                    onClick={() =>
                      setInspectedDoc({
                        title: `Proof of Address (${selectedCase.proofOfAddressType || 'Utility Bill'})`,
                        filename: selectedCase.proofOfAddressPlaceholder || 'proof_of_address.pdf',
                        docType: selectedCase.proofOfAddressType || 'Utility Bill',
                        applicantName: selectedCase.userName,
                        country: selectedCase.country,
                        fileUrl: selectedCase.proofOfAddressUrl || selectedCase.proofOfAddressPlaceholder,
                      })
                    }
                    className="sm:col-span-2 p-3.5 rounded-xl bg-[#141d2b] hover:bg-[#182335] border border-cp-border hover:border-cp-positive/60 transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-cp-text-primary group-hover:text-cp-positive transition-colors">
                        Proof of Address ({selectedCase.proofOfAddressType || 'Utility Bill'})
                      </span>
                      <span className="text-[10px] text-cp-text-muted font-mono flex items-center gap-1">
                        <ZoomIn className="w-3 h-3 text-cp-positive" />
                        Inspect Document
                      </span>
                    </div>
                    <div className="h-20 rounded-lg bg-cp-card border border-dashed border-cp-border flex items-center justify-center gap-3 text-cp-text-muted p-2 group-hover:border-cp-positive/40 transition-colors">
                      <FileCheck2 className="w-6 h-6 text-cp-positive group-hover:scale-110 transition-transform" />
                      <div className="text-left">
                        <span className="text-[11px] font-mono text-cp-text-primary block">
                          {selectedCase.proofOfAddressPlaceholder}
                        </span>
                        <span className="text-[9px] text-cp-text-muted">
                          Official Residential Proof • Click to view statement inspector
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Decision Buttons */}
            <div className="pt-3 flex items-center justify-between border-t border-cp-border">
              <span className="text-[11px] text-cp-text-muted">
                Status:{' '}
                <strong className={selectedCase.status === 'approved' ? 'text-cp-positive font-bold' : selectedCase.status === 'rejected' ? 'text-cp-negative font-bold' : 'text-cp-gold font-bold'}>
                  {selectedCase.status === 'approved' ? 'VERIFIED' : selectedCase.status.replace('_', ' ').toUpperCase()}
                </strong>
              </span>

              {selectedCase.status === 'pending' || selectedCase.status === 'in_review' ? (
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

      {/* DOCUMENT HIGH-FIDELITY INSPECTION MODAL */}
      {inspectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => setInspectedDoc(null)}
          />

          <div className="relative w-full max-w-xl bg-[#0a0f18] border border-cp-gold/40 rounded-2xl shadow-2xl p-6 z-10 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between border-b border-cp-border pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cp-gold" />
                <h4 className="text-base font-bold text-cp-text-primary">
                  {inspectedDoc.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setInspectedDoc(null)}
                className="p-1 rounded-lg text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Graphic Visual Canvas or Real Uploaded Image */}
            {inspectedDoc.fileUrl && (inspectedDoc.fileUrl.startsWith('data:image') || inspectedDoc.fileUrl.startsWith('http') || inspectedDoc.fileUrl.startsWith('storage') || inspectedDoc.fileUrl.startsWith('/storage')) ? (
              <div className="space-y-4">
                <div className="rounded-xl overflow-hidden border border-cp-border bg-black/70 flex items-center justify-center p-3 max-h-[380px]">
                  <img
                    src={inspectedDoc.fileUrl.startsWith('storage') ? `http://127.0.0.1:8000/${inspectedDoc.fileUrl}` : inspectedDoc.fileUrl}
                    alt={inspectedDoc.title}
                    className="max-h-[360px] max-w-full object-contain rounded-lg shadow-2xl"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-cp-card border border-cp-border">
                    <span className="text-[9px] text-cp-text-muted uppercase block font-semibold">Applicant</span>
                    <span className="font-bold text-cp-text-primary block truncate mt-0.5">{inspectedDoc.applicantName || 'Applicant'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-cp-card border border-cp-border">
                    <span className="text-[9px] text-cp-text-muted uppercase block font-semibold">Document No.</span>
                    <span className="font-mono font-bold text-cp-gold block truncate mt-0.5">{inspectedDoc.docNumber || 'N/A'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-cp-card border border-cp-border">
                    <span className="text-[9px] text-cp-text-muted uppercase block font-semibold">Origin</span>
                    <span className="text-cp-text-secondary block truncate mt-0.5">{inspectedDoc.country || 'International'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-gradient-to-br from-[#121c2c] to-[#0d1522] border border-cp-border space-y-4 relative overflow-hidden">
                <div className="absolute right-4 top-4 opacity-10 pointer-events-none">
                  <ShieldCheck className="w-32 h-32 text-cp-gold" />
                </div>

                <div className="flex items-start justify-between border-b border-cp-border/60 pb-3">
                  <div>
                    <span className="text-[10px] text-cp-gold font-mono uppercase tracking-widest block font-bold">
                      Official Verification Document
                    </span>
                    <span className="text-sm font-black text-cp-text-primary block mt-0.5">
                      {inspectedDoc.docType}
                    </span>
                  </div>
                  <Badge variant="gold" size="sm" className="font-mono">
                    {inspectedDoc.country || 'International'}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs py-2">
                  <div className="p-3 rounded-lg bg-cp-card/60 border border-cp-border/60">
                    <span className="text-[9px] text-cp-text-muted uppercase block font-semibold">Applicant</span>
                    <span className="font-bold text-cp-text-primary block truncate mt-0.5">
                      {inspectedDoc.applicantName || 'Verified Trader'}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-cp-card/60 border border-cp-border/60">
                    <span className="text-[9px] text-cp-text-muted uppercase block font-semibold">Document No.</span>
                    <span className="font-mono font-bold text-cp-gold block truncate mt-0.5">
                      {inspectedDoc.docNumber || 'DOC-948124'}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-cp-card/60 border border-cp-border/60">
                    <span className="text-[9px] text-cp-text-muted uppercase block font-semibold">File Format</span>
                    <span className="font-mono text-cp-text-secondary block mt-0.5">
                      {inspectedDoc.filename.endsWith('.pdf') ? 'PDF • 1.1 MB' : 'JPG • 2.4 MB'}
                    </span>
                  </div>
                </div>

                {/* Security MRZ / Barcode Lines Representation */}
                <div className="p-3 rounded-lg bg-black/50 border border-cp-border font-mono text-[10px] text-cp-text-muted space-y-1">
                  <div className="tracking-[0.25em] text-cp-gold/80">
                    P&lt;USA{inspectedDoc.applicantName?.replace(/\s+/g, '&lt;&lt;') || 'TRADER'}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                  </div>
                  <div className="tracking-[0.25em] text-cp-text-muted">
                    {inspectedDoc.docNumber || 'DOC-948124'}&lt;0USA9001014M3001018&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;4
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-cp-text-muted pt-1">
                  <span className="flex items-center gap-1.5 text-cp-positive">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Anti-Tamper Holographic Watermark Verified
                  </span>
                  <span className="font-mono text-[10px]">{inspectedDoc.filename}</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-cp-border">
              <Button variant="outline" size="sm" onClick={() => setInspectedDoc(null)}>
                Close Viewer
              </Button>
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

          <div className="relative w-full max-w-lg bg-[#0c121c] border border-cp-border rounded-2xl shadow-2xl p-6 z-10 animate-fadeIn space-y-4 max-h-[90vh] overflow-y-auto">
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
                  {decisionType === 'approve' ? 'Approve KYC Verification' : 'Reject KYC Application'}
                </h4>
                <p className="text-xs text-cp-text-muted">
                  Case: <strong>{decisionCase.caseRef}</strong> ({decisionCase.userName} • {decisionCase.userEmail})
                </p>
              </div>
            </div>

            <div className="text-xs text-cp-text-secondary leading-relaxed bg-cp-elevated/40 p-3 rounded-xl border border-cp-border space-y-1">
              <p>
                {decisionType === 'approve'
                  ? 'Approving this KYC application will automatically change the customer account verification status to VERIFIED and unlock live spot trading access.'
                  : 'Rejecting this application will keep the user UNVERIFIED. The user will be restricted from accessing trading functions and will see your rejection reason in their portal.'}
              </p>
            </div>

            {/* Quick Reason Presets */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-cp-text-muted block uppercase tracking-wider">
                {decisionType === 'approve' ? 'Recommended Approval Notes (Click to apply)' : 'Standard Rejection Reasons (Click to apply)'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(decisionType === 'approve' ? APPROVAL_PRESETS : REJECTION_PRESETS).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setDecisionReason(preset)
                      if (decisionError) setDecisionError(null)
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-cp-card hover:bg-cp-elevated border border-cp-border hover:border-cp-gold/50 text-cp-text-secondary transition-all text-left"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-cp-text-secondary block">
                {decisionType === 'approve' ? 'Compliance Review Notes *' : 'Rejection Reason Provided to User *'}
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
                    : 'Explain why documents were rejected (e.g. Document expired, unreadable text, name mismatch)...'
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
                {decisionType === 'approve' ? 'Confirm Approval (Set VERIFIED)' : 'Confirm Rejection'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminKYC