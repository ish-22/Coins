import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { Logo } from '@/components/common/Logo'
import { Badge } from '@/components/common/Badge'
import { useLayout } from '@/context/LayoutContext'
import { useAuth } from '@/context/AuthContext'
import { SIDEBAR_NAV_ITEMS, CATEGORY_LABELS } from '@/routes/navItems'

export interface SidebarProps {
  className?: string
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { isSidebarCollapsed, toggleSidebar } = useLayout()
  const { user } = useAuth()

  // Group items by category
  const categories: Array<'core' | 'finance' | 'account' | 'support' | 'dev'> = [
    'core',
    'finance',
    'account',
    'support',
    'dev',
  ]

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col h-screen sticky top-0 z-40 bg-cp-card border-r border-cp-border select-none transition-all duration-300 ease-in-out',
        isSidebarCollapsed ? 'w-20' : 'w-64 xl:w-72',
        className
      )}
    >
      {/* Sidebar Header with CoinPlus Logo & Collapse Toggle */}
      <div
        className={cn(
          'h-16 flex items-center border-b border-cp-border px-4 transition-all duration-300',
          isSidebarCollapsed ? 'justify-center' : 'justify-between'
        )}
      >
        {!isSidebarCollapsed ? (
          <>
            <Logo size="sm" showSubtitle={false} />
            <button
              type="button"
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-cp-text-muted hover:text-cp-gold hover:bg-cp-elevated transition-colors"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-cp-text-muted hover:text-cp-gold hover:bg-cp-elevated transition-colors group relative"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <Logo size="sm" variant="icon-only" />
              <div className="absolute -bottom-1 -right-1 bg-cp-elevated rounded-full p-0.5 border border-cp-border text-cp-gold">
                <ChevronRight className="w-3 h-3" />
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Nav List with custom dark scrollbar */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
        {categories.map((catKey) => {
          const items = SIDEBAR_NAV_ITEMS.filter((item) => item.category === catKey)
          if (items.length === 0) return null

          return (
            <div key={catKey} className="space-y-1">
              {!isSidebarCollapsed && (
                <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-cp-text-muted">
                  {CATEGORY_LABELS[catKey]}
                </div>
              )}

              {items.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.id}
                    to={item.href}
                    title={isSidebarCollapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      cn(
                        'group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                        isSidebarCollapsed ? 'justify-center' : 'justify-start',
                        isActive
                          ? 'bg-cp-gold/10 text-cp-gold font-semibold shadow-[inset_3px_0_0_0_#F0B93A] border border-cp-gold/20'
                          : 'text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-elevated hover:border-cp-border/50 border border-transparent'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={cn(
                            'w-5 h-5 shrink-0 transition-colors',
                            isActive
                              ? 'text-cp-gold'
                              : 'text-cp-text-muted group-hover:text-cp-gold'
                          )}
                        />

                        {!isSidebarCollapsed && (
                          <div className="flex-1 flex items-center justify-between min-w-0">
                            <span className="truncate">{item.label}</span>
                            {item.badge && (
                              <Badge
                                variant={item.badge.variant}
                                size="sm"
                                className="ml-2 shrink-0 py-0 text-[10px]"
                              >
                                {item.badge.text}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Collapsed Tooltip on Hover */}
                        {isSidebarCollapsed && (
                          <div className="absolute left-full ml-3 px-3 py-1.5 bg-cp-elevated text-cp-text-primary border border-cp-border rounded-lg text-xs font-semibold shadow-card whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 flex items-center gap-2">
                            <span>{item.label}</span>
                            {item.badge && (
                              <Badge variant={item.badge.variant} size="sm" className="text-[9px]">
                                {item.badge.text}
                              </Badge>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </NavLink>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Sidebar Footer: User Account Snapshot */}
      <div className="p-3 border-t border-cp-border bg-cp-card/80">
        {!isSidebarCollapsed ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-cp-elevated border border-cp-border">
            <NavLink to="/account" className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-90">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cp-gold to-cp-gold/40 flex items-center justify-center text-cp-bg font-bold text-xs">
                  {user?.avatarInitials || user?.avatar_initials || 'CP'}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-cp-positive border-2 border-cp-elevated rounded-full" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-cp-text-primary truncate">
                    {user?.displayName || user?.name || user?.fullName || 'User'}
                  </span>
                  <Badge variant="gold" size="sm" className="px-1 py-0 text-[9px]">
                    {user?.vipLevel || user?.vip_level || 'VIP 1'}
                  </Badge>
                </div>
                <span className="text-[11px] text-cp-text-muted truncate block">
                  {user?.email || 'user@coinplus.io'}
                </span>
              </div>
            </NavLink>

            <NavLink
              to="/settings"
              className="p-1.5 text-cp-text-muted hover:text-cp-gold hover:bg-cp-card rounded-lg transition-colors ml-1"
              title="Security & Settings"
            >
              <LogOut className="w-4 h-4" />
            </NavLink>
          </div>
        ) : (
          <div className="flex justify-center">
            <NavLink to="/account" className="relative group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cp-gold to-cp-gold/40 flex items-center justify-center text-cp-bg font-bold text-xs">
                {user?.avatarInitials || user?.avatar_initials || 'CP'}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-cp-positive border-2 border-cp-card rounded-full" />
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-cp-elevated text-cp-text-primary border border-cp-border rounded-lg text-xs font-semibold shadow-card whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                {user?.displayName || user?.name || user?.fullName || 'User'} ({user?.vipLevel || user?.vip_level || 'VIP 1'})
              </div>
            </NavLink>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
