import React, { useState, useMemo, useEffect, useRef } from 'react'
import {
  Headphones,
  Search,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  X,
  User,
  ShieldCheck,
  AlertCircle,
  Archive,
  RefreshCw,
  Mail,
  Filter,
  Paperclip,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { AdminSupportTicket, AdminSupportMessage } from '@/mock/adminData'
import { adminService } from '@/services/adminService'

export const AdminSupport: React.FC = () => {
  const [tickets, setTickets] = useState<AdminSupportTicket[]>([])
  const ticketsRef = useRef<AdminSupportTicket[]>([])
  const [metrics, setMetrics] = useState<{
    totalTickets: number
    unreadTotal: number
    openCount: number
    inProgressCount: number
    waitingUserCount: number
    resolvedCount: number
    closedCount: number
  }>({
    totalTickets: 0,
    unreadTotal: 0,
    openCount: 0,
    inProgressCount: 0,
    waitingUserCount: 0,
    resolvedCount: 0,
    closedCount: 0,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'open' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed'>('all')
  const [selectedTicket, setSelectedTicket] = useState<AdminSupportTicket | null>(null)
  const selectedTicketIdRef = useRef<string | null>(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    selectedTicketIdRef.current = selectedTicket?.id ?? null
  }, [selectedTicket])

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Fast equality comparison to avoid blinking / re-renders
  const isTicketsEqual = (prev: AdminSupportTicket[], next: AdminSupportTicket[]) => {
    if (prev.length !== next.length) return false
    for (let i = 0; i < prev.length; i++) {
      const a = prev[i]
      const b = next[i]
      if (
        String(a.id) !== String(b.id) ||
        a.status !== b.status ||
        (a.unreadCount ?? 0) !== (b.unreadCount ?? 0) ||
        a.updatedAt !== b.updatedAt ||
        a.messages.length !== b.messages.length
      ) {
        return false
      }
      if (a.messages.length > 0 && b.messages.length > 0) {
        const lastA = a.messages[a.messages.length - 1]
        const lastB = b.messages[b.messages.length - 1]
        if (lastA.id !== lastB.id || lastA.isRead !== lastB.isRead) {
          return false
        }
      }
    }
    return true
  }

  // Fetch tickets from API with real-time sync
  const fetchLiveTickets = async (silent = false) => {
    try {
      if (!silent && ticketsRef.current.length === 0) setIsLoading(true)
      const res = await adminService.getSupportTickets({
        q: searchQuery.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      })

      if (res && res.tickets) {
        if (!isTicketsEqual(ticketsRef.current, res.tickets)) {
          ticketsRef.current = res.tickets
          setTickets(res.tickets)
        }
        if (res.metrics) {
          const m = res.metrics
          setMetrics((prev) => {
            if (
              prev.totalTickets === m.totalTickets &&
              prev.unreadTotal === m.unreadTotal &&
              prev.openCount === m.openCount &&
              prev.inProgressCount === m.inProgressCount &&
              prev.waitingUserCount === m.waitingUserCount &&
              prev.resolvedCount === m.resolvedCount &&
              prev.closedCount === m.closedCount
            ) {
              return prev
            }
            return m
          })
        }

        // Live real-time update of selected conversation if open
        if (selectedTicketIdRef.current) {
          const currentId = String(selectedTicketIdRef.current)
          const updated = res.tickets.find((t) => String(t.id) === currentId)
          if (updated) {
            setSelectedTicket((prev) => {
              if (!prev) return updated
              if (
                prev.messages.length !== updated.messages.length ||
                prev.status !== updated.status ||
                prev.unreadCount !== updated.unreadCount ||
                prev.updatedAt !== updated.updatedAt
              ) {
                return updated
              }
              return prev
            })
          }
        }
      }
      setLoadError(null)
    } catch (error: any) {
      if (!silent) {
        setLoadError(error?.response?.data?.message || 'Unable to sync support desk from backend.')
      }
    } finally {
      if (!silent) setIsLoading(false)
    }
  }

  // Real-time polling every 3 seconds
  useEffect(() => {
    let isMounted = true
    fetchLiveTickets(false)

    const intervalId = setInterval(() => {
      if (isMounted) {
        fetchLiveTickets(true)
      }
    }, 3000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [searchQuery, statusFilter])

  // Auto scroll when message thread changes
  useEffect(() => {
    if (selectedTicket) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedTicket?.messages?.length])

  // Open ticket handler: marks user messages as read
  const handleOpenTicket = async (t: AdminSupportTicket) => {
    setSelectedTicket(t)
    if ((t.unreadCount ?? 0) > 0) {
      try {
        await adminService.markSupportTicketRead(t.id)
        // locally decrement unread
        setTickets((prev) =>
          prev.map((item) => (item.id === t.id ? { ...item, unreadCount: 0 } : item))
        )
        setMetrics((prev) => ({
          ...prev,
          unreadTotal: Math.max(0, prev.unreadTotal - (t.unreadCount || 0)),
        }))
      } catch {
        // ignore
      }
    }
  }

  const handleStatusChange = async (ticketId: string, newStatus: AdminSupportTicket['status']) => {
    setIsUpdatingStatus(true)
    try {
      await adminService.updateTicketStatus(ticketId, newStatus)
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
      )
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket((prev) => (prev ? { ...prev, status: newStatus } : null))
      }
      triggerToast(`Conversation ${selectedTicket?.ticketRef || ticketId} updated to ${newStatus}.`)
      window.dispatchEvent(new Event('cp_admin_metrics_refresh'))
      fetchLiveTickets(true)
    } catch (err: any) {
      triggerToast(err?.response?.data?.message || 'Failed to update ticket status.')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyMessage.trim() || !selectedTicket || isSending) return

    setIsSending(true)
    try {
      const response = await adminService.replySupportTicket(selectedTicket.id, replyMessage.trim())
      const newMsg: AdminSupportMessage = {
        id: String(response?.reply?.id ?? `msg-${Date.now()}`),
        sender: 'agent',
        senderName: response?.reply?.senderName || 'CoinPlus Support',
        message: replyMessage.trim(),
        timestamp: response?.reply?.timestamp || 'Just now',
        isRead: false,
      }

      const updatedMessages = [...selectedTicket.messages, newMsg]

      setTickets((prev) => {
        const nextList: AdminSupportTicket[] = prev.map((t) =>
          String(t.id) === String(selectedTicket.id)
            ? {
                ...t,
                status: 'waiting_user' as const,
                unreadCount: 0,
                updatedAt: 'Just now',
                messages: updatedMessages,
              }
            : t
        )
        ticketsRef.current = nextList
        return nextList
      })

      setSelectedTicket((prev) =>
        prev
          ? {
              ...prev,
              status: 'waiting_user' as const,
              unreadCount: 0,
              updatedAt: 'Just now',
              messages: updatedMessages,
            }
          : null
      )

      setReplyMessage('')
      triggerToast('Reply dispatched instantly to user.')
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (error: any) {
      setLoadError(error?.response?.data?.message || 'The support agent reply could not be posted to the backend.')
    } finally {
      setIsSending(false)
    }
  }

  const getStatusBadge = (status: AdminSupportTicket['status']) => {
    switch (status) {
      case 'open':
        return <Badge variant="neutral" size="sm" withDot>Open</Badge>
      case 'in_progress':
        return <Badge variant="gold" size="sm" withDot pulseDot>In Progress</Badge>
      case 'waiting_user':
        return <Badge variant="gold" size="sm" withDot>Waiting for User</Badge>
      case 'resolved':
        return <Badge variant="positive" size="sm" withDot>Resolved</Badge>
      case 'closed':
        return <Badge variant="neutral" size="sm" withDot>Closed</Badge>
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: AdminSupportTicket['priority']) => {
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
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-cp-elevated border border-cp-gold text-cp-text-primary shadow-2xl animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-cp-gold shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-cp-text-primary tracking-tight">
              Real-Time Customer Support Desk
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Sync
            </span>
          </div>
          <p className="text-xs text-cp-text-muted mt-1">
            Receive incoming customer messages in real time without refreshing, reply instantly, and manage multi-conversation queues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fetchLiveTickets(false)}
            isLoading={isLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh Desk
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="bg-[#0c121c] border-cp-border p-3.5 space-y-1">
          <span className="text-[11px] font-semibold text-cp-text-muted uppercase">Total Tickets</span>
          <div className="text-xl font-bold text-cp-text-primary font-mono">{metrics.totalTickets}</div>
        </Card>

        <Card className={`border-cp-border p-3.5 space-y-1 ${metrics.unreadTotal > 0 ? 'bg-amber-500/10 border-amber-500/40' : 'bg-[#0c121c]'}`}>
          <span className="text-[11px] font-semibold text-amber-400 uppercase">Unread Messages</span>
          <div className="text-xl font-bold text-amber-400 font-mono flex items-center gap-2">
            <span>{metrics.unreadTotal}</span>
            {metrics.unreadTotal > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </div>
        </Card>

        <Card className="bg-[#0c121c] border-cp-border p-3.5 space-y-1">
          <span className="text-[11px] font-semibold text-cp-text-muted uppercase">Open</span>
          <div className="text-xl font-bold text-sky-400 font-mono">{metrics.openCount}</div>
        </Card>

        <Card className="bg-[#0c121c] border-cp-border p-3.5 space-y-1">
          <span className="text-[11px] font-semibold text-cp-text-muted uppercase">In Progress</span>
          <div className="text-xl font-bold text-cp-gold font-mono">{metrics.inProgressCount}</div>
        </Card>

        <Card className="bg-[#0c121c] border-cp-border p-3.5 space-y-1">
          <span className="text-[11px] font-semibold text-cp-text-muted uppercase">Waiting User</span>
          <div className="text-xl font-bold text-cp-text-secondary font-mono">{metrics.waitingUserCount}</div>
        </Card>

        <Card className="bg-[#0c121c] border-cp-border p-3.5 space-y-1">
          <span className="text-[11px] font-semibold text-cp-text-muted uppercase">Resolved</span>
          <div className="text-xl font-bold text-emerald-400 font-mono">{metrics.resolvedCount + metrics.closedCount}</div>
        </Card>
      </div>

      {loadError && (
        <div className="p-3 rounded-xl bg-cp-negative/10 border border-cp-negative/30 text-xs text-cp-negative flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{loadError}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <Card className="bg-[#0c121c] border-cp-border">
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cp-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search by User ID, Name, UID, Email, Ticket Ref, or Subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141d2b] border border-cp-border rounded-xl pl-9 pr-3 py-2 text-xs text-cp-text-primary placeholder:text-cp-text-muted/60 focus:outline-none focus:border-cp-gold/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cp-text-muted hover:text-cp-text-primary text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0 scrollbar-none">
            {(['all', 'unread', 'open', 'in_progress', 'waiting_user', 'resolved', 'closed'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-all capitalize whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === st
                    ? 'bg-cp-gold text-cp-bg border-cp-gold'
                    : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border-cp-border'
                }`}
              >
                <span>{st.replace('_', ' ')}</span>
                {st === 'unread' && metrics.unreadTotal > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-bold">
                    {metrics.unreadTotal}
                  </span>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card className="bg-[#0c121c] border-cp-border overflow-hidden">
        {tickets.length === 0 ? (
          <div className="p-12 text-center text-xs text-cp-text-muted space-y-2">
            <Headphones className="w-8 h-8 text-cp-text-muted mx-auto" />
            <p>No support tickets match the selected filters or search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-cp-border bg-cp-elevated/40 text-cp-text-muted uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-4">Ref</th>
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Subject & Latest Message</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Updated At</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cp-border/50 text-cp-text-secondary">
                {tickets.map((t) => {
                  const hasUnread = (t.unreadCount ?? 0) > 0

                  return (
                    <tr
                      key={t.id}
                      className={`hover:bg-cp-elevated/30 transition-colors ${
                        hasUnread ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-cp-gold whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{t.ticketRef}</span>
                          {hasUnread && (
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Unread customer message" />
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-cp-text-primary">{t.userName}</span>
                            <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-cp-card border border-cp-border text-cp-gold">
                              {t.userRef || `ID #${t.userId}`}
                            </span>
                          </div>
                          <span className="text-[10px] text-cp-text-muted font-mono block">{t.userEmail}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-cp-text-primary truncate block">{t.subject}</span>
                          {hasUnread && (
                            <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-black text-[9px] font-bold shrink-0">
                              {t.unreadCount} NEW
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-cp-text-muted truncate block">
                          {t.messages.length > 0 ? t.messages[t.messages.length - 1].message : 'No messages'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 uppercase text-[10px] font-mono font-medium text-cp-gold whitespace-nowrap">
                        {t.category}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getPriorityBadge(t.priority)}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(t.status)}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-cp-text-muted whitespace-nowrap">
                        {t.updatedAt || t.createdAt}
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <Button
                          variant={hasUnread ? 'primary' : 'secondary'}
                          size="sm"
                          onClick={() => handleOpenTicket(t)}
                          className="h-7 text-xs"
                          leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                        >
                          Chat & Reply
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* TICKET DETAIL & REAL-TIME REPLY CONVERSATION MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedTicket(null)}
          />

          <div className="relative w-full max-w-3xl bg-[#0c121c] border border-cp-border rounded-2xl shadow-2xl p-6 z-10 animate-fadeIn space-y-4 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-cp-border pb-3 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cp-gold">{selectedTicket.ticketRef}</span>
                  {getStatusBadge(selectedTicket.status)}
                  {getPriorityBadge(selectedTicket.priority)}
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cp-elevated text-cp-text-muted border border-cp-border">
                    {selectedTicket.category}
                  </span>
                </div>
                <h3 className="text-base font-bold text-cp-text-primary">{selectedTicket.subject}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-cp-text-muted">
                  <span>
                    User: <strong>{selectedTicket.userName}</strong> ({selectedTicket.userEmail})
                  </span>
                  <span>•</span>
                  <span className="font-mono text-cp-gold">UID: {selectedTicket.userRef || `#${selectedTicket.userId}`}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="p-1 rounded-lg text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Control Bar */}
            <div className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-cp-elevated/40 border border-cp-border text-xs gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-cp-text-muted font-medium">Ticket Lifecycle:</span>
                <span className="font-bold text-cp-text-primary capitalize">{selectedTicket.status.replace('_', ' ')}</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {(['open', 'in_progress', 'waiting_user', 'resolved', 'closed'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    disabled={isUpdatingStatus}
                    onClick={() => handleStatusChange(selectedTicket.id, st)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all capitalize ${
                      selectedTicket.status === st
                        ? 'bg-cp-gold text-cp-bg font-bold shadow-gold-sm'
                        : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border border-cp-border'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-3.5 p-3 rounded-xl bg-cp-card/50 border border-cp-border/60 min-h-[220px]">
              {selectedTicket.messages.map((msg) => {
                const isAgent = msg.sender === 'agent'

                return (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-xl text-xs space-y-1.5 transition-all ${
                      isAgent
                        ? 'bg-cp-gold/10 border border-cp-gold/30 ml-8'
                        : 'bg-cp-elevated/80 border border-cp-border mr-8'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isAgent ? 'bg-cp-gold text-cp-bg' : 'bg-cp-card border border-cp-border text-cp-text-primary'
                          }`}
                        >
                          {isAgent ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        </div>
                        <span className={`font-bold ${isAgent ? 'text-cp-gold' : 'text-cp-text-primary'}`}>
                          {msg.senderName}
                        </span>
                        {isAgent ? (
                          <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-cp-gold/20 text-cp-gold">
                            Staff
                          </span>
                        ) : (
                          <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-cp-card text-cp-text-muted border border-cp-border">
                            Customer
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-cp-text-muted font-mono">{msg.timestamp}</span>
                    </div>
                    <p className="text-cp-text-primary leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    {msg.attachmentName && (
                      <div className="pt-2 space-y-2">
                        {msg.attachmentUrl && (
                          <div className="rounded-xl overflow-hidden border border-cp-border/70 max-w-sm bg-black/40">
                            {msg.attachmentUrl.match(/\.(jpg|jpeg|png|webp|gif)($|\?)/i) || msg.attachmentUrl.startsWith('data:image/') ? (
                              <a href={msg.attachmentUrl} target="_blank" rel="noreferrer" className="block group">
                                <img
                                  src={msg.attachmentUrl}
                                  alt={msg.attachmentName}
                                  className="max-h-56 w-full object-contain bg-black/60 group-hover:opacity-90 transition-opacity"
                                />
                              </a>
                            ) : null}
                          </div>
                        )}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cp-card border border-cp-border text-xs font-mono text-cp-text-primary shadow-sm">
                          <Paperclip className="w-3.5 h-3.5 text-cp-gold shrink-0" />
                          {msg.attachmentUrl ? (
                            <a
                              href={msg.attachmentUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:text-cp-gold underline truncate max-w-xs"
                            >
                              {msg.attachmentName}
                            </a>
                          ) : (
                            <span className="truncate max-w-xs">{msg.attachmentName}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Staff Instant Reply Form */}
            <form onSubmit={handleSendReply} className="space-y-2 pt-2 border-t border-cp-border shrink-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type an instant reply to customer..."
                  disabled={isSending}
                  className="flex-1 bg-[#141d2b] border border-cp-border rounded-xl px-3.5 py-2.5 text-xs text-cp-text-primary placeholder:text-cp-text-muted focus:outline-none focus:border-cp-gold"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSending || !replyMessage.trim()}
                  isLoading={isSending}
                  className="h-10 px-4"
                >
                  <Send className="w-3.5 h-3.5 mr-1" />
                  <span>Send Reply</span>
                </Button>
              </div>
              <div className="flex items-center justify-between text-[11px] text-cp-text-muted">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Real-time sync active (new customer messages appear automatically without refreshing)
                </span>
                <div className="flex items-center gap-2">
                  {selectedTicket.status !== 'resolved' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(selectedTicket.id, 'resolved')}
                      className="text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Mark Resolved
                    </button>
                  )}
                  {selectedTicket.status !== 'closed' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(selectedTicket.id, 'closed')}
                      className="text-cp-text-muted hover:text-cp-negative hover:underline flex items-center gap-1"
                    >
                      <Archive className="w-3 h-3" /> Close Conversation
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminSupport
