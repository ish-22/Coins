/**
 * CoinPlus Stable Demonstration Data for System Status (/status)
 * IMPORTANT: All metrics, uptime rates, incident reports, and maintenance windows
 * are simulated demonstration data. No real infrastructure is monitored or managed here.
 */

export type ServiceStatus = 'operational' | 'degraded' | 'maintenance' | 'outage'
export type IncidentSeverity = 'minor' | 'major' | 'critical' | 'maintenance'
export type IncidentStatus = 'investigating' | 'identified' | 'monitoring' | 'resolved'

export interface ServiceItem {
  id: string
  name: string
  category: 'core' | 'trading' | 'finance' | 'support'
  status: ServiceStatus
  description: string
  simulatedUptime: string
  simulatedLatency: string
  dailyUptimeHistory: ('operational' | 'degraded' | 'outage')[] // 30-day simulated history
}

export interface IncidentUpdate {
  id: string
  timestamp: string
  status: IncidentStatus
  message: string
}

export interface MockIncident {
  id: string
  title: string
  date: string
  severity: IncidentSeverity
  status: IncidentStatus
  affectedServices: string[]
  description: string
  resolutionSummary: string
  updates: IncidentUpdate[]
}

export interface MaintenanceAnnouncement {
  id: string
  title: string
  scheduledTime: string
  estimatedDuration: string
  status: 'upcoming' | 'in_progress' | 'completed'
  affectedServices: string[]
  description: string
  advisory: string
}

export const DEMO_SYSTEM_SERVICES: ServiceItem[] = [
  {
    id: 'public-website',
    name: 'Public Website',
    category: 'core',
    status: 'operational',
    description: 'Public landing pages, marketing portal, and institutional brand showcase',
    simulatedUptime: '99.99%',
    simulatedLatency: '18ms',
    dailyUptimeHistory: Array(30).fill('operational'),
  },
  {
    id: 'user-dashboard',
    name: 'User Dashboard',
    category: 'core',
    status: 'operational',
    description: 'Personalized portfolio cards, analytics chart engine, and asset balances',
    simulatedUptime: '99.98%',
    simulatedLatency: '24ms',
    dailyUptimeHistory: Array(30).fill('operational'),
  },
  {
    id: 'markets-interface',
    name: 'Markets Interface',
    category: 'trading',
    status: 'operational',
    description: 'Real-time spot price ticker streaming, 24h volume calculations, and sparklines',
    simulatedUptime: '99.95%',
    simulatedLatency: '31ms',
    // One historical degraded day 14 days ago
    dailyUptimeHistory: [
      ...Array(15).fill('operational'),
      'degraded',
      ...Array(14).fill('operational'),
    ],
  },
  {
    id: 'trading-interface',
    name: 'Trading Interface',
    category: 'trading',
    status: 'operational',
    description: 'High-frequency spot order book depth ladder, candlestick charting, and order execution',
    simulatedUptime: '99.99%',
    simulatedLatency: '12ms',
    dailyUptimeHistory: Array(30).fill('operational'),
  },
  {
    id: 'wallet-interface',
    name: 'Wallet Interface',
    category: 'finance',
    status: 'operational',
    description: 'Cryptocurrency on-ramp deposit generation, simulated network gas fees, and withdrawals',
    simulatedUptime: '99.92%',
    simulatedLatency: '45ms',
    // One historical maintenance day 8 days ago
    dailyUptimeHistory: [
      ...Array(21).fill('operational'),
      'degraded',
      ...Array(8).fill('operational'),
    ],
  },
  {
    id: 'account-services',
    name: 'Account Services',
    category: 'core',
    status: 'operational',
    description: 'Demonstration user onboarding, KYC stage verification, and FIDO2 passkey registration',
    simulatedUptime: '99.97%',
    simulatedLatency: '28ms',
    dailyUptimeHistory: Array(30).fill('operational'),
  },
  {
    id: 'support-centre',
    name: 'Support Centre',
    category: 'support',
    status: 'operational',
    description: 'Self-service Help Centre knowledge base, FAQ search engine, and support ticket desk',
    simulatedUptime: '100.0%',
    simulatedLatency: '22ms',
    dailyUptimeHistory: Array(30).fill('operational'),
  },
]

export const DEMO_MAINTENANCE_ANNOUNCEMENTS: MaintenanceAnnouncement[] = [
  {
    id: 'maint-2026-10-25',
    title: 'Scheduled Matching Engine V3 Demonstration Upgrade',
    scheduledTime: 'Sunday, October 25, 2026 • 02:00 – 03:30 UTC',
    estimatedDuration: '90 Minutes',
    status: 'upcoming',
    affectedServices: ['Trading Interface', 'Markets Interface'],
    description:
      'Routine maintenance to deploy simulated memory optimization and order queue throughput improvements.',
    advisory:
      'During this demonstration maintenance window, simulated spot order submission and book depth ladders will be temporarily paused. Open simulated limit orders will remain safely intact.',
  },
  {
    id: 'maint-2026-10-12',
    title: 'Routine Database Index Rebuild & Cache Refresh',
    scheduledTime: 'Monday, October 12, 2026 • 04:00 – 04:45 UTC',
    estimatedDuration: '45 Minutes',
    status: 'completed',
    affectedServices: ['User Dashboard', 'Wallet Interface'],
    description:
      'Scheduled maintenance for client portfolio query index re-indexing and token metadata cache pre-warming.',
    advisory:
      'Maintenance completed successfully ahead of schedule. All portfolio metrics and transaction logs validated.',
  },
]

export const DEMO_INCIDENT_HISTORY: MockIncident[] = [
  {
    id: 'inc-2026-10-14',
    title: 'Intermittent WebSocket Ticker Latency on Markets Feed',
    date: 'October 14, 2026',
    severity: 'minor',
    status: 'resolved',
    affectedServices: ['Markets Interface'],
    description:
      'Users experienced brief delays of 2-4 seconds in receiving real-time price tick updates for selected BTC and ETH pairs.',
    resolutionSummary:
      'Traffic was rerouted to secondary mock WebSocket nodes and the connection pooling threshold was adjusted. Full sub-millisecond streaming was restored.',
    updates: [
      {
        id: 'upd-4',
        timestamp: 'Oct 14, 2026 • 15:45 UTC',
        status: 'resolved',
        message: 'All price feeds and sparklines are updating at normal baseline latencies. This demonstration incident is resolved.',
      },
      {
        id: 'upd-3',
        timestamp: 'Oct 14, 2026 • 15:20 UTC',
        status: 'monitoring',
        message: 'A fix has been deployed. Simulated quote delivery latencies have returned to under 35ms across all trading pairs.',
      },
      {
        id: 'upd-2',
        timestamp: 'Oct 14, 2026 • 14:55 UTC',
        status: 'identified',
        message: 'The root cause was identified as a rate-limiter misconfiguration on mock ticker broadcasts. Engineers are rolling out a patch.',
      },
      {
        id: 'upd-1',
        timestamp: 'Oct 14, 2026 • 14:30 UTC',
        status: 'investigating',
        message: 'We are investigating reports of delayed ticker updates on the Live Markets page. Trading order execution remains unaffected.',
      },
    ],
  },
  {
    id: 'inc-2026-10-06',
    title: 'Simulated Network Congestion on TRC-20 USDT Deposits',
    date: 'October 6, 2026',
    severity: 'minor',
    status: 'resolved',
    affectedServices: ['Wallet Interface'],
    description:
      'Simulated TRC-20 deposit confirmation count requirements experienced increased simulation latency due to mock block reorganization.',
    resolutionSummary:
      'Mock block generation intervals were re-synchronized, and all pending simulated deposits were credited without loss of funds.',
    updates: [
      {
        id: 'upd-w2',
        timestamp: 'Oct 6, 2026 • 11:15 UTC',
        status: 'resolved',
        message: 'Block reorganization simulation settled. All queued deposit transactions were processed to completion.',
      },
      {
        id: 'upd-w1',
        timestamp: 'Oct 6, 2026 • 09:40 UTC',
        status: 'investigating',
        message: 'Investigating slower confirmation times for demonstration TRC-20 deposit credits. Crypto balances remain safe.',
      },
    ],
  },
  {
    id: 'inc-2026-09-22',
    title: 'Brief Degraded Response Times on KYC Document Preview',
    date: 'September 22, 2026',
    severity: 'minor',
    status: 'resolved',
    affectedServices: ['Account Services'],
    description:
      'Demonstration identity verification mock file upload previews displayed occasional timeout errors during client-side image processing.',
    resolutionSummary:
      'Optimized client-side canvas downsampling and increased mock uploader buffer limits. No user data was impacted.',
    updates: [
      {
        id: 'upd-k2',
        timestamp: 'Sep 22, 2026 • 18:00 UTC',
        status: 'resolved',
        message: 'Image processing pipeline restored. Verification stage uploads and document previews are functioning smoothly.',
      },
      {
        id: 'upd-k1',
        timestamp: 'Sep 22, 2026 • 17:15 UTC',
        status: 'investigating',
        message: 'Investigating intermittent preview generation issues on the identity verification document upload step.',
      },
    ],
  },
]
