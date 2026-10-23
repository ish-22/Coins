/**
 * CoinPlus Stable Demonstration Data for Security & Settings (/settings)
 * NOTE: Simulated demonstration data. No real passwords, 2FA keys, or passkeys are handled.
 */

export interface PasskeyItem {
  id: string
  name: string
  deviceType: 'touch_id' | 'face_id' | 'hardware_key' | 'windows_hello'
  addedDate: string
  lastUsed: string
}

export interface LoginHistoryItem {
  id: string
  dateTime: string
  device: string
  browser: string
  ip: string
  location: string
  status: 'successful' | 'failed' | 'blocked'
  isUnknownDevice?: boolean
}

export interface ActiveSessionItem {
  id: string
  device: string
  browser: string
  ip: string
  location: string
  lastActive: string
  isCurrent: boolean
}

export interface TrustedDeviceItem {
  id: string
  name: string
  type: string
  addedDate: string
  lastUsed: string
  ip: string
}

export interface WhitelistAddressItem {
  id: string
  label: string
  asset: string
  network: string
  address: string
  addedDate: string
  memoTag?: string
}

export const INITIAL_PASSKEYS: PasskeyItem[] = [
  {
    id: 'pk-1',
    name: 'MacBook Pro Touch ID (Work Laptop)',
    deviceType: 'touch_id',
    addedDate: '2026-09-12',
    lastUsed: 'Today at 08:30 UTC',
  },
  {
    id: 'pk-2',
    name: 'iPhone 16 Pro Face ID (Personal Mobile)',
    deviceType: 'face_id',
    addedDate: '2026-08-04',
    lastUsed: 'Yesterday at 21:10 UTC',
  },
  {
    id: 'pk-3',
    name: 'YubiKey 5C NFC (Hardware Key)',
    deviceType: 'hardware_key',
    addedDate: '2026-06-20',
    lastUsed: '3 days ago',
  },
]

export const INITIAL_LOGIN_HISTORY: LoginHistoryItem[] = [
  {
    id: 'log-101',
    dateTime: '2026-10-20 08:30:15',
    device: 'MacBook Pro 16" (macOS 15.0)',
    browser: 'Chrome 129.0',
    ip: '198.51.100.42 (Sample IP)',
    location: 'San Francisco, CA, USA',
    status: 'successful',
  },
  {
    id: 'log-102',
    dateTime: '2026-10-19 21:14:02',
    device: 'iPhone 16 Pro (iOS 18.0)',
    browser: 'CoinPlus Mobile App',
    ip: '198.51.100.89 (Sample IP)',
    location: 'San Francisco, CA, USA',
    status: 'successful',
  },
  {
    id: 'log-103',
    dateTime: '2026-10-18 03:42:19',
    device: 'Unknown Linux Workstation',
    browser: 'Firefox 130.0',
    ip: '203.0.113.195 (Sample IP)',
    location: 'Frankfurt, Germany',
    status: 'blocked',
    isUnknownDevice: true,
  },
  {
    id: 'log-104',
    dateTime: '2026-10-17 14:05:44',
    device: 'Windows 11 Desktop',
    browser: 'Edge 128.0',
    ip: '198.51.100.42 (Sample IP)',
    location: 'San Francisco, CA, USA',
    status: 'successful',
  },
  {
    id: 'log-105',
    dateTime: '2026-10-15 09:12:30',
    device: 'Windows 10 Workstation',
    browser: 'Chrome 128.0',
    ip: '192.0.2.77 (Sample IP)',
    location: 'New York, NY, USA',
    status: 'failed',
    isUnknownDevice: true,
  },
]

export const INITIAL_ACTIVE_SESSIONS: ActiveSessionItem[] = [
  {
    id: 'ses-1',
    device: 'Current Device (Windows 11 / Chrome)',
    browser: 'Chrome 129.0',
    ip: '198.51.100.42 (Simulated IP)',
    location: 'San Francisco, CA, USA',
    lastActive: 'Active Now',
    isCurrent: true,
  },
  {
    id: 'ses-2',
    device: 'iPhone 16 Pro (CoinPlus App)',
    browser: 'Mobile App v2.4.0',
    ip: '198.51.100.89 (Simulated IP)',
    location: 'San Francisco, CA, USA',
    lastActive: '35 minutes ago',
    isCurrent: false,
  },
  {
    id: 'ses-3',
    device: 'MacBook Pro 16" (macOS)',
    browser: 'Safari 18.0',
    ip: '198.51.100.42 (Simulated IP)',
    location: 'San Francisco, CA, USA',
    lastActive: '2 days ago',
    isCurrent: false,
  },
]

export const INITIAL_TRUSTED_DEVICES: TrustedDeviceItem[] = [
  {
    id: 'dev-1',
    name: 'Alex Vance\'s Primary PC (Windows 11)',
    type: 'Desktop Computer',
    addedDate: '2026-09-01',
    lastUsed: 'Today at 08:45 UTC',
    ip: '198.51.100.42',
  },
  {
    id: 'dev-2',
    name: 'Personal iPhone 16 Pro',
    type: 'Smartphone',
    addedDate: '2026-08-14',
    lastUsed: 'Yesterday at 21:14 UTC',
    ip: '198.51.100.89',
  },
  {
    id: 'dev-3',
    name: 'Work MacBook Pro 16"',
    type: 'Laptop',
    addedDate: '2026-07-20',
    lastUsed: 'Oct 17, 2026',
    ip: '198.51.100.42',
  },
]

export const INITIAL_WHITELIST_ADDRESSES: WhitelistAddressItem[] = [
  {
    id: 'wl-1',
    label: 'Ledger Nano X (Cold Storage)',
    asset: 'BTC',
    network: 'Bitcoin Native (SegWit)',
    address: 'bc1q9d84g0y7x2lm45kp8h9c43v2k8l5j7m49z88pt',
    addedDate: '2026-08-10',
  },
  {
    id: 'wl-2',
    label: 'Trezor Model T (ETH Vault)',
    asset: 'ETH',
    network: 'Ethereum (ERC-20)',
    address: '0x71C...4e8B',
    addedDate: '2026-08-15',
  },
  {
    id: 'wl-3',
    label: 'Institutional Payout Ledger',
    asset: 'USDT',
    network: 'Tron (TRC-20)',
    address: 'TYDzsY...K8mP2x',
    addedDate: '2026-09-02',
  },
  {
    id: 'wl-4',
    label: 'Ripple Vault Cold Wallet',
    asset: 'XRP',
    network: 'XRP Ledger',
    address: 'rEb8...j2b1',
    memoTag: '849201',
    addedDate: '2026-09-18',
  },
]
