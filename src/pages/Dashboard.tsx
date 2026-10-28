import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  TrendingUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  Wallet,
  ShieldCheck,
  Award,
  RefreshCw,
  AlertCircle,
  Lock,
  Unlock,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Typography } from '@/components/common/Typography'
import { formatCurrency, formatCrypto } from '@/utils/formatters'
import {
  PortfolioChart,
  MarketOverview,
  RecentActivity,
  AnnouncementsCard,
} from '@/components/dashboard'
import { walletService } from '@/services'
import { useAuth } from '@/context/AuthContext'

export const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [hideBalances, setHideBalances] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [portfolioSummary, setPortfolioSummary] = useState({
    totalBalanceUsd: 0,
    totalBalanceBtc: 0,
    totalBalanceEur: 0,
    availableBalanceUsd: 0,
    availableBalanceBtc: 0,
    lockedBalanceUsd: 0,
    lockedBalanceBtc: 0,
    change24hUsd: 0,
    change24hPercentage: 0,
    totalAssetsCount: 0,
    verificationTier: user?.verificationTier || 'Tier 0',
    dailyWithdrawRemainingUsd: 0,
  })

  const fetchSummary = async () => {
    try {
      const summary = await walletService.getSummary()
      if (summary && summary.totalBalanceUsd >= 0) {
        setPortfolioSummary({
          totalBalanceUsd: summary.totalBalanceUsd,
          totalBalanceBtc: summary.totalBalanceBtc,
          totalBalanceEur: summary.totalBalanceEur,
          availableBalanceUsd: summary.availableBalanceUsd,
          availableBalanceBtc: summary.availableBalanceBtc,
          lockedBalanceUsd: summary.lockedBalanceUsd,
          lockedBalanceBtc: summary.lockedBalanceBtc,
          change24hUsd: summary.change24hUsd,
          change24hPercentage: summary.change24hPercentage,
          totalAssetsCount: summary.totalAssetsCount,
          verificationTier: summary.verificationTier || user?.verificationTier || 'Tier 0',
          dailyWithdrawRemainingUsd: summary.dailyWithdrawRemainingUsd,
        })
      }
    } catch {
      // Keep the current live data or empty state when the API is unavailable.
    }
  }

  React.useEffect(() => {
    fetchSummary()
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchSummary()
    setTimeout(() => {
      setIsRefreshing(false)
    }, 750)
  }

  const maskValue = (val: string) => (hideBalances ? '••••••••' : val)

  const total = portfolioSummary.totalBalanceUsd
  const availablePercent =
    total > 0
      ? ((portfolioSummary.availableBalanceUsd / total) * 100).toFixed(1)
      : '0.0'

  const lockedPercent =
    total > 0
      ? ((portfolioSummary.lockedBalanceUsd / total) * 100).toFixed(1)
      : '0.0'

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 rounded-xl bg-cp-elevated border border-cp-gold/30 text-xs shadow-sm">
        <div className="flex items-center gap-2.5">
          <Badge variant="gold" size="sm" withDot pulseDot className="shrink-0">
            LIVE ACCOUNT
          </Badge>
          <span className="text-cp-text-secondary leading-relaxed">
            Portfolio data is synced from your wallet and account profile on the backend.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-cp-text-muted hover:text-cp-gold hover:bg-cp-card transition-colors disabled:opacity-50"
            title="Refresh market & portfolio feeds"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isRefreshing && 'animate-spin text-cp-gold')} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Feeds'}</span>
          </button>
        </div>
      </div>

      {/* 1. Welcome Message & User Profile Summary */}
      <div className="relative overflow-hidden rounded-2xl border border-cp-border bg-gradient-to-r from-cp-card via-cp-elevated to-cp-card p-6 sm:p-8 shadow-card">
        {/* Ambient Gold Glow Backdrop */}
        <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-cp-gold/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* User profile avatar & details */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="relative shrink-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-cp-gold via-cp-gold/80 to-cp-gold/30 flex items-center justify-center text-cp-bg font-extrabold text-xl shadow-gold-sm">
                {user?.avatarInitials || user?.avatar_initials || 'CP'}
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-cp-positive border-2 border-cp-elevated rounded-full" />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Typography variant="h2" className="text-xl sm:text-2xl font-extrabold">
                  Welcome back, {user?.displayName || user?.name || user?.fullName || 'Trader'}
                </Typography>
                <Badge variant="gold" size="sm" withDot>
                  {user?.vipLevel || user?.vip_level || 'VIP 1'}
                </Badge>
                <Badge variant="positive" size="sm" className="hidden sm:inline-flex">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  {user?.verificationTier || user?.kyc_tier || 'Tier 0'}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-cp-text-muted font-mono">
                <span>UID: {user?.uid || '—'}</span>
                <span>•</span>
                <span>Spot Maker: <span className="text-cp-gold">0.02%</span></span>
                <span>•</span>
                <span>Spot Taker: <span className="text-cp-gold">0.04%</span></span>
                <span className="hidden md:inline">•</span>
                <span className="hidden md:inline font-sans text-cp-text-secondary">{user?.email || 'No email available'}</span>
              </div>
            </div>
          </div>

          {/* Balance display mode toggle */}
          <div className="flex items-center gap-2 self-start lg:self-auto">
            <button
              type="button"
              onClick={() => setHideBalances(!hideBalances)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cp-card border border-cp-border hover:border-cp-gold/50 text-xs font-semibold text-cp-text-secondary hover:text-cp-gold transition-colors"
            >
              {hideBalances ? (
                <>
                  <Eye className="w-4 h-4 text-cp-gold" />
                  <span>Show Balance</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4 text-cp-gold" />
                  <span>Hide Balance</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2, 3, 4. Portfolio Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total Portfolio Balance */}
        <Card variant="gold" padding="md" className="space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-cp-text-muted font-semibold uppercase tracking-wider">
              <span>Total Balance</span>
              <Info className="w-3.5 h-3.5 text-cp-text-muted" />
            </div>
            <Badge variant="gold" size="sm">
              Estimated
            </Badge>
          </div>

          <div>
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-cp-text-primary tracking-tight">
              {maskValue(formatCurrency(portfolioSummary.totalBalanceUsd))}
            </div>
            <div className="font-mono text-xs text-cp-text-muted mt-0.5">
              ≈ {maskValue(`${portfolioSummary.totalBalanceBtc.toFixed(5)} BTC`)}
            </div>
          </div>

          <div className="pt-2 border-t border-cp-border/60 flex items-center justify-between text-xs">
            <span className="text-cp-text-muted">Account Status:</span>
            <span className="text-cp-positive font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Normal
            </span>
          </div>
        </Card>

        {/* Card 2: 24h Profit / Loss */}
        <Card variant="default" padding="md" className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-cp-text-muted font-semibold uppercase tracking-wider">
              24h Profit / Loss
            </span>
            <Badge variant="positive" size="sm">
              +{Math.abs(portfolioSummary.change24hPercentage).toFixed(2)}%
            </Badge>
          </div>

          <div>
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-cp-positive tracking-tight">
              {maskValue(`+${formatCurrency(portfolioSummary.change24hUsd)}`)}
            </div>
            <div className="flex items-center gap-2 text-xs text-cp-text-muted mt-0.5">
              <span>Wallet health:</span>
              <span className="font-mono text-cp-positive font-bold">
                {portfolioSummary.totalAssetsCount} active assets
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-cp-border/60 flex items-center justify-between text-xs">
            <span className="text-cp-text-muted">Verification:</span>
            <span className="text-cp-gold font-mono font-semibold">
              {portfolioSummary.verificationTier}
            </span>
          </div>
        </Card>

        {/* Card 3: Available Balance */}
        <Card variant="default" padding="md" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-cp-text-muted font-semibold uppercase tracking-wider">
              <Unlock className="w-3.5 h-3.5 text-cp-positive" />
              <span>Available</span>
            </div>
            <Badge variant="neutral" size="sm">
              {availablePercent}%
            </Badge>
          </div>

          <div>
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-cp-text-primary tracking-tight">
              {maskValue(formatCurrency(portfolioSummary.availableBalanceUsd))}
            </div>
            <div className="font-mono text-xs text-cp-text-muted mt-0.5">
              ≈ {maskValue(`${portfolioSummary.availableBalanceBtc.toFixed(5)} BTC`)}
            </div>
          </div>

          <div className="pt-2 border-t border-cp-border/60">
            <div className="w-full bg-cp-elevated rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-cp-positive h-full rounded-full transition-all"
                style={{ width: `${availablePercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-cp-text-muted mt-1">
              <span>Ready to trade / withdraw</span>
            </div>
          </div>
        </Card>

        {/* Card 4: Locked Balance */}
        <Card variant="default" padding="md" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-cp-text-muted font-semibold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5 text-cp-gold" />
              <span>In Orders / Locked</span>
            </div>
            <Badge variant="neutral" size="sm">
              {lockedPercent}%
            </Badge>
          </div>

          <div>
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-cp-text-primary tracking-tight">
              {maskValue(formatCurrency(portfolioSummary.lockedBalanceUsd))}
            </div>
            <div className="font-mono text-xs text-cp-text-muted mt-0.5">
              ≈ {maskValue(`${portfolioSummary.lockedBalanceBtc.toFixed(5)} BTC`)}
            </div>
          </div>

          <div className="pt-2 border-t border-cp-border/60">
            <div className="w-full bg-cp-elevated rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-cp-gold h-full rounded-full transition-all"
                style={{ width: `${lockedPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-cp-text-muted mt-1">
              <span>Open Limit & Staking</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 6. Quick Action Buttons Bar */}
      <Card variant="elevated" padding="md" className="border-cp-border">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cp-gold/10 text-cp-gold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-cp-text-primary block">
                Quick Actions
              </span>
              <span className="text-xs text-cp-text-muted">
                Execute instant on-ramp, transfers, and spot orders
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-3 w-full sm:w-auto">
            {/* Action 1: Deposit */}
            <Link to="/deposit" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                fullWidth
                leftIcon={<ArrowDownToLine className="w-4 h-4" />}
              >
                Deposit
              </Button>
            </Link>

            {/* Action 2: Withdraw */}
            <Link to="/withdraw" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="md"
                fullWidth
                leftIcon={<ArrowUpFromLine className="w-4 h-4" />}
              >
                Withdraw
              </Button>
            </Link>

            {/* Action 3: Trade */}
            <Link to="/trade" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="md"
                fullWidth
                leftIcon={<ArrowLeftRight className="w-4 h-4 text-cp-gold" />}
              >
                Trade
              </Button>
            </Link>

            {/* Action 4: View Assets */}
            <Link to="/assets" className="w-full sm:w-auto">
              <Button
                variant="ghost"
                size="md"
                fullWidth
                leftIcon={<Wallet className="w-4 h-4" />}
              >
                View Assets
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* 5. Portfolio Performance Line Chart */}
      <PortfolioChart />

      {/* 7, 8, 9. Market Overview (Core BTC, ETH, SOL, BNB, XRP + Gainers/Losers/Favourites) */}
      <MarketOverview />

      {/* 10, 11, 12. Split Section: Recent Activity & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left 2 Cols: Recent Transactions & Orders */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* Right 1 Col: System Announcements & Security Notices */}
        <div>
          <AnnouncementsCard />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
