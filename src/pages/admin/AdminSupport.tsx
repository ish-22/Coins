import React, { useState, useMemo, useEffect } from 'react'
import {
  Headphones,
  Search,
  Eye,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  X,
  User,
  ShieldCheck,
} from 'lucide-react'
import { Card, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { AdminSupportTicket } from '@/mock/adminData'
import { adminService } from '@/services'

export const AdminSupport: React.FC = () => {
  const [tickets, setTickets] = useState<AdminSupportTicket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'waiting_user' | 'resolved'>('all')
  const [selectedTicket, setSelectedTicket] = useState<AdminSupportTicket | null>(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchSearch =
        t.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.ticketRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.userEmail.toLowerCase().includes(searchQuery.toLowerCase())

      const matchStatus = statusFilter === 'all' || t.status === statusFilter

      return matchSearch && matchStatus
    })
  }, [tickets, searchQuery, statusFilter])

  const handleStatusChange = (ticketId: string, newStatus: AdminSupportTicket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    )
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket((prev) => (prev ? { ...prev, status: newStatus } : null))
    }
  }

  useEffect(() => {
    let isMounted = true
    const loadTickets = async () => {
      try {
        setIsLoading(true)
        setLoadError(null)
        const liveTickets = await adminService.getSupportTickets()
        if (isMounted) setTickets(liveTickets)
      } catch (error: any) {
        if (isMounted) {
          setLoadError(error?.response?.data?.message || 'Unable to load support tickets from the backend.')
          setTickets([])
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadTickets()
    return () => {
      isMounted = false
    }
  }, [])

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyMessage.trim() || !selectedTicket) return

    setIsSending(true)
    try {
      const response = await adminService.replySupportTicket(selectedTicket.id, replyMessage.trim())
      const newMsg = {
        id: String(response?.reply?.id ?? `msg-${Date.now()}`),
        sender: 'agent' as const,
        senderName: 'Chief Operator (Staff)',
        message: replyMessage.trim(),
        timestamp: response?.reply?.created_at ? new Date(response.reply.created_at).toISOString().replace('T', ' ').slice(0, 16) : new Date().toISOString().replace('T', ' ').slice(0, 16),
      }

      setTickets((prev) =>
        prev.map((t) =>
          t.id === selectedTicket.id
            ? {
                ...t,
                status: 'waiting_user',
                updatedAt: newMsg.timestamp,
                messages: [...t.messages, newMsg],
              }
            : t
        )
      )

      setSelectedTicket((prev) =>
        prev
          ? {
              ...prev,
              status: 'waiting_user',
              updatedAt: newMsg.timestamp,
              messages: [...prev.messages, newMsg],
            }
          : null
      )

      setReplyMessage('')
    } catch (error: any) {
      setLoadError(error?.response?.data?.message || 'The support agent reply could not be posted to the backend.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-cp-text-primary tracking-tight">
            Customer Support Desk & Ticket Queue
          </h1>
          <p className="text-xs text-cp-text-muted mt-0.5">
            Resolve customer inquiries, review simulated conversation threads, and dispatch staff responses
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="gold" size="sm">
            Active Tickets: {tickets.filter((t) => t.status !== 'resolved').length}
          </Badge>
        </div>
      </div>

      {loadError && (
        <div className="p-3 rounded-xl bg-cp-negative/10 border border-cp-negative/30 text-xs text-cp-negative">
          {loadError}
        </div>
      )}

      {isLoading && (
        <div className="p-4 rounded-xl border border-cp-border bg-cp-card text-xs text-cp-text-muted">
          Loading live support queue from the backend...
        </div>
      )}

      {/* Filter and Search Bar */}
      <Card className="bg-[#0c121c] border-cp-border">
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cp-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search by ticket ref, user name, email, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141d2b] border border-cp-border rounded-xl pl-9 pr-3 py-2 text-xs text-cp-text-primary placeholder:text-cp-text-muted/60 focus:outline-none focus:border-cp-gold/60"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0 scrollbar-none">
            {(['all', 'open', 'in_progress', 'waiting_user', 'resolved'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-all capitalize ${
                  statusFilter === st
                    ? 'bg-cp-gold text-cp-bg border-cp-gold'
                    : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border-cp-border'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card className="bg-[#0c121c] border-cp-border overflow-hidden">
        {filteredTickets.length === 0 ? (
          <div className="p-12 text-center text-xs text-cp-text-muted space-y-2">
            <Headphones className="w-8 h-8 text-cp-text-muted mx-auto" />
            <p>No support tickets match the selected filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-cp-border bg-cp-elevated/40 text-cp-text-muted uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-4">Ref</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Updated At</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cp-border/50 text-cp-text-secondary">
                {filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-cp-elevated/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-cp-gold">
                      {t.ticketRef}
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-cp-text-primary block">{t.userName}</span>
                        <span className="text-[10px] text-cp-text-muted font-mono block">{t.userEmail}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="font-semibold text-cp-text-primary block truncate">{t.subject}</span>
                      <span className="text-[10px] text-cp-text-muted">
                        {t.messages.length} {t.messages.length === 1 ? 'message' : 'messages'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 uppercase text-[10px] font-mono font-medium text-cp-gold">
                      {t.category}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`font-semibold capitalize text-[11px] ${
                          t.priority === 'urgent'
                            ? 'text-cp-negative'
                            : t.priority === 'high'
                            ? 'text-amber-400'
                            : 'text-cp-text-secondary'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        variant={t.status === 'resolved' ? 'positive' : t.status === 'open' ? 'gold' : 'neutral'}
                        size="sm"
                        className="capitalize"
                      >
                        {t.status.replace('_', ' ')}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-cp-text-muted">
                      {t.updatedAt}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedTicket(t)}
                        className="px-2.5 py-1 rounded-lg bg-cp-elevated hover:bg-cp-card border border-cp-border text-cp-text-secondary hover:text-cp-gold transition-colors inline-flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Thread</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* TICKET DETAIL & REPLY CONVERSATION MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedTicket(null)}
          />

          <div className="relative w-full max-w-2xl bg-[#0c121c] border border-cp-border rounded-2xl shadow-2xl p-6 z-10 animate-fadeIn space-y-4 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-cp-border pb-3 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cp-gold">{selectedTicket.ticketRef}</span>
                  <Badge
                    variant={selectedTicket.status === 'resolved' ? 'positive' : selectedTicket.status === 'open' ? 'gold' : 'neutral'}
                    size="sm"
                    className="capitalize"
                  >
                    {selectedTicket.status.replace('_', ' ')}
                  </Badge>
                </div>
                <h3 className="text-base font-bold text-cp-text-primary">{selectedTicket.subject}</h3>
                <span className="text-xs text-cp-text-muted">
                  From: <strong>{selectedTicket.userName}</strong> ({selectedTicket.userEmail})
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="p-1 rounded-lg text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Change Selector */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-cp-elevated/40 border border-cp-border text-xs shrink-0">
              <span className="text-cp-text-muted">Ticket Operational Status:</span>
              <div className="flex items-center gap-1">
                {(['open', 'in_progress', 'waiting_user', 'resolved'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(selectedTicket.id, st)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors capitalize ${
                      selectedTicket.status === st
                        ? 'bg-cp-gold text-cp-bg font-bold'
                        : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border border-cp-border'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-3 p-2 rounded-xl bg-cp-card/50 border border-cp-border/60">
              {selectedTicket.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-xl text-xs space-y-1.5 ${
                    msg.sender === 'agent'
                      ? 'bg-cp-gold/10 border border-cp-gold/25 ml-6'
                      : 'bg-cp-elevated/60 border border-cp-border mr-6'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-bold ${msg.sender === 'agent' ? 'text-cp-gold' : 'text-cp-text-primary'}`}>
                      {msg.senderName}
                    </span>
                    <span className="text-[10px] text-cp-text-muted font-mono">{msg.timestamp}</span>
                  </div>
                  <p className="text-cp-text-secondary leading-relaxed">{msg.message}</p>
                </div>
              ))}
            </div>

            {/* Staff Reply Form */}
            <form onSubmit={handleSendReply} className="space-y-2 pt-2 border-t border-cp-border shrink-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type simulated staff reply to customer..."
                  disabled={isSending}
                  className="flex-1 bg-[#141d2b] border border-cp-border rounded-xl px-3 py-2 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold"
                />
                <Button type="submit" variant="primary" size="sm" disabled={isSending || !replyMessage.trim()}>
                  <Send className="w-3.5 h-3.5 mr-1" />
                  <span>Send</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminSupport
