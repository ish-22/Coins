/**
 * CoinPlus Stable Demonstration Data for Help Centre (/help)
 * NOTE: Educational and self-service knowledge base demonstration data.
 */

export type HelpCategoryId =
  | 'getting_started'
  | 'account_login'
  | 'markets_trading'
  | 'wallet_assets'
  | 'deposits'
  | 'withdrawals'
  | 'identity_kyc'
  | 'security_privacy'

export interface HelpCategory {
  id: HelpCategoryId
  title: string
  shortLabel: string
  description: string
  iconName: string
  articleCount: number
}

export interface HelpArticle {
  id: string
  categoryId: HelpCategoryId
  title: string
  summary: string
  content: string[]
  keySteps?: string[]
  relatedArticleIds: string[]
  lastUpdated: string
  readTime: string
  helpfulVotes: number
  unhelpfulVotes: number
  popular?: boolean
}

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: 'getting_started',
    title: 'Getting Started',
    shortLabel: 'Overview',
    description: 'Platform orientation, demonstration mode, demo balances, and initial steps',
    iconName: 'Rocket',
    articleCount: 3,
  },
  {
    id: 'account_login',
    title: 'Account and Login',
    shortLabel: 'Account',
    description: 'Password recovery, profile settings, and session inactivity timeouts',
    iconName: 'User',
    articleCount: 3,
  },
  {
    id: 'markets_trading',
    title: 'Markets and Trading',
    shortLabel: 'Trading',
    description: 'Spot order books, Limit vs. Market orders, charts, and fee discounts',
    iconName: 'TrendingUp',
    articleCount: 3,
  },
  {
    id: 'wallet_assets',
    title: 'Wallet and Assets',
    shortLabel: 'Wallet',
    description: 'Portfolio valuation, token balances, locked funds, and asset distribution',
    iconName: 'Wallet',
    articleCount: 3,
  },
  {
    id: 'deposits',
    title: 'Deposits',
    shortLabel: 'Deposits',
    description: 'Network confirmations, destination memos, QR scanning, and minimum limits',
    iconName: 'ArrowDownToLine',
    articleCount: 3,
  },
  {
    id: 'withdrawals',
    title: 'Withdrawals',
    shortLabel: 'Withdrawals',
    description: 'Blockchain network fees, daily quotas, 2FA confirmations, and status checks',
    iconName: 'ArrowUpFromLine',
    articleCount: 3,
  },
  {
    id: 'identity_kyc',
    title: 'Identity Verification',
    shortLabel: 'KYC',
    description: 'Tier requirements, acceptable documents, proof of address, and review turnaround',
    iconName: 'ShieldCheck',
    articleCount: 3,
  },
  {
    id: 'security_privacy',
    title: 'Security and Privacy',
    shortLabel: 'Security',
    description: 'FIDO2 Passkeys, Google 2FA, withdrawal allowlists, and device audit logs',
    iconName: 'Lock',
    articleCount: 3,
  },
]

export const POPULAR_HELP_QUERIES = [
  'How to deposit crypto',
  'Tier 2 KYC requirements',
  'Reset 2FA authenticator',
  'Maker vs Taker fees',
  'Withdrawal address allowlist',
  'Unlock locked funds',
]

export const HELP_ARTICLES: HelpArticle[] = [
  // 1. Getting Started
  {
    id: 'art-gs-1',
    categoryId: 'getting_started',
    title: 'Understanding the CoinPlus Demonstration Environment',
    summary: 'How CoinPlus operates as an interface concept and non-custodial demonstration trading platform.',
    content: [
      'CoinPlus is engineered as an institutional-grade cryptocurrency platform concept designed to showcase modern trading interfaces, transparent fee schedules, and responsive user experiences.',
      'In this demonstration version, all order book depth, price charts, asset balances, and blockchain confirmations are simulated. No real capital, actual fiat, or live cryptocurrency is deposited or traded.',
      'Users can freely explore spot trading terminal controls, place simulated limit and market orders, test 2FA verification workflows, and manage mock portfolios without financial risk.',
    ],
    keySteps: [
      'Navigate to Live Markets to inspect real-time coin quotes and sparklines.',
      'Open the Trade page to place simulated Limit, Market, or Stop-Limit orders.',
      'Visit the Deposit and Withdraw pages to review simulated blockchain workflows.',
    ],
    relatedArticleIds: ['art-mt-1', 'art-wa-1', 'art-sec-1'],
    lastUpdated: 'October 2026',
    readTime: '3 min read',
    helpfulVotes: 142,
    unhelpfulVotes: 4,
    popular: true,
  },
  {
    id: 'art-gs-2',
    categoryId: 'getting_started',
    title: 'How to Place Your First Simulated Spot Trade',
    summary: 'A step-by-step walkthrough for configuring order amounts, review confirmations, and order execution.',
    content: [
      'To practice trading on CoinPlus, navigate to the Trade page from the sidebar navigation. The interface default is set to BTC/USDT.',
      'Select whether you want to execute a Limit order (buy or sell at a fixed price) or a Market order (execute immediately at current market price).',
      'Enter the quantity you wish to trade or use the quick percentage buttons (25%, 50%, 75%, 100%) to allocate available demo balance.',
      'Click Review Order to inspect the order confirmation summary. Once confirmed, the order appears immediately in the Open Orders book or fills against market depth.',
    ],
    keySteps: [
      'Choose your trading pair from the top pair selector.',
      'Specify Order Type (Limit, Market, or Stop-Limit).',
      'Enter Limit Price and Amount, then click Buy or Sell.',
      'Confirm the transaction modal to record the simulated trade.',
    ],
    relatedArticleIds: ['art-gs-1', 'art-mt-1', 'art-mt-2'],
    lastUpdated: 'October 2026',
    readTime: '4 min read',
    helpfulVotes: 98,
    unhelpfulVotes: 2,
    popular: true,
  },
  {
    id: 'art-gs-3',
    categoryId: 'getting_started',
    title: 'Exploring Demo Balances and Resetting Data',
    summary: 'How simulated wallet balances are tracked and how to reset demonstration records.',
    content: [
      'Your CoinPlus demonstration profile begins with pre-loaded mock assets including Bitcoin (BTC), Ethereum (ETH), Tether (USDT), and Solana (SOL).',
      'Whenever you submit simulated trades or withdrawals, your local wallet balance updates accordingly within your browser session.',
      'If you wish to restore initial balances or clear modified orders, you can reset demonstration data directly in the Settings or Account pages.',
    ],
    relatedArticleIds: ['art-wa-1', 'art-acc-1'],
    lastUpdated: 'October 2026',
    readTime: '2 min read',
    helpfulVotes: 54,
    unhelpfulVotes: 1,
  },

  // 2. Account and Login
  {
    id: 'art-acc-1',
    categoryId: 'account_login',
    title: 'Managing Personal Preferences and Interface Language',
    summary: 'Customizing display names, regional time zones, display currencies, and landing views.',
    content: [
      'CoinPlus allows traders to personalize their platform experience from the My Account (/account) dashboard.',
      'Available settings include preferred valuation currencies (USD, EUR, GBP, JPY), interface languages, time zones, and default landing screens (Pro Terminal, Classic Dashboard, or Wallet).',
      'All preference updates are safely remembered in your browser local storage and applied automatically on subsequent visits.',
    ],
    relatedArticleIds: ['art-acc-2', 'art-sec-1'],
    lastUpdated: 'October 2026',
    readTime: '3 min read',
    helpfulVotes: 76,
    unhelpfulVotes: 3,
  },
  {
    id: 'art-acc-2',
    categoryId: 'account_login',
    title: 'Updating Passwords and Complexity Requirements',
    summary: 'How to update account passwords with real-time strength validation.',
    content: [
      'Strong passwords protect accounts from automated credential stuffing attacks.',
      'CoinPlus requires passwords to be at least 8 characters in length and recommends incorporating uppercase letters, lowercase letters, numbers, and special symbols.',
      'You can update your password from Security & Settings (/settings). The interactive password meter provides real-time feedback on password strength.',
    ],
    relatedArticleIds: ['art-sec-1', 'art-sec-2'],
    lastUpdated: 'October 2026',
    readTime: '2 min read',
    helpfulVotes: 89,
    unhelpfulVotes: 5,
  },
  {
    id: 'art-acc-3',
    categoryId: 'account_login',
    title: 'Configuring Inactivity Session Timeouts',
    summary: 'Automated screen lock settings to safeguard workstations left unattended.',
    content: [
      'To prevent unauthorized access when stepping away from your trading desk, CoinPlus includes configurable session timeout limits.',
      'Choose between 15 minutes (maximum security), 30 minutes (recommended default), 1 hour, or 24 hours.',
    ],
    relatedArticleIds: ['art-sec-3'],
    lastUpdated: 'October 2026',
    readTime: '2 min read',
    helpfulVotes: 41,
    unhelpfulVotes: 0,
  },

  // 3. Markets and Trading
  {
    id: 'art-mt-1',
    categoryId: 'markets_trading',
    title: 'Maker vs. Taker Trading Fees Explained',
    summary: 'Detailed explanation of how order book liquidity provision impacts your fee schedule.',
    content: [
      'Trading fees on cryptocurrency exchanges are differentiated based on whether your order provides or consumes order book depth.',
      'Maker Orders: Limit orders placed into the order book that do not execute immediately. Because Makers provide liquidity, CoinPlus charges a discounted 0.02% fee on VIP 1.',
      'Taker Orders: Orders that execute immediately against existing order book depth (such as market orders). Takers consume liquidity and pay the 0.04% taker fee.',
    ],
    relatedArticleIds: ['art-gs-2', 'art-mt-2'],
    lastUpdated: 'October 2026',
    readTime: '4 min read',
    helpfulVotes: 215,
    unhelpfulVotes: 6,
    popular: true,
  },
  {
    id: 'art-mt-2',
    categoryId: 'markets_trading',
    title: 'Stop-Limit Orders: Trigger Conditions and Risk Control',
    summary: 'Protecting profits and mitigating downside volatility with conditional stop orders.',
    content: [
      'A Stop-Limit order contains two price parameters: a Stop Trigger price and a Limit execution price.',
      'When the market price reaches or crosses the Stop Trigger price, the system automatically submits a Limit order at your specified limit price.',
      'This order type is ideal for breakout trading or setting stop-loss price thresholds when away from the screen.',
    ],
    relatedArticleIds: ['art-mt-1', 'art-gs-2'],
    lastUpdated: 'October 2026',
    readTime: '4 min read',
    helpfulVotes: 130,
    unhelpfulVotes: 4,
  },
  {
    id: 'art-mt-3',
    categoryId: 'markets_trading',
    title: 'Using the Custom Watchlist to Track Favorite Pairs',
    summary: 'Pinning key digital assets, tracking percentage variations, and jumping into trades.',
    content: [
      'The CoinPlus Watchlist (/watchlist) allows traders to monitor key trading pairs on a single focused dashboard.',
      'Click the Star icon next to any coin in Live Markets or click "Add Asset" in the Watchlist to pin a pair.',
      'Pinned pairs persist in your browser and synchronize with the markets overview.',
    ],
    relatedArticleIds: ['art-gs-1'],
    lastUpdated: 'October 2026',
    readTime: '2 min read',
    helpfulVotes: 67,
    unhelpfulVotes: 1,
  },

  // 4. Wallet and Assets
  {
    id: 'art-wa-1',
    categoryId: 'wallet_assets',
    title: 'Available vs. Locked Balances Explained',
    summary: 'Why portions of your portfolio appear locked during active limit orders or withdrawals.',
    content: [
      'In digital asset trading, your total balance is divided into Available Balance and Locked Balance.',
      'Available Balance: Funds ready for new orders, transfers, or withdrawals.',
      'Locked Balance: Funds actively committed to resting limit orders on the spot exchange or undergoing withdrawal verification.',
      'When you cancel an unfilled limit order, the locked funds are instantly unlocked and restored to your available balance.',
    ],
    relatedArticleIds: ['art-gs-1', 'art-gs-2'],
    lastUpdated: 'October 2026',
    readTime: '3 min read',
    helpfulVotes: 184,
    unhelpfulVotes: 2,
    popular: true,
  },
  {
    id: 'art-wa-2',
    categoryId: 'wallet_assets',
    title: 'Asset Allocation and Portfolio Valuation',
    summary: 'Understanding total estimated USD valuation and proportional token distribution.',
    content: [
      'CoinPlus calculates total estimated portfolio valuation by summing the USD equivalent of all held cryptocurrencies.',
      'The Asset Allocation donut and progress breakdown visualizes the percentage weighting of Bitcoin, Ethereum, stablecoins, and altcoins.',
      'Use the Privacy Toggle (Eye icon) in My Wallet (/wallet) to hide or reveal numerical balances on shared screens.',
    ],
    relatedArticleIds: ['art-wa-1'],
    lastUpdated: 'October 2026',
    readTime: '3 min read',
    helpfulVotes: 91,
    unhelpfulVotes: 2,
  },
  {
    id: 'art-wa-3',
    categoryId: 'wallet_assets',
    title: 'Exporting Historical Activity to CSV',
    summary: 'Client-side export of trade fills and order history for tax and portfolio reporting.',
    content: [
      'CoinPlus includes client-side CSV export functionality on the My Trades & Orders (/orders) page.',
      'Click "Export CSV" on any tab (Open Orders, Order History, or Trade Fills) to generate and download a structured spreadsheet directly in your browser.',
    ],
    relatedArticleIds: ['art-mt-1'],
    lastUpdated: 'October 2026',
    readTime: '2 min read',
    helpfulVotes: 62,
    unhelpfulVotes: 1,
  },

  // 5. Deposits
  {
    id: 'art-dep-1',
    categoryId: 'deposits',
    title: 'Cryptocurrency Deposit Confirmations and Arrival Times',
    summary: 'How blockchain network confirmations dictate when deposits appear in your wallet.',
    content: [
      'All cryptocurrency deposits require a defined number of blockchain confirmations before being credited to your spot balance.',
      'Bitcoin: Requires 2-3 network confirmations (typically 20-30 minutes).',
      'Ethereum & ERC-20: Requires 12 confirmations (typically 3-5 minutes).',
      'Solana & TRC-20: Finalized in under 1-2 minutes.',
      'Always confirm that the selected network matches the sending exchange or wallet exactly.',
    ],
    relatedArticleIds: ['art-dep-2', 'art-wth-1'],
    lastUpdated: 'October 2026',
    readTime: '4 min read',
    helpfulVotes: 198,
    unhelpfulVotes: 5,
    popular: true,
  },
  {
    id: 'art-dep-2',
    categoryId: 'deposits',
    title: 'Mandatory Destination Tags and Memos for XRP',
    summary: 'Why certain shared blockchain address networks require an identification tag.',
    content: [
      'Cryptocurrencies like Ripple (XRP) share a centralized deposit vault address across multiple users.',
      'The Destination Tag / Memo is a unique 6-9 digit numerical identifier that routes the deposit directly to your individual account.',
      'Omitting the destination tag will result in transaction routing delays.',
    ],
    relatedArticleIds: ['art-dep-1', 'art-wth-1'],
    lastUpdated: 'October 2026',
    readTime: '3 min read',
    helpfulVotes: 156,
    unhelpfulVotes: 3,
    popular: true,
  },
  {
    id: 'art-dep-3',
    categoryId: 'deposits',
    title: 'Are There Any Fees for Depositing Cryptocurrency?',
    summary: 'CoinPlus zero-fee deposit policy across all supported digital assets.',
    content: [
      'CoinPlus charges 0.00% platform deposit fees on all supported cryptocurrency assets.',
      'You only pay the standard miner or gas fee charged by your external sending wallet or third-party exchange.',
    ],
    relatedArticleIds: ['art-dep-1', 'art-mt-1'],
    lastUpdated: 'October 2026',
    readTime: '2 min read',
    helpfulVotes: 87,
    unhelpfulVotes: 1,
  },

  // 6. Withdrawals
  {
    id: 'art-wth-1',
    categoryId: 'withdrawals',
    title: 'Withdrawal Fees, Minimums, and Network Speed',
    summary: 'Understanding network miner costs and minimum threshold requirements.',
    content: [
      'When withdrawing cryptocurrency, a network fee is deducted to compensate miners and validators for processing the transaction.',
      'Network fees are dynamic and vary depending on congestion. For example, Layer-2 networks like Arbitrum or Tron cost significantly less than Layer-1 Bitcoin or Ethereum mainnets.',
      'Each asset features a minimum withdrawal threshold (e.g. 0.001 BTC or 10.00 USDT) to prevent uneconomic dust transactions.',
    ],
    relatedArticleIds: ['art-wth-2', 'art-sec-4'],
    lastUpdated: 'October 2026',
    readTime: '4 min read',
    helpfulVotes: 168,
    unhelpfulVotes: 4,
  },
  {
    id: 'art-wth-2',
    categoryId: 'withdrawals',
    title: 'Why is My Withdrawal Under Review or Processing?',
    summary: 'Automated risk security screening and 2FA authorization steps.',
    content: [
      'To safeguard platform assets, withdrawals undergo automated risk checks before broadcast.',
      'Transactions to whitelisted addresses are typically broadcast in minutes.',
      'Unrecognized destination addresses or requests following recent password changes may undergo brief automated hold periods.',
    ],
    relatedArticleIds: ['art-wth-1', 'art-sec-4'],
    lastUpdated: 'October 2026',
    readTime: '3 min read',
    helpfulVotes: 112,
    unhelpfulVotes: 2,
  },
  {
    id: 'art-wth-3',
    categoryId: 'withdrawals',
    title: 'Cancelling a Pending Withdrawal Request',
    summary: 'How to cancel an unbroadcast withdrawal and return funds to available balance.',
    content: [
      'If your withdrawal request is still in "Pending" status, you can cancel it directly from the Withdrawal History table on the Withdraw (/withdraw) page.',
      'Once cancelled, the reserved funds and network fee are immediately restored to your available wallet balance.',
      'Once a withdrawal changes to "Processing" or has been broadcast to the blockchain, it cannot be reversed.',
    ],
    relatedArticleIds: ['art-wth-1', 'art-wa-1'],
    lastUpdated: 'October 2026',
    readTime: '2 min read',
    helpfulVotes: 75,
    unhelpfulVotes: 1,
  },

  // 7. Identity Verification (KYC)
  {
    id: 'art-kyc-1',
    categoryId: 'identity_kyc',
    title: 'Tier 2 Verification Requirements and Limits',
    summary: 'Unlocking 100 BTC daily withdrawal capacity with photo ID and proof of residence.',
    content: [
      'Tier 2 verification upgrades your daily withdrawal capacity from 2 BTC to 100 BTC (~$6.8M USD) and unlocks fiat bank deposit options.',
      'Requirements: A clear, unexpired government photo ID (Passport, National ID card, or Driver’s License) and a Proof of Residence document (Utility bill or bank statement dated within 90 days).',
      'Ensure all four corners of the document are visible, lighting is clear without flash glare, and your legal name matches your account profile.',
    ],
    relatedArticleIds: ['art-kyc-2', 'art-wth-1'],
    lastUpdated: 'October 2026',
    readTime: '4 min read',
    helpfulVotes: 230,
    unhelpfulVotes: 7,
    popular: true,
  },
  {
    id: 'art-kyc-2',
    categoryId: 'identity_kyc',
    title: 'Acceptable Proof of Address Documents',
    summary: 'Guidelines on valid utility statements, tax assessments, and bank letters.',
    content: [
      'Acceptable documents: Water, electricity, gas bills, municipal council tax statements, or bank account statements.',
      'Unacceptable documents: Mobile phone bills, medical invoices, commercial lease receipts, or screenshots of online banking apps without full addresses.',
      'The document must have been issued within the last 90 days and clearly display your full name and permanent residential address.',
    ],
    relatedArticleIds: ['art-kyc-1'],
    lastUpdated: 'October 2026',
    readTime: '3 min read',
    helpfulVotes: 145,
    unhelpfulVotes: 3,
  },
  {
    id: 'art-kyc-3',
    categoryId: 'identity_kyc',
    title: 'How Long Does KYC Verification Review Take?',
    summary: 'Turnaround expectations and handling resubmissions for rejected scans.',
    content: [
      'Automated optical character recognition (OCR) and compliance screening usually complete verification within 1-2 hours.',
      'If your document is rejected due to blurriness or glare, you will receive a detailed reason and can immediately resubmit a clear photo via the KYC Center (/kyc).',
    ],
    relatedArticleIds: ['art-kyc-1', 'art-kyc-2'],
    lastUpdated: 'October 2026',
    readTime: '2 min read',
    helpfulVotes: 88,
    unhelpfulVotes: 2,
  },

  // 8. Security and Privacy
  {
    id: 'art-sec-1',
    categoryId: 'security_privacy',
    title: 'Setting Up Two-Factor Authentication (TOTP)',
    summary: 'Configuring Google Authenticator, Authy, or 1Password for account security.',
    content: [
      'Two-Factor Authentication (2FA) adds a critical second verification layer to your account.',
      'Navigate to Security & Settings (/settings) > Two-Factor Authentication and click "Enable 2FA".',
      'Scan the displayed QR code with your authenticator app or enter the manual secret key, then provide the 6-digit verification code.',
      'Keep a secure offline backup of your setup key in case you replace or lose your mobile device.',
    ],
    relatedArticleIds: ['art-sec-2', 'art-sec-4'],
    lastUpdated: 'October 2026',
    readTime: '4 min read',
    helpfulVotes: 178,
    unhelpfulVotes: 3,
    popular: true,
  },
  {
    id: 'art-sec-2',
    categoryId: 'security_privacy',
    title: 'Using FIDO2 Biometric Passkeys (WebAuthn)',
    summary: 'Passwordless authentication using Touch ID, Face ID, or hardware security keys.',
    content: [
      'Passkeys use modern public-key cryptography to provide phishing-resistant authentication.',
      'You can register your laptop Touch ID, iPhone Face ID, or a hardware key (such as YubiKey) directly from Security & Settings.',
      'Once registered, you can authenticate sign-in attempts and withdrawal requests using your device sensor without typing passwords or SMS codes.',
    ],
    relatedArticleIds: ['art-sec-1', 'art-sec-3'],
    lastUpdated: 'October 2026',
    readTime: '3 min read',
    helpfulVotes: 122,
    unhelpfulVotes: 1,
  },
  {
    id: 'art-sec-3',
    categoryId: 'security_privacy',
    title: 'Auditing Active Sessions and Unknown Device Alerts',
    summary: 'Terminating unauthorized device logins and reviewing recent IP access logs.',
    content: [
      'CoinPlus displays all active browser and application sessions on the Security & Settings page.',
      'You can inspect device models, browsers, IP addresses, and simulated login locations.',
      'If you notice an unfamiliar session, click "Revoke" on that individual device or click "Revoke Others" to terminate all other active logins immediately.',
    ],
    relatedArticleIds: ['art-sec-1', 'art-sec-4'],
    lastUpdated: 'October 2026',
    readTime: '3 min read',
    helpfulVotes: 95,
    unhelpfulVotes: 2,
  },
  {
    id: 'art-sec-4',
    categoryId: 'security_privacy',
    title: 'Enforcing the Withdrawal Address Allowlist',
    summary: 'Restricting payouts strictly to pre-approved destination wallet addresses.',
    content: [
      'The Withdrawal Address Allowlist ensures that cryptocurrency withdrawals can only be sent to destinations you have explicitly verified.',
      'When "Whitelist-Only Mode" is enabled, any attempt to withdraw to an unlisted address is blocked.',
      'Adding a new address to the allowlist is protected by 2FA verification.',
    ],
    relatedArticleIds: ['art-sec-1', 'art-wth-1'],
    lastUpdated: 'October 2026',
    readTime: '3 min read',
    helpfulVotes: 140,
    unhelpfulVotes: 2,
  },
]
