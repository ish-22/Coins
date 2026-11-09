import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  ArrowLeftRight,
  ArrowDownToLine,
  Wallet,
  Bell,
  Headphones,
  TrendingUp,
  History,
  FileText,
  Sliders,
  Lock,
  LogOut,
  ShieldAlert,
  AlertCircle,
} from 'lucide-react'
import { Logo } from '@/components/common/Logo'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'

export interface AdminNavItem {
  id: string
  number: number
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
    number: 1,
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'users',
    number: 2,
    label: 'User Management',
    href: '/admin/users',
    icon: Users,
    badge: { text: 'Active', variant: 'positive' },
  },
  {
    id: 'kyc',
    number: 3,
    label: 'KYC Verification',
    href: '/admin/kyc',
    icon: ShieldCheck,
    badge: { text: '2 Pending', variant: 'gold' },
  },
  {
    id: 'trading',
    number: 4,
    label: 'Trading Management',
    href: '/admin/trading',
    icon: ArrowLeftRight,
  },
  {
    id: 'deposits',
    number: 5,
    label: 'Deposit Management',
    href: '/admin/deposits',
    icon: ArrowDownToLine,
  },
  {
    id: 'balances',
    number: 6,
    label: 'Balance Management',
    href: '/admin/balances',
    icon: Wallet,
  },
  {
    id: 'notifications',
    number: 7,
    label: 'Notification Management',
    href: '/admin/notifications',
    icon: Bell,
  },
  {
    id: 'support',
    number: 8,
    label: 'Customer Support',
    href: '/admin/support',
    icon: Headphones,
    badge: { text: '1 Open', variant: 'gold' },
  },
  {
    id: 'trading-history',
    number: 9,
    label: 'Trading History',
    href: '/admin/trading-history',
    icon: TrendingUp,
  },
  {
    id: 'transactions',
    number: 10,
    label: 'Transaction History',
    href: '/admin/transactions',
    icon: History,
  },
  {
    id: 'audit-logs',
    number: 11,
    label: 'Admin Activity Logs',
    href: '/admin/audit-logs',
    icon: FileText,
  },
  {
    id: 'settings',
    number: 12,
    label: 'Website Settings',
    href: '/admin/settings',
    icon: Sliders,
  },
  {
    id: 'security',
    number: 13,
    label: 'Security Settings',
    href: '/admin/security',
    icon: Lock,
  },
]

export interface AdminSidebarProps {
  onItemClick?: () => void
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onItemClick }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const isMobileDrawer = Boolean(onItemClick)

  const handleLogout = () => {
    // Clean up session and local credentials
    sessionStorage.removeItem('cp_admin_auth')
    localStorage.removeItem('cp_admin_auth')
    sessionStorage.removeItem('cp_admin_token')
    localStorage.removeItem('cp_admin_token')
    sessionStorage.removeItem('cp_admin_user')
    localStorage.removeItem('cp_admin_user')
    sessionStorage.removeItem('cp_admin_2fa_verified')

    if (onItemClick) onItemClick()
    navigate('/admin/login')
  }

  const containerClasses = isMobileDrawer
    ? 'flex flex-col w-full h-full bg-[#0c121c] select-none overflow-hidden'
    : 'hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-[#0c121c] border-r border-cp-border flex-col shrink-0 select-none h-screen overflow-hidden z-40'

  return (
    <>
      <aside className={containerClasses}>
        {/* Brand & Admin Status */}
        <div className="h-16 px-5 border-b border-cp-border flex items-center justify-between shrink-0">
          <Link to="/admin/dashboard" onClick={onItemClick} className="flex items-center gap-2">
            <Logo size="sm" asLink={false} />
            <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-cp-negative/20 text-cp-negative border border-cp-negative/30">
              ADMIN
            </span>
          </Link>
          <span className="w-2 h-2 rounded-full bg-cp-positive animate-pulse" title="System Operational" />
        </div>

        {/* Navigation Links: 1 through 13 */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 scrollbar-thin scrollbar-thumb-cp-border" aria-label="Admin Navigation">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-cp-text-muted flex items-center justify-between">
            <span>Admin Console</span>
            <span className="font-mono text-cp-gold text-[9px]">14 Modules</span>
          </div>

          {ADMIN_NAV_ITEMS.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.id === 'trading' && location.pathname === '/admin/orders')
            const Icon = item.icon

            return (
              <Link
                key={item.id}
                to={item.href}
                onClick={onItemClick}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                  isActive
                    ? 'bg-cp-gold/15 text-cp-gold border border-cp-gold/30 shadow-sm'
                    : 'text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-elevated/70'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`text-[10px] font-mono w-4 text-center shrink-0 ${isActive ? 'text-cp-gold font-bold' : 'text-cp-text-muted'}`}>
                    {item.number}.
                  </span>
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

          {/* 14. Logout Action */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-cp-negative hover:bg-cp-negative/15 border border-transparent hover:border-cp-negative/30 transition-all duration-150 group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-[10px] font-mono w-4 text-center text-cp-negative/70 shrink-0 font-bold">
                  14.
                </span>
                <LogOut className="w-4 h-4 shrink-0 text-cp-negative" />
                <span className="truncate font-bold">Logout</span>
              </div>
              <span className="text-[10px] font-mono text-cp-negative/60 group-hover:text-cp-negative">
                End Session
              </span>
            </button>
          </div>
        </nav>

        {/* Operator Badge Footer */}
        <div className="p-3 border-t border-cp-border bg-[#090e17] shrink-0">
          <div className="flex items-center justify-between px-2 text-[10px] text-cp-gold font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>Operator Console</span>
            </div>
            <span className="font-mono text-cp-text-muted">RBAC v2</span>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="relative w-full max-w-sm bg-[#0c121c] border border-cp-negative/40 rounded-2xl shadow-2xl p-6 z-10 animate-fadeIn space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-cp-negative/20 text-cp-negative border border-cp-negative/40 shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-cp-text-primary">
                  Terminate Admin Session?
                </h3>
                <p className="text-xs text-cp-text-muted mt-1 leading-relaxed">
                  You will be signed out of the operator console. Any unsaved forms will be discarded.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-cp-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleLogout}
                className="bg-cp-negative hover:bg-cp-negative/90 text-white font-bold"
              >
                Logout Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminSidebar
