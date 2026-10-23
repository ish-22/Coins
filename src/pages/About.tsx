import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  BarChart3,
  Wallet,
  ShieldCheck,
  UserCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  Lock,
  Layers,
  Zap,
  Globe,
  ExternalLink,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Logo } from '@/components/common/Logo'
import {
  BRAND_VALUES,
  PLATFORM_FEATURES,
  DESIGN_PRINCIPLES,
  ABOUT_FAQS,
} from '@/mock/aboutData'
import { ProductPreviewTabs } from '@/components/about'

export const About: React.FC = () => {
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0)

  const toggleFaq = (idx: number) => {
    setExpandedFaqIndex((prev) => (prev === idx ? null : idx))
  }

  // Feature icon helper
  const renderFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-cp-positive" />
      case 'BarChart3':
        return <BarChart3 className="w-5 h-5 text-cp-gold" />
      case 'Wallet':
        return <Wallet className="w-5 h-5 text-sky-400" />
      case 'UserCheck':
        return <UserCheck className="w-5 h-5 text-purple-400" />
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />
      default:
        return <Sparkles className="w-5 h-5 text-cp-gold" />
    }
  }

  return (
    <div className="space-y-16 max-w-7xl mx-auto pb-16 animate-in fade-in duration-200">
      
      {/* 1. PUBLIC TOP HEADER BAR */}
      <div className="p-4 rounded-2xl bg-cp-card/80 backdrop-blur-md border border-cp-border flex items-center justify-between gap-4 sticky top-4 z-30 shadow-card">
        <Link to="/about" className="shrink-0">
          <Logo size="sm" />
        </Link>

        {/* Public Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-cp-text-secondary">
          <Link to="/markets" className="hover:text-cp-gold transition-colors">
            Markets
          </Link>
          <Link to="/trade" className="hover:text-cp-gold transition-colors">
            Trade
          </Link>
          <Link to="/fees" className="hover:text-cp-gold transition-colors">
            Fees & Limits
          </Link>
          <Link to="/about" className="text-cp-gold transition-colors font-bold">
            About Concept
          </Link>
          <Link to="/support" className="hover:text-cp-gold transition-colors">
            Help Center
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <Link to="/dashboard">
            <Button variant="secondary" size="sm" className="text-xs h-8">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm" className="text-xs h-8">
              Get Started
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <div className="text-center space-y-6 pt-6 sm:pt-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cp-gold/10 border border-cp-gold/30 text-cp-gold text-xs font-semibold shadow-gold-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Cryptocurrency Exchange Concept</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-cp-text-primary max-w-4xl mx-auto leading-tight">
          Institutional Precision Meets Modern <span className="text-gold-gradient">Digital Asset UX</span>
        </h1>

        <p className="text-sm sm:text-base text-cp-text-secondary max-w-2xl mx-auto leading-relaxed">
          {BRAND_VALUES.conceptDefinition}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <Link to="/register">
            <Button variant="primary" size="lg" className="shadow-gold-md">
              Start Trading Demo <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
          <Link to="/markets">
            <Button variant="secondary" size="lg">
              Explore Live Markets
            </Button>
          </Link>
        </div>

        {/* Hero Features Strip */}
        <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto text-xs text-cp-text-secondary">
          <div className="p-3 rounded-xl bg-cp-card border border-cp-border">
            <span className="font-bold font-mono text-sm text-cp-text-primary block">Sub-ms</span>
            <span className="text-[11px]">Visual Execution Engine</span>
          </div>
          <div className="p-3 rounded-xl bg-cp-card border border-cp-border">
            <span className="font-bold font-mono text-sm text-cp-gold block">0.02% / 0.04%</span>
            <span className="text-[11px]">Transparent VIP 1 Fees</span>
          </div>
          <div className="p-3 rounded-xl bg-cp-card border border-cp-border">
            <span className="font-bold font-mono text-sm text-cp-positive block">100% Free</span>
            <span className="text-[11px]">Cryptocurrency Deposits</span>
          </div>
          <div className="p-3 rounded-xl bg-cp-card border border-cp-border">
            <span className="font-bold font-mono text-sm text-cp-text-primary block">FIDO2</span>
            <span className="text-[11px]">Biometric Passkeys</span>
          </div>
        </div>
      </div>

      {/* 3. MISSION & VISION SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 sm:p-8 border-cp-border bg-cp-card space-y-3 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-cp-gold/10 border border-cp-gold/30 flex items-center justify-center text-cp-gold mb-2">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-cp-gold uppercase tracking-wider block">Our Mission</span>
          <h3 className="text-xl font-bold text-cp-text-primary">
            Clarity, Precision, and Zero Visual Noise
          </h3>
          <p className="text-xs sm:text-sm text-cp-text-secondary leading-relaxed">
            {BRAND_VALUES.mission}
          </p>
        </Card>

        <Card className="p-6 sm:p-8 border-cp-border bg-cp-card space-y-3 relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-cp-positive/10 border border-cp-positive/30 flex items-center justify-center text-cp-positive mb-2">
            <Globe className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-cp-positive uppercase tracking-wider block">Our Vision</span>
          <h3 className="text-xl font-bold text-cp-text-primary">
            Universal Access to Institutional Order Books
          </h3>
          <p className="text-xs sm:text-sm text-cp-text-secondary leading-relaxed">
            {BRAND_VALUES.vision}
          </p>
        </Card>
      </div>

      {/* 4. PLATFORM FEATURES PILLARS */}
      <div className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <Badge variant="gold" size="sm">Core Architecture</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-cp-text-primary tracking-tight">
            Engineered for Modern Cryptocurrency Traders
          </h2>
          <p className="text-xs sm:text-sm text-cp-text-secondary">
            Explore the five pillars that power the CoinPlus trading platform concept.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLATFORM_FEATURES.map((feature) => (
            <Card
              key={feature.id}
              className="p-6 border-cp-border bg-cp-card hover:border-cp-gold/50 transition-all duration-200 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cp-elevated border border-cp-border flex items-center justify-center group-hover:scale-105 transition-transform">
                  {renderFeatureIcon(feature.iconName)}
                </div>

                <div>
                  <span className="text-[11px] font-mono text-cp-gold font-semibold block mb-0.5">
                    {feature.subtitle}
                  </span>
                  <h3 className="text-base font-bold text-cp-text-primary group-hover:text-cp-gold transition-colors">
                    {feature.title}
                  </h3>
                </div>

                <p className="text-xs text-cp-text-secondary leading-relaxed">
                  {feature.description}
                </p>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {feature.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-cp-elevated border border-cp-border text-[10px] font-mono text-cp-text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-cp-border/50">
                <Link
                  to={feature.routeHref}
                  className="inline-flex items-center gap-1.5 text-xs text-cp-gold font-semibold hover:underline"
                >
                  <span>Experience Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 5. DESIGN PRINCIPLES */}
      <div className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <Badge variant="neutral" size="sm">Product Philosophy</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-cp-text-primary tracking-tight">
            Our Four Design Principles
          </h2>
          <p className="text-xs sm:text-sm text-cp-text-secondary">
            Guiding principles that dictate how we present complex financial market data.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DESIGN_PRINCIPLES.map((dp) => (
            <div
              key={dp.id}
              className="p-5 rounded-2xl bg-cp-card border border-cp-border space-y-2.5 hover:border-cp-gold/40 transition-colors"
            >
              <Badge variant="gold" size="sm" className="text-[10px] px-1.5 py-0">
                {dp.badgeText}
              </Badge>
              <h4 className="text-sm font-bold text-cp-text-primary">{dp.title}</h4>
              <p className="text-xs font-semibold text-cp-gold">{dp.lead}</p>
              <p className="text-xs text-cp-text-secondary leading-relaxed">
                {dp.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. PRODUCT PREVIEW SECTION (Interactive Tabs) */}
      <div className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <Badge variant="gold" size="sm">Interface Showcase</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-cp-text-primary tracking-tight">
            Experience the CoinPlus Interfaces
          </h2>
          <p className="text-xs sm:text-sm text-cp-text-secondary">
            Toggle between live components from our spot trading terminal, market depth, and custody suites.
          </p>
        </div>

        <ProductPreviewTabs />
      </div>

      {/* 7. FAQ PREVIEW */}
      <Card className="border-cp-border bg-cp-card overflow-hidden shadow-card">
        <CardHeader className="border-b border-cp-border/50 pb-4">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-cp-gold" />
            <div>
              <CardTitle className="text-base text-cp-text-primary">Frequently Asked Questions</CardTitle>
              <p className="text-xs text-cp-text-secondary">Clarifications on the CoinPlus architecture and demonstration mode</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 divide-y divide-cp-border/50">
          {ABOUT_FAQS.map((faq, index) => {
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

      {/* 8. CALL TO ACTION SECTION */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cp-card via-cp-elevated to-cp-card border border-cp-gold/40 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="max-w-xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-cp-text-primary tracking-tight">
            Ready to explore the future of cryptocurrency trading?
          </h2>
          <p className="text-xs sm:text-sm text-cp-text-secondary leading-relaxed">
            Experience the complete CoinPlus demonstration platform today with live mock markets, candlestick charts, and instant simulated order books.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/register">
            <Button variant="primary" size="lg" className="shadow-gold-md">
              Create Demonstration Account <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
          <Link to="/markets">
            <Button variant="secondary" size="lg">
              Explore Live Markets
            </Button>
          </Link>
        </div>
      </div>

      {/* 9. PUBLIC FOOTER */}
      <footer className="pt-10 border-t border-cp-border/60 space-y-8 text-xs text-cp-text-secondary">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 space-y-3">
            <Logo size="sm" />
            <p className="text-xs leading-relaxed max-w-sm">
              CoinPlus is a conceptual next-generation cryptocurrency platform demonstrating high-performance market depth, transparent fee schedules, and modern security architecture.
            </p>
            <div className="text-[11px] font-mono text-cp-gold">
              Concept Demonstration Environment • Non-Custodial Simulation
            </div>
          </div>

          {/* Exchange Links */}
          <div className="space-y-2">
            <h5 className="font-bold text-cp-text-primary uppercase tracking-wider text-[11px]">Exchange</h5>
            <ul className="space-y-1.5">
              <li><Link to="/markets" className="hover:text-cp-gold transition-colors">Live Markets</Link></li>
              <li><Link to="/trade" className="hover:text-cp-gold transition-colors">Spot Terminal</Link></li>
              <li><Link to="/watchlist" className="hover:text-cp-gold transition-colors">Watchlist</Link></li>
              <li><Link to="/orders" className="hover:text-cp-gold transition-colors">Orders & Trades</Link></li>
            </ul>
          </div>

          {/* Finance & Limits */}
          <div className="space-y-1.5">
            <h5 className="font-bold text-cp-text-primary uppercase tracking-wider text-[11px]">Finance</h5>
            <ul className="space-y-1.5">
              <li><Link to="/wallet" className="hover:text-cp-gold transition-colors">My Wallet</Link></li>
              <li><Link to="/deposit" className="hover:text-cp-gold transition-colors">Deposit Assets</Link></li>
              <li><Link to="/withdraw" className="hover:text-cp-gold transition-colors">Withdraw Assets</Link></li>
              <li><Link to="/fees" className="hover:text-cp-gold transition-colors">Fees & Limits</Link></li>
            </ul>
          </div>

          {/* Account & Help */}
          <div className="space-y-1.5">
            <h5 className="font-bold text-cp-text-primary uppercase tracking-wider text-[11px]">Help & Account</h5>
            <ul className="space-y-1.5">
              <li><Link to="/account" className="hover:text-cp-gold transition-colors">My Account</Link></li>
              <li><Link to="/kyc" className="hover:text-cp-gold transition-colors">Identity KYC</Link></li>
              <li><Link to="/settings" className="hover:text-cp-gold transition-colors">Security Suite</Link></li>
              <li><Link to="/support" className="hover:text-cp-gold transition-colors">Support Desk</Link></li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Bottom */}
        <div className="pt-6 border-t border-cp-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-cp-text-secondary/80">
          <p>© {new Date().getFullYear()} CoinPlus. Demonstration project. All trademarks belong to their respective owners.</p>
          <div className="flex items-center gap-4">
            <Link to="/fees" className="hover:text-cp-gold transition-colors">Fee Schedule</Link>
            <Link to="/support" className="hover:text-cp-gold transition-colors">Terms of Demo</Link>
            <Link to="/about" className="hover:text-cp-gold transition-colors">Privacy Notice</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default About
