import React from 'react'
import {
  X,
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { WithdrawHistoryRecord } from '@/mock/withdrawData'
import { formatCrypto } from '@/utils/formatters'

export interface WithdrawTransactionDetailModalProps {
  isOpen: boolean
  record: WithdrawHistoryRecord | null
  onClose: () => void
  onCopyText: (text: string, label: string) => void
}

export const WithdrawTransactionDetailModal: React.FC<WithdrawTransactionDetailModalProps> = ({
  isOpen,
  record,
  onClose,
  onCopyText,
}) => {
  if (!isOpen || !record) return null

  const getStatusBadge = () => {
    switch (record.status) {
      case 'completed':
        return <Badge variant="positive" size="sm" withDot>Completed</Badge>
      case 'processing':
        return <Badge variant="gold" size="sm" withDot pulseDot>Processing Payout</Badge>
      case 'pending':
        return <Badge variant="neutral" size="sm" withDot>Pending Review</Badge>
      case 'rejected':
        return <Badge variant="negative" size="sm">Rejected by Compliance</Badge>
      case 'failed':
        return <Badge variant="negative" size="sm">Execution Failed</Badge>
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-lg rounded-2xl bg-cp-elevated border border-cp-border shadow-elevated overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-cp-border flex items-center justify-between bg-cp-card">
          <div>
            <h3 className="font-bold text-base text-cp-text-primary">
              Withdrawal Transaction Record
            </h3>
            <span className="text-xs text-cp-text-muted font-mono">
              ID: {record.id}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs font-mono">
          {/* Amount & Status Card */}
          <div className="p-3.5 rounded-xl bg-cp-card border border-cp-border flex items-center justify-between">
            <div>
              <span className="text-[11px] font-sans text-cp-text-muted block">
                Disbursed Amount
              </span>
              <span className="text-lg font-bold text-cp-negative">
                -{formatCrypto(record.amount, record.asset)}
              </span>
              <span className="text-[10px] text-cp-text-muted font-sans block mt-0.5">
                Net received: {formatCrypto(record.receivedAmount, record.asset)}
              </span>
            </div>
            <div>{getStatusBadge()}</div>
          </div>

          {/* Failure reason notice (if rejected or failed) */}
          {record.failureReason && (
            <div className="p-3 rounded-xl bg-cp-negative/10 border border-cp-negative/30 text-cp-negative text-xs font-sans flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Action Note:</span>
                <p className="leading-relaxed mt-0.5">{record.failureReason}</p>
              </div>
            </div>
          )}

          {/* Details Table */}
          <div className="space-y-2.5 px-1 text-cp-text-secondary">
            <div className="flex justify-between py-1 border-b border-cp-border/40">
              <span className="font-sans text-cp-text-muted">Network Protocol:</span>
              <span className="text-cp-text-primary font-bold">{record.network}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-cp-border/40">
              <span className="font-sans text-cp-text-muted">Network Fee Deducted:</span>
              <span className="text-cp-text-primary">
                {formatCrypto(record.fee, record.asset)}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-cp-border/40">
              <span className="font-sans text-cp-text-muted">Timestamp:</span>
              <span className="text-cp-text-primary">
                {record.date} at {record.time}
              </span>
            </div>

            <div className="py-1 border-b border-cp-border/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-sans text-cp-text-muted">Destination Address:</span>
                <button
                  type="button"
                  onClick={() => onCopyText(record.destinationAddress, 'Address')}
                  className="text-cp-gold hover:underline flex items-center gap-1 font-sans text-[11px]"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
              <p className="text-[11px] text-cp-text-primary bg-cp-card p-2 rounded break-all border border-cp-border/60">
                {record.destinationAddress}
              </p>
            </div>

            {record.memoTag && (
              <div className="flex justify-between py-1 border-b border-cp-border/40">
                <span className="font-sans text-cp-text-muted">Destination Memo/Tag:</span>
                <span className="text-cp-gold font-bold">{record.memoTag}</span>
              </div>
            )}

            {record.txHash && (
              <div className="py-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-cp-text-muted">Blockchain Hash:</span>
                  <button
                    type="button"
                    onClick={() => onCopyText(record.txHash!, 'Tx Hash')}
                    className="text-cp-gold hover:underline flex items-center gap-1 font-sans text-[11px]"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <p className="text-[11px] text-cp-text-primary bg-cp-card p-2 rounded break-all border border-cp-border/60">
                  {record.txHash}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-cp-border bg-cp-card flex items-center justify-end">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

export default WithdrawTransactionDetailModal
