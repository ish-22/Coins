import React from 'react'
import {
  X,
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { DepositHistoryRecord } from '@/mock/depositData'
import { formatCrypto } from '@/utils/formatters'

export interface DepositTransactionDetailModalProps {
  isOpen: boolean
  record: DepositHistoryRecord | null
  onClose: () => void
  onCopyText: (text: string, label: string) => void
}

export const DepositTransactionDetailModal: React.FC<DepositTransactionDetailModalProps> = ({
  isOpen,
  record,
  onClose,
  onCopyText,
}) => {
  if (!isOpen || !record) return null

  const getStatusIcon = () => {
    switch (record.status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-cp-positive" />
      case 'pending':
        return <Clock className="w-5 h-5 text-cp-gold animate-spin" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-cp-negative" />
    }
  }

  const getStatusBadge = () => {
    switch (record.status) {
      case 'completed':
        return <Badge variant="positive" size="sm" withDot>Completed</Badge>
      case 'pending':
        return <Badge variant="gold" size="sm" withDot pulseDot>Pending Confirmation</Badge>
      case 'failed':
        return <Badge variant="negative" size="sm">Failed</Badge>
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-lg rounded-2xl bg-cp-elevated border border-cp-border shadow-elevated overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-cp-border flex items-center justify-between bg-cp-card">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cp-elevated border border-cp-border">
              {getStatusIcon()}
            </div>
            <div>
              <h3 className="font-bold text-base text-cp-text-primary">
                Deposit Details
              </h3>
              <span className="text-xs text-cp-text-muted">
                Transaction ID: {record.id}
              </span>
            </div>
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
          {/* Amount and Status Banner */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-cp-card border border-cp-border">
            <div>
              <span className="text-[11px] font-sans text-cp-text-muted block">
                Deposited Amount
              </span>
              <span className="text-lg font-bold text-cp-positive">
                +{formatCrypto(record.amount, record.asset)}
              </span>
            </div>
            <div>{getStatusBadge()}</div>
          </div>

          {/* Details Grid */}
          <div className="space-y-2.5 px-1 text-cp-text-secondary">
            <div className="flex items-center justify-between py-1 border-b border-cp-border/40">
              <span className="font-sans text-cp-text-muted">Network Protocol:</span>
              <span className="text-cp-text-primary font-bold">{record.network}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-cp-border/40">
              <span className="font-sans text-cp-text-muted">Arrival Timestamp:</span>
              <span className="text-cp-text-primary">{record.date} at {record.time}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-cp-border/40">
              <span className="font-sans text-cp-text-muted">Confirmations:</span>
              <span className="text-cp-positive font-semibold">{record.confirmations}</span>
            </div>

            <div className="py-1 border-b border-cp-border/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-sans text-cp-text-muted">Deposit Address:</span>
                <button
                  type="button"
                  onClick={() => onCopyText(record.address, 'Address')}
                  className="text-cp-gold hover:underline flex items-center gap-1 font-sans text-[11px]"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
              <p className="text-[11px] text-cp-text-primary bg-cp-card p-2 rounded break-all border border-cp-border/60">
                {record.address}
              </p>
            </div>

            <div className="py-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-sans text-cp-text-muted">Transaction Reference Hash:</span>
                <button
                  type="button"
                  onClick={() => onCopyText(record.txHash, 'Tx Hash')}
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
          </div>

          {/* Simulation Disclaimer */}
          <div className="p-3 rounded-xl bg-cp-card border border-cp-gold/30 text-[11px] text-cp-text-muted font-sans flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-cp-gold shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              This transaction record is for UI demonstration purposes only. It is simulated and not connected to a live blockchain network.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-cp-border bg-cp-card flex items-center justify-end gap-3">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DepositTransactionDetailModal
