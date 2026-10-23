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
  onStatusChange: (newStatus: KYCStatus) => void
  onResubmit: () => void
  onStartVerification: () => void
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  status,
  onStatusChange,
  onResubmit,
  onStartVerification,
}) => {
  return (
    <div className="space-y-3">
      {/* State Switcher Bar for Demo Testing */}
      <div className="p-2.5 rounded-xl bg-cp-elevated/70 border border-cp-border flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-cp-text-secondary">
          <Sparkles className="w-3.5 h-3.5 text-cp-gold" />
          <span className="font-semibold text-cp-text-primary">Demonstration Status Switcher:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => onStatusChange('not_started')}
            className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
              status === 'not_started'
                ? 'bg-cp-gold text-cp-bg'
                : 'bg-cp-card text-cp-text-secondary hover:text-cp-text-primary'
            }`}
          >
            Not Started
          </button>
          <button
            onClick={() => onStatusChange('in_progress')}
            className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
              status === 'in_progress'
                ? 'bg-cp-gold text-cp-bg'
                : 'bg-cp-card text-cp-text-secondary hover:text-cp-text-primary'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => onStatusChange('pending_review')}
            className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
              status === 'pending_review'
                ? 'bg-cp-gold text-cp-bg'
                : 'bg-cp-card text-cp-text-secondary hover:text-cp-text-primary'
            }`}
          >
            Pending Review
          </button>
          <button
            onClick={() => onStatusChange('approved')}
            className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
              status === 'approved'
                ? 'bg-cp-positive text-cp-bg'
                : 'bg-cp-card text-cp-text-secondary hover:text-cp-positive'
            }`}
          >
            Approved (Tier 2)
          </button>
          <button
            onClick={() => onStatusChange('rejected')}
            className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
              status === 'rejected'
                ? 'bg-cp-negative text-cp-bg'
                : 'bg-cp-card text-cp-text-secondary hover:text-cp-negative'
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

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
                    Identity Verified (Tier 2 Approved)
                  </h3>
                  <Badge variant="positive" size="sm" withDot>
                    Verified
                  </Badge>
                </div>
                <p className="text-xs text-cp-text-secondary mt-0.5">
                  Your government ID and proof of residence have been validated. You now enjoy maximum daily withdrawal limits of 100 BTC.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <Button variant="secondary" size="sm" onClick={() => onStatusChange('not_started')}>
                Reset Verification
              </Button>
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
                    Pending Review
                  </Badge>
                </div>
                <p className="text-xs text-cp-text-secondary mt-0.5">
                  Your identity documents have been submitted to the simulated compliance queue. Review typically completes within 1-2 hours.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <Button variant="primary" size="sm" onClick={() => onStatusChange('approved')}>
                Simulate Approval
              </Button>
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
              <span>Reason: {REJECTION_SAMPLE_EXPLANATION.reason}</span>
            </div>
            <p className="text-cp-text-secondary text-[11px] leading-relaxed">
              {REJECTION_SAMPLE_EXPLANATION.details}
            </p>
            <div className="pt-2 border-t border-cp-border/50 text-[11px] text-cp-gold font-medium">
              💡 Advice: {REJECTION_SAMPLE_EXPLANATION.suggestedAction}
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
