import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  CheckCircle2,
  TrendingUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Megaphone,
  Check,
  Trash2,
  Search,
  X,
  Filter,
  Sliders,
  Sparkles,
  Info,
  Clock,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  BellOff,
  Mail,
  MailOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Typography } from '@/components/common/Typography'
import {
  NotificationItem,
  NotificationCategory,
  INITIAL_NOTIFICATIONS,
} from '@/mock/notificationsData'
import { DeleteNotificationModal } from '@/components/notifications'
import { notificationService } from '@/services/notificationService'

type TabType = 'all' | 'unread' | NotificationCategory

export const Notifications: React.FC = () => {
  // Live Notifications state loaded from backend API
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Active filter tab & search query
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6

  // Delete confirmation modal state
  const [deleteModalConfig, setDeleteModalConfig] = useState<{
    isOpen: boolean
    notification: NotificationItem | null
    isClearAll: boolean
  }>({
    isOpen: false,
    notification: null,
    isClearAll: false,
  })

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Fetch notifications from backend API
  const loadNotifications = () => {
    setIsLoading(true)
    notificationService.getNotifications()
      .then((data) => {
        if (data && Array.isArray(data)) {
          setNotifications(data)
        }
      })
      .catch(() => {
        // Fallback gracefully to empty state
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  // Count unread
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  )

  // Toggle single read status
  const handleToggleRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    )

    try {
      await notificationService.toggleRead(id)
    } catch {
      // Local fallback kept
    }
  }

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    triggerToast('All notifications marked as read.')

    try {
      await notificationService.markAllAsRead()
    } catch {
      // Handled
    }
  }

  // Prompt delete single
  const handlePromptDelete = (notification: NotificationItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setDeleteModalConfig({
      isOpen: true,
      notification,
      isClearAll: false,
    })
  }

  // Prompt clear all read
  const handlePromptClearAllRead = () => {
    setDeleteModalConfig({
      isOpen: true,
      notification: null,
      isClearAll: true,
    })
  }

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (deleteModalConfig.isClearAll) {
      setNotifications((prev) => prev.filter((n) => !n.isRead))
      triggerToast('All read notifications removed.')
      try {
        await notificationService.clearAllRead()
      } catch {
        // Handled
      }
    } else if (deleteModalConfig.notification) {
      const idToDelete = deleteModalConfig.notification.id
      setNotifications((prev) => prev.filter((n) => n.id !== idToDelete))
      triggerToast('Notification deleted.')
      try {
        await notificationService.deleteNotification(idToDelete)
      } catch {
        // Handled
      }
    }
    setDeleteModalConfig({ isOpen: false, notification: null, isClearAll: false })
  }

  // Filtered dataset
  const filteredNotifications = useMemo(() => {
    let result = [...notifications]

    // Category / Unread Tab Filter
    if (activeTab === 'unread') {
      result = result.filter((n) => !n.isRead)
    } else if (activeTab !== 'all') {
      result = result.filter((n) => n.category === activeTab)
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (n) => n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q)
      )
    }

    return result
  }, [notifications, activeTab, searchQuery])

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, filteredNotifications.length)
  const paginatedNotifications = useMemo(
    () => filteredNotifications.slice(startIndex, endIndex),
    [filteredNotifications, startIndex, endIndex]
  )

  // Reset to original mock records
  const handleResetDemo = () => {
    setNotifications(INITIAL_NOTIFICATIONS)
    try {
      localStorage.removeItem('cp_notifications_list')
    } catch {
      // ignore
    }
    setActiveTab('all')
    setSearchQuery('')
    setCurrentPage(1)
    triggerToast('Restored default demonstration notification records.')
  }

  // Category Icon & Color Helper
  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'trading':
        return <TrendingUp className="w-4 h-4 text-cp-positive" />
      case 'transactions':
        return <ArrowDownToLine className="w-4 h-4 text-cp-gold" />
      case 'security':
        return <ShieldAlert className="w-4 h-4 text-cp-negative" />
      case 'account':
        return <UserCheck className="w-4 h-4 text-sky-400" />
      case 'announcements':
        return <Megaphone className="w-4 h-4 text-purple-400" />
      default:
        return <Bell className="w-4 h-4 text-cp-gold" />
    }
  }

  const getCategoryBadgeVariant = (category: NotificationCategory) => {
    switch (category) {
      case 'trading':
        return 'positive'
      case 'transactions':
        return 'gold'
      case 'security':
        return 'negative'
      default:
        return 'neutral'
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-cp-elevated border border-cp-gold text-cp-text-primary shadow-2xl animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-cp-gold shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cp-text-primary">
              Notifications
            </h1>
            {unreadCount > 0 ? (
              <Badge variant="gold" size="sm" withDot pulseDot>
                {unreadCount} Unread
              </Badge>
            ) : (
              <Badge variant="positive" size="sm" withDot>
                All Caught Up
              </Badge>
            )}
          </div>
          <p className="text-sm text-cp-text-secondary">
            Stay informed about your order executions, transaction confirmations, security alerts, and system notices.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Check className="w-3.5 h-3.5" />}
            disabled={unreadCount === 0}
            onClick={handleMarkAllAsRead}
            className="border-cp-border hover:border-cp-gold text-xs h-8"
          >
            Mark All Read
          </Button>

          <Link to="/settings">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Sliders className="w-3.5 h-3.5" />}
              className="text-xs h-8"
            >
              Alert Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Demonstration Notice */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-cp-card/90 border border-cp-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cp-gold/10 border border-cp-gold/30 flex items-center justify-center text-cp-gold shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div className="text-xs text-cp-text-secondary">
            <span className="font-semibold text-cp-text-primary">Simulated Activity:</span> All notifications,
            deposit alerts, and order execution events are generated for platform demonstration. No actual emails,
            SMS messages, or push alerts are sent to external devices.
          </div>
        </div>
        <button
          onClick={handleResetDemo}
          className="flex items-center gap-1.5 text-xs text-cp-gold hover:underline self-end sm:self-auto shrink-0 font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Records</span>
        </button>
      </div>

      {/* Main Container */}
      <Card className="border-cp-border bg-cp-card overflow-hidden shadow-card">
        {/* Navigation Tabs Bar */}
        <div className="border-b border-cp-border bg-cp-elevated/40 px-4 sm:px-6 pt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none pb-1 md:pb-0">
            {/* All */}
            <button
              onClick={() => {
                setActiveTab('all')
                setCurrentPage(1)
              }}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'all'
                  ? 'border-cp-gold text-cp-gold bg-cp-card shadow-sm'
                  : 'border-transparent text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-card/50'
              }`}
            >
              <span>All</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-cp-border text-cp-text-secondary">
                {notifications.length}
              </span>
            </button>

            {/* Unread */}
            <button
              onClick={() => {
                setActiveTab('unread')
                setCurrentPage(1)
              }}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'unread'
                  ? 'border-cp-gold text-cp-gold bg-cp-card shadow-sm'
                  : 'border-transparent text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-card/50'
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-cp-gold text-cp-bg font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Trading */}
            <button
              onClick={() => {
                setActiveTab('trading')
                setCurrentPage(1)
              }}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'trading'
                  ? 'border-cp-gold text-cp-gold bg-cp-card shadow-sm'
                  : 'border-transparent text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-card/50'
              }`}
            >
              <span>Trading</span>
            </button>

            {/* Transactions */}
            <button
              onClick={() => {
                setActiveTab('transactions')
                setCurrentPage(1)
              }}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'transactions'
                  ? 'border-cp-gold text-cp-gold bg-cp-card shadow-sm'
                  : 'border-transparent text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-card/50'
              }`}
            >
              <span>Transactions</span>
            </button>

            {/* Security */}
            <button
              onClick={() => {
                setActiveTab('security')
                setCurrentPage(1)
              }}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'security'
                  ? 'border-cp-gold text-cp-gold bg-cp-card shadow-sm'
                  : 'border-transparent text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-card/50'
              }`}
            >
              <span>Security</span>
            </button>

            {/* Account */}
            <button
              onClick={() => {
                setActiveTab('account')
                setCurrentPage(1)
              }}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'account'
                  ? 'border-cp-gold text-cp-gold bg-cp-card shadow-sm'
                  : 'border-transparent text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-card/50'
              }`}
            >
              <span>Account</span>
            </button>

            {/* Announcements */}
            <button
              onClick={() => {
                setActiveTab('announcements')
                setCurrentPage(1)
              }}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'announcements'
                  ? 'border-cp-gold text-cp-gold bg-cp-card shadow-sm'
                  : 'border-transparent text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-card/50'
              }`}
            >
              <span>Announcements</span>
            </button>
          </div>

          {/* Clear Read action button */}
          {notifications.some((n) => n.isRead) && (
            <div className="pb-2">
              <button
                type="button"
                onClick={handlePromptClearAllRead}
                className="text-xs text-cp-text-secondary hover:text-cp-negative transition-colors flex items-center gap-1 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Read</span>
              </button>
            </div>
          )}
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 border-b border-cp-border bg-cp-card/60 flex items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cp-text-secondary" />
            <input
              type="text"
              placeholder="Search notifications by title or keyword..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full bg-cp-elevated border border-cp-border rounded-lg pl-9 pr-8 py-2 text-xs text-cp-text-primary placeholder:text-cp-text-secondary/60 focus:outline-none focus:border-cp-gold transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cp-text-secondary hover:text-cp-text-primary"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs text-cp-text-secondary hidden sm:block">
            <span>
              Showing <strong className="text-cp-text-primary">{filteredNotifications.length}</strong> alerts
            </span>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          /* Empty State */
          <div className="py-16 px-4 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-cp-elevated border border-cp-border flex items-center justify-center mx-auto text-cp-text-secondary">
              <BellOff className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-cp-text-primary">No Notifications Found</h4>
            <p className="text-xs text-cp-text-secondary max-w-sm mx-auto">
              {searchQuery
                ? `No alerts match your search query "${searchQuery}".`
                : activeTab === 'unread'
                ? 'You have caught up with all your notifications. No unread alerts remaining.'
                : 'There are no notifications in this category.'}
            </p>
            {(searchQuery || activeTab !== 'all') && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setActiveTab('all')
                }}
              >
                View All Notifications
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-cp-border/50">
            {paginatedNotifications.map((notif) => {
              return (
                <div
                  key={notif.id}
                  onClick={() => !notif.isRead && handleToggleRead(notif.id)}
                  className={`p-4 sm:p-5 flex items-start gap-4 transition-colors group cursor-pointer ${
                    notif.isRead
                      ? 'bg-cp-card hover:bg-cp-elevated/40'
                      : 'bg-cp-elevated/70 hover:bg-cp-elevated border-l-4 border-l-cp-gold'
                  }`}
                >
                  {/* Category Icon Badge */}
                  <div className="w-10 h-10 rounded-xl bg-cp-card border border-cp-border flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    {getCategoryIcon(notif.category)}
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={getCategoryBadgeVariant(notif.category)}
                          size="sm"
                          className="capitalize text-[10px] px-1.5 py-0"
                        >
                          {notif.category}
                        </Badge>
                        {notif.priority === 'high' && (
                          <Badge variant="negative" size="sm" className="text-[10px] px-1.5 py-0">
                            Urgent
                          </Badge>
                        )}
                        <h4
                          className={`text-sm tracking-tight truncate ${
                            notif.isRead
                              ? 'text-cp-text-primary font-semibold'
                              : 'text-cp-text-primary font-extrabold text-cp-gold'
                          }`}
                        >
                          {notif.title}
                        </h4>
                      </div>

                      <span className="text-[11px] text-cp-text-secondary font-mono flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" />
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-cp-text-secondary leading-relaxed">
                      {notif.message}
                    </p>

                    {/* Contextual Link */}
                    {notif.linkHref && (
                      <div className="pt-1">
                        <Link
                          to={notif.linkHref}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs text-cp-gold hover:underline font-semibold"
                        >
                          <span>{notif.linkText || 'View Details'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Actions (Mark as Read & Delete) */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleToggleRead(notif.id, e)}
                      className={`p-2 rounded-lg transition-colors ${
                        notif.isRead
                          ? 'text-cp-text-secondary hover:text-cp-gold hover:bg-cp-card'
                          : 'text-cp-gold hover:bg-cp-card'
                      }`}
                      title={notif.isRead ? 'Mark as unread' : 'Mark as read'}
                    >
                      {notif.isRead ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handlePromptDelete(notif, e)}
                      className="p-2 rounded-lg text-cp-text-secondary hover:text-cp-negative hover:bg-cp-card transition-colors"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {filteredNotifications.length > pageSize && (
          <div className="p-4 border-t border-cp-border bg-cp-card/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cp-text-secondary">
            <span>
              Showing {startIndex + 1} - {endIndex} of {filteredNotifications.length} notifications
            </span>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="h-8 w-8 p-0 border-cp-border flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="px-3 font-semibold text-cp-text-primary">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="h-8 w-8 p-0 border-cp-border flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <DeleteNotificationModal
        isOpen={deleteModalConfig.isOpen}
        notification={deleteModalConfig.notification}
        isClearAll={deleteModalConfig.isClearAll}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModalConfig({ isOpen: false, notification: null, isClearAll: false })}
      />
    </div>
  )
}

export default Notifications
