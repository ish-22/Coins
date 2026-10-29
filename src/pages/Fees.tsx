import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Coins,
  ArrowRight,
  TrendingUp,
  Percent,
  CheckCircle2,
  Sparkles,
  Info,
  ShieldCheck,
  ArrowDownToLine,
  ArrowUpFromLine,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Building,
  Zap,
  Layers,
  Scale,
  Wallet,
  ExternalLink,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Typography } from '@/components/common/Typography'
import {
  SPOT_FEE_TIERS,
  DEPOSIT_FEE_TABLE,
  WITHDRAWAL_FEE_TABLE,
  LIMIT_TIERS_TABLE,
  FEES_FAQS,
} from '@/mock/feesData'
import { FeeCalculator } from '@/components/fees'
import { useEffect } from 'react'
import apiClient from '@/services/apiClient'

export const Fees: React.FC = () => {
  // FAQ accordion state
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0)

  // Fetch live fee schedule from backend
  useEffect(() => {
    apiClient.get('/fees').catch(() => {})
  }, [])

  const toggleFaq = (index: number) => {
    setExpandedFaqIndex((prev) => (prev === index ? null : index))
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cp-text-primary">
              Fees & Limits
            </h1>
            <Badge variant="gold" size="sm">
              Transparent Pricing
            </Badge>
          </div>
          <p className="text-sm text-cp-text-secondary">
            Comprehensive breakdown of spot trading schedules, zero-fee deposits, network withdrawal fees, and tiered limits.
          </p>
        </div>

        {/* Quick Route Shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/trade">
            <Button variant="primary" size="sm" leftIcon={<TrendingUp className="w-3.5 h-3.5" />}>
              Open Trade
            </Button>
          </Link>
          <Link to="/deposit">
            <Button variant="secondary" size="sm">
              Deposit
            </Button>
          </Link>
          <Link to="/withdraw">
            <Button variant="outline" size="sm" className="border-cp-border hover:border-cp-gold">
              Withdraw
            </Button>
          </Link>
        </div>
      </div>

      {/* Demonstration Notice Banner */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-cp-card/90 border border-cp-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cp-gold/10 border border-cp-gold/30 flex items-center justify-center text-cp-gold shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div className="text-xs text-cp-text-secondary">
            <span className="font-semibold text-cp-text-primary">Demonstration Data Notice:</span> All
            maker/taker rates, network fees, and withdrawal limits shown on this page are sample demonstration
            figures for platform preview. They do not constitute binding commercial pricing.
          </div>
        </div>
        <div className="text-xs font-mono text-cp-gold shrink-0 self-end sm:self-auto bg-cp-elevated px-2.5 py-1 rounded-md border border-cp-border">
          VIP 1 Active (0.02% / 0.04%)
        </div>
      </div>

      {/* Summary Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 bg-cp-card border-cp-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-cp-text-secondary font-medium">Crypto Deposits</span>
            <ArrowDownToLine className="w-4 h-4 text-cp-positive" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cp-positive">
            0.00% Free
          </div>
          <div className="text-[11px] text-cp-text-secondary mt-1">
            Zero platform deposit fee
          </div>
        </Card>

        <Card className="p-4 bg-cp-card border-cp-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-cp-text-secondary font-medium">VIP 1 Maker Fee</span>
            <Coins className="w-4 h-4 text-cp-gold" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cp-gold">
            0.0200%
          </div>
          <div className="text-[11px] text-cp-positive mt-1">
            80% discount vs base rate
          </div>
        </Card>

        <Card className="p-4 bg-cp-card border-cp-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-cp-text-secondary font-medium">VIP 1 Taker Fee</span>
            <TrendingUp className="w-4 h-4 text-cp-gold" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cp-text-primary">
            0.0400%
          </div>
          <div className="text-[11px] text-cp-positive mt-1">
            60% discount vs base rate
          </div>
        </Card>

        <Card className="p-4 bg-cp-card border-cp-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-cp-text-secondary font-medium">Daily Limit (Tier 2)</span>
            <ShieldCheck className="w-4 h-4 text-cp-positive" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cp-gold">
            100 BTC
          </div>
          <div className="text-[11px] text-cp-text-secondary mt-1">
            ~$6,845,000 USD / 24h
          </div>
        </Card>
      </div>

      {/* 1. SPOT TRADING FEE TIERS */}
      <Card className="border-cp-border bg-cp-card overflow-hidden shadow-card">
        <CardHeader className="border-b border-cp-border/50 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <Percent className="w-5 h-5 text-cp-gold" />
              <div>
                <CardTitle className="text-base text-cp-text-primary">Spot Trading Fee Schedule</CardTitle>
                <p className="text-xs text-cp-text-secondary">Tiered fee rates evaluated based on 30-day cumulative trading volume</p>
              </div>
            </div>
            <Link to="/trade">
              <Button variant="outline" size="sm" className="h-8 text-xs border-cp-border hover:border-cp-gold">
                Start Trading <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-cp-elevated/60 text-cp-text-secondary uppercase text-[11px] font-semibold border-b border-cp-border">
                <tr>
                  <th className="py-3 px-4 sm:px-6">VIP Tier</th>
                  <th className="py-3 px-4 sm:px-6">30-Day Volume (USDT)</th>
                  <th className="py-3 px-4 sm:px-6">Maker Fee</th>
                  <th className="py-3 px-4 sm:px-6">Taker Fee</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cp-border/50 font-mono">
                {SPOT_FEE_TIERS.map((tier) => (
                  <tr
                    key={tier.tier}
                    className={`transition-colors ${
                      tier.isCurrent
                        ? 'bg-cp-gold/10 hover:bg-cp-gold/15'
                        : 'hover:bg-cp-elevated/40'
                    }`}
                  >
                    <td className="py-3.5 px-4 sm:px-6 font-bold font-sans text-cp-text-primary">
                      <div className="flex items-center gap-2">
                        <span>{tier.tier}</span>
                        {tier.isCurrent && (
                          <Badge variant="gold" size="sm" className="text-[10px] px-1 py-0">
                            Your Tier
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-cp-text-secondary">
                      {tier.volume30d}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-cp-positive">
                      {tier.makerDisplay}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-cp-gold">
                      {tier.takerDisplay}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right font-sans">
                      {tier.isCurrent ? (
                        <Badge variant="positive" size="sm" withDot>
                          Active
                        </Badge>
                      ) : (
                        <span className="text-[11px] text-cp-text-secondary">Unlocked by Volume</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 2. INTERACTIVE FEE CALCULATOR */}
      <FeeCalculator />

      {/* 3. EDUCATIONAL GUIDES (MAKER VS TAKER & NETWORK FEES) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Maker vs Taker */}
        <Card className="border-cp-border bg-cp-card p-6 space-y-4">
          <div className="flex items-center gap-2.5 border-b border-cp-border/50 pb-3">
            <Scale className="w-5 h-5 text-cp-gold" />
            <div>
              <h3 className="text-base font-bold text-cp-text-primary">Understanding Maker vs. Taker</h3>
              <p className="text-xs text-cp-text-secondary">How liquidity placement shapes your trading fees</p>
            </div>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-cp-text-secondary">
            <div className="p-3.5 rounded-xl bg-cp-elevated border border-cp-border space-y-1.5">
              <span className="font-bold text-cp-positive flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Maker (Liquidity Provider)
              </span>
              <p className="text-[11px]">
                A Maker order places an order onto the order book that does not fill immediately (e.g., a limit buy order placed below current market price). Because Makers add depth and liquidity to the exchange, CoinPlus rewards them with the lowest fee rates.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-cp-elevated border border-cp-border space-y-1.5">
              <span className="font-bold text-cp-gold flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> Taker (Liquidity Consumer)
              </span>
              <p className="text-[11px]">
                A Taker order executes instantly against existing orders already resting in the order book (e.g., market orders or aggressive limit orders). Takers consume liquidity and pay the standard taker rate for immediate execution.
              </p>
            </div>
          </div>
        </Card>

        {/* Network Fees vs Platform Fees */}
        <Card className="border-cp-border bg-cp-card p-6 space-y-4">
          <div className="flex items-center gap-2.5 border-b border-cp-border/50 pb-3">
            <Layers className="w-5 h-5 text-cp-gold" />
            <div>
              <h3 className="text-base font-bold text-cp-text-primary">Blockchain Network Fees</h3>
              <p className="text-xs text-cp-text-secondary">How gas and miner fees are calculated for withdrawals</p>
            </div>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-cp-text-secondary">
            <div className="p-3.5 rounded-xl bg-cp-elevated border border-cp-border space-y-1.5">
              <span className="font-bold text-cp-text-primary flex items-center gap-1.5">
                <Info className="w-4 h-4 text-cp-gold" /> Miner & Gas Fee Reality
              </span>
              <p className="text-[11px]">
                When withdrawing cryptocurrency, the fee deducted goes directly to blockchain miners or network validators to process your transaction. CoinPlus batches transactions where possible to keep fees at the minimum practical level.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-cp-elevated border border-cp-border space-y-1.5">
              <span className="font-bold text-cp-text-primary flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cp-positive" /> Layer-2 Efficiency
              </span>
              <p className="text-[11px]">
                Selecting modern Layer-2 networks (such as Arbitrum One for ETH or TRC-20 for USDT) provides transaction speed under 2 minutes at a fraction of the cost of Layer-1 mainnets.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* 4. DEPOSIT & WITHDRAWAL FEE TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deposit Fees */}
        <Card className="border-cp-border bg-cp-card overflow-hidden shadow-card">
          <CardHeader className="border-b border-cp-border/50 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ArrowDownToLine className="w-5 h-5 text-cp-positive" />
                <div>
                  <CardTitle className="text-base text-cp-text-primary">Deposit Fees & Limits</CardTitle>
                  <p className="text-xs text-cp-text-secondary">All cryptocurrency deposits are 100% free</p>
                </div>
              </div>
              <Link to="/deposit">
                <Button variant="outline" size="sm" className="h-7 text-xs border-cp-border hover:border-cp-gold">
                  Deposit
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-cp-elevated/60 text-cp-text-secondary uppercase text-[11px] font-semibold border-b border-cp-border">
                  <tr>
                    <th className="py-2.5 px-4">Asset</th>
                    <th className="py-2.5 px-4">Networks</th>
                    <th className="py-2.5 px-4">Deposit Fee</th>
                    <th className="py-2.5 px-4">Min Deposit</th>
                    <th className="py-2.5 px-4 text-right">Confirmations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cp-border/50 font-mono text-[11px]">
                  {DEPOSIT_FEE_TABLE.map((d) => (
                    <tr key={d.symbol} className="hover:bg-cp-elevated/40 transition-colors">
                      <td className="py-3 px-4 font-bold font-sans text-cp-text-primary">
                        {d.asset} ({d.symbol})
                      </td>
                      <td className="py-3 px-4 text-cp-text-secondary font-sans text-[11px]">
                        {d.networks}
                      </td>
                      <td className="py-3 px-4 font-bold text-cp-positive">
                        {d.fee}
                      </td>
                      <td className="py-3 px-4 text-cp-text-primary">
                        {d.minDeposit}
                      </td>
                      <td className="py-3 px-4 text-right text-cp-text-secondary font-sans">
                        {d.confirmations} ({d.speed})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal Fees */}
        <Card className="border-cp-border bg-cp-card overflow-hidden shadow-card">
          <CardHeader className="border-b border-cp-border/50 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ArrowUpFromLine className="w-5 h-5 text-cp-gold" />
                <div>
                  <CardTitle className="text-base text-cp-text-primary">Withdrawal Fees & Minimums</CardTitle>
                  <p className="text-xs text-cp-text-secondary">Network fees deducted at time of broadcast</p>
                </div>
              </div>
              <Link to="/withdraw">
                <Button variant="outline" size="sm" className="h-7 text-xs border-cp-border hover:border-cp-gold">
                  Withdraw
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-cp-elevated/60 text-cp-text-secondary uppercase text-[11px] font-semibold border-b border-cp-border">
                  <tr>
                    <th className="py-2.5 px-4">Asset</th>
                    <th className="py-2.5 px-4">Network</th>
                    <th className="py-2.5 px-4">Network Fee</th>
                    <th className="py-2.5 px-4">Min Withdrawal</th>
                    <th className="py-2.5 px-4 text-right">24h Quota</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cp-border/50 font-mono text-[11px]">
                  {WITHDRAWAL_FEE_TABLE.map((w, idx) => (
                    <tr key={`${w.symbol}-${w.network}-${idx}`} className="hover:bg-cp-elevated/40 transition-colors">
                      <td className="py-3 px-4 font-bold font-sans text-cp-text-primary">
                        {w.asset} ({w.symbol})
                      </td>
                      <td className="py-3 px-4 text-cp-text-secondary font-sans text-[11px]">
                        {w.network}
                      </td>
                      <td className="py-3 px-4 font-bold text-cp-gold">
                        {w.fee} <span className="font-normal text-[10px] text-cp-text-secondary">({w.feeUsd})</span>
                      </td>
                      <td className="py-3 px-4 text-cp-text-primary">
                        {w.minWithdraw}
                      </td>
                      <td className="py-3 px-4 text-right text-cp-text-secondary">
                        {w.dailyLimit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5. ACCOUNT QUOTAS & KYC TIERS */}
      <Card className="border-cp-border bg-cp-card overflow-hidden shadow-card">
        <CardHeader className="border-b border-cp-border/50 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-cp-positive" />
              <div>
                <CardTitle className="text-base text-cp-text-primary">Account Verification Tiers & Daily Limits</CardTitle>
                <p className="text-xs text-cp-text-secondary">Higher KYC verification levels grant elevated daily withdrawal capacities</p>
              </div>
            </div>
            <Link to="/kyc">
              <Button variant="primary" size="sm" className="h-8 text-xs">
                Upgrade Verification <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-cp-elevated/60 text-cp-text-secondary uppercase text-[11px] font-semibold border-b border-cp-border">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Verification Level</th>
                  <th className="py-3 px-4 sm:px-6">Requirements</th>
                  <th className="py-3 px-4 sm:px-6">Crypto Deposit</th>
                  <th className="py-3 px-4 sm:px-6">Fiat Deposit</th>
                  <th className="py-3 px-4 sm:px-6">24h Withdrawal Limit</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cp-border/50 text-[11px]">
                {LIMIT_TIERS_TABLE.map((tier) => (
                  <tr
                    key={tier.tier}
                    className={`transition-colors ${
                      tier.isCurrent
                        ? 'bg-cp-positive/5 hover:bg-cp-positive/10'
                        : 'hover:bg-cp-elevated/40'
                    }`}
                  >
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-cp-text-primary">
                      <div className="flex items-center gap-2">
                        <span>{tier.tier}</span>
                        {tier.isCurrent && (
                          <Badge variant="positive" size="sm" className="text-[10px] px-1.5 py-0">
                            Current Tier
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-cp-text-secondary">
                      {tier.kycRequirement}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-cp-positive font-mono">
                      {tier.cryptoDeposit}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-cp-text-primary">
                      {tier.fiatDeposit}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-cp-gold font-mono">
                      {tier.dailyWithdrawal}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      {tier.isCurrent ? (
                        <Badge variant="positive" size="sm" withDot>
                          Active
                        </Badge>
                      ) : (
                        <Link to="/kyc" className="text-cp-gold hover:underline font-semibold">
                          Verify
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 6. FAQS ACCORDION */}
      <Card className="border-cp-border bg-cp-card overflow-hidden shadow-card">
        <CardHeader className="border-b border-cp-border/50 pb-4">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-cp-gold" />
            <div>
              <CardTitle className="text-base text-cp-text-primary">Fees & Limits Frequently Asked Questions</CardTitle>
              <p className="text-xs text-cp-text-secondary">Answers to common questions regarding fees, rebates, and settlement</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 divide-y divide-cp-border/50">
          {FEES_FAQS.map((faq, index) => {
            const isExpanded = expandedFaqIndex === index

            return (
              <div key={index} className="py-3.5 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left gap-4 hover:text-cp-gold transition-colors select-none group"
                >
                  <span className="text-xs sm:text-sm font-semibold text-cp-text-primary group-hover:text-cp-gold">
                    {faq.question}
                  </span>
                  <span className="text-cp-text-secondary group-hover:text-cp-gold shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {isExpanded && (
                  <div className="mt-2.5 pl-3 text-xs text-cp-text-secondary leading-relaxed border-l border-cp-gold/40 animate-in fade-in duration-150">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Quick Cross-Navigation Links */}
      <div className="p-4 rounded-xl bg-cp-elevated/40 border border-cp-border flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-cp-text-secondary">
          <Info className="w-4 h-4 text-cp-gold" />
          <span>Need further help? Visit our customer care center.</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/trade" className="text-cp-gold hover:underline font-semibold flex items-center gap-1">
            <span>Trading Terminal</span> <ArrowRight className="w-3 h-3" />
          </Link>
          <Link to="/wallet" className="text-cp-gold hover:underline font-semibold flex items-center gap-1">
            <span>My Wallet</span> <ArrowRight className="w-3 h-3" />
          </Link>
          <Link to="/deposit" className="text-cp-gold hover:underline font-semibold flex items-center gap-1">
            <span>Deposit Assets</span> <ArrowRight className="w-3 h-3" />
          </Link>
          <Link to="/withdraw" className="text-cp-gold hover:underline font-semibold flex items-center gap-1">
            <span>Withdraw Assets</span> <ArrowRight className="w-3 h-3" />
          </Link>
          <Link to="/support" className="text-cp-gold hover:underline font-semibold flex items-center gap-1">
            <span>Help Center</span> <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Fees
