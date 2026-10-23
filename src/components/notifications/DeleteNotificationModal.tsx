import React from 'react'
import { Trash2, X, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { NotificationItem } from '@/mock/notificationsData'

export interface DeleteNotificationModalProps {
  isOpen: boolean
  notification: NotificationItem | null
  isClearAll?: boolean
  onConfirm: () => void
  onClose: () => void
}

export const DeleteNotificationModal: React.FC<DeleteNotificationModalProps> = ({
  isOpen,
  notification,
  isClearAll = false,
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
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-cp-text-primary">
                {isClearAll ? 'Delete All Read Notifications?' : 'Delete Notification?'}
              </h3>
              <p className="text-xs text-cp-text-secondary">Confirm deletion action</p>
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
        <div className="p-5 text-xs text-cp-text-secondary leading-relaxed space-y-2">
          {isClearAll ? (
            <p>
              Are you sure you want to permanently remove all read notification records from your notification centre? This action cannot be undone.
            </p>
          ) : (
            <>
              <p>Are you sure you want to delete this notification?</p>
              {notification && (
                <div className="p-3 rounded-xl bg-cp-card border border-cp-border font-medium text-cp-text-primary text-xs">
                  {notification.title}
                </div>
              )}
            </>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-cp-border bg-cp-card/60 flex items-center justify-end gap-3">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm}>
            {isClearAll ? 'Clear All Read' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  )
}
