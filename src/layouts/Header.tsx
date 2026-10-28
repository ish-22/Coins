import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  User,
  ShieldCheck,
  Settings,
  LogOut,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Wallet,
  X,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { Logo } from '@/components/common/Logo'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { useLayout } from '@/context/LayoutContext'
import { useAuth } from '@/context/AuthContext'
import { mockCryptoAssets } from '@/mock'

export const Header: React.FC = () => {
  const { openMobileDrawer, isSearchOpen, setSearchOpen, toggleSearch } = useLayout()
  const { user, logout } = useAuth()
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('cp-theme-mode')
      return saved === 'light' ? 'light' : 'dark'
    } catch {
      return 'dark'
    }
  })
  const [searchQuery, setSearchQuery] = useState('')

  const profileRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus search input when modal opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
  }, [isSearchOpen])

  // Apply the selected theme globally and persist it
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', themeMode)
    root.style.colorScheme = themeMode

    try {
      localStorage.setItem('cp-theme-mode', themeMode)
    } catch {
      // ignore storage errors
    }
  }, [themeMode])

  const [headerNotifications, setHeaderNotifications] = useState<
    {
      id: string
      title: string
      desc: string
      time: string
      icon: any
      isPositive: boolean
    }[]
  >([])

  useEffect(() => {
    let isMounted = true
    import('@/services/notificationService').then(({ notificationService }) => {
      notificationService
        .getNotifications()
        .then((items) => {
          if (!isMounted || !items || items.length === 0) return
          const mapped = items.slice(0, 5).map((n) => {
            const icon =
              n.category === 'trading'
                ? CheckCircle2
                : n.category === 'security'
                ? ShieldCheck
                : n.category === 'transactions'
                ? TrendingUp
                : Sparkles

            return {
              id: n.id,
              title: n.title,
              desc: n.message,
              time: n.timestamp || 'Recent',
              icon,
              isPositive: n.category !== 'security',
            }
          })
          setHeaderNotifications(mapped)
        })
        .catch(() => {})
    })

    return () => {
      isMounted = false
    }
  }, [])

  const filteredAssets = mockCryptoAssets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-cp-card/95 backdrop-blur-md border-b border-cp-border select-none">
        {/* Desktop Ticker Strip */}
        <div className="hidden xl:flex items-center justify-between px-6 py-1.5 bg-cp-bg border-b border-cp-border/60 text-xs text-cp-text-secondary">
          {/* Live mini ticker items */}
          <div className="flex items-center gap-6 overflow-hidden">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-cp-text-muted">MARKETS 24H:</span>
              {mockCryptoAssets.map((asset) => {
                const isPos = asset.change24h >= 0
                return (
                  <Link
                    key={asset.id}
                    to="/trade"
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-cp-card transition-colors"
                  >
                    <span className="font-semibold text-cp-text-primary">{asset.symbol}</span>
                    <span className="text-cp-text-primary">${asset.priceUsd.toLocaleString()}</span>
                    <span
                      className={cn(
                        'flex items-center text-[10px] font-semibold',
                        isPos ? 'text-cp-positive' : 'text-cp-negative'
                      )}
                    >
                      {isPos ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                      {isPos ? '+' : ''}{asset.change24h}%
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-cp-text-muted">24h Vol:</span>
              <span className="text-cp-text-primary font-bold">$84.25B</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-cp-text-muted">Gas:</span>
              <span className="text-cp-positive font-bold">18 Gwei</span>
            </div>
            <Badge variant="positive" size="sm" withDot pulseDot className="text-[10px] py-0">
              Operational
            </Badge>
          </div>
        </div>

        {/* Main Header Bar */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Mobile Left: Hamburger Button & Logo */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                type="button"
                onClick={openMobileDrawer}
                className="p-2 rounded-lg text-cp-text-secondary hover:text-cp-gold hover:bg-cp-elevated transition-colors"
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <Logo size="sm" showSubtitle={false} />
            </div>

            {/* Desktop Left: Quick search input */}
            <div className="hidden lg:flex items-center flex-1 max-w-md">
              <div
                onClick={() => setSearchOpen(true)}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-cp-elevated border border-cp-border text-sm text-cp-text-muted cursor-pointer hover:border-cp-border-light hover:text-cp-text-secondary transition-all group shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-cp-text-muted group-hover:text-cp-gold transition-colors" />
                  <span className="text-xs">Search coin, pair, or feature...</span>
                </div>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-semibold text-cp-text-muted bg-cp-card border border-cp-border rounded">
                  Ctrl K
                </kbd>
              </div>
            </div>

            {/* Header Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Search Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg text-cp-text-secondary hover:text-cp-gold hover:bg-cp-elevated lg:hidden transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Theme Control */}
              <button
                type="button"
                onClick={() => setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'))}
                className="p-2 rounded-lg text-cp-text-secondary hover:text-cp-gold hover:bg-cp-elevated transition-colors relative group"
                title={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label="Toggle theme mode"
                aria-pressed={themeMode === 'light'}
              >
                {themeMode === 'dark' ? (
                  <Moon className="w-5 h-5 text-cp-text-secondary group-hover:text-cp-gold transition-colors" />
                ) : (
                  <Sun className="w-5 h-5 text-cp-gold" />
                )}
              </button>

              {/* Notification Icon & Dropdown */}
              <div className="relative" ref={notificationsRef}>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-lg text-cp-text-secondary hover:text-cp-gold hover:bg-cp-elevated transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cp-gold ring-2 ring-cp-card animate-pulse" />
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-cp-elevated border border-cp-border shadow-elevated z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-cp-border">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-cp-text-primary">Notifications</span>
                        <Badge variant="gold" size="sm">3 New</Badge>
                      </div>
                      <Link
                        to="/notifications"
                        onClick={() => setNotificationsOpen(false)}
                        className="text-xs text-cp-gold hover:underline"
                      >
                        View All
                      </Link>
                    </div>

                    <div className="divide-y divide-cp-border/50 max-h-72 overflow-y-auto">
                      {headerNotifications.map((n) => {
                        const Icon = n.icon
                        return (
                          <div
                            key={n.id}
                            className="p-3.5 hover:bg-cp-card transition-colors cursor-pointer flex items-start gap-3"
                          >
                            <div className="p-2 rounded-lg bg-cp-card border border-cp-border text-cp-gold shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-cp-text-primary truncate">
                                  {n.title}
                                </span>
                                <span className="text-[10px] text-cp-text-muted">{n.time}</span>
                              </div>
                              <p className="text-xs text-cp-text-secondary mt-0.5 line-clamp-2">
                                {n.desc}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="p-2.5 border-t border-cp-border bg-cp-card text-center">
                      <Link
                        to="/notifications"
                        onClick={() => setNotificationsOpen(false)}
                        className="text-xs font-medium text-cp-text-secondary hover:text-cp-gold transition-colors"
                      >
                        Notification Settings & Preferences
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Deposit Button (Desktop) */}
              <Link to="/deposit" className="hidden sm:inline-flex">
                <Button variant="primary" size="sm">
                  Deposit
                </Button>
              </Link>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-cp-elevated transition-colors focus:outline-none"
                  aria-label="User profile menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cp-gold to-cp-gold/40 flex items-center justify-center text-cp-bg font-extrabold text-xs shadow-gold-sm">
                    {user?.avatarInitials || user?.avatar_initials || 'CP'}
                  </div>
                  <div className="hidden md:flex flex-col text-left leading-none">
                    <span className="text-xs font-bold text-cp-text-primary">
                      {user?.displayName || user?.name || user?.fullName || 'User'}
                    </span>
                    <span className="text-[10px] text-cp-gold font-medium mt-0.5">
                      {user?.vipLevel || user?.vip_level || 'VIP 1'}
                    </span>
                  </div>
                  <ChevronDown className="hidden md:block w-3.5 h-3.5 text-cp-text-muted" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-cp-elevated border border-cp-border shadow-elevated z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User summary header */}
                    <div className="p-4 border-b border-cp-border bg-cp-card/60">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cp-gold to-cp-gold/40 flex items-center justify-center text-cp-bg font-bold text-sm">
                          {user?.avatarInitials || user?.avatar_initials || 'CP'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-sm font-bold text-cp-text-primary truncate block">
                            {user?.displayName || user?.name || user?.fullName || 'User'}
                          </span>
                          <span className="text-xs text-cp-text-muted truncate block">
                            {user?.email || 'user@coinplus.io'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 p-2.5 rounded-lg bg-cp-elevated border border-cp-border flex items-center justify-between text-xs">
                        <span className="text-cp-text-muted">UID:</span>
                        <span className="font-mono font-bold text-cp-gold">{user?.uid || '—'}</span>
                      </div>
                    </div>

                    {/* Menu links */}
                    <div className="p-1.5 space-y-0.5">
                      <Link
                        to="/account"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-card transition-colors"
                      >
                        <User className="w-4 h-4 text-cp-gold" />
                        <span>My Account</span>
                      </Link>

                      <Link
                        to="/assets"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-card transition-colors"
                      >
                        <Wallet className="w-4 h-4 text-cp-gold" />
                        <span>Wallet / Assets</span>
                      </Link>

                      <Link
                        to="/kyc"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-card transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <ShieldCheck className="w-4 h-4 text-cp-positive" />
                          <span>KYC Verification</span>
                        </div>
                        <Badge variant="positive" size="sm" className="text-[9px] py-0">
                          {user?.verificationTier || user?.kyc_tier || 'Tier 0'}
                        </Badge>
                      </Link>

                      <Link
                        to="/settings"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-card transition-colors"
                      >
                        <Settings className="w-4 h-4 text-cp-gold" />
                        <span>Security & Settings</span>
                      </Link>
                    </div>

                    <div className="p-1.5 border-t border-cp-border">
                      <button
                        type="button"
                        onClick={async () => {
                          setProfileDropdownOpen(false)
                          await logout()
                          navigate('/login')
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-cp-negative hover:bg-cp-negative/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Global Quick Search Modal (Ctrl+K) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-2xl bg-cp-elevated border border-cp-border shadow-elevated overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center px-4 py-3 border-b border-cp-border gap-3">
              <Search className="w-5 h-5 text-cp-gold shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search coins, markets, or pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-cp-text-primary placeholder:text-cp-text-muted focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1 text-cp-text-muted hover:text-cp-text-primary rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-3 space-y-4">
              {/* Filtered crypto pairs */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cp-text-muted px-2 block mb-1">
                  Crypto Pairs
                </span>
                <div className="space-y-1">
                  {filteredAssets.map((asset) => (
                    <div
                      key={asset.id}
                      onClick={() => {
                        setSearchOpen(false)
                        navigate('/trade')
                      }}
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-cp-card transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cp-card border border-cp-border flex items-center justify-center font-mono font-bold text-xs text-cp-gold">
                          {asset.symbol.split('/')[0]}
                        </div>
                        <div>
                          <span className="text-sm font-bold text-cp-text-primary">
                            {asset.symbol}
                          </span>
                          <span className="text-xs text-cp-text-muted block">{asset.name}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-sm font-semibold text-cp-text-primary block">
                          ${asset.priceUsd.toLocaleString()}
                        </span>
                        <span
                          className={cn(
                            'text-xs font-mono font-semibold',
                            asset.change24h >= 0 ? 'text-cp-positive' : 'text-cp-negative'
                          )}
                        >
                          {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Navigation Links */}
              <div className="border-t border-cp-border pt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cp-text-muted px-2 block mb-1">
                  Quick Pages
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    onClick={() => {
                      setSearchOpen(false)
                      navigate('/deposit')
                    }}
                    className="p-2 rounded-lg bg-cp-card hover:bg-cp-card/80 border border-cp-border text-xs font-medium text-cp-text-primary cursor-pointer flex items-center justify-between"
                  >
                    <span>Deposit Funds</span>
                    <Badge variant="gold" size="sm">Fiat / Crypto</Badge>
                  </div>
                  <div
                    onClick={() => {
                      setSearchOpen(false)
                      navigate('/orders')
                    }}
                    className="p-2 rounded-lg bg-cp-card hover:bg-cp-card/80 border border-cp-border text-xs font-medium text-cp-text-primary cursor-pointer flex items-center justify-between"
                  >
                    <span>Order History</span>
                    <Badge variant="neutral" size="sm">Trades</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-2 bg-cp-card border-t border-cp-border text-center text-[11px] text-cp-text-muted">
              Press <kbd className="px-1.5 py-0.5 rounded bg-cp-elevated text-cp-text-primary font-mono">ESC</kbd> to close
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
