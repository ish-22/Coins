import React, { useState, useMemo, useEffect } from 'react'
import {
  Bell,
  Search,
  Eye,
  CheckCircle2,
  X,
  AlertTriangle,
  RefreshCw,
  Plus,
  Send,
  Users,
  User,
  ShieldAlert,
  ShieldCheck,
  ArrowDownToLine,
  TrendingUp,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  Trash2,
  Filter,
  CheckSquare,
  Square,
} from 'lucide-react'
import { Card, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import {
  AdminNotificationDispatch,
  SendNotificationPayload,
  AdminUser,
} from '@/mock/adminData'
import { adminService } from '@/services'

export const AdminNotifications: React.FC = () => {
  const [dispatches, setDispatches] = useState<AdminNotificationDispatch[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [targetFilter, setTargetFilter] = useState<string>('all')

  // Notification Toast feedback
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Drawer / Inspection
  const [selectedDispatch, setSelectedDispatch] = useState<AdminNotificationDispatch | null>(null)

  // Send Notification Modal State
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [composerError, setComposerError] = useState<string | null>(null)

  // Form Fields
  const [formTitle, setFormTitle] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [formType, setFormType] = useState<'deposit' | 'kyc' | 'trading' | 'account' | 'security' | 'system'>('trading')
  const [formPriority, setFormPriority] = useState<'normal' | 'high' | 'urgent'>('normal')
  const [formTargetType, setFormTargetType] = useState<'all' | 'individual' | 'selected'>('all')
  const [formSingleUserId, setFormSingleUserId] = useState<string>('')
  const [formSelectedUserIds, setFormSelectedUserIds] = useState<string[]>([])
  const [formLinkText, setFormLinkText] = useState('')
  const [formLinkHref, setFormLinkHref] = useState('')

  // Search inside user selection modal
  const [userSelectSearch, setUserSelectSearch] = useState('')

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  // Fetch dispatches history & users
  const loadData = async () => {
    try {
      setIsLoading(true)
      const [historyRes, usersRes] = await Promise.all([
        adminService.getNotificationHistory(),
        adminService.getUsers(),
      ])
      setDispatches(historyRes.dispatches)
      setUsers(usersRes)
    } catch (err: any) {
      setToastMessage({
        type: 'error',
        text: err?.response?.data?.message || 'Failed to load notifications history.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Quick preset templates
  const applyTemplate = (
    template: 'deposit' | 'kyc_approved' | 'kyc_rejected' | 'trading' | 'account_security'
  ) => {
    if (template === 'deposit') {
      setFormType('deposit')
      setFormTitle('Deposit Network & Custody Vault Update')
      setFormMessage(
        'New multi-sig deposit addresses for USDT (TRC-20 and ERC-20) are now live. Please review your deposit vault address before sending assets to ensure instant automated block crediting.'
      )
      setFormLinkText('View Deposit Vault')
      setFormLinkHref('/deposit')
      setFormPriority('high')
    } else if (template === 'kyc_approved') {
      setFormType('kyc')
      setFormTitle('KYC Verification Approved — Tier 2 Unlocked')
      setFormMessage(
        'Congratulations! Your submitted identification documents have been verified and approved by the compliance team. Your daily withdrawal limit has been elevated to $500,000 USD.'
      )
      setFormLinkText('Check Verification Status')
      setFormLinkHref('/kyc')
      setFormPriority('normal')
    } else if (template === 'kyc_rejected') {
      setFormType('kyc')
      setFormTitle('KYC Verification: Document Resubmission Required')
      setFormMessage(
        'Your recent KYC submission requires attention: document photo was blurry or edges were cut off. Please re-upload a clear high-resolution photo of your valid Passport or National ID.'
      )
      setFormLinkText('Resubmit KYC Documents')
      setFormLinkHref('/kyc')
      setFormPriority('high')
    } else if (template === 'trading') {
      setFormType('trading')
      setFormTitle('New Spot Trading Pair & Ultra-Low Matching Latency')
      setFormMessage(
        'Institutional order books for SOL/USDT and XRP/USDT have been enabled on the CoinPlus matching engine with 0.1% maker/taker trading fees.'
      )
      setFormLinkText('Trade Spot Markets')
      setFormLinkHref('/trade')
      setFormPriority('normal')
    } else if (template === 'account_security') {
      setFormType('account')
      setFormTitle('Account Security Alert: Enable Two-Factor Authentication')
      setFormMessage(
        'Ensure your digital assets remain protected. We strongly advise enabling Two-Factor Authentication (Google Authenticator / TOTP) and FIDO2 Passkeys in your Security Settings.'
      )
      setFormLinkText('Security Settings')
      setFormLinkHref('/settings')
      setFormPriority('urgent')
    }
  }

  // Handle Send Notification
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault()
    setComposerError(null)

    if (!formTitle.trim()) {
      setComposerError('Notification title is required.')
      return
    }
    if (!formMessage.trim()) {
      setComposerError('Notification message is required.')
      return
    }

    if (formTargetType === 'individual' && !formSingleUserId) {
      setComposerError('Please select a recipient user for individual notification.')
      return
    }

    if (formTargetType === 'selected' && formSelectedUserIds.length === 0) {
      setComposerError('Please select at least one recipient user.')
      return
    }

    const payload: SendNotificationPayload = {
      title: formTitle.trim(),
      message: formMessage.trim(),
      type: formType,
      priority: formPriority,
      targetType: formTargetType,
      targetUserIds:
        formTargetType === 'individual'
          ? [formSingleUserId]
          : formTargetType === 'selected'
          ? formSelectedUserIds
          : undefined,
      linkText: formLinkText.trim() || undefined,
      linkHref: formLinkHref.trim() || undefined,
    }

    try {
      setIsSubmitting(true)
      const res = await adminService.sendNotification(payload)
      setToastMessage({
        type: 'success',
        text: `Notification successfully dispatched to ${res.deliveredCount} recipient(s)! They will receive it in their User Panel.`,
      })
      setIsComposerOpen(false)
      // Reset form
      setFormTitle('')
      setFormMessage('')
      setFormLinkText('')
      setFormLinkHref('')
      setFormSelectedUserIds([])
      setFormSingleUserId('')
      // Reload history
      await loadData()
    } catch (err: any) {
      setComposerError(err?.response?.data?.message || 'Failed to dispatch notification.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Delete History Entry
  const handleDeleteDispatch = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this notification record from history?')) return
    try {
      await adminService.deleteNotificationDispatch(id)
      setToastMessage({ type: 'success', text: 'Notification history record deleted.' })
      setDispatches((prev) => prev.filter((d) => d.id !== id))
      if (selectedDispatch?.id === id) setSelectedDispatch(null)
    } catch (err: any) {
      setToastMessage({ type: 'error', text: 'Failed to delete record.' })
    }
  }

  // Filtered Dispatches
  const filteredDispatches = useMemo(() => {
    return dispatches.filter((d) => {
      const q = searchQuery.toLowerCase()
      const matchSearch =
        !searchQuery ||
        d.title.toLowerCase().includes(q) ||
        d.message.toLowerCase().includes(q) ||
        d.targetSummary.toLowerCase().includes(q) ||
        d.adminName.toLowerCase().includes(q)

      const matchType = typeFilter === 'all' || d.type === typeFilter
      const matchTarget = targetFilter === 'all' || d.targetType === targetFilter

      return matchSearch && matchType && matchTarget
    })
  }, [dispatches, searchQuery, typeFilter, targetFilter])

  // Filtered users for selection list
  const filteredUsersList = useMemo(() => {
    const q = userSelectSearch.toLowerCase()
    return users.filter(
      (u) =>
        !userSelectSearch ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.userRef.toLowerCase().includes(q)
    )
  }, [users, userSelectSearch])

  // Multi-select helpers
  const toggleSelectUser = (id: string) => {
    setFormSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    )
  }

  const selectAllFilteredUsers = () => {
    const ids = filteredUsersList.map((u) => u.id)
    setFormSelectedUserIds((prev) => Array.from(new Set([...prev, ...ids])))
  }

  const deselectAllUsers = () => {
    setFormSelectedUserIds([])
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between shadow-lg animate-fadeIn text-xs ${
            toastMessage.type === 'success'
              ? 'bg-cp-positive/10 border-cp-positive/30 text-cp-positive'
              : 'bg-cp-negative/10 border-cp-negative/30 text-cp-negative'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span className="font-semibold">{toastMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-cp-text-primary tracking-tight">
              Notification Management System
            </h1>
            <Badge variant="gold" size="sm">
              In-App Broadcaster
            </Badge>
          </div>
          <p className="text-xs text-cp-text-muted mt-1">
            Dispatch announcements, deposit confirmations, KYC status alerts, and trading notices directly to user panels.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsComposerOpen(true)}
            className="flex items-center gap-1.5 shadow-md"
          >
            <Send className="w-4 h-4" />
            <span>Send Notification</span>
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-[#0c121c] border-cp-border p-4">
          <span className="text-[10px] text-cp-text-muted uppercase font-bold tracking-wider block">
            Total Dispatches
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-2xl font-black text-cp-text-primary font-mono">
              {dispatches.length}
            </span>
            <Bell className="w-4 h-4 text-cp-gold opacity-80" />
          </div>
        </Card>

        <Card className="bg-[#0c121c] border-cp-border p-4">
          <span className="text-[10px] text-cp-positive uppercase font-bold tracking-wider block">
            Recipients Reached
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-2xl font-black text-cp-positive font-mono">
              {dispatches.reduce((acc, d) => acc + (d.targetCount || 1), 0)}
            </span>
            <Users className="w-4 h-4 text-cp-positive" />
          </div>
        </Card>

        <Card className="bg-[#0c121c] border-cp-border p-4">
          <span className="text-[10px] text-cp-gold uppercase font-bold tracking-wider block">
            Registered Clients
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-2xl font-black text-cp-gold font-mono">
              {users.length}
            </span>
            <User className="w-4 h-4 text-cp-gold" />
          </div>
        </Card>

        <Card className="bg-[#0c121c] border-cp-border p-4">
          <span className="text-[10px] text-amber-300 uppercase font-bold tracking-wider block">
            Priority Alerts
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
              {dispatches.filter((d) => d.priority === 'high' || d.priority === 'urgent').length}
            </span>
            <ShieldAlert className="w-4 h-4 text-amber-300" />
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="bg-[#0c121c] border-cp-border">
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cp-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, message snippet, audience, or admin name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141d2b] border border-cp-border rounded-xl pl-9 pr-3 py-2 text-xs text-cp-text-primary placeholder:text-cp-text-muted/60 focus:outline-none focus:border-cp-gold/60"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Category / Type filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#141d2b] border border-cp-border rounded-lg px-2.5 py-1.5 text-xs text-cp-text-primary focus:outline-none capitalize"
            >
              <option value="all">All Categories</option>
              <option value="deposit">Deposit Notifications</option>
              <option value="kyc">KYC Notifications</option>
              <option value="trading">Trading Announcements</option>
              <option value="account">Account Alerts</option>
              <option value="security">Security Notices</option>
              <option value="system">System Updates</option>
            </select>

            {/* Target Audience filter */}
            <select
              value={targetFilter}
              onChange={(e) => setTargetFilter(e.target.value)}
              className="bg-[#141d2b] border border-cp-border rounded-lg px-2.5 py-1.5 text-xs text-cp-text-primary focus:outline-none"
            >
              <option value="all">All Audiences</option>
              <option value="all">Broadcast (All Users)</option>
              <option value="individual">Individual Direct</option>
              <option value="selected">Selected Group</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Sent Notifications History Table */}
      <Card className="bg-[#0c121c] border-cp-border overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-cp-text-muted space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin text-cp-gold mx-auto" />
            <p>Loading notification dispatch history...</p>
          </div>
        ) : filteredDispatches.length === 0 ? (
          <div className="p-12 text-center text-xs text-cp-text-muted space-y-2">
            <Bell className="w-8 h-8 text-cp-text-muted mx-auto" />
            <p>No dispatched notifications match the current search or filters.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setTypeFilter('all')
                setTargetFilter('all')
              }}
              className="mt-2"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-cp-border bg-cp-elevated/40 text-cp-text-muted uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4">Subject & Content</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Target Audience</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Dispatched By</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cp-border/50 text-cp-text-secondary">
                {filteredDispatches.map((d) => (
                  <tr key={d.id} className="hover:bg-cp-elevated/30 transition-colors">
                    {/* Timestamp */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-cp-text-muted whitespace-nowrap">
                      <div>
                        <span className="block text-cp-text-primary font-semibold">{d.createdAt}</span>
                        <span className="text-[10px] text-cp-text-muted block">{d.timestamp}</span>
                      </div>
                    </td>

                    {/* Title & Message */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <div>
                        <span className="font-bold text-cp-text-primary block text-xs">{d.title}</span>
                        <p className="text-[11px] text-cp-text-muted line-clamp-2 mt-0.5 leading-relaxed">
                          {d.message}
                        </p>
                        {d.linkText && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-cp-gold mt-1 font-semibold">
                            <span>Link: {d.linkText}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          d.type === 'deposit'
                            ? 'bg-cp-positive/10 text-cp-positive border border-cp-positive/30'
                            : d.type === 'kyc'
                            ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                            : d.type === 'trading'
                            ? 'bg-cp-gold/15 text-cp-gold border border-cp-gold/30'
                            : d.type === 'security'
                            ? 'bg-cp-negative/10 text-cp-negative border border-cp-negative/30'
                            : 'bg-cp-elevated text-cp-text-secondary border border-cp-border'
                        }`}
                      >
                        {d.type}
                      </span>
                    </td>

                    {/* Audience & Count */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-cp-text-primary block text-[11px]">
                          {d.targetSummary}
                        </span>
                        <span className="text-[10px] text-cp-text-muted font-mono block">
                          Delivered to {d.targetCount} inbox{d.targetCount === 1 ? '' : 'es'}
                        </span>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          d.priority === 'urgent'
                            ? 'bg-cp-negative/20 text-cp-negative border border-cp-negative/40'
                            : d.priority === 'high'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-cp-elevated text-cp-text-muted border border-cp-border'
                        }`}
                      >
                        {d.priority}
                      </span>
                    </td>

                    {/* Admin Sender */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="text-cp-text-primary font-medium block">{d.adminName}</span>
                        <span className="text-[10px] text-cp-text-muted font-mono block">{d.adminEmail}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedDispatch(d)}
                          className="px-2 py-1 rounded-lg bg-cp-elevated hover:bg-cp-card border border-cp-border text-cp-text-secondary hover:text-cp-gold transition-colors inline-flex items-center gap-1 text-[11px]"
                          title="Inspect Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteDispatch(d.id)}
                          className="p-1 rounded-lg bg-cp-elevated hover:bg-cp-negative/15 border border-cp-border hover:border-cp-negative/30 text-cp-text-muted hover:text-cp-negative transition-colors"
                          title="Remove from history"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ========================================================================= */}
      {/* 1. SEND NOTIFICATION MODAL (COMPOSER) */}
      {/* ========================================================================= */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm" onClick={() => setIsComposerOpen(false)} />

          <div className="relative w-full max-w-3xl bg-[#0c121c] border border-cp-border rounded-2xl shadow-2xl overflow-hidden z-10 animate-fadeIn flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-cp-border flex items-center justify-between bg-[#111827]/70">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cp-gold/15 text-cp-gold border border-cp-gold/30">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-cp-text-primary">
                    Dispatch Platform Notification
                  </h3>
                  <p className="text-xs text-cp-text-muted">
                    Recipients immediately receive this notification inside their User Panel notification inbox.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsComposerOpen(false)}
                className="p-1.5 rounded-lg text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
              {composerError && (
                <div className="p-3 rounded-xl bg-cp-negative/15 border border-cp-negative/30 text-xs text-cp-negative flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{composerError}</span>
                  </div>
                  <button type="button" onClick={() => setComposerError(null)} className="p-1 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Quick Template Picker */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-cp-text-muted uppercase text-[10px] tracking-wider block">
                  Quick Preset Templates (Click to Auto-Fill):
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyTemplate('deposit')}
                    className="px-2.5 py-1 rounded-lg bg-cp-elevated hover:bg-cp-card border border-cp-border text-cp-positive hover:border-cp-positive/40 transition-colors inline-flex items-center gap-1 text-[11px]"
                  >
                    <ArrowDownToLine className="w-3 h-3" />
                    <span>Deposit Channel Notice</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyTemplate('kyc_approved')}
                    className="px-2.5 py-1 rounded-lg bg-cp-elevated hover:bg-cp-card border border-cp-border text-blue-300 hover:border-blue-400 transition-colors inline-flex items-center gap-1 text-[11px]"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>KYC Approved Notice</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyTemplate('kyc_rejected')}
                    className="px-2.5 py-1 rounded-lg bg-cp-elevated hover:bg-cp-card border border-cp-border text-amber-300 hover:border-amber-400 transition-colors inline-flex items-center gap-1 text-[11px]"
                  >
                    <ShieldAlert className="w-3 h-3" />
                    <span>KYC Rejection / Resubmit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyTemplate('trading')}
                    className="px-2.5 py-1 rounded-lg bg-cp-elevated hover:bg-cp-card border border-cp-border text-cp-gold hover:border-cp-gold/40 transition-colors inline-flex items-center gap-1 text-[11px]"
                  >
                    <TrendingUp className="w-3 h-3" />
                    <span>Trading Announcement</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyTemplate('account_security')}
                    className="px-2.5 py-1 rounded-lg bg-cp-elevated hover:bg-cp-card border border-cp-border text-rose-300 hover:border-rose-400 transition-colors inline-flex items-center gap-1 text-[11px]"
                  >
                    <ShieldAlert className="w-3 h-3" />
                    <span>Account Security Alert</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSendNotification} className="space-y-4 text-xs">
                {/* 1. Target Audience Selection */}
                <div className="space-y-1.5">
                  <label className="font-bold text-cp-text-secondary block uppercase text-[10px] tracking-wider">
                    Target Audience *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setFormTargetType('all')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        formTargetType === 'all'
                          ? 'bg-cp-gold/15 border-cp-gold text-cp-gold shadow-sm'
                          : 'bg-[#141d2b] border-cp-border text-cp-text-secondary hover:bg-cp-elevated'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <Users className="w-4 h-4" />
                        <span>All Registered Users</span>
                      </div>
                      <span className="text-[10px] opacity-80 block mt-1">
                        Broadcast to all {users.length} clients
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormTargetType('individual')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        formTargetType === 'individual'
                          ? 'bg-cp-gold/15 border-cp-gold text-cp-gold shadow-sm'
                          : 'bg-[#141d2b] border-cp-border text-cp-text-secondary hover:bg-cp-elevated'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <User className="w-4 h-4" />
                        <span>Individual User</span>
                      </div>
                      <span className="text-[10px] opacity-80 block mt-1">
                        Send to a specific client directly
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormTargetType('selected')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        formTargetType === 'selected'
                          ? 'bg-cp-gold/15 border-cp-gold text-cp-gold shadow-sm'
                          : 'bg-[#141d2b] border-cp-border text-cp-text-secondary hover:bg-cp-elevated'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <CheckSquare className="w-4 h-4" />
                        <span>Selected Users ({formSelectedUserIds.length})</span>
                      </div>
                      <span className="text-[10px] opacity-80 block mt-1">
                        Pick specific recipients from list
                      </span>
                    </button>
                  </div>
                </div>

                {/* Individual User Selection Dropdown */}
                {formTargetType === 'individual' && (
                  <div className="space-y-1.5 p-3 rounded-xl bg-[#141d2b] border border-cp-border animate-fadeIn">
                    <label className="font-bold text-cp-text-secondary block uppercase text-[10px]">
                      Select Recipient User *
                    </label>
                    <select
                      value={formSingleUserId}
                      onChange={(e) => setFormSingleUserId(e.target.value)}
                      required
                      className="w-full bg-[#0c121c] border border-cp-border rounded-lg px-3 py-2 text-cp-text-primary text-xs focus:outline-none focus:border-cp-gold"
                    >
                      <option value="">-- Choose Trader / Client --</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.email}) — UID: {u.userRef}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Selected Users Multi-Select Box */}
                {formTargetType === 'selected' && (
                  <div className="space-y-2 p-3.5 rounded-xl bg-[#141d2b] border border-cp-border animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-cp-text-secondary block uppercase text-[10px]">
                        Select Recipients ({formSelectedUserIds.length} selected)
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={selectAllFilteredUsers}
                          className="text-[10px] text-cp-gold hover:underline font-semibold"
                        >
                          Select All ({filteredUsersList.length})
                        </button>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={deselectAllUsers}
                          className="text-[10px] text-cp-text-muted hover:underline"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder="Filter users by name, email, or UID..."
                      value={userSelectSearch}
                      onChange={(e) => setUserSelectSearch(e.target.value)}
                      className="w-full bg-[#0c121c] border border-cp-border rounded-lg px-2.5 py-1.5 text-xs text-cp-text-primary focus:outline-none"
                    />

                    <div className="max-h-40 overflow-y-auto space-y-1 border border-cp-border/60 rounded-lg p-2 bg-[#0c121c]">
                      {filteredUsersList.map((u) => {
                        const isSelected = formSelectedUserIds.includes(u.id)
                        return (
                          <div
                            key={u.id}
                            onClick={() => toggleSelectUser(u.id)}
                            className={`p-2 rounded-lg flex items-center justify-between cursor-pointer transition-colors text-xs ${
                              isSelected
                                ? 'bg-cp-gold/15 text-cp-gold border border-cp-gold/30'
                                : 'hover:bg-cp-elevated text-cp-text-secondary'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isSelected ? (
                                <CheckSquare className="w-3.5 h-3.5 text-cp-gold shrink-0" />
                              ) : (
                                <Square className="w-3.5 h-3.5 text-cp-text-muted shrink-0" />
                              )}
                              <span className="font-semibold text-cp-text-primary">{u.name}</span>
                              <span className="text-[10px] text-cp-text-muted">({u.email})</span>
                            </div>
                            <span className="text-[10px] font-mono text-cp-text-muted">{u.userRef}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Notification Category & Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-cp-text-secondary block uppercase text-[10px] mb-1">
                      Notification Category *
                    </label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as any)}
                      className="w-full bg-[#141d2b] border border-cp-border rounded-xl px-3 py-2 text-cp-text-primary text-xs focus:outline-none focus:border-cp-gold capitalize"
                    >
                      <option value="deposit">Deposit-Related Notification</option>
                      <option value="kyc">KYC Approval or Rejection</option>
                      <option value="trading">Trading-Related Announcement</option>
                      <option value="account">Account-Related Alert</option>
                      <option value="security">Security Advisory</option>
                      <option value="system">General System Update</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-cp-text-secondary block uppercase text-[10px] mb-1">
                      Priority Level
                    </label>
                    <select
                      value={formPriority}
                      onChange={(e) => setFormPriority(e.target.value as any)}
                      className="w-full bg-[#141d2b] border border-cp-border rounded-xl px-3 py-2 text-cp-text-primary text-xs focus:outline-none focus:border-cp-gold capitalize font-mono"
                    >
                      <option value="normal">Normal (Standard Inbox)</option>
                      <option value="high">High (Elevated Badge)</option>
                      <option value="urgent">Urgent (Highlighted Alert)</option>
                    </select>
                  </div>
                </div>

                {/* 3. Notification Title */}
                <div>
                  <label className="font-bold text-cp-text-secondary block uppercase text-[10px] mb-1">
                    Notification Subject / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Deposit Channel Upgrade / KYC Verification Approved"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-[#141d2b] border border-cp-border rounded-xl px-3 py-2 text-cp-text-primary text-xs focus:outline-none focus:border-cp-gold font-medium"
                  />
                </div>

                {/* 4. Notification Message */}
                <div>
                  <label className="font-bold text-cp-text-secondary block uppercase text-[10px] mb-1">
                    Notification Message Body *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write detailed notification message delivered to user panels..."
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    className="w-full bg-[#141d2b] border border-cp-border rounded-xl p-3 text-cp-text-primary text-xs focus:outline-none focus:border-cp-gold leading-relaxed"
                  />
                </div>

                {/* 5. Optional Call-To-Action Link */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-cp-text-secondary block uppercase text-[10px] mb-1">
                      Button Label (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. View Deposit Page / Go to KYC"
                      value={formLinkText}
                      onChange={(e) => setFormLinkText(e.target.value)}
                      className="w-full bg-[#141d2b] border border-cp-border rounded-xl px-3 py-2 text-cp-text-primary text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-cp-text-secondary block uppercase text-[10px] mb-1">
                      Target Route URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. /deposit, /kyc, /orders, /trade"
                      value={formLinkHref}
                      onChange={(e) => setFormLinkHref(e.target.value)}
                      className="w-full bg-[#141d2b] border border-cp-border rounded-xl px-3 py-2 text-cp-text-primary text-xs font-mono focus:outline-none"
                    />
                  </div>
                </div>

                {/* Live Client Preview Box */}
                {formTitle && (
                  <div className="p-3.5 rounded-xl bg-cp-elevated/40 border border-cp-gold/30 space-y-1.5 animate-fadeIn">
                    <span className="text-[10px] text-cp-gold uppercase font-bold tracking-wider block">
                      Live User Panel Preview:
                    </span>
                    <div className="p-3 rounded-lg bg-[#0c121c] border border-cp-border space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cp-text-primary text-xs">{formTitle}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold bg-cp-gold/20 text-cp-gold">
                          {formType}
                        </span>
                      </div>
                      <p className="text-[11px] text-cp-text-secondary leading-relaxed">{formMessage}</p>
                      {formLinkText && (
                        <div className="pt-1">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cp-gold underline">
                            <span>{formLinkText}</span>
                            <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-cp-border">
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => setIsComposerOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Dispatching...' : 'Dispatch Notification'}</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. INSPECTION DRAWER MODAL */}
      {/* ========================================================================= */}
      {selectedDispatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedDispatch(null)} />

          <div className="relative w-full max-w-lg bg-[#0c121c] border border-cp-border rounded-2xl shadow-2xl p-6 z-10 animate-fadeIn space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-cp-border pb-3">
              <div>
                <span className="text-[10px] text-cp-gold uppercase font-bold block">
                  Dispatched Notification Inspection
                </span>
                <h3 className="text-base font-bold text-cp-text-primary mt-0.5">
                  {selectedDispatch.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDispatch(null)}
                className="p-1 rounded-lg text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-cp-elevated/40 border border-cp-border space-y-2">
                <span className="text-[10px] text-cp-text-muted uppercase font-bold block">
                  Delivered Message Content
                </span>
                <p className="text-cp-text-primary leading-relaxed text-xs">
                  {selectedDispatch.message}
                </p>
                {selectedDispatch.linkText && (
                  <div className="pt-1.5 border-t border-cp-border/40 text-[11px] text-cp-gold flex items-center gap-1 font-semibold">
                    <span>Target Route:</span>
                    <span className="font-mono text-cp-text-secondary">
                      {selectedDispatch.linkHref || 'N/A'} ({selectedDispatch.linkText})
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#141d2b] border border-cp-border">
                  <span className="text-[10px] text-cp-text-muted uppercase block">Category / Type</span>
                  <span className="font-bold text-cp-text-primary mt-0.5 block uppercase">
                    {selectedDispatch.type}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#141d2b] border border-cp-border">
                  <span className="text-[10px] text-cp-text-muted uppercase block">Priority Level</span>
                  <span className="font-bold text-cp-text-primary mt-0.5 block uppercase font-mono">
                    {selectedDispatch.priority}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#141d2b] border border-cp-border col-span-2">
                  <span className="text-[10px] text-cp-text-muted uppercase block">Target Recipients</span>
                  <span className="font-bold text-cp-gold mt-0.5 block">
                    {selectedDispatch.targetSummary}
                  </span>
                  <span className="text-[10px] text-cp-text-muted font-mono block mt-0.5">
                    Delivered to {selectedDispatch.targetCount} inbox(es)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#141d2b] border border-cp-border col-span-2">
                  <span className="text-[10px] text-cp-text-muted uppercase block">Dispatched By Administrator</span>
                  <span className="text-cp-text-primary font-medium mt-0.5 block">
                    {selectedDispatch.adminName} ({selectedDispatch.adminEmail})
                  </span>
                  <span className="text-[10px] text-cp-text-muted font-mono block mt-0.5">
                    Timestamp: {selectedDispatch.createdAt}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-cp-border">
              <Button
                variant="outline"
                size="sm"
                className="text-cp-negative border-cp-negative/30 hover:bg-cp-negative/10"
                onClick={() => handleDeleteDispatch(selectedDispatch.id)}
              >
                Delete Dispatch
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedDispatch(null)}>
                Close Drawer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminNotifications

