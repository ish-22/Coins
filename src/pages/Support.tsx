import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Headphones,
  Search,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Plus,
  Mail,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  RotateCcw,
  Sparkles,
  Info,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  User,
  Wallet,
  TrendingUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  Lock,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import {
  SupportCategory,
  TicketStatus,
  SupportTicket,
  SUPPORT_CATEGORIES,
  POPULAR_FAQS,
  INITIAL_SUPPORT_TICKETS,
} from '@/mock/supportData'
import {
  CreateTicketModal,
  TicketDetailModal,
} from '@/components/support'
import { useAuth } from '@/context/AuthContext'
import { supportService } from '@/services/supportService'

export const Support: React.FC = () => {
  const { user } = useAuth()
  // Search & FAQ Category
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<SupportCategory | 'all'>('all')

  // Expanded FAQ accordion items
  const [expandedFaqIds, setExpandedFaqIds] = useState<string[]>(['faq-1'])

  // Support Tickets State
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [isLoadingTickets, setIsLoadingTickets] = useState(false)
  const [totalUnread, setTotalUnread] = useState(0)

  // Ticket filters
  const [ticketStatusFilter, setTicketStatusFilter] = useState<'all' | TicketStatus>('all')
  const [ticketSearch, setTicketSearch] = useState('')

  // Modals & Selection
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const selectedTicketIdRef = useRef<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Keep track of active ticket ID in ref for poll updates
  useEffect(() => {
    selectedTicketIdRef.current = selectedTicket?.id ?? null
  }, [selectedTicket])

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Fetch live tickets
  const fetchTickets = async (showLoading = false) => {
    if (!user) return
    try {
      if (showLoading) setIsLoadingTickets(true)
      const data = await supportService.getTickets()
      if (data && data.tickets) {
        setTickets(data.tickets)
        setTotalUnread(data.totalUnread || 0)

        // If a ticket is currently open in modal, update its messages in real-time
        if (selectedTicketIdRef.current) {
          const updatedSelected = data.tickets.find((t) => t.id === selectedTicketIdRef.current)
          if (updatedSelected) {
            setSelectedTicket(updatedSelected)
          }
        }
      }
    } catch {
      // Fallback to local demonstration if backend is unreachable
      if (tickets.length === 0) {
        setTickets(INITIAL_SUPPORT_TICKETS)
      }
    } finally {
      if (showLoading) setIsLoadingTickets(false)
    }
  }

  // Initial load & 3-second real-time polling
  useEffect(() => {
    let isMounted = true
    fetchTickets(true)

    const intervalId = setInterval(() => {
      if (isMounted) {
        fetchTickets(false)
      }
    }, 3000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [user])

  // Toggle FAQ accordion item
  const toggleFaq = (id: string) => {
    setExpandedFaqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Handle new ticket created
  const handleTicketCreated = (newTicket: SupportTicket) => {
    setTickets((prev) => [newTicket, ...prev])
    setSelectedTicket(newTicket)
    triggerToast(`Support ticket ${newTicket.ticketRef || newTicket.id} submitted successfully!`)
  }

  // Handle add live reply to ticket
  const handleAddReply = async (ticketId: string, replyText: string) => {
    try {
      const response = await supportService.replyTicket(ticketId, replyText)
      // Update ticket locally immediately
      setTickets((prev) =>
        prev.map((t) => {
          if (t.id === ticketId) {
            const updatedMessages = [
              ...t.messages,
              response.reply,
            ]
            const updated = {
              ...t,
              status: (response.ticket?.status ?? 'open') as TicketStatus,
              updatedAt: 'Just now',
              messages: updatedMessages,
            }
            if (selectedTicket?.id === ticketId) {
              setSelectedTicket(updated)
            }
            return updated
          }
          return t
        })
      )
      triggerToast('Reply dispatched to support team.')
      // Quick re-fetch to sync
      fetchTickets(false)
    } catch (err: any) {
      triggerToast(err?.response?.data?.message || 'Failed to dispatch reply.')
    }
  }

  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    )
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket((prev) => (prev ? { ...prev, status: newStatus } : null))
    }
    triggerToast(`Ticket updated to ${newStatus}.`)
  }

  // Filter FAQs
  const filteredFaqs = useMemo(() => {
    let result = [...POPULAR_FAQS]

    if (selectedCategory !== 'all') {
      result = result.filter((f) => f.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (f) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q)
      )
    }

    return result
  }, [selectedCategory, searchQuery])

  // Filter Tickets
  const filteredTickets = useMemo(() => {
    let result = [...tickets]

    if (ticketStatusFilter !== 'all') {
      result = result.filter((t) => t.status === ticketStatusFilter)
    }

    if (ticketSearch.trim()) {
      const q = ticketSearch.toLowerCase().trim()
      result = result.filter(
        (t) =>
          t.subject.toLowerCase().includes(q) ||
          (t.ticketRef && t.ticketRef.toLowerCase().includes(q)) ||
          t.id.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      )
    }

    return result
  }, [tickets, ticketStatusFilter, ticketSearch])

  // Get Category Icon
  const getCategoryIcon = (catId: SupportCategory) => {
    switch (catId) {
      case 'account':
        return <User className="w-4 h-4 text-sky-400" />
      case 'trading':
        return <TrendingUp className="w-4 h-4 text-cp-positive" />
      case 'wallet':
        return <Wallet className="w-4 h-4 text-cp-gold" />
      case 'deposits':
        return <ArrowDownToLine className="w-4 h-4 text-emerald-400" />
      case 'withdrawals':
        return <ArrowUpFromLine className="w-4 h-4 text-amber-400" />
      case 'kyc':
        return <ShieldCheck className="w-4 h-4 text-purple-400" />
      case 'security':
        return <Lock className="w-4 h-4 text-cp-negative" />
    }
  }

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return <Badge variant="neutral" size="sm" withDot>Open</Badge>
      case 'in_progress':
        return <Badge variant="gold" size="sm" withDot pulseDot>In Progress</Badge>
      case 'waiting_user':
        return <Badge variant="gold" size="sm" withDot>Waiting for You</Badge>
      case 'resolved':
        return <Badge variant="positive" size="sm" withDot>Resolved</Badge>
      case 'closed':
        return <Badge variant="neutral" size="sm" withDot>Closed</Badge>
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
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-cp-elevated border border-cp-gold text-cp-text-primary shadow-2xl animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-cp-gold shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* HERO / SEARCH HEADER */}
      <div className="relative rounded-2xl bg-gradient-to-b from-cp-elevated via-cp-card to-cp-card border border-cp-border p-6 sm:p-10 text-center space-y-4 overflow-hidden shadow-card">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cp-gold/10 border border-cp-gold/30 text-cp-gold text-xs font-semibold">
          <Headphones className="w-3.5 h-3.5" />
          <span>CoinPlus Real-Time Customer Support</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-cp-text-primary">
          How can we help you?
        </h1>

        <p className="text-xs sm:text-sm text-cp-text-secondary max-w-lg mx-auto">
          Chat directly with the administrative team in real time, review ticket conversations, or explore FAQs.
        </p>

        {/* Global Help Search Input */}
        <div className="relative max-w-xl mx-auto pt-2">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-cp-text-secondary" />
          <input
            type="text"
            placeholder="Search questions, blockchain topics, error codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-cp-elevated border border-cp-border rounded-xl pl-11 pr-10 py-3 text-xs sm:text-sm text-cp-text-primary placeholder:text-cp-text-secondary/60 focus:outline-none focus:border-cp-gold shadow-inner transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cp-text-secondary hover:text-cp-text-primary text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Real-Time Live Status Banner */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-cp-card/90 border border-cp-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-xs text-cp-text-secondary">
            <span className="font-semibold text-cp-text-primary">Live Support Desk Connected:</span> Direct messaging with operators is active. Incoming replies arrive in real time without refreshing the page.
          </div>
        </div>
        {totalUnread > 0 && (
          <Badge variant="gold" size="sm" className="shrink-0 self-start sm:self-auto font-mono">
            {totalUnread} Unread Message{totalUnread > 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* 1. BROWSE BY CATEGORY TILES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-cp-text-primary">
            Explore Help by Category
          </h2>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs text-cp-gold hover:underline font-semibold"
            >
              Show All Categories
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {SUPPORT_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cp-gold/15 border-cp-gold text-cp-gold font-bold shadow-gold-sm scale-[1.02]'
                    : 'bg-cp-card border-cp-border hover:border-cp-gold/40 text-cp-text-secondary hover:text-cp-text-primary'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-cp-elevated border border-cp-border flex items-center justify-center mb-2 shrink-0">
                  {getCategoryIcon(cat.id)}
                </div>
                <div>
                  <span className="text-xs font-semibold block leading-tight">{cat.label}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. POPULAR FAQS SECTION */}
      <Card className="border-cp-border bg-cp-card overflow-hidden shadow-card">
        <CardHeader className="border-b border-cp-border/50 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-5 h-5 text-cp-gold" />
              <div>
                <CardTitle className="text-base text-cp-text-primary">Frequently Asked Questions</CardTitle>
                <p className="text-xs text-cp-text-secondary">Answers to common trading, deposit, and verification topics</p>
              </div>
            </div>

            <Badge variant="gold" size="sm">
              {filteredFaqs.length} Articles
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <p className="text-xs text-cp-text-secondary">
                No FAQs match your search query &quot;{searchQuery}&quot;.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
              >
                Reset Search Filters
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-cp-border/50">
              {filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqIds.includes(faq.id)

                return (
                  <div key={faq.id} className="py-3.5 first:pt-0 last:pb-0">
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex items-center justify-between text-left gap-4 hover:text-cp-gold transition-colors select-none group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cp-gold shrink-0" />
                        <span className="text-xs sm:text-sm font-semibold text-cp-text-primary group-hover:text-cp-gold">
                          {faq.question}
                        </span>
                        {faq.popular && (
                          <Badge variant="gold" size="sm" className="hidden sm:inline-flex text-[9px] px-1 py-0">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <span className="text-cp-text-secondary group-hover:text-cp-gold shrink-0">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="mt-2.5 pl-4 text-xs text-cp-text-secondary leading-relaxed border-l border-cp-gold/30 animate-in fade-in duration-150">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. MY SUPPORT TICKETS SECTION */}
      <Card className="border-cp-border bg-cp-card overflow-hidden shadow-card">
        <div className="p-4 sm:p-5 border-b border-cp-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-cp-elevated/40">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-cp-text-primary">Customer Support Conversations</h2>
              <Badge variant="gold" size="sm">
                {tickets.length} Active
              </Badge>
              {totalUnread > 0 && (
                <Badge variant="positive" size="sm">
                  {totalUnread} New
                </Badge>
              )}
            </div>
            <p className="text-xs text-cp-text-secondary mt-0.5">
              Chat directly with administrator support in real time.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            New Support Conversation
          </Button>
        </div>

        {/* Ticket Filter Bar */}
        <div className="p-4 border-b border-cp-border bg-cp-card/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cp-text-secondary" />
            <input
              type="text"
              placeholder="Search conversations by subject or reference..."
              value={ticketSearch}
              onChange={(e) => setTicketSearch(e.target.value)}
              className="w-full bg-cp-elevated border border-cp-border rounded-lg pl-9 pr-8 py-2 text-xs text-cp-text-primary placeholder:text-cp-text-secondary/60 focus:outline-none focus:border-cp-gold"
            />
            {ticketSearch && (
              <button
                onClick={() => setTicketSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cp-text-secondary hover:text-cp-text-primary"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-cp-text-secondary shrink-0">Status:</span>
            <select
              value={ticketStatusFilter}
              onChange={(e) => setTicketStatusFilter(e.target.value as 'all' | TicketStatus)}
              className="bg-cp-elevated border border-cp-border rounded-lg px-2.5 py-1.5 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting_user">Waiting for You</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Tickets List */}
        {isLoadingTickets && tickets.length === 0 ? (
          <div className="py-16 text-center text-xs text-cp-text-secondary">
            Loading conversations from support desk...
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-cp-elevated border border-cp-border flex items-center justify-center mx-auto text-cp-text-secondary">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-cp-text-primary">No Conversations Found</h4>
            <p className="text-xs text-cp-text-secondary max-w-sm mx-auto">
              {ticketSearch || ticketStatusFilter !== 'all'
                ? 'No tickets match your search criteria. Try adjusting your filters.'
                : 'You have no open support tickets. Need help? Click the button below to start a live conversation.'}
            </p>
            <Button variant="secondary" size="sm" onClick={() => setIsCreateModalOpen(true)}>
              Start Live Conversation
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-cp-border/50">
            {filteredTickets.map((t) => {
              const hasUnread = (t.unreadCount ?? 0) > 0

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-cp-elevated/40 transition-colors cursor-pointer group ${
                    hasUnread ? 'bg-cp-gold/5 border-l-2 border-l-cp-gold' : ''
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-xs text-cp-gold">{t.ticketRef || t.id}</span>
                      {getStatusBadge(t.status)}
                      {getPriorityBadge(t.priority)}
                      <Badge variant="neutral" size="sm" className="capitalize text-[10px] px-1.5 py-0">
                        {t.category}
                      </Badge>
                      {hasUnread && (
                        <span className="px-2 py-0.5 rounded-full bg-cp-gold text-cp-bg text-[10px] font-bold font-mono animate-pulse">
                          {t.unreadCount} Unread
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-cp-text-primary group-hover:text-cp-gold transition-colors truncate">
                      {t.subject}
                    </h3>

                    <div className="flex items-center gap-3 text-[11px] text-cp-text-secondary font-mono pt-0.5">
                      <span>Created: {t.createdAt}</span>
                      <span>•</span>
                      <span>{t.messages.length} message{t.messages.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <Button
                      variant={hasUnread ? 'primary' : 'outline'}
                      size="sm"
                      className="h-8 text-xs border-cp-border hover:border-cp-gold"
                    >
                      Open Chat <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* 4. CONTACT SUPPORT CHANNELS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Live Chat */}
        <Card className="p-5 bg-cp-card border-cp-border flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cp-gold/10 border border-cp-gold/30 flex items-center justify-center text-cp-gold">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-cp-text-primary">Real-Time Support</h4>
            <p className="text-xs text-cp-text-secondary leading-relaxed">
              Instant responses from CoinPlus administrators directly in your user panel.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full text-xs"
          >
            Start Conversation
          </Button>
        </Card>

        {/* Email Relations */}
        <Card className="p-5 bg-cp-card border-cp-border flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cp-elevated border border-cp-border flex items-center justify-center text-cp-text-secondary">
              <Mail className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-cp-text-primary">Official Relations</h4>
            <p className="text-xs text-cp-text-secondary leading-relaxed">
              Inquiries regarding institutional account onboarding and corporate agreements.
            </p>
          </div>
          <a
            href="mailto:support@coinplus.io"
            className="w-full py-2 rounded-lg border border-cp-border text-center text-xs font-semibold text-cp-text-secondary hover:text-cp-gold hover:border-cp-gold transition-colors block"
          >
            support@coinplus.io
          </a>
        </Card>

        {/* Documentation Portal */}
        <Card className="p-5 bg-cp-card border-cp-border flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cp-elevated border border-cp-border flex items-center justify-center text-cp-text-secondary">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-cp-text-primary">Institutional Documentation</h4>
            <p className="text-xs text-cp-text-secondary leading-relaxed">
              Review trading API specs, compliance guidelines, and system security controls.
            </p>
          </div>
          <Link
            to="/status"
            className="w-full py-2 rounded-lg border border-cp-border text-center text-xs font-semibold text-cp-text-secondary hover:text-cp-gold hover:border-cp-gold transition-colors block"
          >
            Platform Status & Service Health
          </Link>
        </Card>
      </div>

      {/* CREATE TICKET MODAL */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handleTicketCreated}
      />

      {/* TICKET DETAIL / CONVERSATION MODAL */}
      <TicketDetailModal
        isOpen={Boolean(selectedTicket)}
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onAddReply={handleAddReply}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}

export default Support
