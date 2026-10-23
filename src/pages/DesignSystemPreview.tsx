import React, { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Search,
  CheckCircle2,
  Sliders,
  DollarSign,
  ArrowUpRight,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react'
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Input,
  Select,
  Typography,
  Logo,
} from '@/components'
import { colors } from '@/styles/theme'
import { mockCryptoAssets } from '@/mock'

export const DesignSystemPreview: React.FC = () => {
  const [amountInput, setAmountInput] = useState('1000')
  const [selectedAsset, setSelectedAsset] = useState('BTC')
  const [isTestLoading, setIsTestLoading] = useState(false)

  const colorPalette = [
    { name: 'Main Background', hex: '#080B12', token: 'bg-cp-bg', textColor: 'text-white' },
    { name: 'Card Background', hex: '#101824', token: 'bg-cp-card', textColor: 'text-white' },
    { name: 'Elevated Background', hex: '#141E2B', token: 'bg-cp-elevated', textColor: 'text-white' },
    { name: 'Gold Accent', hex: '#F0B93A', token: 'bg-cp-gold', textColor: 'text-cp-bg' },
    { name: 'Primary Text', hex: '#F4F6FA', token: 'bg-cp-text-primary', textColor: 'text-cp-bg' },
    { name: 'Secondary Text', hex: '#98A5B7', token: 'bg-cp-text-secondary', textColor: 'text-cp-bg' },
    { name: 'Border', hex: '#243042', token: 'bg-cp-border', textColor: 'text-white' },
    { name: 'Positive Green', hex: '#00D6A0', token: 'bg-cp-positive', textColor: 'text-cp-bg' },
    { name: 'Negative Red', hex: '#FF5364', token: 'bg-cp-negative', textColor: 'text-white' },
  ]

  const assetOptions = [
    { value: 'BTC', label: 'Bitcoin', sublabel: 'BTC' },
    { value: 'ETH', label: 'Ethereum', sublabel: 'ETH' },
    { value: 'SOL', label: 'Solana', sublabel: 'SOL' },
    { value: 'BNB', label: 'BNB Chain', sublabel: 'BNB' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16">
      {/* Hero Foundation Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-cp-gold/30 bg-gradient-to-b from-cp-elevated via-cp-card to-cp-bg p-8 sm:p-12 shadow-[0_0_35px_rgba(240,185,58,0.08)]">
        {/* Ambient background decoration */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-cp-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-cp-positive/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="gold" size="md" withDot pulseDot>
              FOUNDATION ACTIVE
            </Badge>
            <Badge variant="neutral" size="md">
              Frontend Design System v1.0
            </Badge>
          </div>

          <Typography variant="h1" className="text-cp-text-primary">
            CoinPlus <span className="text-cp-gold">Design System</span>
          </Typography>

          <Typography variant="body" color="secondary" className="text-base sm:text-lg">
            High-performance trading platform foundation engineered with React, TypeScript, Tailwind CSS,
            React Router, Lucide icons, and a premium black-and-gold aesthetic.
          </Typography>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Sparkles className="w-4 h-4" />}
              onClick={() => {
                setIsTestLoading(true)
                setTimeout(() => setIsTestLoading(false), 1500)
              }}
              isLoading={isTestLoading}
            >
              Test Interactive Feedback
            </Button>
            <Button variant="secondary" size="md" leftIcon={<Sliders className="w-4 h-4" />}>
              Tokens & Specs
            </Button>
          </div>
        </div>
      </section>

      {/* 1. Geometric Logo Showcase */}
      <section className="space-y-6">
        <div className="border-b border-cp-border pb-3">
          <Typography variant="h3">1. Geometric Brand Logo</Typography>
          <Typography variant="body-sm" color="secondary">
            SVG and CSS-rendered geometric hexagonal coin emblem with metallic gold gradient and precision cross insignia.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="default" className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
            <Logo size="lg" variant="horizontal" asLink={false} />
            <Typography variant="caption" color="secondary">Horizontal (Standard Header)</Typography>
          </Card>

          <Card variant="elevated" className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
            <Logo size="xl" variant="vertical" asLink={false} />
            <Typography variant="caption" color="secondary">Vertical (Auth & Splash)</Typography>
          </Card>

          <Card variant="gold" className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
            <div className="flex items-center gap-6">
              <Logo size="sm" variant="icon-only" asLink={false} />
              <Logo size="md" variant="icon-only" asLink={false} />
              <Logo size="lg" variant="icon-only" asLink={false} />
              <Logo size="xl" variant="icon-only" asLink={false} />
            </div>
            <Typography variant="caption" color="secondary">Icon Marks (sm, md, lg, xl)</Typography>
          </Card>
        </div>
      </section>

      {/* 2. Color System Palette */}
      <section className="space-y-6">
        <div className="border-b border-cp-border pb-3">
          <Typography variant="h3">2. Premium Black-and-Gold Palette</Typography>
          <Typography variant="body-sm" color="secondary">
            Defined strictly according to specifications: Main (#080B12), Card (#101824), Elevated (#141E2B), Gold (#F0B93A), Primary Text (#F4F6FA), Secondary Text (#98A5B7), Borders (#243042), Positive (#00D6A0), Negative (#FF5364).
          </Typography>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {colorPalette.map((item) => (
            <div
              key={item.name}
              className="group rounded-xl border border-cp-border bg-cp-card p-4 transition-all duration-200 hover:border-cp-border-light hover:-translate-y-0.5"
            >
              <div
                className={`w-full h-14 rounded-lg border border-cp-border/40 flex items-center justify-center font-mono text-xs font-bold ${item.token} ${item.textColor}`}
              >
                {item.hex}
              </div>
              <div className="mt-3">
                <h4 className="text-xs font-semibold text-cp-text-primary truncate">{item.name}</h4>
                <p className="text-[11px] font-mono text-cp-text-muted mt-0.5">{item.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Typography Scales */}
      <section className="space-y-6">
        <div className="border-b border-cp-border pb-3">
          <Typography variant="h3">3. Typography Scale & Tickers</Typography>
          <Typography variant="body-sm" color="secondary">
            Inter for structural interface typography and JetBrains Mono with tabular numbers for precision financial quotes.
          </Typography>
        </div>

        <Card variant="default" padding="lg" className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-cp-border/60 pb-3 gap-2">
              <span className="text-xs font-mono text-cp-text-muted">H1 / Heading 1 (48px)</span>
              <Typography variant="h1">Trade Bitcoin Instantly</Typography>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-cp-border/60 pb-3 gap-2">
              <span className="text-xs font-mono text-cp-text-muted">H2 / Heading 2 (32px)</span>
              <Typography variant="h2">Institutional Order Book</Typography>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-cp-border/60 pb-3 gap-2">
              <span className="text-xs font-mono text-cp-text-muted">H3 / Heading 3 (24px)</span>
              <Typography variant="h3">Real-Time Market Depth</Typography>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-cp-border/60 pb-3 gap-2">
              <span className="text-xs font-mono text-cp-text-muted">H4 / Section (20px)</span>
              <Typography variant="h4">Account Overview & Margin</Typography>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-cp-border/60 pb-3 gap-2">
              <span className="text-xs font-mono text-cp-text-muted">Body & Secondary (16px)</span>
              <div className="max-w-xl">
                <Typography variant="body" color="primary">
                  CoinPlus provides sub-millisecond execution with deep liquidity pools.
                </Typography>
                <Typography variant="body-sm" color="secondary" className="mt-1">
                  Protected by multi-signature cold custody and segregated reserve proofs.
                </Typography>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <span className="text-xs font-mono text-cp-text-muted">Mono Financial Tickers</span>
              <div className="flex items-center gap-6">
                <div>
                  <Typography variant="caption" color="secondary">BTC / USDT</Typography>
                  <Typography variant="mono-lg" color="positive" className="block">
                    $68,450.25
                  </Typography>
                </div>
                <div>
                  <Typography variant="caption" color="secondary">24H CHANGE</Typography>
                  <Typography variant="mono-lg" color="positive" className="block">
                    +3.42%
                  </Typography>
                </div>
                <div>
                  <Typography variant="caption" color="secondary">ETH / USDT</Typography>
                  <Typography variant="mono-lg" color="negative" className="block">
                    $3,624.80
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 4. Button Component Variants */}
      <section className="space-y-6">
        <div className="border-b border-cp-border pb-3">
          <Typography variant="h3">4. Button Variants & Trading Actions</Typography>
          <Typography variant="body-sm" color="secondary">
            Primary Gold, Secondary Card, Elevated, Outline, Ghost, and specialized Buy/Long and Sell/Short trading buttons.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="default" padding="md" className="space-y-4">
            <Typography variant="h4">Standard UI Actions</Typography>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary Gold</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="elevated">Elevated</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>

            <div className="pt-2">
              <Typography variant="caption" color="secondary" className="block mb-2">Sizes (sm, md, lg)</Typography>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" size="sm">Small (32px)</Button>
                <Button variant="primary" size="md">Medium (40px)</Button>
                <Button variant="primary" size="lg">Large (48px)</Button>
              </div>
            </div>
          </Card>

          <Card variant="elevated" padding="md" className="space-y-4">
            <Typography variant="h4">Trading Actions & States</Typography>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="success"
                leftIcon={<TrendingUp className="w-4 h-4" />}
                className="flex-1"
              >
                Buy / Long BTC
              </Button>
              <Button
                variant="danger"
                leftIcon={<TrendingDown className="w-4 h-4" />}
                className="flex-1"
              >
                Sell / Short BTC
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button variant="primary" isLoading>
                Processing
              </Button>
              <Button variant="secondary" disabled>
                Disabled
              </Button>
              <Button
                variant="outline"
                leftIcon={<ArrowUpRight className="w-4 h-4 text-cp-gold" />}
              >
                View Analytics
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* 5. Card Variants */}
      <section className="space-y-6">
        <div className="border-b border-cp-border pb-3">
          <Typography variant="h3">5. Card Surfaces & Elevation</Typography>
          <Typography variant="body-sm" color="secondary">
            Structured surfaces supporting multi-tiered depth: Default Card (#101824), Elevated (#141E2B), and Gold Glow Highlight.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="default" hoverEffect>
            <CardHeader>
              <CardTitle>Default Surface</CardTitle>
              <Badge variant="neutral" size="sm">#101824</Badge>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Base surface for markets, order books, and standard informational modules.
              </CardDescription>
            </CardContent>
            <CardFooter>
              <span className="text-xs text-cp-text-muted">Border: #243042</span>
            </CardFooter>
          </Card>

          <Card variant="elevated" hoverEffect>
            <CardHeader>
              <CardTitle>Elevated Surface</CardTitle>
              <Badge variant="gold" size="sm">#141E2B</Badge>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Elevated background for interactive modals, popovers, dropdowns, and highlighted tiles.
              </CardDescription>
            </CardContent>
            <CardFooter>
              <span className="text-xs text-cp-text-muted">High Elevation Shadow</span>
            </CardFooter>
          </Card>

          <Card variant="gold" hoverEffect>
            <CardHeader>
              <CardTitle className="text-cp-gold">Gold Accent Surface</CardTitle>
              <Badge variant="gold" size="sm" withDot>VIP 1</Badge>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Subtle gold bordered gradient for premium features, staking pools, and promo banners.
              </CardDescription>
            </CardContent>
            <CardFooter>
              <span className="text-xs text-cp-gold font-medium">0.02% Maker Rebate</span>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* 6. Form Fields & Status Badges */}
      <section className="space-y-6">
        <div className="border-b border-cp-border pb-3">
          <Typography variant="h3">6. Form Fields & Status Badges</Typography>
          <Typography variant="body-sm" color="secondary">
            Form controls with asset suffixes, focus states, and indicators.
          </Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Fields Showcase */}
          <Card variant="default" padding="lg" className="space-y-5">
            <Typography variant="h4">Trading Inputs</Typography>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Order Amount"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                suffixText="USDT"
                helperText="Available Balance: 14,250.00 USDT"
              />

              <Select
                label="Selected Asset"
                options={assetOptions}
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
              />
            </div>

            <Input
              label="Search Pairs"
              placeholder="Search BTC, ETH, SOL..."
              leftIcon={<Search className="w-4 h-4" />}
            />

            <Input
              label="Margin Limit (Error State Example)"
              defaultValue="99999999"
              suffixText="USD"
              error="Order exceeds your available margin leverage cap of 50x."
            />
          </Card>

          {/* Status Badges Showcase */}
          <Card variant="elevated" padding="lg" className="space-y-6">
            <Typography variant="h4">Status Badges & Signal Indicators</Typography>

            <div className="space-y-4">
              <div>
                <Typography variant="caption" color="secondary" className="block mb-2">Variant Styles</Typography>
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge variant="gold" withDot pulseDot>
                    VIP Tier 3
                  </Badge>
                  <Badge variant="positive" withDot>
                    24h High +8.75%
                  </Badge>
                  <Badge variant="negative" withDot>
                    24h Low -2.14%
                  </Badge>
                  <Badge variant="neutral">
                    Pending Settlement
                  </Badge>
                  <Badge variant="outline">
                    Spot Maker
                  </Badge>
                </div>
              </div>

              <div className="pt-2">
                <Typography variant="caption" color="secondary" className="block mb-2">Mock Asset Badges</Typography>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mockCryptoAssets.map((asset) => {
                    const isPos = asset.change24h >= 0
                    return (
                      <div
                        key={asset.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-cp-card border border-cp-border"
                      >
                        <div>
                          <span className="text-sm font-bold text-cp-text-primary">{asset.symbol}</span>
                          <span className="block text-[11px] text-cp-text-muted">{asset.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-sm text-cp-text-primary block">
                            ${asset.priceUsd.toLocaleString()}
                          </span>
                          <Badge variant={isPos ? 'positive' : 'negative'} size="sm">
                            {isPos ? '+' : ''}{asset.change24h}%
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 7. Foundation Status Ready Card */}
      <section>
        <Card variant="gold" padding="lg" className="border-cp-gold/40">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-cp-gold/20 text-cp-gold shrink-0">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <Typography variant="h3" className="text-cp-gold">
                  Frontend Foundation Setup Complete
                </Typography>
                <Typography variant="body-sm" color="secondary">
                  Ready for subsequent steps. Framework, TypeScript config, Tailwind tokens, geometric logo, responsive layout, and reusable components verified. Individual pages have not been built per instruction.
                </Typography>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Badge variant="gold" size="md">
                STEP 1 OF STEP-BY-STEP BUILD
              </Badge>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

export default DesignSystemPreview
