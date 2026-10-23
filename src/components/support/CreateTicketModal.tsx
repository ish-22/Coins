import React, { useState } from 'react'
import {
  X,
  LifeBuoy,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Send,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import {
  SupportCategory,
  TicketPriority,
  SupportTicket,
  SUPPORT_CATEGORIES,
} from '@/mock/supportData'

export interface CreateTicketModalProps {
  isOpen: boolean
  onCreated: (ticket: SupportTicket) => void
  onClose: () => void
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onCreated,
  onClose,
}) => {
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState<SupportCategory>('trading')
  const [priority, setPriority] = useState<TicketPriority>('medium')
  const [description, setDescription] = useState('')
  const [attachmentName, setAttachmentName] = useState<string | null>(null)
  const [errors, setErrors] = useState<{ subject?: string; description?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleAttachDemoFile = () => {
    setAttachmentName('error_screenshot_sample.png')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { subject?: string; description?: string } = {}

    if (!subject.trim()) {
      newErrors.subject = 'Please enter a ticket subject.'
    }
    if (!description.trim() || description.trim().length < 10) {
      newErrors.description = 'Please provide a detailed description (minimum 10 characters).'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      const now = new Date()
      const newTicket: SupportTicket = {
        id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
        subject: subject.trim(),
        category,
        priority,
        status: 'open',
        createdAt: now.toISOString().replace('T', ' ').slice(0, 16),
        updatedAt: now.toISOString().replace('T', ' ').slice(0, 16),
        description: description.trim(),
        attachmentName: attachmentName || undefined,
        messages: [
          {
            id: `msg-${Date.now()}`,
            sender: 'user',
            senderName: 'Alex Vance',
            message: description.trim(),
            timestamp: 'Just now',
            attachmentName: attachmentName || undefined,
          },
        ],
      }

      onCreated(newTicket)
      onClose()
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-cp-elevated border border-cp-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-cp-border flex items-center justify-between bg-cp-card/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cp-gold/10 border border-cp-gold/30 flex items-center justify-center text-cp-gold">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-cp-text-primary">Create Support Ticket</h3>
              <p className="text-xs text-cp-text-secondary">Direct assistance from CoinPlus support desk</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Subject */}
          <div className="space-y-1.5">
            <label className="font-semibold text-cp-text-primary block">
              Ticket Subject <span className="text-cp-negative">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value)
                if (errors.subject) setErrors({ ...errors, subject: undefined })
              }}
              placeholder="e.g. Issue with deposit confirmation or order fill"
              className={`w-full bg-cp-card border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary focus:outline-none ${
                errors.subject ? 'border-cp-negative' : 'border-cp-border focus:border-cp-gold'
              }`}
            />
            {errors.subject && (
              <span className="text-[11px] text-cp-negative flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.subject}
              </span>
            )}
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-cp-text-secondary block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SupportCategory)}
                className="w-full bg-cp-card border border-cp-border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold cursor-pointer"
              >
                {SUPPORT_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-cp-text-secondary block">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                className="w-full bg-cp-card border border-cp-border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-semibold text-cp-text-primary block">
              Detailed Description <span className="text-cp-negative">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                if (errors.description) setErrors({ ...errors, description: undefined })
              }}
              placeholder="Please explain your issue clearly. Include transaction hashes or order IDs if applicable..."
              className={`w-full bg-cp-card border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary focus:outline-none leading-relaxed ${
                errors.description ? 'border-cp-negative' : 'border-cp-border focus:border-cp-gold'
              }`}
            />
            {errors.description && (
              <span className="text-[11px] text-cp-negative flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.description}
              </span>
            )}
          </div>

          {/* Demonstration Attachment */}
          <div className="space-y-2 pt-1">
            <span className="font-semibold text-cp-text-secondary block">
              Attachments (Optional)
            </span>

            {attachmentName ? (
              <div className="p-3 rounded-xl bg-cp-card border border-cp-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-cp-gold" />
                  <span className="font-mono text-cp-text-primary text-xs">{attachmentName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachmentName(null)}
                  className="text-cp-text-secondary hover:text-cp-negative text-xs p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAttachDemoFile}
                className="w-full py-2.5 px-3 rounded-lg border border-dashed border-cp-border hover:border-cp-gold/60 text-cp-text-secondary hover:text-cp-gold transition-colors flex items-center justify-center gap-2"
              >
                <Paperclip className="w-4 h-4" />
                <span>Attach Demonstration Screenshot (.PNG / .JPG / .PDF)</span>
              </button>
            )}
          </div>

          {/* Safety Notice */}
          <div className="p-3 rounded-lg bg-cp-card border border-cp-border/60 text-[11px] text-cp-text-secondary leading-relaxed">
            Note: This is a frontend demonstration. Tickets are stored in your local session and will not be routed to live external personnel.
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <Button variant="secondary" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Submit Ticket
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
