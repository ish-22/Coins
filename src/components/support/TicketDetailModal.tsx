import React, { useState } from 'react'
import {
  X,
  MessageSquare,
  Send,
  User,
  ShieldCheck,
  Paperclip,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { SupportTicket, TicketMessage } from '@/mock/supportData'

export interface TicketDetailModalProps {
  isOpen: boolean
  ticket: SupportTicket | null
  onClose: () => void
  onAddReply: (ticketId: string, replyText: string) => void
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  isOpen,
  ticket,
  onClose,
  onAddReply,
}) => {
  const [replyText, setReplyText] = useState('')
  const [isSending, setIsSending] = useState(false)

  if (!isOpen || !ticket) return null

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return

    setIsSending(true)
    setTimeout(() => {
      onAddReply(ticket.id, replyText.trim())
      setReplyText('')
      setIsSending(false)
    }, 400)
  }

  const getStatusBadge = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return <Badge variant="neutral" size="sm" withDot>Open</Badge>
      case 'in_progress':
        return <Badge variant="gold" size="sm" withDot pulseDot>In Progress</Badge>
      case 'waiting_user':
        return <Badge variant="gold" size="sm" withDot>Waiting for User</Badge>
      case 'resolved':
        return <Badge variant="positive" size="sm" withDot>Resolved</Badge>
      default:
        return null
    }
  }

  const getPriorityBadge = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="negative" size="sm">Urgent</Badge>
      case 'high':
        return <Badge variant="gold" size="sm">High</Badge>
      case 'medium':
        return <Badge variant="neutral" size="sm">Medium</Badge>
      case 'low':
        return <Badge variant="neutral" size="sm">Low</Badge>
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl bg-cp-elevated border border-cp-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-cp-border flex items-center justify-between bg-cp-card/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cp-gold/10 border border-cp-gold/30 flex items-center justify-center text-cp-gold shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-cp-gold">{ticket.id}</span>
                {getStatusBadge(ticket.status)}
                {getPriorityBadge(ticket.priority)}
              </div>
              <h3 className="text-base font-bold text-cp-text-primary mt-0.5 line-clamp-1">
                {ticket.subject}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conversation Thread */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Ticket Metadata Bar */}
          <div className="p-3.5 rounded-xl bg-cp-card border border-cp-border/70 flex flex-wrap items-center justify-between gap-3 text-[11px] text-cp-text-secondary">
            <div>
              Category: <span className="text-cp-text-primary font-semibold capitalize">{ticket.category}</span>
            </div>
            <div>
              Created: <span className="text-cp-text-primary font-mono">{ticket.createdAt}</span>
            </div>
            <div>
              Last Updated: <span className="text-cp-text-primary font-mono">{ticket.updatedAt}</span>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-3.5 pt-2">
            {ticket.messages.map((msg) => {
              const isSupport = msg.sender === 'support'

              return (
                <div
                  key={msg.id}
                  className={`p-4 rounded-xl border flex flex-col space-y-2 ${
                    isSupport
                      ? 'bg-cp-card border-cp-gold/40 mr-4 sm:mr-8'
                      : 'bg-cp-elevated border-cp-border ml-4 sm:ml-8'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isSupport
                            ? 'bg-cp-gold text-cp-bg'
                            : 'bg-cp-elevated border border-cp-border text-cp-text-primary'
                        }`}
                      >
                        {isSupport ? <ShieldCheck className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                      </div>
                      <span
                        className={`font-semibold text-xs ${
                          isSupport ? 'text-cp-gold' : 'text-cp-text-primary'
                        }`}
                      >
                        {msg.senderName}
                      </span>
                    </div>
                    <span className="text-[10px] text-cp-text-secondary font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {msg.timestamp}
                    </span>
                  </div>

                  <p className="text-cp-text-secondary text-xs leading-relaxed whitespace-pre-wrap">
                    {msg.message}
                  </p>

                  {msg.attachmentName && (
                    <div className="pt-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cp-card border border-cp-border text-[11px] font-mono text-cp-text-primary">
                        <Paperclip className="w-3 h-3 text-cp-gold" />
                        <span>{msg.attachmentName}</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Reply Box Footer */}
        <div className="p-4 border-t border-cp-border bg-cp-card/70">
          <form onSubmit={handleSend} className="space-y-2.5">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type a simulated reply to customer support..."
                className="flex-1 bg-cp-elevated border border-cp-border rounded-xl px-3.5 py-2.5 text-xs text-cp-text-primary placeholder:text-cp-text-secondary/60 focus:outline-none focus:border-cp-gold transition-colors"
              />
              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={!replyText.trim() || isSending}
                isLoading={isSending}
                className="h-10 px-4 text-xs"
              >
                Send <Send className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
            <p className="text-[10px] text-cp-text-secondary text-right">
              Replies are simulated for demonstration and recorded in your local session.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
