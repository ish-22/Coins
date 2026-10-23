/**
 * CoinPlus Stable Demonstration Data for Customer Support (/support)
 * NOTE: Simulated demonstration data. No real tickets are sent to a live support team.
 */

export type SupportCategory =
  | 'account'
  | 'trading'
  | 'wallet'
  | 'deposits'
  | 'withdrawals'
  | 'kyc'
  | 'security'

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TicketStatus = 'open' | 'in_progress' | 'waiting_user' | 'resolved'

export interface FAQItem {
  id: string
  category: SupportCategory
  question: string
  answer: string
  popular?: boolean
}

export interface TicketMessage {
  id: string
  sender: 'user' | 'support'
  senderName: string
  message: string
  timestamp: string
  attachmentName?: string
}

export interface SupportTicket {
  id: string
  subject: string
  category: SupportCategory
  priority: TicketPriority
  status: TicketStatus
  createdAt: string
  updatedAt: string
  description: string
  attachmentName?: string
  messages: TicketMessage[]
}

export const SUPPORT_CATEGORIES: { id: SupportCategory; label: string; description: string }[] = [
  { id: 'account', label: 'Account & Login', description: 'Password resets, 2FA recovery, and profile details' },
  { id: 'trading', label: 'Trading', description: 'Spot orders, limit fills, order books, and trading fees' },
  { id: 'wallet', label: 'Wallet & Assets', description: 'Token balances, valuation, and asset allocation' },
  { id: 'deposits', label: 'Deposits', description: 'Blockchain confirmations, memo tags, and minimum deposit limits' },
  { id: 'withdrawals', label: 'Withdrawals', description: 'Network fees, 24h limits, address whitelist, and status delays' },
  { id: 'kyc', label: 'KYC Verification', description: 'Identity proof, verification tiers, and proof of address' },
  { id: 'security', label: 'Security', description: 'Passkeys, suspicious logins, active sessions, and anti-phishing' },
]

export const POPULAR_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'deposits',
    question: 'How long do cryptocurrency deposits take to appear in my wallet?',
    answer:
      'Deposits depend on the specific blockchain network confirmations. For example, Bitcoin deposits require 2-3 confirmations (~20-30 minutes), while Solana and TRC-20 USDT deposits are credited in less than 2 minutes. Once the required confirmations are met, the balance updates automatically.',
    popular: true,
  },
  {
    id: 'faq-2',
    category: 'withdrawals',
    question: 'Why is my withdrawal in "Pending" or "Processing" status?',
    answer:
      'Withdrawals are screened by automated risk compliance. Small transactions to whitelisted addresses are broadcast in minutes, while larger sums or new destination addresses may be subject to a brief security review (usually under 30 minutes).',
    popular: true,
  },
  {
    id: 'faq-3',
    category: 'kyc',
    question: 'What documents are required to complete Tier 2 Identity Verification?',
    answer:
      'Tier 2 requires a valid government-issued photo ID (Passport, National ID card, or Driver’s License) and a Proof of Residence document (Utility bill or bank statement issued within the last 90 days).',
    popular: true,
  },
  {
    id: 'faq-4',
    category: 'trading',
    question: 'What is the difference between Maker and Taker trading fees on CoinPlus?',
    answer:
      'Maker orders add liquidity to the order book (e.g. limit orders below current ask price) and pay a discounted 0.02% fee on Tier 1. Taker orders remove liquidity by executing instantly against existing orders (e.g. market orders) and pay 0.04%.',
    popular: true,
  },
  {
    id: 'faq-5',
    category: 'security',
    question: 'How do I transfer my Google Authenticator 2FA to a new phone?',
    answer:
      'You can transfer 2FA by logging in on your trusted device, navigating to Security & Settings > Two-Factor Authentication, and clicking "Reconfigure". You will need your account password and a confirmation code from your current device.',
    popular: true,
  },
  {
    id: 'faq-6',
    category: 'account',
    question: 'Can I change my registered email address or country of residence?',
    answer:
      'You can update your personal preferences directly on the My Account page. For legal compliance reasons, changing your country of residence requires re-submitting KYC documentation.',
  },
  {
    id: 'faq-7',
    category: 'wallet',
    question: 'Why are some of my cryptocurrency balances listed as "Locked"?',
    answer:
      'Assets are temporarily locked when placed in active limit orders on the spot trading terminal or during active withdrawal processing. Once the order executes or is cancelled, locked funds return to available balance.',
  },
  {
    id: 'faq-8',
    category: 'deposits',
    question: 'What happens if I forget to enter the Destination Tag / Memo for XRP?',
    answer:
      'XRP and select network deposits require a mandatory Destination Tag to credit your individual account. If omitted, please submit a support ticket with your transaction hash and proof of ownership to manually recover the deposit.',
  },
]

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'TICK-9081',
    subject: 'Simulated TRC-20 deposit confirmation delay',
    category: 'deposits',
    priority: 'medium',
    status: 'in_progress',
    createdAt: '2026-10-20 08:30',
    updatedAt: '2026-10-20 09:10',
    description: 'My recent simulated deposit of 1,500 USDT has reached 20 confirmations on the explorer but is still showing as processing.',
    attachmentName: 'tx_explorer_screenshot.png',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        senderName: 'Alex Vance',
        message: 'Hello, I made a simulated deposit of 1,500 USDT on TRC-20. The explorer confirms it has been completed, but my spot balance has not updated yet.',
        timestamp: 'Today at 08:30 UTC',
        attachmentName: 'tx_explorer_screenshot.png',
      },
      {
        id: 'msg-2',
        sender: 'support',
        senderName: 'Sarah K. (CoinPlus Compliance Desk)',
        message: 'Hi Alex, thank you for reaching out! We reviewed the transaction reference. The simulated node sync delay has been cleared and your balance has been credited. Please refresh your wallet view.',
        timestamp: 'Today at 09:10 UTC',
      },
    ],
  },
  {
    id: 'TICK-9074',
    subject: 'Tier 2 Verification document query',
    category: 'kyc',
    priority: 'high',
    status: 'waiting_user',
    createdAt: '2026-10-19 14:15',
    updatedAt: '2026-10-19 16:00',
    description: 'Inquiry regarding acceptable utility bills for proof of address.',
    messages: [
      {
        id: 'msg-3',
        sender: 'user',
        senderName: 'Alex Vance',
        message: 'Does CoinPlus accept internet and broadband provider statements for Proof of Address, or must it be gas/electric only?',
        timestamp: 'Oct 19, 14:15 UTC',
      },
      {
        id: 'msg-4',
        sender: 'support',
        senderName: 'David M. (KYC Operations)',
        message: 'Hi Alex! Yes, high-speed broadband and municipal council statements are fully accepted, provided they show your full legal name, permanent residential address, and are issued within the last 90 days. Could you please confirm the issuance date on your statement?',
        timestamp: 'Oct 19, 16:00 UTC',
      },
    ],
  },
  {
    id: 'TICK-9060',
    subject: 'Trading API WebSocket latency inquiry',
    category: 'trading',
    priority: 'low',
    status: 'resolved',
    createdAt: '2026-10-17 11:00',
    updatedAt: '2026-10-17 15:45',
    description: 'Inquiring about order book depth stream intervals on BTC/USDT.',
    messages: [
      {
        id: 'msg-5',
        sender: 'user',
        senderName: 'Alex Vance',
        message: 'What is the default order book push frequency for the public spot WebSocket API on BTC/USDT?',
        timestamp: 'Oct 17, 11:00 UTC',
      },
      {
        id: 'msg-6',
        sender: 'support',
        senderName: 'Tech Support Team',
        message: 'Hello Alex, our WebSocket streams push delta updates every 100ms by default, with complete order book snapshots available every 1,000ms. Thank you for building on CoinPlus!',
        timestamp: 'Oct 17, 15:45 UTC',
      },
    ],
  },
]
