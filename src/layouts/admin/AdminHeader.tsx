import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Menu,
  Bell,
  Search,
  LogOut,
  User,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Sliders,
  X,
} from 'lucide-react'
import { Badge } from '@/components/common/Badge'

export interface AdminHeaderProps {
  onToggleMobileMenu: () => void
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleMobileMenu }) => {
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = () => {
    sessionStorage.removeItem('cp_admin_auth')
    navigate('/admin/login')
  }

  const mockAdminAlerts = [
    { id: '1', title: 'New KYC Tier 1 Submission', time: '10m ago', unread: true },
    { id: '2', title: 'Large Withdrawal Request (50,000 USDT)', time: '35m ago', unread: true },
    { id: '3', title: 'Scheduled Maintenance Reminder (Engine V3)', time: '2h ago', unread: false },
  ]

  return (
    <header className="h-16 px-4 sm:px-6 bg-[#0c121c] border-b border-cp-border flex items-center justify-between gap-4 sticky top-0 z-30 select-none">
      {/* Mobile Hamburger & Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-elevated transition-colors"
          aria-label="Open administration navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-bold text-cp-text-primary tracking-wide">
            CoinPlus Operator Desk
          </span>
          <Badge variant="gold" size="sm" className="text-[10px] py-0 px-1.5">
            Demonstration v2.4
          </Badge>
        </div>
      </div>

      {/* Center Search Shortcut */}
      <div className="hidden md:flex items-center max-w-sm flex-1 mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cp-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Quick search user ID, case ref, txHash..."
            className="w-full bg-[#141d2b] border border-cp-border rounded-xl pl-9 pr-3 py-1.5 text-xs text-cp-text-primary placeholder:text-cp-text-muted/60 focus:outline-none focus:border-cp-gold/60 transition-colors"
          />
        </div>
      </div>

      {/* Right Controls: Notifications & Admin Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-elevated relative transition-colors"
            aria-label="Admin alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cp-negative ring-2 ring-[#0c121c]" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-cp-card border border-cp-border shadow-2xl overflow-hidden z-50 animate-fadeIn">
              <div className="p-3 border-b border-cp-border flex items-center justify-between bg-cp-elevated/50">
                <span className="text-xs font-bold text-cp-text-primary">Admin Alerts Queue</span>
                <Badge variant="negative" size="sm">
                  2 Pending
                </Badge>
              </div>

              <div className="divide-y divide-cp-border/50 max-h-64 overflow-y-auto">
                {mockAdminAlerts.map((alt) => (
                  <div key={alt.id} className="p-3 hover:bg-cp-elevated/40 transition-colors space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${alt.unread ? 'text-cp-gold' : 'text-cp-text-primary'}`}>
                        {alt.title}
                      </span>
                      {alt.unread && <span className="w-1.5 h-1.5 rounded-full bg-cp-gold" />}
                    </div>
                    <span className="text-[10px] text-cp-text-muted block">{alt.time}</span>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-cp-border bg-cp-base/60 text-center">
                <Link
                  to="/admin/audit-logs"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[11px] text-cp-gold hover:underline font-semibold"
                >
                  View All Audit Events
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Administrator Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-cp-elevated transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cp-gold to-cp-gold/40 text-cp-bg font-black text-xs flex items-center justify-center">
              OP
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-cp-text-primary block leading-none">
                Chief Operator
              </span>
              <span className="text-[10px] text-cp-gold font-mono block mt-0.5">
                Super Admin
              </span>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-cp-card border border-cp-border shadow-2xl p-2 z-50 animate-fadeIn space-y-1">
              <div className="p-2.5 border-b border-cp-border/60">
                <span className="text-xs font-bold text-cp-text-primary block">Chief Operator</span>
                <span className="text-[10px] text-cp-text-muted font-mono block truncate">
                  operator@coinplus.io
                </span>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-cp-positive">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Hardware Key Verified</span>
                </div>
              </div>

              <Link
                to="/admin/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-elevated transition-colors"
              >
                <Sliders className="w-4 h-4 text-cp-gold" />
                <span>Admin Settings</span>
              </Link>

              <Link
                to="/dashboard"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-elevated transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Customer Exchange</span>
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-cp-negative hover:bg-cp-negative/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Admin</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
