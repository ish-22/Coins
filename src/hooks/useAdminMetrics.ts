import { useState, useEffect, useCallback } from 'react'
import { adminService } from '@/services/adminService'

export interface AdminMetricsData {
  totalUsers: number
  verifiedUsers?: number
  unverifiedUsers?: number
  activeUsers24h?: number
  pendingKycCount: number
  pendingKycApplications?: number
  totalDepositsUsd?: number
  pendingDepositsCount: number
  pendingWithdrawalsCount?: number
  openTicketsCount: number
  totalSupportConversations?: number
  matchingEngineStatus?: string
  lastUpdatedAt?: string
}

const CACHE_KEY = 'cp_admin_metrics_cache'

// Module-level singleton state to prevent duplicate requests
let cachedMetrics: AdminMetricsData | null = null
try {
  const stored = localStorage.getItem(CACHE_KEY)
  if (stored) cachedMetrics = JSON.parse(stored)
} catch {}

const listeners = new Set<(metrics: AdminMetricsData) => void>()

function broadcastMetrics(data: AdminMetricsData) {
  cachedMetrics = data
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {}
  listeners.forEach((listener) => listener(data))
}

export function useAdminMetrics() {
  const [metrics, setMetrics] = useState<AdminMetricsData>(() => {
    return (
      cachedMetrics ?? {
        totalUsers: 4,
        pendingKycCount: 1,
        openTicketsCount: 4,
        pendingDepositsCount: 0,
        pendingWithdrawalsCount: 0,
      }
    )
  })
  const [isLoading, setIsLoading] = useState(false)

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await adminService.getMetrics()
      if (res) {
        const normalized: AdminMetricsData = {
          totalUsers: Number(res.totalUsers ?? 4),
          verifiedUsers: Number(res.verifiedUsers ?? 0),
          unverifiedUsers: Number(res.unverifiedUsers ?? 0),
          activeUsers24h: Number(res.activeUsers24h ?? res.totalUsers ?? 4),
          pendingKycCount: Number(res.pendingKycCount ?? res.pendingKycApplications ?? 0),
          pendingDepositsCount: Number(res.pendingDepositsCount ?? 0),
          pendingWithdrawalsCount: Number(res.pendingWithdrawalsCount ?? 0),
          openTicketsCount: Number(res.openTicketsCount ?? 0),
          totalSupportConversations: Number(res.totalSupportConversations ?? 0),
          matchingEngineStatus: res.matchingEngineStatus ?? 'Operational',
          lastUpdatedAt: res.lastUpdatedAt ?? new Date().toISOString(),
        }
        broadcastMetrics(normalized)
      }
    } catch (err) {
      // Keep existing state on error
      console.warn('Failed to load admin metrics:', err)
    }
  }, [])

  useEffect(() => {
    // Subscribe to shared state updates
    const listener = (data: AdminMetricsData) => setMetrics(data)
    listeners.add(listener)

    // Initial fetch
    fetchMetrics()

    // Background polling every 12 seconds
    const interval = setInterval(fetchMetrics, 12000)

    // Listen to manual trigger events
    const handleCustomRefresh = () => fetchMetrics()
    window.addEventListener('cp_admin_metrics_refresh', handleCustomRefresh)

    return () => {
      listeners.delete(listener)
      clearInterval(interval)
      window.removeEventListener('cp_admin_metrics_refresh', handleCustomRefresh)
    }
  }, [fetchMetrics])

  return {
    metrics,
    isLoading,
    refresh: fetchMetrics,
  }
}

