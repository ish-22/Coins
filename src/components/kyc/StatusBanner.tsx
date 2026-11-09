import React from 'react'
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { KYCStatus, REJECTION_SAMPLE_EXPLANATION } from '@/mock/kycData'

export interface StatusBannerProps {
  status: KYCStatus
  rejectionReason?: string | null
  onStatusChange: (newStatus: KYCStatus) => void
  onResubmit: () => void
  onStartVerification: () => void
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  status,
  rejectionReason,
  onStatusChange,
  onResubmit,
  onStartVerification,
}) => {
  return (
    <div className="space-y-3">
      {/* Main Status Cards */}
      {status === 'approved' && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-cp-card via-cp-elevated to-cp-card border border-cp-positive/40 shadow-card animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-cp-positive/10 border border-cp-positive/30 flex items-center justify-center text-cp-positive shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-cp-text-primary">
                    Identity Verified (VERIFIED Status)
                  </h3>
                  <Badge variant="positive" size="sm" withDot>
                    Verified
                  </Badge>
                </div>
                <p className="text-xs text-cp-text-secondary mt-0.5">
                  Your government identification documents have been verified and approved by compliance. High-tier trading and elevated withdrawal limits are fully unlocked.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {status === 'pending_review' && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-cp-card via-cp-elevated to-cp-card border border-cp-gold/40 shadow-card animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-cp-gold/10 border border-cp-gold/30 flex items-center justify-center text-cp-gold shrink-0">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-cp-text-primary">
                    Verification In Review
                  </h3>
                  <Badge variant="gold" size="sm" withDot pulseDot>
                    Compliance Review Active
                  </Badge>
                </div>
                <p className="text-xs text-cp-text-secondary mt-0.5">
                  Your identity documents have been securely submitted to the compliance review desk. Once an administrator reviews and approves your submission, your account will update automatically.
                </p>
              </div>
            </div>
            <div className="text-xs text-cp-gold/90 bg-cp-gold/10 border border-cp-gold/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              <span>Awaiting Admin Decision</span>
            </div>
          </div>
        </div>
      )}

      {status === 'rejected' && (
        <div className="p-5 rounded-2xl bg-cp-card border border-cp-negative/50 shadow-card space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cp-border/50 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-cp-negative/10 border border-cp-negative/30 flex items-center justify-center text-cp-negative shrink-0">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-cp-text-primary">
                    Verification Rejected
                  </h3>
                  <Badge variant="negative" size="sm">
                    Action Required
                  </Badge>
                </div>
                <p className="text-xs text-cp-text-secondary mt-0.5">
                  Your identity verification submission could not be approved due to compliance criteria mismatch.
                </p>
              </div>
            </div>
            <Button variant="danger" size="sm" onClick={onResubmit} className="shrink-0">
              Resubmit Verification
            </Button>
          </div>

          {/* Rejection Detail Box */}
          <div className="p-4 rounded-xl bg-cp-elevated border border-cp-border space-y-2 text-xs">
            <div className="flex items-center gap-2 text-cp-negative font-semibold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Reason: {rejectionReason || REJECTION_SAMPLE_EXPLANATION.reason}</span>
            </div>
            <p className="text-cp-text-secondary text-[11px] leading-relaxed">
              {rejectionReason ? `Official Compliance Feedback: ${rejectionReason}` : REJECTION_SAMPLE_EXPLANATION.details}
            </p>
            <div className="pt-2 border-t border-cp-border/50 text-[11px] text-cp-gold font-medium">
              💡 Advice: Please review the rejection reason above, ensure documents are high-resolution, unexpired, and match your registered legal name, then submit again.
            </div>
          </div>
        </div>
      )}

      {status === 'not_started' && (
        <div className="p-5 rounded-2xl bg-cp-card border border-cp-border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-cp-elevated border border-cp-border flex items-center justify-center text-cp-text-secondary shrink-0">
              <ShieldCheck className="w-6 h-6 text-cp-gold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-cp-text-primary">
                  Verification Not Started
                </h3>
                <Badge variant="neutral" size="sm">
                  Tier 1 Only
                </Badge>
              </div>
              <p className="text-xs text-cp-text-secondary mt-0.5">
                Complete Tier 2 identity verification to unlock 100 BTC daily withdrawals and high-volume limits.
              </p>
            </div>
          </div>
          <Button variant="primary" size="sm" onClick={onStartVerification} className="shrink-0">
            Start Verification <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}
