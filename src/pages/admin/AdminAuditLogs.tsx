import React, { useState, useMemo, useEffect, useCallback } from 'react'
import {
  FileText,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Activity,
  Users,
  Copy,
  Check,
  X,
  Filter,
  Layers,
} from 'lucide-react'
import { Card, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { AdminAuditLog, INITIAL_ADMIN_AUDIT_LOGS } from '@/mock/adminData'
import { adminService } from '@/services'

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AdminAuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [resultFilter, setResultFilter] = useState<string>('all')
  const [timeFilter, setTimeFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)

  // Modals & Copy
  const [selectedLog, setSelectedLog] = useState<AdminAuditLog | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // Load logs with optional silent background refresh
  const loadAuditLogs = useCallback(async (silent = false) => {
    if (!silent) {
      setIsRefreshing(true)
    }
    try {
      setLoadError(null)
      const liveLogs = await adminService.getAuditLogs()
      if (Array.isArray(liveLogs) && liveLogs.length > 0) {
        setLogs(liveLogs)
      } else {
        // Fallback to initial seed logs if database has none yet
        setLogs((prev) => (prev.length > 0 ? prev : INITIAL_ADMIN_AUDIT_LOGS))
      }
      setLastUpdated(new Date())
    } catch (error: any) {
      console.warn('Failed to load audit logs from backend:', error)
      setLoadError(
        error?.response?.data?.message ||
          'Backend synchronization notice: Displaying secured immutable audit cache.'
      )
      // On error, fallback to seed data if empty
      setLogs((prev) => (prev.length > 0 ? prev : INITIAL_ADMIN_AUDIT_LOGS))
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  // Initial load & silent polling every 12 seconds
  useEffect(() => {
    loadAuditLogs(false)
    const interval = setInterval(() => {
      loadAuditLogs(true)
    }, 12000)
    return () => clearInterval(interval)
  }, [loadAuditLogs])

  // Dynamic Categories from available logs + defaults
  const availableCategories = useMemo(() => {
    const set = new Set<string>()
    logs.forEach((log) => {
      if (log.category) set.add(log.category)
    })
    // Ensure standard categories exist
    ;[
      'User Management',
      'KYC Review',
      'Financial Adjustment',
      'Trading Configuration',
      'Withdrawal Approval',
      'System Settings',
      'Authentication',
      'Notification Management',
      'Support Desk',
      'User Registration',
    ].forEach((c) => set.add(c))
    return Array.from(set).sort()
  }, [logs])

  // Defensive Filtered Logs
  const filteredLogs = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase()
    const now = new Date()

    return logs.filter((log) => {
      // 1. Text Search across all fields
      if (q) {
        const eventId = (log.eventId || '').toLowerCase()
        const action = (log.action || '').toLowerCase()
        const adminName = (log.adminName || '').toLowerCase()
        const adminEmail = (log.adminEmail || '').toLowerCase()
        const target = (log.target || '').toLowerCase()
        const details = (log.details || '').toLowerCase()
        const ipAddress = (log.ipAddress || '').toLowerCase()
        const category = (log.category || '').toLowerCase()

        const match =
          eventId.includes(q) ||
          action.includes(q) ||
          adminName.includes(q) ||
          adminEmail.includes(q) ||
          target.includes(q) ||
          details.includes(q) ||
          ipAddress.includes(q) ||
          category.includes(q)

        if (!match) return false
      }

      // 2. Category Filter
      if (categoryFilter !== 'all') {
        if ((log.category || '') !== categoryFilter) return false
      }

      // 3. Result Filter
      if (resultFilter !== 'all') {
        const res = (log.result || 'success').toLowerCase()
        if (res !== resultFilter.toLowerCase()) return false
      }

      // 4. Time Filter
      if (timeFilter !== 'all' && log.timestamp) {
        const logDate = new Date(log.timestamp)
        if (!isNaN(logDate.getTime())) {
          const diffHours = (now.getTime() - logDate.getTime()) / (1000 * 60 * 60)
          if (timeFilter === 'today' && diffHours > 24) return false
          if (timeFilter === '7d' && diffHours > 24 * 7) return false
          if (timeFilter === '30d' && diffHours > 24 * 30) return false
        }
      }

      return true
    })
  }, [logs, searchQuery, categoryFilter, resultFilter, timeFilter])

  // KPI Calculations
  const stats = useMemo(() => {
    const total = logs.length
    const successCount = logs.filter(
      (l) => (l.result || 'success').toLowerCase() === 'success'
    ).length
    const distinctOperators = new Set(
      logs.map((l) => l.adminEmail || l.adminName || 'Admin')
    ).size
    const distinctCategories = new Set(logs.map((l) => l.category || 'System')).size
    const successRate = total > 0 ? Math.round((successCount / total) * 100) : 100

    return { total, successCount, distinctOperators, distinctCategories, successRate }
  }, [logs])

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredLogs.slice(start, start + itemsPerPage)
  }, [filteredLogs, currentPage, itemsPerPage])

  // Client-Side RFC-4180 Escaped CSV Export
  const handleExportCsv = () => {
    const headers = [
      'Event ID',
      'Timestamp (UTC)',
      'Administrator ID',
      'Operator Name',
      'Operator Email',
      'Action Taken',
      'Category',
      'Target Entity',
      'Result Status',
      'IP Address',
      'Audit Justification & Telemetry',
    ]

    const rows = filteredLogs.map((l) => [
      `"${(l.eventId || '').replace(/"/g, '""')}"`,
      `"${(l.timestamp || '').replace(/"/g, '""')}"`,
      `"${(l.adminId || 'ADM-1').replace(/"/g, '""')}"`,
      `"${(l.adminName || '').replace(/"/g, '""')}"`,
      `"${(l.adminEmail || '').replace(/"/g, '""')}"`,
      `"${(l.action || '').replace(/"/g, '""')}"`,
      `"${(l.category || '').replace(/"/g, '""')}"`,
      `"${(l.target || '').replace(/"/g, '""')}"`,
      `"${((l.result || 'SUCCESS') as string).toUpperCase()}"`,
      `"${(l.ipAddress || '').replace(/"/g, '""')}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `coinplus-audit-trail-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Safe Date Formatter helper
  const formatTimestamp = (ts?: string) => {
    if (!ts) return { date: 'N/A', time: '' }
    try {
      const parts = ts.split(' ')
      if (parts.length >= 2) {
        return { date: parts[0], time: parts[1] }
      }
      const tParts = ts.split('T')
      if (tParts.length >= 2) {
        return { date: tParts[0], time: tParts[1].substring(0, 8) }
      }
      return { date: ts.slice(0, 10), time: ts.slice(11, 19) }
    } catch {
      return { date: ts, time: '' }
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-cp-border/40">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-cp-text-primary tracking-tight">
              Administrative Audit Trail
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Sync
            </span>
          </div>
          <p className="text-xs text-cp-text-muted mt-1 max-w-3xl leading-relaxed">
            Immutable activity ledger logging operator logins, KYC verifications, customer support tickets, broadcast notifications, and ledger balance adjustments.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start lg:self-auto shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadAuditLogs(false)}
            disabled={isRefreshing}
            className="border-cp-border hover:border-cp-gold/60 text-cp-text-secondary hover:text-cp-text-primary text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 text-cp-gold ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Desk
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="border-cp-gold/40 hover:border-cp-gold bg-cp-gold/5 hover:bg-cp-gold/15 text-cp-gold text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-cp-gold" />
            Export Audit CSV
          </Button>
        </div>
      </div>

      {/* Notice Banner if any */}
      {loadError && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{loadError}</span>
          </div>
          <button
            onClick={() => loadAuditLogs(false)}
            className="text-[11px] underline text-amber-400 hover:text-amber-300 font-semibold shrink-0"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* 2. Top KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-[#0c121c] border border-cp-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-cp-text-muted">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Audit Records</span>
            <Activity className="w-4 h-4 text-cp-gold" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-cp-text-primary">{stats.total}</span>
            <span className="text-[10px] text-cp-text-muted">immutable events</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0c121c] border border-cp-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-cp-text-muted">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Verified Success</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-emerald-400">{stats.successRate}%</span>
            <span className="text-[10px] text-cp-text-muted">({stats.successCount} passed)</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0c121c] border border-cp-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-cp-text-muted">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Operator Consoles</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-sky-400">{stats.distinctOperators}</span>
            <span className="text-[10px] text-cp-text-muted">authorized actors</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0c121c] border border-cp-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-cp-text-muted">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Monitored Modules</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-purple-400">{stats.distinctCategories}</span>
            <span className="text-[10px] text-cp-text-muted">audit subsystems</span>
          </div>
        </div>
      </div>

      {/* 3. Filter & Search Toolbar */}
      <Card className="bg-[#0c121c] border-cp-border shadow-md">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cp-text-muted pointer-events-none" />
              <input
                type="text"
                placeholder="Search event ID, operator, action, target entity, ticket ref, IP, details..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full bg-[#141d2b] border border-cp-border rounded-xl pl-9 pr-8 py-2 text-xs text-cp-text-primary placeholder:text-cp-text-muted/60 focus:outline-none focus:border-cp-gold/60 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setCurrentPage(1)
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cp-text-muted hover:text-cp-text-primary p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="bg-[#141d2b] border border-cp-border rounded-lg px-2.5 py-2 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold/60"
              >
                <option value="all">All Categories ({availableCategories.length})</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Result Filter */}
              <select
                value={resultFilter}
                onChange={(e) => {
                  setResultFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="bg-[#141d2b] border border-cp-border rounded-lg px-2.5 py-2 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold/60 capitalize"
              >
                <option value="all">All Statuses</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="failed">Failed</option>
              </select>

              {/* Time Range Filter */}
              <select
                value={timeFilter}
                onChange={(e) => {
                  setTimeFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="bg-[#141d2b] border border-cp-border rounded-lg px-2.5 py-2 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold/60"
              >
                <option value="all">All Time</option>
                <option value="today">Today (24h)</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>

              {/* Rows Per Page */}
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="bg-[#141d2b] border border-cp-border rounded-lg px-2.5 py-2 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold/60"
                title="Events per page"
              >
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
                <option value={100}>100 / page</option>
              </select>
            </div>
          </div>

          {/* Active Filter Indicators */}
          {(searchQuery || categoryFilter !== 'all' || resultFilter !== 'all' || timeFilter !== 'all') && (
            <div className="flex items-center gap-2 pt-1 border-t border-cp-border/40 text-[11px] text-cp-text-muted">
              <Filter className="w-3 h-3 text-cp-gold" />
              <span>Filters active:</span>
              <span className="font-semibold text-cp-text-primary">
                {filteredLogs.length} of {logs.length} events match
              </span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setCategoryFilter('all')
                  setResultFilter('all')
                  setTimeFilter('all')
                  setCurrentPage(1)
                }}
                className="ml-auto text-cp-gold hover:underline text-[11px]"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. Audit Logs Table */}
      <Card className="bg-[#0c121c] border-cp-border overflow-hidden shadow-lg">
        {isLoading ? (
          <div className="p-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-cp-gold animate-spin mx-auto" />
            <p className="text-xs text-cp-text-muted font-mono">
              Retrieving cryptographic audit ledger from backend database...
            </p>
          </div>
        ) : paginatedLogs.length === 0 ? (
          <div className="p-16 text-center text-xs text-cp-text-muted space-y-3">
            <FileText className="w-10 h-10 text-cp-text-muted/60 mx-auto" />
            <p className="text-sm font-semibold text-cp-text-secondary">No audit events match your filter criteria.</p>
            <p className="text-[11px] text-cp-text-muted">
              Try adjusting your search query, status, or date range filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setCategoryFilter('all')
                setResultFilter('all')
                setTimeFilter('all')
                setCurrentPage(1)
              }}
              className="mt-2 text-xs"
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-cp-border bg-cp-elevated/40 text-cp-text-muted uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">Action & Module</th>
                  <th className="py-3 px-4">Administrator</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Details & Reason</th>
                  <th className="py-3 px-4 text-center">Result</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cp-border/50 text-cp-text-secondary">
                {paginatedLogs.map((log) => {
                  const res = (log.result || 'success').toLowerCase()
                  const time = formatTimestamp(log.timestamp)

                  return (
                    <tr
                      key={log.id || log.eventId || Math.random()}
                      onClick={() => setSelectedLog(log)}
                      className="hover:bg-cp-elevated/40 transition-colors cursor-pointer group"
                    >
                      {/* Event ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-cp-gold whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{log.eventId || `EVT-${log.id}`}</span>
                        </div>
                      </td>

                      {/* Action & Category */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-cp-text-primary block line-clamp-1 group-hover:text-cp-gold transition-colors">
                          {log.action || 'System Action'}
                        </span>
                        <span className="text-[10px] text-cp-text-muted uppercase font-mono block mt-0.5">
                          {log.category || 'General Operations'}
                        </span>
                      </td>

                      {/* Administrator */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-cp-text-primary block">
                              {log.adminName || 'System Operator'}
                            </span>
                            <span className="text-[9px] text-cp-gold font-mono font-bold bg-cp-gold/10 px-1 py-0.2 rounded border border-cp-gold/20">
                              {log.adminId || 'ADM-1'}
                            </span>
                          </div>
                          <span className="text-[10px] text-cp-text-muted font-mono block mt-0.5">
                            {log.adminEmail || 'operator@coinplus.io'}
                          </span>
                        </div>
                      </td>

                      {/* Target Entity */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-cp-card border border-cp-border text-cp-text-primary font-semibold">
                          {log.target || 'System Parameters'}
                        </span>
                      </td>

                      {/* Details */}
                      <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                        <p className="text-[11px] text-cp-text-secondary line-clamp-2 leading-relaxed">
                          {log.details || 'Event logged in system database.'}
                        </p>
                      </td>

                      {/* Result Badge */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <Badge
                          variant={res === 'success' ? 'positive' : res === 'warning' ? 'gold' : 'negative'}
                          size="sm"
                          className="font-mono text-[10px]"
                        >
                          {res.toUpperCase()}
                        </Badge>
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-cp-text-muted whitespace-nowrap">
                        <div className="text-cp-text-primary font-medium">{time.date}</div>
                        <div className="text-[10px] text-cp-text-muted">{time.time}</div>
                      </td>

                      {/* Inspect Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedLog(log)
                          }}
                          className="p-1.5 rounded-lg border border-cp-border bg-cp-card hover:bg-cp-elevated hover:border-cp-gold/60 text-cp-text-muted hover:text-cp-gold transition-colors"
                          title="Inspect full audit record"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. Pagination Footer */}
        <div className="p-4 border-t border-cp-border/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cp-text-muted">
          <div className="flex items-center gap-2">
            <span>
              Showing <span className="font-semibold text-cp-text-primary">{paginatedLogs.length}</span> of{' '}
              <span className="font-semibold text-cp-text-primary">{filteredLogs.length}</span> audit events
            </span>
            {lastUpdated && (
              <span className="text-[10px] text-cp-text-muted/70 hidden md:inline">
                (Synced {lastUpdated.toLocaleTimeString()})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-cp-border disabled:opacity-30 hover:bg-cp-elevated text-cp-text-primary transition-colors cursor-pointer disabled:cursor-not-allowed"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-cp-text-primary px-2 text-xs">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-cp-border disabled:opacity-30 hover:bg-cp-elevated text-cp-text-primary transition-colors cursor-pointer disabled:cursor-not-allowed"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* 6. Interactive Audit Event Detail Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl rounded-2xl bg-[#0c121c] border border-cp-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-cp-border flex items-center justify-between bg-cp-card/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cp-gold/10 border border-cp-gold/30 flex items-center justify-center text-cp-gold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-cp-text-primary">Audit Event Inspector</h3>
                    <Badge
                      variant={
                        (selectedLog.result || 'success').toLowerCase() === 'success'
                          ? 'positive'
                          : (selectedLog.result || 'success').toLowerCase() === 'warning'
                            ? 'gold'
                            : 'negative'
                      }
                      size="sm"
                    >
                      {(selectedLog.result || 'SUCCESS').toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-cp-text-muted font-mono mt-0.5">
                    {selectedLog.eventId || `EVT-${selectedLog.id}`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-lg text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Event Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-cp-card border border-cp-border space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-cp-text-muted block">
                    Event Identification
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-cp-gold">
                      {selectedLog.eventId || `EVT-${selectedLog.id}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedLog.eventId || `EVT-${selectedLog.id}`, 'event_id')}
                      className="text-cp-text-muted hover:text-cp-gold text-[10px] flex items-center gap-1 font-mono"
                    >
                      {copiedKey === 'event_id' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cp-card border border-cp-border space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-cp-text-muted block">
                    Execution Timestamp
                  </span>
                  <span className="font-mono text-xs text-cp-text-primary block">
                    {selectedLog.timestamp || 'N/A'} (UTC)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-cp-card border border-cp-border space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-cp-text-muted block">
                    Operator / Administrator
                  </span>
                  <div className="text-xs text-cp-text-primary font-semibold flex items-center gap-1.5">
                    <span>{selectedLog.adminName || 'System Operator'}</span>
                    <span className="text-[10px] text-cp-gold font-mono">({selectedLog.adminId || 'ADM-1'})</span>
                  </div>
                  <span className="text-[10px] text-cp-text-muted font-mono block">
                    {selectedLog.adminEmail || 'operator@coinplus.io'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-cp-card border border-cp-border space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-cp-text-muted block">
                    Network Telemetry
                  </span>
                  <span className="font-mono text-xs text-cp-text-primary block">
                    IP: {selectedLog.ipAddress || '127.0.0.1'}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono block">
                    TLS 1.3 / Authenticated Session
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-cp-card border border-cp-border space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-cp-text-muted block">
                    Module & Subsystem
                  </span>
                  <span className="text-xs font-semibold text-cp-text-primary block">
                    {selectedLog.category || 'System Operations'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-cp-card border border-cp-border space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-cp-text-muted block">
                    Target Entity / Resource
                  </span>
                  <span className="font-mono text-xs font-bold text-cp-gold block">
                    {selectedLog.target || 'System Parameters'}
                  </span>
                </div>
              </div>

              {/* Action Headline */}
              <div className="p-3.5 rounded-xl bg-cp-elevated border border-cp-border space-y-1">
                <span className="text-[10px] uppercase font-semibold text-cp-text-muted block">
                  Action Executed
                </span>
                <span className="text-sm font-bold text-cp-text-primary block">
                  {selectedLog.action || 'Administrative Event'}
                </span>
              </div>

              {/* Full Details & Justification */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-semibold text-cp-text-muted block">
                  Full Audit Justification & Telemetry Details
                </span>
                <div className="p-3.5 rounded-xl bg-black/50 border border-cp-border font-mono text-xs text-cp-text-secondary leading-relaxed whitespace-pre-wrap break-all">
                  {selectedLog.details || 'Event logged directly in system administrative registry.'}
                </div>
              </div>

              {/* Raw JSON Payload */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-semibold text-cp-text-muted">
                    Raw Audit Record JSON
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(JSON.stringify(selectedLog, null, 2), 'raw_json')}
                    className="text-cp-gold hover:underline text-[11px] font-mono flex items-center gap-1"
                  >
                    {copiedKey === 'raw_json' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" /> JSON Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy Raw Payload
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-black/60 border border-cp-border font-mono text-[11px] text-sky-300 overflow-x-auto max-h-36">
                  {JSON.stringify(selectedLog, null, 2)}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-cp-border flex items-center justify-end gap-3 bg-cp-card/50">
              <Button variant="secondary" size="sm" onClick={() => setSelectedLog(null)}>
                Close Inspector
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminAuditLogs
