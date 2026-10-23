import React from 'react'
import {
  LayoutDashboard,
  TrendingUp,
  ArrowLeftRight,
  Wallet,
  ClipboardList,
  ArrowDownToLine,
  ArrowUpFromLine,
  Star,
  User,
  ShieldCheck,
  ShieldAlert,
  Settings,
  Bell,
  Headphones,
  HelpCircle,
  Mail,
  Activity,
  Coins,
  Home,
  Sparkles,
} from 'lucide-react'

export interface NavItemConfig {
  id: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: {
    text: string
    variant: 'gold' | 'positive' | 'negative' | 'neutral'
  }
  category?: 'core' | 'finance' | 'account' | 'support' | 'dev'
  description?: string
}

export const SIDEBAR_NAV_ITEMS: NavItemConfig[] = [
  // Core Trading & Markets
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    category: 'core',
    description: 'Portfolio overview, analytics & quick trades',
  },
  {
    id: 'markets',
    label: 'Live Markets',
    href: '/markets',
    icon: TrendingUp,
    badge: { text: 'HOT', variant: 'positive' },
    category: 'core',
    description: 'Real-time crypto prices, gainers & volume',
  },
  {
    id: 'trade',
    label: 'Trade',
    href: '/trade',
    icon: ArrowLeftRight,
    badge: { text: 'PRO', variant: 'gold' },
    category: 'core',
    description: 'Advanced spot order book & chart engine',
  },
  {
    id: 'watchlist',
    label: 'Watchlist',
    href: '/watchlist',
    icon: Star,
    category: 'core',
    description: 'Custom pinned coins and price alerts',
  },

  // Finance & Asset Management
  {
    id: 'assets',
    label: 'Wallet / Assets',
    href: '/assets',
    icon: Wallet,
    category: 'finance',
    description: 'Crypto balances, valuation & asset allocation',
  },
  {
    id: 'orders',
    label: 'My Trades & Orders',
    href: '/orders',
    icon: ClipboardList,
    category: 'finance',
    description: 'Open limit orders, order history & trade fills',
  },
  {
    id: 'deposit',
    label: 'Deposit',
    href: '/deposit',
    icon: ArrowDownToLine,
    category: 'finance',
    description: 'Crypto and fiat on-ramp funding methods',
  },
  {
    id: 'withdraw',
    label: 'Withdraw',
    href: '/withdraw',
    icon: ArrowUpFromLine,
    category: 'finance',
    description: 'Secure multi-network off-ramp transfers',
  },

  // Account & Compliance
  {
    id: 'account',
    label: 'My Account',
    href: '/account',
    icon: User,
    category: 'account',
    description: 'Profile settings, VIP tiers & fee tiers',
  },
  {
    id: 'kyc',
    label: 'KYC Verification',
    href: '/kyc',
    icon: ShieldCheck,
    badge: { text: 'Verified', variant: 'positive' },
    category: 'account',
    description: 'Identity tiers, limits & institutional AML',
  },
  {
    id: 'settings',
    label: 'Security & Settings',
    href: '/settings',
    icon: Settings,
    category: 'account',
    description: '2FA, API keys, anti-phishing code & whitelist',
  },

  // Support & System
  {
    id: 'notifications',
    label: 'Notifications',
    href: '/notifications',
    icon: Bell,
    badge: { text: '3', variant: 'gold' },
    category: 'support',
    description: 'Price alerts, order fills & security notices',
  },
  {
    id: 'support',
    label: 'Customer Support',
    href: '/support',
    icon: Headphones,
    category: 'support',
    description: '24/7 VIP desk, live chat & ticket desk',
  },
  {
    id: 'help',
    label: 'Help Centre',
    href: '/help',
    icon: HelpCircle,
    category: 'support',
    description: 'Knowledge base, guides, FAQs & tutorials',
  },
  {
    id: 'fees',
    label: 'Fees & Limits',
    href: '/fees',
    icon: Coins,
    category: 'support',
    description: 'Spot trading schedules, network fees & limits',
  },
  {
    id: 'contact',
    label: 'Contact Us',
    href: '/contact',
    icon: Mail,
    category: 'support',
    description: 'Inquiries, institutional desk & partnership channels',
  },
  {
    id: 'status',
    label: 'System Status',
    href: '/status',
    icon: Activity,
    badge: { text: '99.98%', variant: 'positive' },
    category: 'support',
    description: 'Operational status, latency, and incident history',
  },
  {
    id: 'design-system',
    label: 'Design System',
    href: '/design-system',
    icon: Sparkles,
    badge: { text: 'Tokens', variant: 'neutral' },
    category: 'dev',
    description: 'Color tokens, typography & button specs',
  },
]

// 5-item Mobile Bottom Navigation
export const MOBILE_BOTTOM_NAV_ITEMS: {
  id: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  isProminent?: boolean
}[] = [
  { id: 'home', label: 'Home', href: '/dashboard', icon: Home },
  { id: 'markets', label: 'Markets', href: '/markets', icon: TrendingUp },
  { id: 'trade', label: 'Trade', href: '/trade', icon: ArrowLeftRight, isProminent: true },
  { id: 'assets', label: 'Assets', href: '/assets', icon: Wallet },
  { id: 'account', label: 'Account', href: '/account', icon: User },
]

export const CATEGORY_LABELS: Record<string, string> = {
  core: 'Exchange & Markets',
  finance: 'Wallet & Funds',
  account: 'Account & Identity',
  support: 'Support & Alerts',
  dev: 'Developer Specs',
}
