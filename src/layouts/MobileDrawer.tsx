import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  X,
  ArrowDownToLine,
  ArrowUpFromLine,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Headphones,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { Logo } from '@/components/common/Logo'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { useLayout } from '@/context/LayoutContext'
import { SIDEBAR_NAV_ITEMS, CATEGORY_LABELS } from '@/routes/navItems'

export const MobileDrawer: React.FC = () => {
  const { isMobileDrawerOpen, closeMobileDrawer } = useLayout()

  if (!isMobileDrawerOpen) return null

  const categories: Array<'core' | 'finance' | 'account' | 'support' | 'dev'> = [
    'core',
    'finance',
    'account',
    'support',
    'dev',
  ]

  return (
    <div className="fixed inset-0 z-50 lg:hidden select-none">
      {/* Dark backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={closeMobileDrawer}
        aria-hidden="true"
      />

      {/* Slide-out Drawer Panel */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-cp-card border-r border-cp-border shadow-elevated flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* Top Header */}
        <div className="h-16 px-4 border-b border-cp-border flex items-center justify-between">
          <Logo size="sm" showSubtitle={false} />
          <button
            type="button"
            onClick={closeMobileDrawer}
            className="p-2 rounded-lg text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="p-4 border-b border-cp-border bg-cp-elevated/40">
          <NavLink
            to="/account"
            onClick={closeMobileDrawer}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-cp-gold to-cp-gold/40 flex items-center justify-center text-cp-bg font-bold text-sm shadow-gold-sm">
                AV
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-cp-positive border-2 border-cp-card rounded-full" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-cp-text-primary truncate">Alex Vance</span>
                <Badge variant="gold" size="sm" className="px-1 py-0 text-[9px]">
                  VIP 1
                </Badge>
              </div>
              <span className="text-xs text-cp-text-muted truncate block">
                alex.v@coinplus.io
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-cp-text-muted" />
          </NavLink>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 mt-3.5">
            <NavLink to="/deposit" onClick={closeMobileDrawer} className="w-full">
              <Button
                variant="primary"
                size="sm"
                fullWidth
                leftIcon={<ArrowDownToLine className="w-3.5 h-3.5" />}
              >
                Deposit
              </Button>
            </NavLink>
            <NavLink to="/withdraw" onClick={closeMobileDrawer} className="w-full">
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                leftIcon={<ArrowUpFromLine className="w-3.5 h-3.5" />}
              >
                Withdraw
              </Button>
            </NavLink>
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {categories.map((catKey) => {
            const items = SIDEBAR_NAV_ITEMS.filter((item) => item.category === catKey)
            if (items.length === 0) return null

            return (
              <div key={catKey} className="space-y-1">
                <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-cp-text-muted">
                  {CATEGORY_LABELS[catKey]}
                </div>

                {items.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.id}
                      to={item.href}
                      onClick={closeMobileDrawer}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-cp-gold/10 text-cp-gold font-semibold border border-cp-gold/30 shadow-[inset_3px_0_0_0_#F0B93A]'
                            : 'text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-elevated'
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-3 min-w-0">
                            <Icon
                              className={cn(
                                'w-4 h-4 shrink-0',
                                isActive ? 'text-cp-gold' : 'text-cp-text-muted'
                              )}
                            />
                            <span className="truncate">{item.label}</span>
                          </div>

                          {item.badge && (
                            <Badge
                              variant={item.badge.variant}
                              size="sm"
                              className="text-[9px] py-0 shrink-0"
                            >
                              {item.badge.text}
                            </Badge>
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

        {/* Footer in Drawer */}
        <div className="p-3 border-t border-cp-border bg-cp-elevated/40 space-y-2">
          <div className="flex items-center justify-between text-xs text-cp-text-muted px-2 py-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cp-positive" />
              <span>Identity Verified</span>
            </span>
            <span className="flex items-center gap-1.5 text-cp-gold">
              <Headphones className="w-3.5 h-3.5" />
              <span>24/7 Desk</span>
            </span>
          </div>

          <button
            type="button"
            onClick={closeMobileDrawer}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold text-cp-negative hover:bg-cp-negative/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default MobileDrawer
