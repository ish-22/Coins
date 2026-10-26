import React, { useState, useMemo, useEffect } from 'react'
import {
  FileText,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Card, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { AdminAuditLog } from '@/mock/adminData'
import { adminService } from '@/services'

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AdminAuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [resultFilter, setResultFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch =
        log.eventId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase())

      const matchCategory = categoryFilter === 'all' || log.category === categoryFilter
      const matchResult = resultFilter === 'all' || log.result === resultFilter

      return matchSearch && matchCategory && matchResult
    })
  }, [logs, searchQuery, categoryFilter, resultFilter])

  useEffect(() => {
    let isMounted = true
    const loadAuditLogs = async () => {
      try {
        setIsLoading(true)
        setLoadError(null)
        const liveLogs = await adminService.getAuditLogs()
        if (isMounted) setLogs(liveLogs)
      } catch (error: any) {
        if (isMounted) {
          setLoadError(error?.response?.data?.message || 'Unable to load audit trails from the backend.')
          setLogs([])
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadAuditLogs()
    return () => {
      isMounted = false
    }
  }, [])

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Client-Side CSV Export
  const handleExportCsv = () => {
    const headers = ['Event ID', 'Timestamp', 'Operator', 'Action', 'Category', 'Target', 'Result', 'IP Address', 'Details']
    const rows = filteredLogs.map((l) => [
      l.eventId,
      l.timestamp,
      `"${l.adminName} (${l.adminEmail})"`,
      `"${l.action}"`,
      `"${l.category}"`,
      `"${l.target}"`,
      l.result.toUpperCase(),
      l.ipAddress,
      `"${l.details.replace(/"/g, '""')}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `coinplus-audit-logs-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-cp-text-primary tracking-tight">
            Administrative Audit Trail
          </h1>
          <p className="text-xs text-cp-text-muted mt-0.5">
            Immutable demonstration activity logs tracking operator logins, KYC decisions, and withdrawal authorisations
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleExportCsv}>
          <Download className="w-4 h-4 mr-1.5 text-cp-gold" />
          Export Audit CSV
        </Button>
      </div>

      {loadError && (
        <div className="p-3 rounded-xl bg-cp-negative/10 border border-cp-negative/30 text-xs text-cp-negative">
          {loadError}
        </div>
      )}

      {isLoading && (
        <div className="p-4 rounded-xl border border-cp-border bg-cp-card text-xs text-cp-text-muted">
          Loading audit trail from the database...
        </div>
      )}

      {/* Filter and Search Bar */}
      <Card className="bg-[#0c121c] border-cp-border">
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cp-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search by Event ID, action, administrator, target, or details..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full bg-[#141d2b] border border-cp-border rounded-xl pl-9 pr-3 py-2 text-xs text-cp-text-primary placeholder:text-cp-text-muted/60 focus:outline-none focus:border-cp-gold/60"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="bg-[#141d2b] border border-cp-border rounded-lg px-2.5 py-1.5 text-xs text-cp-text-primary focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="User Management">User Management</option>
              <option value="KYC Review">KYC Review</option>
              <option value="Withdrawal Approval">Withdrawal Approval</option>
              <option value="System Settings">System Settings</option>
              <option value="Authentication">Authentication</option>
            </select>

            {/* Result Filter */}
            <select
              value={resultFilter}
              onChange={(e) => {
                setResultFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="bg-[#141d2b] border border-cp-border rounded-lg px-2.5 py-1.5 text-xs text-cp-text-primary focus:outline-none capitalize"
            >
              <option value="all">All Results</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card className="bg-[#0c121c] border-cp-border overflow-hidden">
        {paginatedLogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-cp-text-muted space-y-2">
            <FileText className="w-8 h-8 text-cp-text-muted mx-auto" />
            <p>No audit events match your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-cp-border bg-cp-elevated/40 text-cp-text-muted uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">Action & Category</th>
                  <th className="py-3 px-4">Administrator</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">Result</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cp-border/50 text-cp-text-secondary">
                {paginatedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-cp-elevated/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-cp-gold">
                      {log.eventId}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-cp-text-primary block">{log.action}</span>
                      <span className="text-[10px] text-cp-text-muted uppercase font-mono block">
                        {log.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-cp-text-primary block">{log.adminName}</span>
                        <span className="text-[10px] text-cp-text-muted font-mono block">{log.adminEmail}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-cp-text-primary">
                      {log.target}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-[11px] text-cp-text-secondary line-clamp-2 leading-relaxed">
                        {log.details}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge
                        variant={log.result === 'success' ? 'positive' : log.result === 'warning' ? 'gold' : 'negative'}
                        size="sm"
                      >
                        {log.result.toUpperCase()}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-cp-text-muted">
                      <div>{log.timestamp.slice(0, 10)}</div>
                      <div className="text-[10px]">{log.timestamp.slice(11)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 border-t border-cp-border/80 flex items-center justify-between text-xs text-cp-text-muted">
          <span>
            Showing {paginatedLogs.length} of {filteredLogs.length} audit events
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-cp-border disabled:opacity-40 hover:bg-cp-elevated text-cp-text-primary"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-cp-text-primary">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-cp-border disabled:opacity-40 hover:bg-cp-elevated text-cp-text-primary"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default AdminAuditLogs
