import React from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronRight,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Typography } from '@/components/common/Typography'

export interface PagePlaceholderProps {
  title: string
  subtitle: string
  category: string
  icon: React.ComponentType<{ className?: string }>
  routePath: string
  stats?: { label: string; value: string; change?: string; isPositive?: boolean }[]
  suggestedRoutes?: { label: string; href: string }[]
}

export const PagePlaceholder: React.FC<PagePlaceholderProps> = ({
  title,
  subtitle,
  category,
  icon: Icon,
  routePath,
  stats = [],
  suggestedRoutes = [
    { label: 'Trade (Spot)', href: '/trade' },
    { label: 'Live Markets', href: '/markets' },
    { label: 'Deposit', href: '/deposit' },
    { label: 'Wallet', href: '/assets' },
  ],
}) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-cp-text-muted">
        <Link to="/dashboard" className="hover:text-cp-gold transition-colors">
          CoinPlus
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-cp-border-light" />
        <span className="text-cp-text-secondary">{category}</span>
        <ChevronRight className="w-3.5 h-3.5 text-cp-border-light" />
        <span className="text-cp-gold font-medium">{title}</span>
      </nav>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-cp-border bg-gradient-to-r from-cp-card via-cp-elevated to-cp-card p-6 sm:p-8 shadow-card">
        {/* Ambient gold glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-cp-gold/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-cp-gold/20 to-cp-gold/5 border border-cp-gold/30 text-cp-gold shrink-0 shadow-gold-sm">
              <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <Typography variant="h2" className="text-cp-text-primary">
                  {title}
                </Typography>
                <Badge variant="gold" size="sm" withDot pulseDot>
                  Active Route
                </Badge>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-cp-border/60 text-cp-text-secondary">
                  {routePath}
                </span>
              </div>
              <Typography variant="body-sm" color="secondary" className="max-w-2xl">
                {subtitle}
              </Typography>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link to="/trade">
              <Button variant="primary" size="sm">
                Open Trade Engine
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Domain Highlight Stats (if any) */}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} variant="default" padding="sm" className="space-y-1">
              <span className="text-xs text-cp-text-muted">{stat.label}</span>
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-lg sm:text-xl font-bold text-cp-text-primary">
                  {stat.value}
                </span>
                {stat.change && (
                  <span
                    className={`text-xs font-mono font-medium ${
                      stat.isPositive ? 'text-cp-positive' : 'text-cp-negative'
                    }`}
                  >
                    {stat.change}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Route & Layout Verification Status Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="elevated" padding="lg" className="lg:col-span-2 space-y-4">
          <CardHeader className="border-b-0 pb-0 mb-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cp-positive/10 text-cp-positive">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">Navigation & Layout Connected</CardTitle>
                <span className="text-xs text-cp-text-muted">
                  Responsive desktop sidebar, mobile header, bottom nav, and drawer are active.
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-cp-card border border-cp-border/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-cp-text-secondary">
                <span>Layout Step 2 Target:</span>
                <span className="text-cp-gold font-mono">Shared Responsive Shell</span>
              </div>
              <p className="text-xs text-cp-text-muted leading-relaxed">
                This page is accessible via the desktop sidebar, mobile bottom navigation, and slide-out drawer.
                Specific trading features, order execution modules, and dashboard widgets will be built in the next step.
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-cp-text-secondary block mb-2.5">
                Quick Navigation Test Links:
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestedRoutes.map((route) => (
                  <Link key={route.href} to={route.href}>
                    <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      {route.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick System Info Card */}
        <Card variant="gold" padding="lg" className="space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cp-gold" />
                <span className="text-xs font-bold uppercase tracking-wider text-cp-gold">
                  System Health
                </span>
              </div>
              <Badge variant="positive" size="sm" withDot pulseDot>
                Online
              </Badge>
            </div>

            <Typography variant="body-sm" color="secondary">
              Trading engines and WebSocket feeds are responding with sub-millisecond roundtrips.
            </Typography>

            <div className="space-y-2 pt-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-cp-border/60">
                <span className="text-cp-text-muted">Matching Engine:</span>
                <span className="text-cp-positive font-semibold">&lt; 0.8ms</span>
              </div>
              <div className="flex justify-between py-1 border-b border-cp-border/60">
                <span className="text-cp-text-muted">WebSocket Feeds:</span>
                <span className="text-cp-positive font-semibold">100% Uptime</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-cp-text-muted">Compliance:</span>
                <span className="text-cp-gold font-semibold">Tier 3 Verified</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link to="/design-system" className="w-full block">
              <Button variant="secondary" size="sm" fullWidth leftIcon={<Layers className="w-3.5 h-3.5" />}>
                View Design Tokens
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default PagePlaceholder
