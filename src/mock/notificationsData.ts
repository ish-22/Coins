/**
 * CoinPlus Stable Demonstration Data for Notifications (/notifications)
 * NOTE: Simulated demonstration data. No real external emails or push alerts are sent.
 */

export type NotificationCategory =
  | 'trading'
  | 'transactions'
  | 'security'
  | 'account'
  | 'announcements'

export interface NotificationItem {
  id: string
  title: string
  message: string
  timestamp: string
  date: string
  category: NotificationCategory
  isRead: boolean
  linkText?: string
  linkHref?: string
  priority?: 'high' | 'normal' | 'low'
}

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  // 1. Trading
  {
    id: 'notif-1',
    title: 'Limit Buy Order Executed',
    message: 'Your limit order to buy 0.25 BTC at $67,200.00 USDT has been fully filled by the matching engine.',
    timestamp: '12 minutes ago',
    date: '2026-10-20 09:15',
    category: 'trading',
    isRead: false,
    linkText: 'View Order',
    linkHref: '/orders',
    priority: 'normal',
  },
  // 2. Transactions
  {
    id: 'notif-2',
    title: 'Simulated Deposit Confirmed',
    message: 'Your simulated deposit of 1,500.00 USDT via Tron (TRC-20) has received 20 network confirmations and is credited to your spot wallet.',
    timestamp: '45 minutes ago',
    date: '2026-10-20 08:42',
    category: 'transactions',
    isRead: false,
    linkText: 'Check Wallet',
    linkHref: '/wallet',
    priority: 'normal',
  },
  // 3. Security
  {
    id: 'notif-3',
    title: 'New Login Alert (San Francisco, USA)',
    message: 'A successful login was registered from Chrome 129 on Windows 11 (IP: 198.51.100.42). If this was not you, lock your account immediately.',
    timestamp: '2 hours ago',
    date: '2026-10-20 07:25',
    category: 'security',
    isRead: false,
    linkText: 'Security Settings',
    linkHref: '/settings',
    priority: 'high',
  },
  // 4. Account
  {
    id: 'notif-4',
    title: 'Identity Verification (Tier 2) Approved',
    message: 'Congratulations! Your Tier 2 government identity documents have been approved. Your daily withdrawal quota is upgraded to 100 BTC.',
    timestamp: '5 hours ago',
    date: '2026-10-20 04:10',
    category: 'account',
    isRead: true,
    linkText: 'KYC Center',
    linkHref: '/kyc',
    priority: 'high',
  },
  // 5. Transactions
  {
    id: 'notif-5',
    title: 'Withdrawal Completed',
    message: 'Simulated withdrawal of 0.1500 BTC to Ledger Nano X (bc1q9d...88pt) has been successfully verified and confirmed.',
    timestamp: 'Yesterday at 20:30',
    date: '2026-10-19 20:30',
    category: 'transactions',
    isRead: true,
    linkText: 'Withdraw History',
    linkHref: '/withdraw',
    priority: 'normal',
  },
  // 6. Announcements
  {
    id: 'notif-6',
    title: 'Scheduled Engine Maintenance Notice',
    message: 'CoinPlus matching engine will undergo a brief scheduled database index optimization on Sunday, Oct 25 from 02:00 to 03:00 UTC. Spot trading will pause for approximately 15 minutes.',
    timestamp: 'Yesterday at 14:00',
    date: '2026-10-19 14:00',
    category: 'announcements',
    isRead: true,
    priority: 'normal',
  },
  // 7. Trading
  {
    id: 'notif-7',
    title: 'Stop-Limit Trigger Activated',
    message: 'Stop-loss trigger condition met for SOL/USDT at $178.50. A limit sell order for 15.0 SOL was submitted to the book.',
    timestamp: 'Oct 18, 16:45',
    date: '2026-10-18 16:45',
    category: 'trading',
    isRead: true,
    linkText: 'Open Orders',
    linkHref: '/orders',
    priority: 'normal',
  },
  // 8. Security
  {
    id: 'notif-8',
    title: 'Two-Factor Authentication Confirmed',
    message: 'Google Authenticator 2FA was confirmed and set as your primary authorization method for cryptocurrency withdrawals.',
    timestamp: 'Oct 17, 11:20',
    date: '2026-10-17 11:20',
    category: 'security',
    isRead: true,
    linkText: 'Manage 2FA',
    linkHref: '/settings',
    priority: 'high',
  },
  // 9. Account
  {
    id: 'notif-9',
    title: 'VIP Fee Tier 1 Activated',
    message: 'Your 30-day cumulative trading volume reached $50,000 USDT. You now enjoy discounted maker fees of 0.02% and taker fees of 0.04%.',
    timestamp: 'Oct 16, 09:00',
    date: '2026-10-16 09:00',
    category: 'account',
    isRead: true,
    linkText: 'View Tier Benefits',
    linkHref: '/account',
    priority: 'low',
  },
  // 10. Announcements
  {
    id: 'notif-10',
    title: 'New Spot Trading Pair: SUI/USDT Listed',
    message: 'Sui Network (SUI/USDT) is now officially available for spot trading with zero maker fee promotion for the first 30 days.',
    timestamp: 'Oct 15, 08:00',
    date: '2026-10-15 08:00',
    category: 'announcements',
    isRead: true,
    linkText: 'Trade SUI',
    linkHref: '/trade?pair=SUI-USDT',
    priority: 'low',
  },
]
