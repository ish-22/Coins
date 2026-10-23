import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  ArrowLeftRight,
  Wallet,
  UserCheck,
  ShieldCheck,
  BarChart3,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  X,
  Menu,
  Info,
  ExternalLink,
  Star,
  Zap,
  Lock,
  Globe,
  Layers,
  HelpCircle,
} from 'lucide-react'
import { Logo } from '@/components/common/Logo'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Card, CardContent } from '@/components/common/Card'
import { MarketSparkline } from '@/components/markets/MarketSparkline'
import { mockMarketItems } from '@/mock/marketsPageData'
import { ABOUT_FAQS, PLATFORM_FEATURES } from '@/mock/aboutData'
import { formatUSD } from '@/utils/formatters'

/* ─── Helper: coin emoji / short color ─────────────────────────── */
const COIN_SYMBOLS: Record<string, string> = {
  BTC: '₿',
  ETH: 'Ξ',
  SOL: '◎',
  BNB: 'B',
  XRP: '✕',
}

/* ─── Landing-page top nav (public, no sidebar) ─────────────────── */
const PublicNav: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { label: 'Markets', to: '/markets' },
    { label: 'Trade', to: '/trade' },
    { label: 'About', to: '/about' },
    { label: 'Fees', to: '/fees' },
    { label: 'Help Centre', to: '/help' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cp-border/70 bg-cp-base/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <Logo size="md" asLink={false} />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary Navigation">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="px-3 py-2 rounded-lg text-sm font-medium text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-elevated transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            <Link to="/login">
              <Button variant="secondary" size="sm">
                Log In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">
                Sign Up
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-elevated transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer panel */}
          <div className="relative ml-auto w-[280px] max-w-full h-full bg-cp-card border-l border-cp-border flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Drawer header */}
            <div className="flex items-center justify-between p-4 border-b border-cp-border">
              <Logo size="sm" asLink={false} />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated transition-colors"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-elevated transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Drawer CTAs */}
            <div className="p-4 border-t border-cp-border space-y-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block">
                <Button variant="secondary" size="md" className="w-full">
                  Log In
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="block">
                <Button variant="primary" size="md" className="w-full">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

/* ─── Sparkline wrapper for the market table ──────────────────────── */
const SparkCell: React.FC<{ data: number[]; positive: boolean }> = ({ data, positive }) => (
  <MarketSparkline data={data} isPositive={positive} width={80} height={28} />
)

/* ─── Getting-started steps ──────────────────────────────────────── */
const STEPS = [
  {
    number: '01',
    title: 'Create a Demonstration Account',
    description: 'Register in under a minute with a demonstration email. No identity documents are required to start exploring.',
    href: '/register',
    cta: 'Sign Up',
  },
  {
    number: '02',
    title: 'Explore the Live Markets Feed',
    description: 'View illustrative spot prices, 24-hour sparklines, volume rankings, and top gainers across all tracked pairs.',
    href: '/markets',
    cta: 'View Markets',
  },
  {
    number: '03',
    title: 'Open the Trading Terminal',
    description: 'Place simulated limit, market, and stop-limit orders in the advanced candlestick order book interface.',
    href: '/trade',
    cta: 'Start Trading',
  },
  {
    number: '04',
    title: 'Manage Your Portfolio',
    description: 'Review your demonstration balances, deposit history, and asset allocation from the wallet overview.',
    href: '/wallet',
    cta: 'View Wallet',
  },
]

/* ─── Platform features with icon resolver ─────────────────────────── */
function FeatureIcon({ name, className = 'w-6 h-6' }: { name: string; className?: string }) {
  switch (name) {
    case 'TrendingUp': return <TrendingUp className={className} />
    case 'BarChart3': return <BarChart3 className={className} />
    case 'Wallet': return <Wallet className={className} />
    case 'UserCheck': return <UserCheck className={className} />
    case 'ShieldCheck': return <ShieldCheck className={className} />
    default: return <Sparkles className={className} />
  }
}

const FEATURE_ACCENT: Record<string, string> = {
  'market-intel': 'text-cp-positive bg-cp-positive/10 border-cp-positive/20',
  'trading-terminal': 'text-cp-gold bg-cp-gold/10 border-cp-gold/20',
  'asset-custody': 'text-sky-400 bg-sky-400/10 border-sky-400/20',
  'account-tools': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  'security-design': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
}

/* ─── Inline mini dashboard preview (SVG illustration) ─────────────── */
const DashboardPreview: React.FC = () => (
  <div className="relative rounded-2xl overflow-hidden border border-cp-border/80 bg-cp-card shadow-2xl">
    {/* Simulated title bar */}
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-cp-border/60 bg-cp-elevated/60">
      <div className="flex gap-1.5">
        <span className="w-3 h-3 rounded-full bg-cp-negative/60" />
        <span className="w-3 h-3 rounded-full bg-cp-gold/60" />
        <span className="w-3 h-3 rounded-full bg-cp-positive/60" />
      </div>
      <span className="ml-2 text-[11px] font-mono text-cp-text-muted">CoinPlus — Trading Terminal</span>
      <div className="ml-auto flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1 text-[10px] text-cp-positive font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-cp-positive animate-pulse" />
          Simulation Active
        </span>
      </div>
    </div>

    {/* Body */}
    <div className="p-4 grid grid-cols-3 gap-3">
      {/* Left: Order book snippet */}
      <div className="col-span-1 space-y-1.5">
        <div className="text-[10px] font-semibold text-cp-text-muted uppercase tracking-wider mb-2">Order Book</div>
        {[
          { price: '68,510', qty: '0.124', type: 'sell' },
          { price: '68,490', qty: '0.302', type: 'sell' },
          { price: '68,450', qty: '0.891', type: 'sell' },
        ].map((row, i) => (
          <div key={i} className="flex justify-between text-[11px] font-mono">
            <span className="text-cp-negative">{row.price}</span>
            <span className="text-cp-text-muted">{row.qty}</span>
          </div>
        ))}
        <div className="my-1.5 text-center text-xs font-bold font-mono text-cp-gold border-y border-cp-border/60 py-1">
          68,450.25
        </div>
        {[
          { price: '68,420', qty: '0.448', type: 'buy' },
          { price: '68,390', qty: '1.021', type: 'buy' },
          { price: '68,360', qty: '0.672', type: 'buy' },
        ].map((row, i) => (
          <div key={i} className="flex justify-between text-[11px] font-mono">
            <span className="text-cp-positive">{row.price}</span>
            <span className="text-cp-text-muted">{row.qty}</span>
          </div>
        ))}
      </div>

      {/* Center: Candlestick area (SVG) */}
      <div className="col-span-2 space-y-2">
        <div className="flex items-center gap-2 text-[11px]">
          <span className="font-mono font-bold text-cp-text-primary">BTC/USDT</span>
          <span className="text-cp-positive font-semibold">+3.42%</span>
          <Badge variant="gold" size="sm">Pro Terminal</Badge>
        </div>

        {/* Minimal candlestick SVG */}
        <svg viewBox="0 0 240 80" className="w-full" fill="none">
          {/* Price line */}
          {[
            { x: 10, open: 60, close: 50, high: 45, low: 65 },
            { x: 30, open: 50, close: 40, high: 35, low: 55 },
            { x: 50, open: 40, close: 52, high: 32, low: 55 },
            { x: 70, open: 52, close: 45, high: 40, low: 58 },
            { x: 90, open: 45, close: 30, high: 25, low: 50 },
            { x: 110, open: 30, close: 20, high: 15, low: 35 },
            { x: 130, open: 20, close: 35, high: 12, low: 38 },
            { x: 150, open: 35, close: 22, high: 18, low: 40 },
            { x: 170, open: 22, close: 12, high: 8, low: 25 },
            { x: 190, open: 12, close: 18, high: 6, low: 22 },
            { x: 210, open: 18, close: 10, high: 5, low: 22 },
            { x: 230, open: 10, close: 8, high: 3, low: 14 },
          ].map((c, i) => {
            const bullish = c.close < c.open
            const color = bullish ? '#00D6A0' : '#FF5364'
            const top = Math.min(c.open, c.close)
            const height = Math.abs(c.open - c.close) || 2
            return (
              <g key={i}>
                {/* Wick */}
                <line x1={c.x} y1={c.high} x2={c.x} y2={c.low} stroke={color} strokeWidth="1" opacity="0.6" />
                {/* Body */}
                <rect x={c.x - 4} y={top} width={8} height={height} fill={color} rx="1" />
              </g>
            )
          })}
        </svg>

        {/* Mini portfolio cards */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[
            { label: 'Portfolio', value: '$14,250', change: '+3.42%', up: true },
            { label: 'Day P&L', value: '+$472', change: 'Sim.', up: true },
            { label: 'Open Orders', value: '3', change: 'Active', up: null },
          ].map((stat, i) => (
            <div key={i} className="bg-cp-elevated/60 border border-cp-border/60 rounded-lg p-2">
              <div className="text-[9px] text-cp-text-muted uppercase tracking-wide">{stat.label}</div>
              <div className="text-[12px] font-bold font-mono text-cp-text-primary mt-0.5">{stat.value}</div>
              <div className={`text-[9px] font-medium ${stat.up === true ? 'text-cp-positive' : stat.up === false ? 'text-cp-negative' : 'text-cp-text-muted'}`}>
                {stat.change}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Demo watermark */}
    <div className="absolute bottom-2 right-3 text-[9px] text-cp-text-muted/60 font-mono pointer-events-none select-none">
      Demonstration Data Only
    </div>
  </div>
)

/* ─── Public footer ──────────────────────────────────────────────── */
const PublicFooter: React.FC = () => (
  <footer className="border-t border-cp-border bg-cp-card/50 text-cp-text-secondary">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
        {/* Brand */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-2">
          <Logo size="md" asLink={false} />
          <p className="mt-4 text-sm text-cp-text-muted max-w-xs leading-relaxed">
            CoinPlus is a conceptual cryptocurrency trading platform demonstration. No real trading, custody, or financial services are offered.
          </p>
        </div>

        {/* Platform */}
        <div>
          <h5 className="text-xs font-bold text-cp-text-primary tracking-wider uppercase mb-4">Platform</h5>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/markets" className="hover:text-cp-gold transition-colors">Live Markets</Link></li>
            <li><Link to="/trade" className="hover:text-cp-gold transition-colors">Trade</Link></li>
            <li><Link to="/wallet" className="hover:text-cp-gold transition-colors">Wallet</Link></li>
            <li><Link to="/fees" className="hover:text-cp-gold transition-colors">Fees & Limits</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h5 className="text-xs font-bold text-cp-text-primary tracking-wider uppercase mb-4">Company</h5>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="hover:text-cp-gold transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-cp-gold transition-colors">Contact</Link></li>
            <li><Link to="/status" className="hover:text-cp-gold transition-colors">System Status</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h5 className="text-xs font-bold text-cp-text-primary tracking-wider uppercase mb-4">Support</h5>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/help" className="hover:text-cp-gold transition-colors">Help Centre</Link></li>
            <li><Link to="/support" className="hover:text-cp-gold transition-colors">Support Tickets</Link></li>
            <li><Link to="/kyc" className="hover:text-cp-gold transition-colors">KYC Verification</Link></li>
            <li><Link to="/settings" className="hover:text-cp-gold transition-colors">Security & Settings</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 pt-8 border-t border-cp-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cp-text-muted">
        <p>© {new Date().getFullYear()} CoinPlus Exchange Ltd. All rights reserved.</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/terms" className="hover:text-cp-gold transition-colors">Terms of Service</Link>
          <Link to="/privacy" className="hover:text-cp-gold transition-colors">Privacy Policy</Link>
          <Link to="/risk-disclosure" className="hover:text-cp-gold transition-colors">Risk Disclosure</Link>
          <Link to="/compliance" className="hover:text-cp-gold transition-colors">Compliance Framework</Link>
        </div>
      </div>
    </div>
  </footer>
)

/* ─── Landing page ───────────────────────────────────────────────── */
export const Landing: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)

  // Pick the 5 hero coins for the market strip
  const heroCoins = mockMarketItems.filter((m) =>
    ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple'].includes(m.id)
  )

  return (
    <div className="min-h-screen bg-cp-base text-cp-text-primary overflow-x-hidden">
      <PublicNav />

      {/* ══════════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
        {/* Background radial glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-cp-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-cp-positive/5 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy */}
            <div className="space-y-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cp-gold/10 border border-cp-gold/25 text-cp-gold text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Demonstration Trading Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-cp-text-primary tracking-tight leading-[1.08]">
                Trade Smarter.{' '}
                <span className="bg-gradient-to-r from-cp-gold to-cp-gold/60 bg-clip-text text-transparent">
                  Go Further.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-cp-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed">
                CoinPlus is a conceptual high-performance cryptocurrency trading interface. Explore a
                professional-grade order book, live market data, and portfolio tools — all in a
                transparent demonstration environment.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Link to="/markets">
                  <Button variant="primary" size="lg">
                    Explore Markets
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" size="lg">
                    Create Account
                  </Button>
                </Link>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-cp-text-muted">
                {[
                  { icon: <ShieldCheck className="w-3.5 h-3.5 text-cp-positive" />, label: 'Demonstration Security' },
                  { icon: <Zap className="w-3.5 h-3.5 text-cp-gold" />, label: 'Sub-ms Simulated Matching' },
                  { icon: <Lock className="w-3.5 h-3.5 text-purple-400" />, label: 'FIDO2 Passkey Design' },
                ].map((t) => (
                  <span key={t.label} className="flex items-center gap-1.5">
                    {t.icon}
                    {t.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Dashboard preview */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-cp-gold/10 via-transparent to-cp-positive/5 rounded-3xl blur-xl pointer-events-none" />
              <div className="relative">
                <DashboardPreview />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          MARKET OVERVIEW STRIP
      ══════════════════════════════════════════════════════════ */}
      <section className="border-y border-cp-border bg-cp-card/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Sample-data label */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-cp-text-primary flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cp-gold" />
              Sample Market Prices
            </h2>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-cp-text-muted bg-cp-elevated border border-cp-border px-2.5 py-1 rounded-full">
              <Info className="w-3 h-3 text-cp-gold" />
              Illustrative data — not live prices
            </span>
          </div>

          {/* Coin cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {heroCoins.map((coin) => {
              const isUp = coin.change24h >= 0
              return (
                <Link
                  key={coin.id}
                  to={`/trade?pair=${coin.pair}`}
                  className="group p-4 rounded-xl bg-cp-elevated/40 hover:bg-cp-elevated border border-cp-border hover:border-cp-gold/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-cp-card border border-cp-border flex items-center justify-center text-sm font-bold text-cp-gold">
                        {COIN_SYMBOLS[coin.symbol] || coin.symbol[0]}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-cp-text-primary">{coin.symbol}</div>
                        <div className="text-[10px] text-cp-text-muted">{coin.name}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-bold font-mono text-cp-text-primary">
                      {formatUSD(coin.priceUsd)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${isUp ? 'text-cp-positive' : 'text-cp-negative'}`}>
                        {isUp ? '+' : ''}{coin.change24h.toFixed(2)}%
                      </span>
                      <SparkCell data={coin.sparkline} positive={isUp} />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="mt-4 text-center">
            <Link to="/markets" className="inline-flex items-center gap-1.5 text-xs text-cp-gold hover:underline font-semibold">
              View all trading pairs
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PLATFORM FEATURES
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
            <Badge variant="gold" size="md">
              Platform Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-cp-text-primary tracking-tight">
              Everything You Need to Trade Effectively
            </h2>
            <p className="text-cp-text-secondary text-sm sm:text-base leading-relaxed">
              CoinPlus models the interface patterns of professional cryptocurrency exchanges — from
              order book depth ladders to biometric security workflows.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PLATFORM_FEATURES.map((feat) => {
              const accent = FEATURE_ACCENT[feat.id] || 'text-cp-gold bg-cp-gold/10 border-cp-gold/20'
              return (
                <Link
                  key={feat.id}
                  to={feat.routeHref}
                  className="group p-6 rounded-2xl bg-cp-card hover:bg-cp-elevated border border-cp-border hover:border-cp-gold/40 transition-all duration-200 flex flex-col gap-4"
                >
                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${accent}`}>
                    <FeatureIcon name={feat.iconName} className="w-5 h-5" />
                  </div>

                  {/* Copy */}
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-cp-text-primary group-hover:text-cp-gold transition-colors mb-1">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-cp-text-muted leading-relaxed">{feat.description}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {feat.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded bg-cp-elevated border border-cp-border text-cp-text-muted">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Explore arrow */}
                  <div className="flex items-center gap-1 text-xs text-cp-gold font-semibold">
                    Explore <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              )
            })}

            {/* Security-conscious design extra card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-cp-card to-cp-elevated/50 border border-cp-gold/30 flex flex-col gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center border text-cp-gold bg-cp-gold/10 border-cp-gold/20">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-cp-text-primary mb-1">Design System & Tokens</h3>
                <p className="text-xs text-cp-text-muted leading-relaxed">
                  Consistent black-and-gold design language with accessible colour tokens, refined typography, and a responsive component library.
                </p>
              </div>
              <Link to="/design-system">
                <span className="flex items-center gap-1 text-xs text-cp-gold font-semibold hover:underline">
                  View Components <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PLATFORM INTERFACE PREVIEW (product screenshot strip)
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-cp-card/40 via-cp-base to-cp-card/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
            <Badge variant="neutral" size="md">
              Interface Preview
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-cp-text-primary tracking-tight">
              A Professional-Grade Trading Environment
            </h2>
            <p className="text-cp-text-secondary text-sm sm:text-base leading-relaxed">
              Navigate a full-featured spot trading terminal with candlestick charts, live order book
              depth, and one-click order placement — all in demonstration mode.
            </p>
          </div>

          {/* Large preview */}
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute -inset-6 bg-gradient-to-r from-cp-gold/5 via-cp-positive/5 to-cp-gold/5 rounded-3xl blur-2xl pointer-events-none" />
            <div className="relative rounded-2xl overflow-hidden border border-cp-border shadow-2xl bg-cp-card">
              {/* Chrome bar */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-cp-border bg-cp-elevated/80">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-cp-negative/50" />
                  <span className="w-3 h-3 rounded-full bg-cp-gold/50" />
                  <span className="w-3 h-3 rounded-full bg-cp-positive/50" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[11px] font-mono text-cp-text-muted bg-cp-card border border-cp-border px-3 py-0.5 rounded-md">
                    coinplus.demo/trade?pair=BTC/USDT
                  </span>
                </div>
              </div>

              {/* Content grid preview */}
              <div className="p-5 grid grid-cols-12 gap-4 min-h-[280px]">
                {/* Sidebar strip */}
                <div className="col-span-2 hidden sm:block space-y-2">
                  {['Dashboard', 'Markets', 'Trade', 'Wallet', 'Orders'].map((item, i) => (
                    <div
                      key={item}
                      className={`px-3 py-2 rounded-lg text-xs font-medium ${i === 2 ? 'bg-cp-gold/15 text-cp-gold' : 'text-cp-text-muted'}`}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                {/* Chart area */}
                <div className="col-span-10 sm:col-span-7 bg-cp-elevated/50 rounded-xl border border-cp-border/60 p-3 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold font-mono text-cp-text-primary">BTC / USDT</span>
                    <span className="text-sm font-mono font-bold text-cp-positive">$68,450.25</span>
                    <span className="text-xs text-cp-positive">+3.42%</span>
                  </div>
                  <svg viewBox="0 0 400 120" className="w-full" fill="none">
                    {[
                      [0, 80], [30, 72], [60, 78], [90, 65], [120, 58], [150, 52],
                      [180, 45], [210, 55], [240, 42], [270, 35], [300, 28], [330, 20], [360, 18], [400, 15]
                    ].reduce((acc, pt, i, arr) => {
                      if (i === 0) return acc
                      const prev = arr[i - 1]
                      return [...acc, { x1: prev[0], y1: prev[1], x2: pt[0], y2: pt[1] }]
                    }, [] as { x1: number; y1: number; x2: number; y2: number }[]).map((seg, i) => (
                      <line key={i} x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2} stroke="#F0B93A" strokeWidth="2" />
                    ))}
                    {/* Area fill */}
                    <path
                      d="M0 80 L30 72 L60 78 L90 65 L120 58 L150 52 L180 45 L210 55 L240 42 L270 35 L300 28 L330 20 L360 18 L400 15 L400 120 L0 120 Z"
                      fill="url(#heroGradient)"
                      opacity="0.15"
                    />
                    <defs>
                      <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F0B93A" />
                        <stop offset="100%" stopColor="#F0B93A" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Order form snippet */}
                <div className="col-span-12 sm:col-span-3 space-y-3">
                  <div className="flex gap-1">
                    <div className="flex-1 text-center py-1.5 text-xs font-semibold rounded-lg bg-cp-positive/20 text-cp-positive">Buy</div>
                    <div className="flex-1 text-center py-1.5 text-xs font-semibold rounded-lg text-cp-text-muted bg-cp-elevated">Sell</div>
                  </div>
                  <div className="space-y-2">
                    {['Price (USDT)', 'Amount (BTC)', 'Total'].map((f) => (
                      <div key={f} className="px-3 py-2 rounded-lg bg-cp-elevated border border-cp-border">
                        <div className="text-[9px] text-cp-text-muted">{f}</div>
                        <div className="text-xs font-mono text-cp-text-muted mt-0.5">
                          {f === 'Price (USDT)' ? '68,450.25' : f === 'Amount (BTC)' ? '0.0100' : '684.50'}
                        </div>
                      </div>
                    ))}
                    <div className="w-full py-2 rounded-lg bg-cp-positive/80 text-[11px] font-bold text-center text-white">
                      Buy BTC (Simulated)
                    </div>
                  </div>
                </div>
              </div>

              {/* Watermark */}
              <div className="border-t border-cp-border/60 px-4 py-2 flex items-center justify-end">
                <span className="text-[10px] text-cp-text-muted font-mono">⚠ Demonstration data. No real trades executed.</span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link to="/trade">
              <Button variant="primary" size="md">
                Open Trading Terminal
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          GETTING STARTED STEPS
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
            <Badge variant="positive" size="md">
              Quick Start
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-cp-text-primary tracking-tight">
              Up and Trading in Minutes
            </h2>
            <p className="text-cp-text-secondary text-sm sm:text-base leading-relaxed">
              CoinPlus is a frontend demonstration. No real financial account is required — explore
              every feature instantly with sample balances.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={step.number} className="relative group">
                {/* Connector line (desktop) */}
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-cp-border to-transparent z-0" />
                )}

                <div className="relative z-10 p-6 rounded-2xl bg-cp-card border border-cp-border hover:border-cp-gold/40 group-hover:bg-cp-elevated/40 transition-all h-full flex flex-col gap-4">
                  {/* Step number */}
                  <div className="w-12 h-12 rounded-xl bg-cp-gold/10 border border-cp-gold/25 flex items-center justify-center shrink-0">
                    <span className="text-lg font-black text-cp-gold font-mono">{step.number}</span>
                  </div>

                  <div className="flex-1 space-y-2">
                    <h3 className="text-base font-bold text-cp-text-primary">{step.title}</h3>
                    <p className="text-xs text-cp-text-muted leading-relaxed">{step.description}</p>
                  </div>

                  <Link to={step.href} className="inline-flex items-center gap-1.5 text-xs text-cp-gold font-semibold hover:underline">
                    {step.cta} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FAQ PREVIEW
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 bg-cp-card/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-4">
            <Badge variant="neutral" size="md">
              FAQ
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-cp-text-primary tracking-tight">
              Common Questions
            </h2>
          </div>

          <div className="space-y-3">
            {ABOUT_FAQS.map((faq, i) => {
              const isOpen = expandedFaq === i
              return (
                <div
                  key={i}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isOpen ? 'bg-cp-card border-cp-gold/40' : 'bg-cp-card border-cp-border hover:border-cp-border-light'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="text-sm font-semibold text-cp-text-primary">{faq.question}</span>
                    <div className={`shrink-0 p-1.5 rounded-lg border transition-colors ${isOpen ? 'bg-cp-gold/15 text-cp-gold border-cp-gold/30' : 'bg-cp-elevated text-cp-text-muted border-cp-border'}`}>
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-sm text-cp-text-secondary leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-8 text-center">
            <Link to="/help">
              <Button variant="outline" size="md">
                <HelpCircle className="w-4 h-4 mr-2" />
                View Full Help Centre
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CALL TO ACTION BAND
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-cp-gold/40 bg-gradient-to-br from-cp-card via-cp-elevated/80 to-cp-card p-8 sm:p-14 text-center shadow-2xl">
            <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-cp-gold/8 rounded-full blur-3xl" />

            <div className="relative space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cp-gold/10 border border-cp-gold/25 text-cp-gold text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Ready to Explore?
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-cp-text-primary tracking-tight">
                Start Your Demonstration Journey
              </h2>

              <p className="text-cp-text-secondary text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                Sign up instantly and access the full CoinPlus simulation — live market data,
                professional order books, portfolio tools, and institutional security patterns.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link to="/register">
                  <Button variant="primary" size="lg">
                    Create Free Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/markets">
                  <Button variant="outline" size="lg">
                    Browse Markets
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          RISK DISCLOSURE
      ══════════════════════════════════════════════════════════ */}
      <section className="py-12 border-t border-cp-border bg-cp-card/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 p-6 rounded-2xl bg-cp-elevated/40 border border-cp-border">
            <div className="shrink-0 mt-0.5">
              <Info className="w-5 h-5 text-cp-gold" />
            </div>
            <div className="space-y-2 text-xs text-cp-text-muted leading-relaxed">
              <p className="text-sm font-semibold text-cp-text-secondary">Risk Disclosure & Demonstration Notice</p>
              <p>
                CoinPlus is a <strong>cryptocurrency trading platform interface demonstration</strong>. It does not operate a regulated exchange,
                offer financial services, custody real digital assets, or execute transactions on any live blockchain network.
                All balances, prices, trades, and order book data shown are simulated for educational and interface design showcase purposes only.
              </p>
              <p>
                Trading digital assets involves substantial market risk, including the potential loss of your entire invested capital.
                Past illustrative performance shown in any demonstration material does not represent future results.
                This platform does not provide investment, tax, or legal advice.
              </p>
              <p>
                Sample market prices displayed are <strong>illustrative only</strong> and do not represent live cryptocurrency valuations.
                Do not make investment decisions based on any data shown in this demonstration environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}

export default Landing
