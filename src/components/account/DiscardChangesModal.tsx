import React from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/common/Button'

export interface DiscardChangesModalProps {
  isOpen: boolean
  onConfirm: () => void
  onClose: () => void
}

export const DiscardChangesModal: React.FC<DiscardChangesModalProps> = ({
  isOpen,
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
            <div className="w-9 h-9 rounded-xl bg-cp-negative/10 border border-cp-negative/30 flex items-center justify-center text-cp-negative">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-cp-text-primary">Discard Unsaved Changes?</h3>
              <p className="text-xs text-cp-text-secondary">You have unsaved edits in your profile</p>
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
        <div className="p-5 space-y-2 text-xs text-cp-text-secondary">
          <p>
            Are you sure you want to discard your edits? Any modifications made to your personal information, contact details, or trading preferences will be lost and reverted.
          </p>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-cp-border bg-cp-card/60 flex items-center justify-end gap-3">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Continue Editing
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm}>
            Discard Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
