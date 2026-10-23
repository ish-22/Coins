import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  Headphones,
  Megaphone,
  Coins,
  FileText,
  Sliders,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react'
import { Logo } from '@/components/common/Logo'
import { Badge } from '@/components/common/Badge'

export interface AdminNavItem {
  id: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: {
    text: string
    variant: 'gold' | 'positive' | 'negative' | 'neutral'
  }
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'users',
    label: 'User Management',
    href: '/admin/users',
    icon: Users,
    badge: { text: '10', variant: 'neutral' },
  },
  {
    id: 'kyc',
    label: 'KYC Verification',
    href: '/admin/kyc',
    icon: ShieldCheck,
    badge: { text: '2 Pending', variant: 'gold' },
  },
  {
    id: 'deposits',
    label: 'Deposits',
    href: '/admin/deposits',
    icon: ArrowDownToLine,
  },
  {
    id: 'withdrawals',
    label: 'Withdrawals',
    href: '/admin/withdrawals',
    icon: ArrowUpFromLine,
    badge: { text: '2 Review', variant: 'negative' },
  },
  {
    id: 'orders',
    label: 'Orders & Trades',
    href: '/admin/orders',
    icon: ArrowLeftRight,
  },
  {
    id: 'support',
    label: 'Support Tickets',
    href: '/admin/support',
    icon: Headphones,
    badge: { text: '1 Open', variant: 'gold' },
  },
  {
    id: 'announcements',
    label: 'Announcements',
    href: '/admin/announcements',
    icon: Megaphone,
  },
  {
    id: 'assets',
    label: 'Asset Management',
    href: '/admin/assets',
    icon: Coins,
  },
  {
    id: 'audit-logs',
    label: 'Audit Logs',
    href: '/admin/audit-logs',
    icon: FileText,
  },
  {
    id: 'settings',
    label: 'Admin Settings',
    href: '/admin/settings',
    icon: Sliders,
  },
]

export interface AdminSidebarProps {
  onItemClick?: () => void
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onItemClick }) => {
  const location = useLocation()

  return (
    <aside className="w-64 bg-[#0c121c] border-r border-cp-border flex flex-col shrink-0 select-none">
      {/* Brand & Admin Badge */}
      <div className="h-16 px-5 border-b border-cp-border flex items-center justify-between">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <Logo size="sm" asLink={false} />
          <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-cp-negative/20 text-cp-negative border border-cp-negative/30">
            ADMIN
          </span>
        </Link>
        <span className="w-2 h-2 rounded-full bg-cp-positive animate-pulse" title="System Operational" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-none" aria-label="Admin Navigation">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-cp-text-muted">
          Administration Modules
        </div>

        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.id}
              to={item.href}
              onClick={onItemClick}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                isActive
                  ? 'bg-cp-gold/15 text-cp-gold border border-cp-gold/30 shadow-sm'
                  : 'text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-elevated/70'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-cp-gold' : 'text-cp-text-muted group-hover:text-cp-text-primary'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <Badge variant={item.badge.variant} size="sm" className="text-[10px] py-0 px-1.5 font-mono">
                  {item.badge.text}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Back to Client Terminal shortcut */}
      <div className="p-3 border-t border-cp-border bg-[#090e17] space-y-2">
        <div className="flex items-center gap-2 px-2 text-[10px] text-cp-gold font-medium">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          <span>Restricted Operator View</span>
        </div>
        <Link
          to="/dashboard"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated border border-cp-border/50 transition-colors"
        >
          <span>Exit to Trader Terminal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  )
}
