/**
 * CoinPlus Stable Demonstration Data for About Page (/about)
 * NOTE: Brand and architecture concept showcase. Does not invent company credentials or certifications.
 */

export interface PlatformFeature {
  id: string
  title: string
  subtitle: string
  description: string
  iconName: string
  tags: string[]
  routeHref: string
}

export interface DesignPrinciple {
  id: string
  title: string
  lead: string
  description: string
  badgeText: string
}

export interface AboutFAQ {
  question: string
  answer: string
}

export const BRAND_VALUES = {
  platformName: 'CoinPlus',
  tagline: 'Precision Cryptocurrency Exchange Interface',
  conceptDefinition:
    'CoinPlus is a conceptual next-generation cryptocurrency trading platform engineered to unite institutional-grade market depth, sub-millisecond visual latency, and transparent fee architecture in a modern black-and-gold design system.',
  mission:
    'To establish a cleaner, more reliable standard for digital asset trading interfaces — removing visual clutter, eliminating hidden costs, and presenting real-time market data with utmost visual clarity.',
  vision:
    'A financial ecosystem where traders at every experience level enjoy equal access to professional order books, transparent liquidity routing, and frictionless asset management without cognitive overload.',
}

export const PLATFORM_FEATURES: PlatformFeature[] = [
  {
    id: 'market-intel',
    title: 'Real-Time Market Intelligence',
    subtitle: 'High-Density Live Pricing & Metrics',
    description:
      'Continuous price updates, 24-hour volume distribution, dynamic SVG sparklines, and filterable gainers/losers rankings across leading cryptocurrency assets including BTC, ETH, SOL, BNB, and XRP.',
    iconName: 'TrendingUp',
    tags: ['Live Sparklines', '24h Volume', 'Market Dominance'],
    routeHref: '/markets',
  },
  {
    id: 'trading-terminal',
    title: 'Advanced Trading Terminal',
    subtitle: 'Institutional Order Book Depth',
    description:
      'Multi-timeframe candlestick engine with volume histograms, interactive depth ladders, limit/market/stop-limit order types, and real-time trade execution simulation.',
    iconName: 'BarChart3',
    tags: ['Multi-Timeframe', 'Depth Ladder', 'Stop-Limit Orders'],
    routeHref: '/trade',
  },
  {
    id: 'asset-custody',
    title: 'Comprehensive Asset Overview',
    subtitle: 'Portfolio Valuation & Allocation',
    description:
      'Detailed balance tracking, portfolio asset distribution charts, available vs. locked balance distinctions, and comprehensive deposit/withdrawal history logging.',
    iconName: 'Wallet',
    tags: ['Portfolio Allocation', 'Locked Balances', 'Audit Trails'],
    routeHref: '/wallet',
  },
  {
    id: 'account-tools',
    title: 'Account & Compliance Tools',
    subtitle: 'Tiered Limits & Fee Discounter',
    description:
      'Transparent verification workflows, tiered daily withdrawal quotas up to 100 BTC, personalized regional preferences, and VIP fee discount milestones.',
    iconName: 'UserCheck',
    tags: ['Tiered KYC', 'VIP Discounts', 'Session Timeout'],
    routeHref: '/account',
  },
  {
    id: 'security-design',
    title: 'Security-First Architecture',
    subtitle: 'FIDO2 Passkeys & Allowlisting',
    description:
      'Biometric authentication via WebAuthn passkeys, two-factor authentication (TOTP), withdrawal address allowlists, and automated suspicious session detection.',
    iconName: 'ShieldCheck',
    tags: ['FIDO2 Passkeys', '2FA TOTP', 'Address Allowlist'],
    routeHref: '/settings',
  },
]

export const DESIGN_PRINCIPLES: DesignPrinciple[] = [
  {
    id: 'clarity',
    title: 'Information Clarity',
    lead: 'High signal, zero unnecessary noise.',
    description:
      'Every decimal point, order depth layer, and status indicator is intentionally positioned to maximize readability in fast-moving market conditions.',
    badgeText: 'Legibility First',
  },
  {
    id: 'usability',
    title: 'Fluid Usability',
    lead: 'Desktop power meets mobile precision.',
    description:
      'Engineered with responsive layouts, touch-friendly touch targets (≥44px), and adaptive table drawers that prevent accidental mis-clicks.',
    badgeText: 'Responsive Design',
  },
  {
    id: 'transparency',
    title: 'Upfront Transparency',
    lead: 'No hidden spreads or ambiguous fees.',
    description:
      'Transparent maker/taker fee tiers, clear blockchain network gas breakdowns, and accessible fee calculators ensure traders know costs in advance.',
    badgeText: 'Transparent Limits',
  },
  {
    id: 'responsible',
    title: 'Responsible Access',
    lead: 'Safety warnings and environment boundaries.',
    description:
      'Unambiguous demonstration notices, two-step withdrawal reviews, and strict simulated boundaries ensure safe exploration without risk to real capital.',
    badgeText: 'Safety Conscious',
  },
]

export const ABOUT_FAQS: AboutFAQ[] = [
  {
    question: 'What is CoinPlus and how does it operate?',
    answer:
      'CoinPlus is a cryptocurrency trading platform design and technology showcase. It demonstrates how modern exchange frontends can provide institutional order book depth, responsive charts, and transparent fee architectures in a secure demonstration environment.',
  },
  {
    question: 'Are the order books and trades connected to real live blockchains?',
    answer:
      'No. In this version, all price feeds, order books, and transactions are simulated demonstration data. No real cryptocurrencies or fiat funds are deposited, withdrawn, or traded.',
  },
  {
    question: 'What security standards are demonstrated in CoinPlus?',
    answer:
      'CoinPlus models industry security patterns including FIDO2/WebAuthn biometric passkeys, Google Authenticator 2FA, withdrawal address allowlists, session revocation, and tiered identity verification.',
  },
  {
    question: 'Can I test all platform features without creating an external account?',
    answer:
      'Yes! You can explore all routes, including Live Markets, the Trading Terminal, Deposit/Withdraw simulators, and the Settings suite directly in your browser.',
  },
]
