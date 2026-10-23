import React from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/common/Button'

export interface ConfirmActionModalProps {
  isOpen: boolean
  title: string
  description: string
  confirmButtonText?: string
  isDangerous?: boolean
  onConfirm: () => void
  onClose: () => void
}

export const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  isOpen,
  title,
  description,
  confirmButtonText = 'Confirm Action',
  isDangerous = true,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-cp-elevated border border-cp-border shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-cp-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isDangerous
                  ? 'bg-cp-negative/10 border border-cp-negative/30 text-cp-negative'
                  : 'bg-cp-gold/10 border border-cp-gold/30 text-cp-gold'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-cp-text-primary">{title}</h3>
              <p className="text-xs text-cp-text-secondary">Security action confirmation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 text-xs text-cp-text-secondary leading-relaxed">
          <p>{description}</p>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-cp-border bg-cp-card/60 flex items-center justify-end gap-3">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={isDangerous ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
          >
            {confirmButtonText}
          </Button>
        </div>
      </div>
    </div>
  )
}
