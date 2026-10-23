import React from 'react'
import {
  X,
  AlertTriangle,
  ArrowUpFromLine,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { formatCrypto } from '@/utils/formatters'

export interface WithdrawPayload {
  assetSymbol: string
  assetName: string
  networkName: string
  networkId: string
  destinationAddress: string
  memoTag?: string
  amount: number
  fee: number
  receivedAmount: number
}

export interface WithdrawConfirmationModalProps {
  isOpen: boolean
  payload: WithdrawPayload | null
  onProceedToVerification: () => void
  onClose: () => void
}

export const WithdrawConfirmationModal: React.FC<WithdrawConfirmationModalProps> = ({
  isOpen,
  payload,
  onProceedToVerification,
  onClose,
}) => {
  if (!isOpen || !payload) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-md rounded-2xl bg-cp-elevated border border-cp-border shadow-elevated overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-cp-border flex items-center justify-between bg-cp-card">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cp-negative/10 text-cp-negative">
              <ArrowUpFromLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-cp-text-primary">
                Confirm Withdrawal
              </h3>
              <span className="text-xs text-cp-text-muted">
                Step 1 of 2: Review Parameters
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

        {/* Content Details */}
        <div className="p-5 space-y-4 text-xs font-mono">
          {/* Net Amount Banner */}
          <div className="p-4 rounded-xl bg-cp-card border border-cp-border flex items-center justify-between">
            <div>
              <span className="text-[11px] font-sans text-cp-text-muted block">
                You will receive
              </span>
              <span className="text-xl font-extrabold text-cp-gold">
                {formatCrypto(payload.receivedAmount, payload.assetSymbol)}
              </span>
            </div>
            <Badge variant="gold" size="sm" withDot>
              {payload.networkName.split(' ')[0]}
            </Badge>
          </div>

          {/* Breakdown Table */}
          <div className="space-y-2.5 px-1 text-cp-text-secondary">
            <div className="flex justify-between py-1 border-b border-cp-border/40">
              <span className="font-sans text-cp-text-muted">Withdrawal Asset:</span>
              <span className="text-cp-text-primary font-bold">
                {payload.assetName} ({payload.assetSymbol})
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-cp-border/40">
              <span className="font-sans text-cp-text-muted">Network Protocol:</span>
              <span className="text-cp-text-primary font-bold">{payload.networkName}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-cp-border/40">
              <span className="font-sans text-cp-text-muted">Requested Amount:</span>
              <span className="text-cp-text-primary font-bold">
                {formatCrypto(payload.amount, payload.assetSymbol)}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-cp-border/40">
              <span className="font-sans text-cp-text-muted">Network Fee:</span>
              <span className="text-cp-negative font-bold">
                -{formatCrypto(payload.fee, payload.assetSymbol)}
              </span>
            </div>

            <div className="py-1 space-y-1">
              <span className="font-sans text-cp-text-muted block">Destination Address:</span>
              <p className="text-[11px] text-cp-text-primary bg-cp-card p-2 rounded break-all border border-cp-border/60 font-semibold select-all">
                {payload.destinationAddress}
              </p>
            </div>

            {payload.memoTag && (
              <div className="flex justify-between py-1 border-t border-cp-border/40">
                <span className="font-sans text-cp-text-muted">Destination Tag / Memo:</span>
                <span className="text-cp-gold font-bold">{payload.memoTag}</span>
              </div>
            )}
          </div>

          {/* Simulated Disclaimer */}
          <div className="p-3 rounded-xl bg-cp-card border border-cp-gold/30 text-[11px] text-cp-text-muted font-sans flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-cp-gold shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Simulation Disclaimer: This is a frontend demonstration. No real cryptocurrency funds will be transferred or broadcasted to any blockchain.
            </p>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 sm:p-5 border-t border-cp-border bg-cp-card flex items-center justify-end gap-3">
          <Button variant="ghost" size="md" onClick={onClose}>
            Back
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={onProceedToVerification}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="font-bold uppercase tracking-wider"
          >
            Continue to Security
          </Button>
        </div>
      </div>
    </div>
  )
}

export default WithdrawConfirmationModal
