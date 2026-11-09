import React, { useState, useRef } from 'react'
import {
  X,
  LifeBuoy,
  Paperclip,
  AlertCircle,
  Send,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import {
  SupportCategory,
  TicketPriority,
  SupportTicket,
  SUPPORT_CATEGORIES,
} from '@/mock/supportData'
import { supportService } from '@/services/supportService'

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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [attachmentName, setAttachmentName] = useState<string | null>(null)
  const [attachmentData, setAttachmentData] = useState<string | null>(null)
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null)
  const [attachmentSize, setAttachmentSize] = useState<string | null>(null)
  const [errors, setErrors] = useState<{ subject?: string; description?: string; general?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, general: 'File size must be under 10MB.' }))
      return
    }

    setAttachmentName(file.name)
    const formattedSize =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`
    setAttachmentSize(formattedSize)

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setAttachmentData(result)
      if (file.type.startsWith('image/')) {
        setAttachmentPreview(result)
      } else {
        setAttachmentPreview(null)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveAttachment = () => {
    setAttachmentName(null)
    setAttachmentData(null)
    setAttachmentPreview(null)
    setAttachmentSize(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { subject?: string; description?: string; general?: string } = {}

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
    setErrors({})
    try {
      const response = await supportService.createTicket({
        subject: subject.trim(),
        category,
        priority,
        message: description.trim(),
        attachmentName: attachmentName || undefined,
        attachmentData: attachmentData || undefined,
      })

      if (response && response.ticket) {
        onCreated(response.ticket)
        onClose()
      }
    } catch (err: any) {
      setErrors({
        general: err?.response?.data?.message || 'Failed to submit support ticket. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
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
              <p className="text-xs text-cp-text-secondary">Direct communication with CoinPlus support desk</p>
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
          {errors.general && (
            <div className="p-3 rounded-lg bg-cp-negative/10 border border-cp-negative/30 text-cp-negative text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

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
              placeholder="e.g. Question about deposit or trading inquiry"
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

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              placeholder="Please explain your question or issue clearly..."
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

          {/* Real Browser File Attachment */}
          <div className="space-y-2 pt-1">
            <span className="font-semibold text-cp-text-secondary block">
              Attachments (Optional)
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />

            {attachmentName ? (
              <div className="p-3 rounded-xl bg-cp-card border border-cp-border flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  {attachmentPreview ? (
                    <img
                      src={attachmentPreview}
                      alt="preview"
                      className="w-10 h-10 rounded-lg object-cover border border-cp-border shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-cp-elevated border border-cp-border flex items-center justify-center text-cp-gold shrink-0">
                      <Paperclip className="w-5 h-5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="font-mono text-cp-text-primary text-xs font-semibold block truncate">
                      {attachmentName}
                    </span>
                    {attachmentSize && (
                      <span className="text-[10px] text-cp-text-secondary font-mono block">
                        {attachmentSize}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveAttachment}
                  className="text-cp-text-secondary hover:text-cp-negative text-xs p-1.5 rounded-lg hover:bg-cp-elevated transition-colors"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-3 rounded-xl border border-dashed border-cp-border hover:border-cp-gold/60 text-cp-text-secondary hover:text-cp-gold transition-colors flex items-center justify-center gap-2 bg-cp-card/40 cursor-pointer"
              >
                <Paperclip className="w-4 h-4" />
                <span>Choose File from Device (.PNG, .JPG, .PDF, .DOC)</span>
              </button>
            )}
          </div>

          {/* Safety Notice */}
          <div className="p-3 rounded-lg bg-cp-card border border-cp-border/60 text-[11px] text-cp-text-secondary leading-relaxed">
            Customer inquiries are answered in real time by administrative operators. Updates appear instantly without page refresh.
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
