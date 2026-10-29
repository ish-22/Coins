import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  Activity,
  Sparkles,
  ArrowRight,
  Info,
  X,
  Server,
  Globe,
  LayoutDashboard,
  TrendingUp,
  ArrowLeftRight,
  Wallet,
  User,
  HelpCircle,
  Headphones,
  Zap,
  Wrench,
  AlertOctagon,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Typography } from '@/components/common/Typography'
import {
  ServiceStatus,
  ServiceItem,
  MockIncident,
  MaintenanceAnnouncement,
  DEMO_SYSTEM_SERVICES,
  DEMO_MAINTENANCE_ANNOUNCEMENTS,
  DEMO_INCIDENT_HISTORY,
} from '@/mock/statusData'

// Service icon mapper helper
const ServiceIcon: React.FC<{ id: string; className?: string }> = ({ id, className = 'w-5 h-5' }) => {
  switch (id) {
    case 'public-website':
      return <Globe className={className} />
    case 'user-dashboard':
      return <LayoutDashboard className={className} />
    case 'markets-interface':
      return <TrendingUp className={className} />
    case 'trading-interface':
      return <ArrowLeftRight className={className} />
    case 'wallet-interface':
      return <Wallet className={className} />
    case 'account-services':
      return <User className={className} />
    case 'support-centre':
      return <HelpCircle className={className} />
    default:
      return <Server className={className} />
  }
}

// Status badge helper
const StatusBadge: React.FC<{ status: ServiceStatus }> = ({ status }) => {
  switch (status) {
    case 'operational':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cp-positive/15 text-cp-positive border border-cp-positive/30">
          <span className="w-1.5 h-1.5 rounded-full bg-cp-positive animate-pulse" />
          Operational
        </span>
      )
    case 'degraded':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cp-gold/15 text-cp-gold border border-cp-gold/30">
          <span className="w-1.5 h-1.5 rounded-full bg-cp-gold animate-pulse" />
          Degraded
        </span>
      )
    case 'maintenance':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
          <Wrench className="w-3 h-3" />
          Maintenance
        </span>
      )
    case 'outage':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cp-negative/15 text-cp-negative border border-cp-negative/30">
          <AlertOctagon className="w-3 h-3" />
          Outage
        </span>
      )
    default:
      return null
  }
}

export const Status: React.FC = () => {
  // State loaded live from database API
  const [services, setServices] = useState<ServiceItem[]>(DEMO_SYSTEM_SERVICES)
  const [incidents, setIncidents] = useState<MockIncident[]>(DEMO_INCIDENT_HISTORY)
  const [overallStatus, setOverallStatus] = useState<ServiceStatus>('operational')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('Checking database telemetry...')
  const [refreshNotification, setRefreshNotification] = useState<string | null>(null)

  // Incident detail drill-down state
  const [selectedIncident, setSelectedIncident] = useState<MockIncident | null>(null)

  // Active filter for services
  const [serviceFilter, setServiceFilter] = useState<'all' | 'trading' | 'core' | 'finance'>('all')

  const fetchStatus = () => {
    setIsRefreshing(true)
    import('@/services/apiClient')
      .then(({ apiClient }) => apiClient.get('/system-status'))
      .then((res) => {
        setIsRefreshing(false)
        if (res.data?.services && Array.isArray(res.data.services) && res.data.services.length > 0) {
          setServices(res.data.services)
        }
        if (res.data?.incidents && Array.isArray(res.data.incidents) && res.data.incidents.length > 0) {
          setIncidents(res.data.incidents)
        }
        if (res.data?.overallStatus) {
          setOverallStatus(res.data.overallStatus)
        }
        const now = new Date()
        setLastUpdated(
          `${now.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })} • ${now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short',
          })} (Live Database)`
        )
      })
      .catch(() => {
        setIsRefreshing(false)
        const now = new Date()
        setLastUpdated(
          `${now.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })} • ${now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short',
          })} (Local Fallback)`
        )
      })
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  // Handle status refresh
  const handleRefresh = () => {
    fetchStatus()
    setRefreshNotification('All infrastructure and exchange nodes re-verified in real time!')
    setTimeout(() => setRefreshNotification(null), 3000)
  }

  // Filtered services
  const filteredServices = services.filter((srv) => {
    if (serviceFilter === 'all') return true
    if (serviceFilter === 'trading') return srv.category === 'trading'
    if (serviceFilter === 'core') return srv.category === 'core'
    if (serviceFilter === 'finance') return srv.category === 'finance'
    return true
  })

  return (
    <div className="space-y-10 pb-16">
      {/* 1. OVERALL DEMONSTRATION STATUS BANNER */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-cp-card via-cp-card/90 to-cp-base border border-cp-border p-6 sm:p-10 shadow-xl">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cp-positive/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cp-positive/10 border border-cp-positive/25 text-cp-positive text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-cp-positive animate-pulse" />
            <span>CoinPlus Infrastructure Telemetry</span>
          </div>

          <div className="space-y-3">
            <Typography variant="h1" className="text-3xl sm:text-4xl lg:text-5xl font-black text-cp-text-primary tracking-tight">
              All Systems Operational
            </Typography>

            <p className="text-sm sm:text-base text-cp-text-secondary max-w-2xl mx-auto leading-relaxed">
              Every core demonstration module, matching terminal, live price streaming service, and wallet interface is
              functioning within baseline latency expectations.
            </p>
          </div>

          {/* Quick Stats Banner Row */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            <div className="p-3.5 rounded-xl bg-cp-elevated/50 border border-cp-border text-center">
              <span className="text-[11px] text-cp-text-muted font-medium uppercase tracking-wider block">
                Simulated Uptime
              </span>
              <span className="text-xl font-bold font-mono text-cp-positive mt-0.5 block">99.98%</span>
              <span className="text-[10px] text-cp-text-muted">Last 90 Days</span>
            </div>

            <div className="p-3.5 rounded-xl bg-cp-elevated/50 border border-cp-border text-center">
              <span className="text-[11px] text-cp-text-muted font-medium uppercase tracking-wider block">
                Avg. Engine Latency
              </span>
              <span className="text-xl font-bold font-mono text-cp-gold mt-0.5 block">&lt; 15ms</span>
              <span className="text-[10px] text-cp-text-muted">High-Frequency Match</span>
            </div>

            <div className="p-3.5 rounded-xl bg-cp-elevated/50 border border-cp-border text-center">
              <span className="text-[11px] text-cp-text-muted font-medium uppercase tracking-wider block">
                Monitored Modules
              </span>
              <span className="text-xl font-bold font-mono text-cp-text-primary mt-0.5 block">
                {DEMO_SYSTEM_SERVICES.length} / {DEMO_SYSTEM_SERVICES.length}
              </span>
              <span className="text-[10px] text-cp-positive">100% Operational</span>
            </div>

            <div className="p-3.5 rounded-xl bg-cp-elevated/50 border border-cp-border text-center">
              <span className="text-[11px] text-cp-text-muted font-medium uppercase tracking-wider block">
                Active Incidents
              </span>
              <span className="text-xl font-bold font-mono text-cp-positive mt-0.5 block">0</span>
              <span className="text-[10px] text-cp-text-muted">Zero Degradation</span>
            </div>
          </div>

          {/* Timestamp and Refresh Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-cp-text-muted">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cp-gold" />
              <span>Last Checked:</span>
              <span className="text-cp-text-secondary font-mono">{lastUpdated}</span>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cp-elevated hover:bg-cp-border text-cp-text-secondary hover:text-cp-gold border border-cp-border transition-colors font-medium cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cp-gold' : ''}`} />
              <span>{isRefreshing ? 'Checking Feeds...' : 'Refresh Status'}</span>
            </button>
          </div>

          {refreshNotification && (
            <div className="p-2.5 rounded-lg bg-cp-positive/10 border border-cp-positive/30 text-xs text-cp-positive max-w-md mx-auto animate-fadeIn">
              {refreshNotification}
            </div>
          )}
        </div>
      </section>

      {/* 2. DEMONSTRATION DISCLAIMER CALLOUT */}
      <div className="p-4 rounded-xl bg-cp-gold/10 border border-cp-gold/25 flex items-start gap-3 text-xs text-cp-gold">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Demonstration Environment Notice:</strong> All status metrics, uptime bars, latencies, and incident reports on
          this page are simulated demonstration artifacts designed for interface walkthroughs. CoinPlus does not claim to operate
          or monitor live production cloud servers or high-frequency exchange clusters on this demonstration portal.
        </p>
      </div>

      {/* 3. INDIVIDUAL SERVICE CARDS */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <Typography variant="h2" className="text-xl sm:text-2xl font-bold text-cp-text-primary flex items-center gap-2">
              <Activity className="w-5 h-5 text-cp-gold" />
              CoinPlus Demonstration Services
            </Typography>
            <p className="text-xs text-cp-text-muted mt-0.5">
              Simulated real-time operational status and 30-day simulated uptime history per platform subsystem
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setServiceFilter('all')}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-all ${
                serviceFilter === 'all'
                  ? 'bg-cp-gold text-cp-base font-bold border-cp-gold'
                  : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border-cp-border'
              }`}
            >
              All ({DEMO_SYSTEM_SERVICES.length})
            </button>
            <button
              type="button"
              onClick={() => setServiceFilter('trading')}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-all ${
                serviceFilter === 'trading'
                  ? 'bg-cp-gold text-cp-base font-bold border-cp-gold'
                  : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border-cp-border'
              }`}
            >
              Trading & Markets
            </button>
            <button
              type="button"
              onClick={() => setServiceFilter('core')}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-all ${
                serviceFilter === 'core'
                  ? 'bg-cp-gold text-cp-base font-bold border-cp-gold'
                  : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border-cp-border'
              }`}
            >
              Core & Web
            </button>
            <button
              type="button"
              onClick={() => setServiceFilter('finance')}
              className={`px-3 py-1.5 rounded-lg border font-medium transition-all ${
                serviceFilter === 'finance'
                  ? 'bg-cp-gold text-cp-base font-bold border-cp-gold'
                  : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border-cp-border'
              }`}
            >
              Wallet
            </button>
          </div>
        </div>

        {/* Services List / Cards */}
        <div className="grid grid-cols-1 gap-3.5">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className="bg-cp-card hover:bg-cp-elevated/40 border-cp-border hover:border-cp-border-light transition-all duration-200"
            >
              <CardContent className="p-5 space-y-4">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cp-elevated text-cp-gold flex items-center justify-center shrink-0 border border-cp-border">
                      <ServiceIcon id={service.id} className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-cp-text-primary">{service.name}</h4>
                        <span className="text-[10px] font-mono text-cp-text-muted px-1.5 py-0.5 rounded bg-cp-elevated border border-cp-border">
                          {service.simulatedLatency}
                        </span>
                      </div>
                      <p className="text-xs text-cp-text-muted mt-0.5 line-clamp-1">{service.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-mono font-semibold text-cp-text-primary block">
                        {service.simulatedUptime}
                      </span>
                      <span className="text-[10px] text-cp-text-muted">30d Uptime</span>
                    </div>
                    <StatusBadge status={service.status} />
                  </div>
                </div>

                {/* 30-Day Simulated Uptime Visualization Bar */}
                <div className="space-y-1.5 pt-1 border-t border-cp-border/60">
                  <div className="flex items-center justify-between text-[11px] text-cp-text-muted">
                    <span>30 days ago</span>
                    <span className="font-mono text-cp-positive font-medium">100% available today</span>
                    <span>Today</span>
                  </div>

                  <div className="flex items-center gap-1 w-full">
                    {(service.dailyUptimeHistory || Array(30).fill('operational')).map((dayStatus, idx, arr) => {
                      const isLast = idx === arr.length - 1
                      return (
                        <div
                          key={idx}
                          title={`Day ${30 - idx} ago: ${dayStatus === 'operational' ? 'Normal Performance' : 'Minor Degraded Latency'}`}
                          className={`h-7 flex-1 rounded-sm transition-all duration-150 hover:opacity-75 ${
                            dayStatus === 'operational'
                              ? 'bg-cp-positive/70 hover:bg-cp-positive'
                              : 'bg-cp-gold/80 hover:bg-cp-gold'
                          } ${isLast ? 'ring-1 ring-cp-positive' : ''}`}
                        />
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. MAINTENANCE ANNOUNCEMENTS */}
      <section className="space-y-4">
        <div>
          <Typography variant="h2" className="text-xl sm:text-2xl font-bold text-cp-text-primary flex items-center gap-2">
            <Wrench className="w-5 h-5 text-cp-gold" />
            Maintenance Announcements
          </Typography>
          <p className="text-xs text-cp-text-muted mt-0.5">
            Scheduled demonstration maintenance windows and infrastructure optimization releases
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {DEMO_MAINTENANCE_ANNOUNCEMENTS.map((maint) => (
            <Card
              key={maint.id}
              className={`border transition-all ${
                maint.status === 'upcoming'
                  ? 'bg-gradient-to-r from-cp-card via-cp-elevated/40 to-cp-card border-cp-gold/40'
                  : 'bg-cp-card border-cp-border'
              }`}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={maint.status === 'upcoming' ? 'gold' : 'neutral'} size="sm">
                        {maint.status === 'upcoming' ? 'Scheduled Upcoming' : 'Completed Maintenance'}
                      </Badge>
                      <span className="text-xs text-cp-text-muted flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-cp-gold" />
                        {maint.scheduledTime}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-cp-text-primary">{maint.title}</h3>
                  </div>

                  <span className="text-xs font-mono text-cp-gold px-2.5 py-1 rounded bg-cp-elevated border border-cp-border self-start sm:self-auto">
                    Est. Duration: {maint.estimatedDuration}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-cp-text-secondary leading-relaxed">{maint.description}</p>

                <div className="rounded-xl bg-cp-elevated/40 border border-cp-border p-4 text-xs space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-cp-text-primary">Affected Demonstration Modules:</span>
                    {maint.affectedServices.map((aff) => (
                      <span
                        key={aff}
                        className="px-2 py-0.5 rounded bg-cp-card border border-cp-border font-mono text-cp-gold text-[11px]"
                      >
                        {aff}
                      </span>
                    ))}
                  </div>
                  <p className="text-cp-text-muted leading-relaxed">
                    <strong>Advisory:</strong> {maint.advisory}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. MOCK INCIDENT HISTORY & INCIDENT DETAIL VIEW */}
      <section className="space-y-4">
        <div>
          <Typography variant="h2" className="text-xl sm:text-2xl font-bold text-cp-text-primary flex items-center gap-2">
            <Clock className="w-5 h-5 text-cp-gold" />
            Demonstration Incident History
          </Typography>
          <p className="text-xs text-cp-text-muted mt-0.5">
            Historical incident logs, diagnostic timelines, and simulated post-mortem summaries
          </p>
        </div>

        <div className="space-y-4">
          {incidents.map((inc) => {
            const isSelected = selectedIncident?.id === inc.id
            return (
              <Card
                key={inc.id}
                className={`border transition-all duration-200 overflow-hidden ${
                  isSelected ? 'bg-cp-card border-cp-gold/60 shadow-lg' : 'bg-cp-card border-cp-border hover:border-cp-border-light'
                }`}
              >
                {/* Incident Card Header */}
                <div
                  onClick={() => setSelectedIncident(isSelected ? null : inc)}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-cp-text-muted font-medium">{inc.date}</span>
                      <span className="text-cp-text-muted">•</span>
                      <span className="inline-flex items-center gap-1 text-cp-positive font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Resolved
                      </span>
                      <span className="text-cp-text-muted">•</span>
                      <span className="px-2 py-0.5 rounded bg-cp-elevated text-cp-gold text-[10px] font-mono border border-cp-border">
                        {inc.affectedServices.join(', ')}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-cp-text-primary hover:text-cp-gold transition-colors">
                      {inc.title}
                    </h3>

                    <p className="text-xs text-cp-text-secondary line-clamp-1">{inc.description}</p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cp-elevated hover:bg-cp-border text-cp-text-secondary hover:text-cp-text-primary border border-cp-border transition-colors"
                    >
                      <span>{isSelected ? 'Hide Details' : 'View Incident Timeline'}</span>
                      {isSelected ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Incident Expanded Details & Timeline */}
                {isSelected && (
                  <div className="px-5 pb-6 sm:px-6 pt-2 border-t border-cp-border/60 space-y-6 animate-fadeIn">
                    <div className="rounded-xl bg-cp-elevated/40 border border-cp-border p-4 space-y-3">
                      <div>
                        <span className="text-xs font-semibold text-cp-text-primary uppercase tracking-wider block">
                          Incident Scope & Root Cause:
                        </span>
                        <p className="text-xs sm:text-sm text-cp-text-secondary mt-1 leading-relaxed">{inc.description}</p>
                      </div>

                      <div className="pt-2 border-t border-cp-border/40">
                        <span className="text-xs font-semibold text-cp-text-primary uppercase tracking-wider block">
                          Resolution Summary:
                        </span>
                        <p className="text-xs sm:text-sm text-cp-positive mt-1 leading-relaxed font-medium">
                          {inc.resolutionSummary}
                        </p>
                      </div>
                    </div>

                    {/* Step-by-Step Incident Updates Timeline */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-cp-text-primary uppercase tracking-wider flex items-center gap-2">
                        <Clock className="w-4 h-4 text-cp-gold" />
                        Simulated Incident Progress Timeline
                      </h4>

                      <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-cp-border">
                        {inc.updates.map((upd, idx) => {
                          const isResolvedStep = upd.status === 'resolved'
                          return (
                            <div key={upd.id} className="relative space-y-1">
                              {/* Dot */}
                              <div
                                className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 bg-cp-base flex items-center justify-center ${
                                  isResolvedStep ? 'border-cp-positive text-cp-positive' : 'border-cp-gold text-cp-gold'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${isResolvedStep ? 'bg-cp-positive' : 'bg-cp-gold'}`} />
                              </div>

                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="font-mono text-cp-text-muted">{upd.timestamp}</span>
                                <Badge variant={isResolvedStep ? 'positive' : 'gold'} size="sm">
                                  {upd.status.toUpperCase()}
                                </Badge>
                              </div>

                              <p className="text-xs sm:text-sm text-cp-text-secondary leading-relaxed pl-0.5">
                                {upd.message}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </section>

      {/* 6. HELP & SUPPORT DIRECT SHORTCUTS */}
      <section className="rounded-2xl border border-cp-gold/30 bg-gradient-to-r from-cp-card via-cp-elevated/70 to-cp-card p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cp-gold/10 text-cp-gold text-xs font-semibold">
              <Headphones className="w-3.5 h-3.5" />
              <span>Assistance & Documentation</span>
            </div>
            <Typography variant="h3" className="text-xl sm:text-2xl font-bold text-cp-text-primary">
              Have Questions About Platform Reliability?
            </Typography>
            <p className="text-xs sm:text-sm text-cp-text-secondary max-w-xl">
              Explore our self-service Help Centre for 24 guides on trading rules, deposit memos, and security, or submit a
              ticket to our demonstration support desk.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link to="/help">
              <Button variant="primary" size="md">
                <HelpCircle className="w-4 h-4 mr-2" />
                CoinPlus Help Centre
              </Button>
            </Link>
            <Link to="/support">
              <Button variant="outline" size="md">
                <Headphones className="w-4 h-4 mr-2" />
                Support Ticket Desk
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. PUBLIC FOOTER WITH LEGAL LINKS & RISK DISCLOSURE */}
      <section className="border-t border-cp-border/80 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/fees"
            className="p-4 rounded-xl bg-cp-card hover:bg-cp-elevated border border-cp-border hover:border-cp-gold/40 transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-cp-gold mb-1 font-semibold">
              <span>TRADING FEES</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-sm font-bold text-cp-text-primary group-hover:text-cp-gold transition-colors">
              Fees & VIP Limits
            </h4>
            <p className="text-xs text-cp-text-muted mt-1">
              Review spot maker/taker rates and network withdrawal schedules.
            </p>
          </Link>

          <Link
            to="/settings"
            className="p-4 rounded-xl bg-cp-card hover:bg-cp-elevated border border-cp-border hover:border-cp-gold/40 transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-cp-gold mb-1 font-semibold">
              <span>SECURITY</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-sm font-bold text-cp-text-primary group-hover:text-cp-gold transition-colors">
              Security & Settings
            </h4>
            <p className="text-xs text-cp-text-muted mt-1">
              Configure 2FA, biometric passkeys, and withdrawal address allowlists.
            </p>
          </Link>

          <Link
            to="/contact"
            className="p-4 rounded-xl bg-cp-card hover:bg-cp-elevated border border-cp-border hover:border-cp-gold/40 transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-cp-gold mb-1 font-semibold">
              <span>COMMUNICATION</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-sm font-bold text-cp-text-primary group-hover:text-cp-gold transition-colors">
              Contact CoinPlus
            </h4>
            <p className="text-xs text-cp-text-muted mt-1">
              Submit demonstration inquiries, partnership proposals, or security alerts.
            </p>
          </Link>

          <Link
            to="/about"
            className="p-4 rounded-xl bg-cp-card hover:bg-cp-elevated border border-cp-border hover:border-cp-gold/40 transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-cp-gold mb-1 font-semibold">
              <span>CONCEPT</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-sm font-bold text-cp-text-primary group-hover:text-cp-gold transition-colors">
              About CoinPlus
            </h4>
            <p className="text-xs text-cp-text-muted mt-1">
              Learn about our cryptocurrency platform concept and core architecture.
            </p>
          </Link>
        </div>

        {/* Regulatory & Demonstration Disclaimer */}
        <div className="mt-8 p-4 rounded-xl bg-cp-elevated/40 border border-cp-border text-center text-xs text-cp-text-muted space-y-1">
          <p className="font-semibold text-cp-text-secondary">
            Demonstration Disclaimer & Risk Disclosure
          </p>
          <p className="max-w-3xl mx-auto">
            CoinPlus is an educational cryptocurrency trading interface demonstration. Status metrics, incident updates, and
            maintenance notices on this page represent simulated operational states. No actual cloud infrastructure or third-party
            services are monitored.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Status
