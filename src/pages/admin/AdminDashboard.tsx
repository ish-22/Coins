import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  ShieldCheck,
  ArrowDownToLine,
  ArrowUpFromLine,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Zap,
  Server,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import {
  INITIAL_ADMIN_USERS,
  INITIAL_ADMIN_KYC_CASES,
  INITIAL_ADMIN_DEPOSITS,
  INITIAL_ADMIN_WITHDRAWALS,
  INITIAL_ADMIN_ORDERS,
  INITIAL_ADMIN_AUDIT_LOGS,
} from '@/mock/adminData'
import { formatUSD } from '@/utils/formatters'
import { adminService } from '@/services'

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null)

  useEffect(() => {
    adminService.getMetrics().then(res => {
      if (res?.metrics) setMetrics(res.metrics)
    }).catch(() => {})
  }, [])

  const pendingKycCount = metrics?.pendingKycCount ?? INITIAL_ADMIN_KYC_CASES.filter((c) => c.status === 'pending' || c.status === 'in_review').length
  const pendingWithdrawalCount = metrics?.pendingWithdrawalsCount ?? INITIAL_ADMIN_WITHDRAWALS.filter((w) => w.status === 'pending_review').length
  const pendingDepositCount = INITIAL_ADMIN_DEPOSITS.filter((d) => d.status === 'confirming' || d.status === 'pending').length
  const totalVolume24h = metrics?.volume24hUsd ?? (INITIAL_ADMIN_ORDERS.reduce((acc, curr) => acc + curr.totalUsd, 0) * 12)

  return (
    <div className="space-y-6">
      {/* Page Title & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-cp-text-primary tracking-tight">
            Administration Console
          </h1>
          <p className="text-xs text-cp-text-muted mt-0.5">
            Real-time demonstration monitoring, verification queues, and system telemetry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="positive" size="sm" className="px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cp-positive animate-pulse mr-1" />
            All Simulated Services Operational
          </Badge>
        </div>
      </div>

      {/* 1. TOP STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Users */}
        <Card className="bg-[#0c121c] border-cp-border">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cp-text-muted uppercase tracking-wider">
                Simulated Users
              </span>
              <div className="p-2 rounded-xl bg-cp-elevated text-cp-gold border border-cp-border">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black font-mono text-cp-text-primary block">
                1,420
              </span>
              <span className="text-[11px] text-cp-positive font-semibold flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3" />
                +14 new this week
              </span>
            </div>
          </CardContent>
        </Card>

        {/* KYC Queue */}
        <Card className="bg-[#0c121c] border-cp-border">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cp-text-muted uppercase tracking-wider">
                Pending KYC Cases
              </span>
              <div className="p-2 rounded-xl bg-cp-gold/15 text-cp-gold border border-cp-gold/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black font-mono text-cp-gold block">
                {pendingKycCount}
              </span>
              <span className="text-[11px] text-cp-text-muted mt-0.5 block">
                Requires operator verification
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal Queue */}
        <Card className="bg-[#0c121c] border-cp-border">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cp-text-muted uppercase tracking-wider">
                Withdrawal Queue
              </span>
              <div className="p-2 rounded-xl bg-cp-negative/15 text-cp-negative border border-cp-negative/30">
                <ArrowUpFromLine className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black font-mono text-cp-negative block">
                {pendingWithdrawalCount}
              </span>
              <span className="text-[11px] text-cp-text-muted mt-0.5 block">
                Pending risk authorization
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 24h Volume */}
        <Card className="bg-[#0c121c] border-cp-border">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cp-text-muted uppercase tracking-wider">
                Simulated 24h Volume
              </span>
              <div className="p-2 rounded-xl bg-cp-elevated text-cp-positive border border-cp-border">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black font-mono text-cp-text-primary block">
                {formatUSD(totalVolume24h)}
              </span>
              <span className="text-[11px] text-cp-positive font-semibold flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3" />
                +4.8% vs yesterday
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. ACTIVITY & TELEMETRY ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Illustrative Hourly Trading Activity (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="bg-[#0c121c] border-cp-border">
            <CardHeader className="border-b border-cp-border/80 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-cp-text-primary">
                    Illustrative Trading & Fill Activity
                  </CardTitle>
                  <p className="text-xs text-cp-text-muted mt-0.5">
                    Demonstration volume distribution across spot trading books
                  </p>
                </div>
                <Badge variant="gold" size="sm">
                  24-Hour Timeline
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              {/* Simulated SVG Activity Bar Chart */}
              <div className="h-44 w-full flex items-end gap-2 pt-4 px-2 border-b border-cp-border/60">
                {[
                  { hour: '00:00', val: 45 },
                  { hour: '02:00', val: 30 },
                  { hour: '04:00', val: 25 },
                  { hour: '06:00', val: 55 },
                  { hour: '08:00', val: 80 },
                  { hour: '10:00', val: 95 },
                  { hour: '12:00', val: 85 },
                  { hour: '14:00', val: 70 },
                  { hour: '16:00', val: 90 },
                  { hour: '18:00', val: 65 },
                  { hour: '20:00', val: 50 },
                  { hour: '22:00', val: 60 },
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                    <div
                      className="w-full bg-cp-gold/60 group-hover:bg-cp-gold rounded-t transition-all duration-200"
                      style={{ height: `${item.val}%` }}
                      title={`${item.hour}: $${item.val * 12000} volume (simulated)`}
                    />
                    <span className="text-[10px] text-cp-text-muted font-mono">{item.hour}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-cp-text-muted pt-2">
                <span>Total 24h Spot Orders: <strong>418</strong></span>
                <span>Active Pairs: <strong>184</strong></span>
                <span>Order Rejection Rate: <strong className="text-cp-positive">0.02%</strong></span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Administrative Events */}
          <Card className="bg-[#0c121c] border-cp-border">
            <CardHeader className="border-b border-cp-border/80 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-cp-text-primary">
                  Recent Administrative Events
                </CardTitle>
                <Link to="/admin/audit-logs" className="text-xs text-cp-gold hover:underline font-semibold">
                  View Full Audit Log →
                </Link>
              </div>
            </CardHeader>

            <CardContent className="p-0 divide-y divide-cp-border/60">
              {INITIAL_ADMIN_AUDIT_LOGS.slice(0, 4).map((log) => (
                <div key={log.id} className="p-4 hover:bg-cp-elevated/30 transition-colors flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-cp-text-primary">{log.action}</span>
                      <Badge
                        variant={log.result === 'success' ? 'positive' : log.result === 'warning' ? 'gold' : 'negative'}
                        size="sm"
                        className="text-[9px] py-0"
                      >
                        {log.result.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-cp-text-secondary">{log.details}</p>
                    <div className="flex items-center gap-2 text-[10px] text-cp-text-muted">
                      <span>By: {log.adminName}</span>
                      <span>•</span>
                      <span>Target: {log.target}</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-cp-text-muted font-mono shrink-0">
                    {log.timestamp.slice(11)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: Health Telemetry & Action Shortcuts (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* System Health Indicators */}
          <Card className="bg-[#0c121c] border-cp-border">
            <CardHeader className="border-b border-cp-border/80 pb-3">
              <CardTitle className="text-base font-bold text-cp-text-primary flex items-center gap-2">
                <Server className="w-4 h-4 text-cp-gold" />
                System Health Indicators
              </CardTitle>
            </CardHeader>

            <CardContent className="p-5 space-y-3.5 text-xs">
              {[
                { name: 'WebSocket Price Feeds', latency: '18ms', status: 'Optimal' },
                { name: 'Spot Matching Engine', latency: '12ms', status: 'Optimal' },
                { name: 'KYC Document OCR Queue', latency: '120ms', status: 'Normal' },
                { name: 'Deposit Confirmation Tracker', latency: '35ms', status: 'Optimal' },
                { name: 'FIDO2 Passkey Vault', latency: '22ms', status: 'Optimal' },
              ].map((sub, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-cp-elevated/40 border border-cp-border">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-cp-text-primary block">{sub.name}</span>
                    <span className="text-[10px] font-mono text-cp-text-muted">Latency: {sub.latency}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cp-positive">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {sub.status}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Operator Action Shortcuts */}
          <Card className="bg-gradient-to-b from-[#0c121c] to-cp-elevated/40 border border-cp-gold/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-cp-text-primary">
                Operator Action Shortcuts
              </CardTitle>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-2.5 text-xs">
              <Link
                to="/admin/kyc"
                className="p-3 rounded-xl bg-[#141d2b] hover:bg-cp-card border border-cp-border hover:border-cp-gold/40 flex items-center justify-between transition-all group"
              >
                <div>
                  <span className="font-bold text-cp-text-primary group-hover:text-cp-gold transition-colors block">
                    Review Pending KYC
                  </span>
                  <span className="text-[10px] text-cp-text-muted">{pendingKycCount} cases waiting</span>
                </div>
                <ArrowRight className="w-4 h-4 text-cp-text-muted group-hover:text-cp-gold transition-colors" />
              </Link>

              <Link
                to="/admin/withdrawals"
                className="p-3 rounded-xl bg-[#141d2b] hover:bg-cp-card border border-cp-border hover:border-cp-gold/40 flex items-center justify-between transition-all group"
              >
                <div>
                  <span className="font-bold text-cp-text-primary group-hover:text-cp-gold transition-colors block">
                    Authorize Withdrawals
                  </span>
                  <span className="text-[10px] text-cp-text-muted">{pendingWithdrawalCount} queued payouts</span>
                </div>
                <ArrowRight className="w-4 h-4 text-cp-text-muted group-hover:text-cp-gold transition-colors" />
              </Link>

              <Link
                to="/admin/users"
                className="p-3 rounded-xl bg-[#141d2b] hover:bg-cp-card border border-cp-border hover:border-cp-gold/40 flex items-center justify-between transition-all group"
              >
                <div>
                  <span className="font-bold text-cp-text-primary group-hover:text-cp-gold transition-colors block">
                    Manage Accounts
                  </span>
                  <span className="text-[10px] text-cp-text-muted">Search, restrict, inspect</span>
                </div>
                <ArrowRight className="w-4 h-4 text-cp-text-muted group-hover:text-cp-gold transition-colors" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
