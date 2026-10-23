import React, { useState, useMemo, useEffect } from 'react'
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
import { Typography } from '@/components/common/Typography'
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

export const Support: React.FC = () => {
  // Search & FAQ Category
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<SupportCategory | 'all'>('all')

  // Expanded FAQ accordion items
  const [expandedFaqIds, setExpandedFaqIds] = useState<string[]>(['faq-1'])

  // Support Tickets State (persisted in localStorage)
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    try {
      const saved = localStorage.getItem('cp_support_tickets')
      return saved ? JSON.parse(saved) : INITIAL_SUPPORT_TICKETS
    } catch {
      return INITIAL_SUPPORT_TICKETS
    }
  })

  // Ticket filters
  const [ticketStatusFilter, setTicketStatusFilter] = useState<'all' | TicketStatus>('all')
  const [ticketSearch, setTicketSearch] = useState('')

  // Modals & Selection
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Persist tickets
  useEffect(() => {
    try {
      localStorage.setItem('cp_support_tickets', JSON.stringify(tickets))
    } catch {
      // ignore
    }
  }, [tickets])

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Toggle FAQ accordion item
  const toggleFaq = (id: string) => {
    setExpandedFaqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Handle new ticket created
  const handleTicketCreated = (newTicket: SupportTicket) => {
    setTickets((prev) => [newTicket, ...prev])
    triggerToast(`Support ticket ${newTicket.id} submitted successfully!`)
  }

  // Handle add simulated reply to ticket
  const handleAddReply = (ticketId: string, replyText: string) => {
    const now = new Date()
    const timestampStr = 'Today at ' + now.toTimeString().slice(0, 5) + ' UTC'

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updatedMessages = [
            ...t.messages,
            {
              id: `msg-${Date.now()}`,
              sender: 'user' as const,
              senderName: 'Alex Vance',
              message: replyText,
              timestamp: timestampStr,
            },
          ]
          const updatedTicket = {
            ...t,
            status: 'in_progress' as TicketStatus,
            updatedAt: now.toISOString().replace('T', ' ').slice(0, 16),
            messages: updatedMessages,
          }
          if (selectedTicket?.id === ticketId) {
            setSelectedTicket(updatedTicket)
          }
          return updatedTicket
        }
        return t
      })
    )

    triggerToast('Simulated reply sent to support desk.')
  }

  // Reset demonstration tickets
  const handleResetDemo = () => {
    setTickets(INITIAL_SUPPORT_TICKETS)
    try {
      localStorage.removeItem('cp_support_tickets')
    } catch {
      // ignore
    }
    triggerToast('Reset demonstration support tickets.')
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
        return <Badge variant="gold" size="sm" withDot>Waiting for User</Badge>
      case 'resolved':
        return <Badge variant="positive" size="sm" withDot>Resolved</Badge>
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
          <span>CoinPlus Help & Customer Care</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-cp-text-primary">
          How can we help you?
        </h1>

        <p className="text-xs sm:text-sm text-cp-text-secondary max-w-lg mx-auto">
          Search articles, explore common cryptocurrency trading FAQs, or submit a priority support ticket.
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

      {/* Demonstration Notice Banner */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-cp-card/90 border border-cp-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cp-gold/10 border border-cp-gold/30 flex items-center justify-center text-cp-gold shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div className="text-xs text-cp-text-secondary">
            <span className="font-semibold text-cp-text-primary">Demonstration Help Center:</span> Support
            tickets, replies, and FAQs are simulated for user interface demonstration. Inquiries are stored in
            your local browser session and are not dispatched to external support agents.
          </div>
        </div>
        <button
          onClick={handleResetDemo}
          className="flex items-center gap-1.5 text-xs text-cp-gold hover:underline self-end sm:self-auto shrink-0 font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Tickets</span>
        </button>
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
              <h2 className="text-base font-bold text-cp-text-primary">My Support Tickets</h2>
              <Badge variant="gold" size="sm">
                {tickets.length} Total
              </Badge>
            </div>
            <p className="text-xs text-cp-text-secondary mt-0.5">
              Track open inquiries, review support replies, and add follow-up notes.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Support Ticket
          </Button>
        </div>

        {/* Ticket Filter Bar */}
        <div className="p-4 border-b border-cp-border bg-cp-card/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cp-text-secondary" />
            <input
              type="text"
              placeholder="Search by ticket ID or subject..."
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
              <option value="waiting_user">Waiting for User</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-cp-elevated border border-cp-border flex items-center justify-center mx-auto text-cp-text-secondary">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-cp-text-primary">No Tickets Found</h4>
            <p className="text-xs text-cp-text-secondary max-w-sm mx-auto">
              {ticketSearch || ticketStatusFilter !== 'all'
                ? 'No tickets match your search criteria. Try adjusting your filters.'
                : 'You have no open support tickets. Need help? Click the button below to create one.'}
            </p>
            <Button variant="secondary" size="sm" onClick={() => setIsCreateModalOpen(true)}>
              Open New Ticket
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-cp-border/50">
            {filteredTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-cp-elevated/40 transition-colors cursor-pointer group"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-xs text-cp-gold">{t.id}</span>
                    {getStatusBadge(t.status)}
                    {getPriorityBadge(t.priority)}
                    <Badge variant="neutral" size="sm" className="capitalize text-[10px] px-1.5 py-0">
                      {t.category}
                    </Badge>
                  </div>

                  <h3 className="text-sm font-bold text-cp-text-primary group-hover:text-cp-gold transition-colors truncate">
                    {t.subject}
                  </h3>

                  <p className="text-xs text-cp-text-secondary line-clamp-1">
                    {t.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-cp-text-secondary font-mono pt-0.5">
                    <span>Created: {t.createdAt}</span>
                    <span>•</span>
                    <span>{t.messages.length} message{t.messages.length > 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs border-cp-border hover:border-cp-gold"
                  >
                    View Conversation <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
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
            <h4 className="text-sm font-bold text-cp-text-primary">24/7 Live Desk</h4>
            <p className="text-xs text-cp-text-secondary leading-relaxed">
              Instant simulated concierge support with average wait times under 2 minutes.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full text-xs border-cp-border hover:border-cp-gold"
          >
            Start Live Chat
          </Button>
        </Card>

        {/* Email Support */}
        <Card className="p-5 bg-cp-card border-cp-border flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cp-positive/10 border border-cp-positive/30 flex items-center justify-center text-cp-positive">
              <Mail className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-cp-text-primary">Email Support</h4>
            <p className="text-xs text-cp-text-secondary leading-relaxed">
              Direct inquiries: <span className="font-mono text-cp-gold">support@coinplus.io</span>. Guaranteed review within 4 hours.
            </p>
          </div>
          <a href="mailto:support@coinplus.io">
            <Button variant="outline" size="sm" className="w-full text-xs border-cp-border hover:border-cp-gold">
              Email Help Desk
            </Button>
          </a>
        </Card>

        {/* VIP Priority Desk */}
        <Card className="p-5 bg-cp-card border-cp-border flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-cp-text-primary">VIP 1 Priority Channel</h4>
            <p className="text-xs text-cp-text-secondary leading-relaxed">
              Exclusive compliance and institutional desk routing for high-volume accounts.
            </p>
          </div>
          <Link to="/account">
            <Button variant="outline" size="sm" className="w-full text-xs border-cp-border hover:border-cp-gold">
              View VIP Benefits
            </Button>
          </Link>
        </Card>
      </div>

      {/* Create Support Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onCreated={handleTicketCreated}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Ticket Details & Conversation Modal */}
      <TicketDetailModal
        isOpen={selectedTicket !== null}
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onAddReply={handleAddReply}
      />
    </div>
  )
}

export default Support
