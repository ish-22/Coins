/**
 * CoinPlus Stable Demonstration Data for Administration Interface (/admin)
 * IMPORTANT: All data, metrics, user records, and administrative actions are simulated.
 * No real backend access control, live blockchain operations, or real financial balances are modified.
 */

export interface AdminUser {
  id: string
  userRef: string
  name: string
  email: string
  country: string
  countryCode: string
  status: 'active' | 'suspended' | 'pending'
  kycTier: 'Tier 0' | 'Tier 1' | 'Tier 2'
  balanceUsd: number
  registeredAt: string
  lastLogin: string
  twoFactorEnabled: boolean
  passkeyRegistered: boolean
  ipAddress: string
}

export interface AdminKycCase {
  id: string
  caseRef: string
  userId: string
  userName: string
  userEmail: string
  country: string
  requestedTier: 'Tier 1' | 'Tier 2'
  status: 'pending' | 'in_review' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt?: string
  documentType: 'Passport' | 'National ID' | 'Drivers License'
  documentNumber: string
  proofOfAddressType?: 'Utility Bill' | 'Bank Statement'
  rejectionReason?: string
  idFrontPlaceholder: string
  idBackPlaceholder: string
  proofOfAddressPlaceholder?: string
}

export interface AdminDepositRecord {
  id: string
  depositRef: string
  txHash: string
  userId: string
  userName: string
  asset: string
  network: string
  amount: number
  amountUsd: number
  status: 'completed' | 'confirming' | 'pending'
  confirmations: number
  requiredConfirmations: number
  destinationAddress: string
  createdAt: string
}

export interface AdminWithdrawalRecord {
  id: string
  withdrawalRef: string
  userId: string
  userName: string
  asset: string
  network: string
  amount: number
  amountUsd: number
  fee: number
  destinationAddress: string
  riskScore: 'Low' | 'Medium' | 'High'
  status: 'pending_review' | 'approved' | 'rejected' | 'processing'
  createdAt: string
  reviewedAt?: string
  rejectionReason?: string
}

export interface AdminOrderRecord {
  id: string
  orderRef: string
  userId: string
  userName: string
  pair: string
  side: 'buy' | 'sell'
  type: 'limit' | 'market' | 'stop_limit'
  price: number
  amount: number
  filled: number
  totalUsd: number
  status: 'open' | 'filled' | 'cancelled'
  createdAt: string
}

export interface AdminSupportMessage {
  id: string
  sender: 'user' | 'agent'
  senderName: string
  message: string
  timestamp: string
}

export interface AdminSupportTicket {
  id: string
  ticketRef: string
  userId: string
  userName: string
  userEmail: string
  subject: string
  category: 'trading' | 'account' | 'deposits' | 'withdrawals' | 'kyc' | 'security'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'waiting_user' | 'resolved'
  createdAt: string
  updatedAt: string
  messages: AdminSupportMessage[]
}

export interface AdminAnnouncement {
  id: string
  title: string
  content: string
  type: 'maintenance' | 'feature' | 'security' | 'advisory'
  targetAudience: 'All Users' | 'Verified Only' | 'VIP Traders'
  status: 'active' | 'draft' | 'archived'
  createdAt: string
  validUntil: string
}

export interface AdminAssetRecord {
  id: string
  symbol: string
  name: string
  networks: string[]
  currentPriceUsd: number
  change24h: number
  depositEnabled: boolean
  withdrawEnabled: boolean
  tradingEnabled: boolean
  minDeposit: number
  minWithdrawal: number
  withdrawalFee: number
}

export interface AdminAuditLog {
  id: string
  eventId: string
  adminEmail: string
  adminName: string
  action: string
  category: 'User Management' | 'KYC Review' | 'Withdrawal Approval' | 'Asset Config' | 'System Settings' | 'Authentication'
  target: string
  details: string
  timestamp: string
  result: 'success' | 'failed' | 'warning'
  ipAddress: string
}

// ── 1. Users ─────────────────────────────────────────────────────────────────
// No example users: real users will populate from backend authentication.
export const INITIAL_ADMIN_USERS: AdminUser[] = []

// ── 2. Mock KYC Cases ─────────────────────────────────────────────────────────
export const INITIAL_ADMIN_KYC_CASES: AdminKycCase[] = [
  {
    id: 'kyc-201',
    caseRef: 'KYC-2026-8812',
    userId: 'usr-104',
    userName: 'Sarah Jenkins',
    userEmail: 'sarah.j@techcorp.co.uk',
    country: 'United Kingdom',
    requestedTier: 'Tier 1',
    status: 'pending',
    submittedAt: '2026-10-18 16:30',
    documentType: 'Passport',
    documentNumber: 'GB94820199',
    idFrontPlaceholder: 'uk_passport_front_sample.jpg',
    idBackPlaceholder: 'uk_passport_signature_sample.jpg',
  },
  {
    id: 'kyc-202',
    caseRef: 'KYC-2026-8813',
    userId: 'usr-108',
    userName: 'Lucas Silva',
    userEmail: 'lucas.silva@saopaulo-defi.br',
    country: 'Brazil',
    requestedTier: 'Tier 2',
    status: 'in_review',
    submittedAt: '2026-10-19 14:10',
    documentType: 'National ID',
    documentNumber: 'BR-RG-3920192',
    proofOfAddressType: 'Utility Bill',
    idFrontPlaceholder: 'brazil_rg_front_sample.jpg',
    idBackPlaceholder: 'brazil_rg_back_sample.jpg',
    proofOfAddressPlaceholder: 'enel_utility_bill_sept2026.pdf',
  },
  {
    id: 'kyc-203',
    caseRef: 'KYC-2026-8809',
    userId: 'usr-105',
    userName: 'David Okafor',
    userEmail: 'd.okafor@lagos-traders.ng',
    country: 'Nigeria',
    requestedTier: 'Tier 1',
    status: 'approved',
    submittedAt: '2026-10-16 11:20',
    reviewedAt: '2026-10-16 14:05',
    documentType: 'Drivers License',
    documentNumber: 'NG-DL-882910',
    idFrontPlaceholder: 'ng_drivers_license_front.jpg',
    idBackPlaceholder: 'ng_drivers_license_back.jpg',
  },
  {
    id: 'kyc-204',
    caseRef: 'KYC-2026-8805',
    userId: 'usr-107',
    userName: 'Chloe Dupont',
    userEmail: 'chloe.dupont@paris-consulting.fr',
    country: 'France',
    requestedTier: 'Tier 2',
    status: 'rejected',
    submittedAt: '2026-10-14 09:15',
    reviewedAt: '2026-10-14 11:45',
    documentType: 'Passport',
    documentNumber: 'FR77291039',
    rejectionReason: 'Proof of address document is dated older than 90 days. Please resubmit a recent utility bill or bank statement.',
    idFrontPlaceholder: 'fr_passport_page1.jpg',
    idBackPlaceholder: 'fr_passport_page2.jpg',
    proofOfAddressPlaceholder: 'edf_electricity_bill_2025.pdf',
  },
  {
    id: 'kyc-205',
    caseRef: 'KYC-2026-8815',
    userId: 'usr-101',
    userName: 'Alex Vance',
    userEmail: 'alex.vance@coinplus.io',
    country: 'United Kingdom',
    requestedTier: 'Tier 2',
    status: 'approved',
    submittedAt: '2026-10-10 10:00',
    reviewedAt: '2026-10-10 11:15',
    documentType: 'Passport',
    documentNumber: 'GB10293847',
    proofOfAddressType: 'Bank Statement',
    idFrontPlaceholder: 'vance_passport_scan.jpg',
    idBackPlaceholder: 'vance_passport_barcode.jpg',
    proofOfAddressPlaceholder: 'barclays_statement_oct2026.pdf',
  },
]

// ── 3. Mock Deposits ──────────────────────────────────────────────────────────
export const INITIAL_ADMIN_DEPOSITS: AdminDepositRecord[] = [
  {
    id: 'dep-301',
    depositRef: 'DEP-99401',
    txHash: '0x8f2a...c91e',
    userId: 'usr-101',
    userName: 'Alex Vance',
    asset: 'USDT',
    network: 'Ethereum (ERC-20)',
    amount: 5000.0,
    amountUsd: 5000.0,
    status: 'completed',
    confirmations: 64,
    requiredConfirmations: 12,
    destinationAddress: '0x71C...8491',
    createdAt: '2026-10-20 09:15',
  },
  {
    id: 'dep-302',
    depositRef: 'DEP-99402',
    txHash: '3a8f...92bf',
    userId: 'usr-103',
    userName: 'Marcus Chen',
    asset: 'BTC',
    network: 'Bitcoin Native',
    amount: 1.5,
    amountUsd: 102675.37,
    status: 'completed',
    confirmations: 6,
    requiredConfirmations: 3,
    destinationAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    createdAt: '2026-10-20 07:22',
  },
  {
    id: 'dep-303',
    depositRef: 'DEP-99403',
    txHash: '0x4e1b...77aa',
    userId: 'usr-102',
    userName: 'Elena Rostova',
    asset: 'ETH',
    network: 'Ethereum (ERC-20)',
    amount: 10.0,
    amountUsd: 36248.0,
    status: 'confirming',
    confirmations: 8,
    requiredConfirmations: 12,
    destinationAddress: '0x4B2...2201',
    createdAt: '2026-10-20 10:41',
  },
  {
    id: 'dep-304',
    depositRef: 'DEP-99404',
    txHash: '5Knp...81cc',
    userId: 'usr-106',
    userName: 'Kenji Takahashi',
    asset: 'SOL',
    network: 'Solana SPL',
    amount: 250.0,
    amountUsd: 46162.5,
    status: 'completed',
    confirmations: 32,
    requiredConfirmations: 32,
    destinationAddress: '7XwK...49Pq',
    createdAt: '2026-10-20 05:40',
  },
  {
    id: 'dep-305',
    depositRef: 'DEP-99405',
    txHash: '0x99bb...11ee',
    userId: 'usr-105',
    userName: 'David Okafor',
    asset: 'USDT',
    network: 'TRON (TRC-20)',
    amount: 1500.0,
    amountUsd: 1500.0,
    status: 'pending',
    confirmations: 2,
    requiredConfirmations: 20,
    destinationAddress: 'TJ4v...999x',
    createdAt: '2026-10-20 10:49',
  },
]

// ── 4. Mock Withdrawals ───────────────────────────────────────────────────────
export const INITIAL_ADMIN_WITHDRAWALS: AdminWithdrawalRecord[] = [
  {
    id: 'wth-401',
    withdrawalRef: 'WTH-88201',
    userId: 'usr-103',
    userName: 'Marcus Chen',
    asset: 'BTC',
    network: 'Bitcoin Native',
    amount: 0.85,
    amountUsd: 58182.71,
    fee: 0.0002,
    destinationAddress: 'bc1q99...xx91',
    riskScore: 'Low',
    status: 'pending_review',
    createdAt: '2026-10-20 10:15',
  },
  {
    id: 'wth-402',
    withdrawalRef: 'WTH-88202',
    userId: 'usr-101',
    userName: 'Alex Vance',
    asset: 'USDT',
    network: 'Ethereum (ERC-20)',
    amount: 2500.0,
    amountUsd: 2500.0,
    fee: 8.0,
    destinationAddress: '0x12A...99FF',
    riskScore: 'Low',
    status: 'pending_review',
    createdAt: '2026-10-20 09:50',
  },
  {
    id: 'wth-403',
    withdrawalRef: 'WTH-88203',
    userId: 'usr-107',
    userName: 'Chloe Dupont',
    asset: 'ETH',
    network: 'Ethereum (ERC-20)',
    amount: 1.2,
    amountUsd: 4349.76,
    fee: 0.002,
    destinationAddress: '0x992...331B',
    riskScore: 'High',
    status: 'rejected',
    createdAt: '2026-10-19 18:20',
    reviewedAt: '2026-10-19 18:45',
    rejectionReason: 'Account flagged for administrative review due to recent suspicious login geolocation.',
  },
  {
    id: 'wth-404',
    withdrawalRef: 'WTH-88204',
    userId: 'usr-110',
    userName: 'Fatima Al-Mansoor',
    asset: 'USDT',
    network: 'TRON (TRC-20)',
    amount: 50000.0,
    amountUsd: 50000.0,
    fee: 1.0,
    destinationAddress: 'TWy8...881a',
    riskScore: 'Medium',
    status: 'approved',
    createdAt: '2026-10-20 08:10',
    reviewedAt: '2026-10-20 08:25',
  },
]

// ── 5. Mock Orders ────────────────────────────────────────────────────────────
export const INITIAL_ADMIN_ORDERS: AdminOrderRecord[] = [
  {
    id: 'ord-501',
    orderRef: 'ORD-77101',
    userId: 'usr-101',
    userName: 'Alex Vance',
    pair: 'BTC/USDT',
    side: 'buy',
    type: 'limit',
    price: 68100.0,
    amount: 0.25,
    filled: 0.25,
    totalUsd: 17025.0,
    status: 'filled',
    createdAt: '2026-10-20 10:22',
  },
  {
    id: 'ord-502',
    orderRef: 'ORD-77102',
    userId: 'usr-102',
    userName: 'Elena Rostova',
    pair: 'ETH/USDT',
    side: 'sell',
    type: 'limit',
    price: 3650.0,
    amount: 5.0,
    filled: 2.1,
    totalUsd: 18250.0,
    status: 'open',
    createdAt: '2026-10-20 10:15',
  },
  {
    id: 'ord-503',
    orderRef: 'ORD-77103',
    userId: 'usr-106',
    userName: 'Kenji Takahashi',
    pair: 'SOL/USDT',
    side: 'buy',
    type: 'market',
    price: 184.65,
    amount: 50.0,
    filled: 50.0,
    totalUsd: 9232.5,
    status: 'filled',
    createdAt: '2026-10-20 09:40',
  },
  {
    id: 'ord-504',
    orderRef: 'ORD-77104',
    userId: 'usr-109',
    userName: 'Liam O’Connor',
    pair: 'BTC/USDT',
    side: 'sell',
    type: 'stop_limit',
    price: 67500.0,
    amount: 0.5,
    filled: 0.0,
    totalUsd: 33750.0,
    status: 'open',
    createdAt: '2026-10-20 08:30',
  },
  {
    id: 'ord-505',
    orderRef: 'ORD-77105',
    userId: 'usr-108',
    userName: 'Lucas Silva',
    pair: 'XRP/USDT',
    side: 'buy',
    type: 'limit',
    price: 0.582,
    amount: 2000.0,
    filled: 0.0,
    totalUsd: 1164.0,
    status: 'cancelled',
    createdAt: '2026-10-19 21:10',
  },
]

// ── 6. Mock Support Tickets ───────────────────────────────────────────────────
export const INITIAL_ADMIN_TICKETS: AdminSupportTicket[] = [
  {
    id: 'tkt-601',
    ticketRef: 'TICK-4819',
    userId: 'usr-101',
    userName: 'Alex Vance',
    userEmail: 'alex.vance@coinplus.io',
    subject: 'Question regarding withdrawal allowlist confirmation period',
    category: 'security',
    priority: 'medium',
    status: 'open',
    createdAt: '2026-10-20 09:20',
    updatedAt: '2026-10-20 09:20',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        senderName: 'Alex Vance',
        message: 'Hello, when I add a new address to my withdrawal allowlist, how long does the demonstration security cooldown remain active?',
        timestamp: '2026-10-20 09:20',
      },
    ],
  },
  {
    id: 'tkt-602',
    ticketRef: 'TICK-4818',
    userId: 'usr-104',
    userName: 'Sarah Jenkins',
    userEmail: 'sarah.j@techcorp.co.uk',
    subject: 'KYC Tier 1 submission review turnaround',
    category: 'kyc',
    priority: 'high',
    status: 'in_progress',
    createdAt: '2026-10-18 17:00',
    updatedAt: '2026-10-19 09:30',
    messages: [
      {
        id: 'msg-2',
        sender: 'user',
        senderName: 'Sarah Jenkins',
        message: 'Hi team, I submitted my passport photo yesterday afternoon. Could you let me know if any additional proof is needed?',
        timestamp: '2026-10-18 17:00',
      },
      {
        id: 'msg-3',
        sender: 'agent',
        senderName: 'Staff Moderator',
        message: 'Hello Sarah, our compliance desk has picked up your case. Your passport image is being processed by the optical character reader.',
        timestamp: '2026-10-19 09:30',
      },
    ],
  },
  {
    id: 'tkt-603',
    ticketRef: 'TICK-4812',
    userId: 'usr-105',
    userName: 'David Okafor',
    userEmail: 'd.okafor@lagos-traders.ng',
    subject: 'Deposit confirmation delay for TRC-20 USDT',
    category: 'deposits',
    priority: 'low',
    status: 'resolved',
    createdAt: '2026-10-16 12:10',
    updatedAt: '2026-10-16 13:45',
    messages: [
      {
        id: 'msg-4',
        sender: 'user',
        senderName: 'David Okafor',
        message: 'My demonstration deposit took 25 blocks instead of 20 to confirm. Has the block generation rate returned to normal?',
        timestamp: '2026-10-16 12:10',
      },
      {
        id: 'msg-5',
        sender: 'agent',
        senderName: 'Staff Moderator',
        message: 'Yes David, the simulated TRON node reorganization has settled and credits are functioning at standard baseline speed.',
        timestamp: '2026-10-16 13:45',
      },
    ],
  },
]

// ── 7. Mock Announcements ─────────────────────────────────────────────────────
export const INITIAL_ADMIN_ANNOUNCEMENTS: AdminAnnouncement[] = [
  {
    id: 'anc-701',
    title: 'Scheduled Matching Engine V3 Optimization',
    content: 'Routine demonstration maintenance on the spot matching engine will take place on Sunday, Oct 25, 2026 from 02:00 to 03:30 UTC. Simulated order submission will be paused.',
    type: 'maintenance',
    targetAudience: 'All Users',
    status: 'active',
    createdAt: '2026-10-19 10:00',
    validUntil: '2026-10-26 00:00',
  },
  {
    id: 'anc-702',
    title: 'Enhanced FIDO2 Biometric Passkey Support',
    content: 'CoinPlus now supports Touch ID, Face ID, and hardware security key authentication across all demonstration trading terminals.',
    type: 'feature',
    targetAudience: 'All Users',
    status: 'active',
    createdAt: '2026-10-15 14:00',
    validUntil: '2026-11-15 00:00',
  },
  {
    id: 'anc-703',
    title: 'Anti-Phishing Code Verification Reminder',
    content: 'Ensure your anti-phishing secret phrase is configured in Security & Settings to guarantee the authenticity of demonstration system notices.',
    type: 'security',
    targetAudience: 'Verified Only',
    status: 'active',
    createdAt: '2026-10-10 09:30',
    validUntil: '2026-12-31 00:00',
  },
]

// ── 8. Mock Assets ────────────────────────────────────────────────────────────
export const INITIAL_ADMIN_ASSETS: AdminAssetRecord[] = [
  {
    id: 'ast-1',
    symbol: 'BTC',
    name: 'Bitcoin',
    networks: ['Bitcoin Native', 'Lightning (Simulated)'],
    currentPriceUsd: 68450.25,
    change24h: 3.42,
    depositEnabled: true,
    withdrawEnabled: true,
    tradingEnabled: true,
    minDeposit: 0.0005,
    minWithdrawal: 0.001,
    withdrawalFee: 0.0002,
  },
  {
    id: 'ast-2',
    symbol: 'ETH',
    name: 'Ethereum',
    networks: ['Ethereum (ERC-20)', 'Arbitrum One', 'Optimism'],
    currentPriceUsd: 3624.8,
    change24h: -1.18,
    depositEnabled: true,
    withdrawEnabled: true,
    tradingEnabled: true,
    minDeposit: 0.01,
    minWithdrawal: 0.02,
    withdrawalFee: 0.002,
  },
  {
    id: 'ast-3',
    symbol: 'SOL',
    name: 'Solana',
    networks: ['Solana SPL'],
    currentPriceUsd: 184.65,
    change24h: 8.75,
    depositEnabled: true,
    withdrawEnabled: true,
    tradingEnabled: true,
    minDeposit: 0.1,
    minWithdrawal: 0.2,
    withdrawalFee: 0.01,
  },
  {
    id: 'ast-4',
    symbol: 'USDT',
    name: 'Tether USD',
    networks: ['Ethereum (ERC-20)', 'TRON (TRC-20)', 'Solana SPL', 'BNB Smart Chain'],
    currentPriceUsd: 1.0002,
    change24h: 0.02,
    depositEnabled: true,
    withdrawEnabled: true,
    tradingEnabled: true,
    minDeposit: 10.0,
    minWithdrawal: 20.0,
    withdrawalFee: 1.0,
  },
  {
    id: 'ast-5',
    symbol: 'BNB',
    name: 'BNB Chain',
    networks: ['BNB Smart Chain (BEP-20)'],
    currentPriceUsd: 592.1,
    change24h: 0.85,
    depositEnabled: true,
    withdrawEnabled: true,
    tradingEnabled: true,
    minDeposit: 0.05,
    minWithdrawal: 0.1,
    withdrawalFee: 0.001,
  },
  {
    id: 'ast-6',
    symbol: 'XRP',
    name: 'Ripple',
    networks: ['XRP Ledger (Destination Tag Required)'],
    currentPriceUsd: 0.5842,
    change24h: 4.12,
    depositEnabled: true,
    withdrawEnabled: true,
    tradingEnabled: true,
    minDeposit: 20.0,
    minWithdrawal: 30.0,
    withdrawalFee: 0.25,
  },
]

// ── 9. Mock Audit Logs ────────────────────────────────────────────────────────
export const INITIAL_ADMIN_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'log-901',
    eventId: 'EVT-2026-9041',
    adminEmail: 'admin@coinplus.io',
    adminName: 'Chief Operator',
    action: 'Approved Withdrawal Request',
    category: 'Withdrawal Approval',
    target: 'WTH-88204 (Fatima Al-Mansoor)',
    details: 'Validated 50,000 USDT withdrawal to TWy8...881a with clean risk telemetry.',
    timestamp: '2026-10-20 08:25:12',
    result: 'success',
    ipAddress: '10.0.4.12',
  },
  {
    id: 'log-902',
    eventId: 'EVT-2026-9040',
    adminEmail: 'compliance@coinplus.io',
    adminName: 'AML Analyst',
    action: 'Approved KYC Tier 1',
    category: 'KYC Review',
    target: 'KYC-2026-8809 (David Okafor)',
    details: 'Verified Nigerian Drivers License NG-DL-882910 identity credentials.',
    timestamp: '2026-10-16 14:05:30',
    result: 'success',
    ipAddress: '10.0.4.19',
  },
  {
    id: 'log-903',
    eventId: 'EVT-2026-9039',
    adminEmail: 'security@coinplus.io',
    adminName: 'SecOps Officer',
    action: 'Suspended User Account',
    category: 'User Management',
    target: 'CP-USR-1097 (Chloe Dupont)',
    details: 'Account suspended following repeated unfamiliar IP logins and unverified address payout request.',
    timestamp: '2026-10-15 11:22:04',
    result: 'warning',
    ipAddress: '10.0.2.8',
  },
  {
    id: 'log-904',
    eventId: 'EVT-2026-9038',
    adminEmail: 'compliance@coinplus.io',
    adminName: 'AML Analyst',
    action: 'Rejected KYC Tier 2',
    category: 'KYC Review',
    target: 'KYC-2026-8805 (Chloe Dupont)',
    details: 'Proof of address utility bill rejected (expired beyond 90 days threshold).',
    timestamp: '2026-10-14 11:45:18',
    result: 'failed',
    ipAddress: '10.0.4.19',
  },
  {
    id: 'log-905',
    eventId: 'EVT-2026-9037',
    adminEmail: 'admin@coinplus.io',
    adminName: 'Chief Operator',
    action: 'Created Maintenance Announcement',
    category: 'System Settings',
    target: 'ANC-701 (Engine V3 Optimization)',
    details: 'Broadcasted upcoming Sunday matching engine maintenance notification.',
    timestamp: '2026-10-19 10:02:11',
    result: 'success',
    ipAddress: '10.0.4.12',
  },
  {
    id: 'log-906',
    eventId: 'EVT-2026-9036',
    adminEmail: 'admin@coinplus.io',
    adminName: 'Chief Operator',
    action: 'Administrator Authentication',
    category: 'Authentication',
    target: 'Admin Session Login',
    details: 'Successful simulated root login with FIDO2 hardware token verification.',
    timestamp: '2026-10-20 07:15:00',
    result: 'success',
    ipAddress: '10.0.4.12',
  },
]
