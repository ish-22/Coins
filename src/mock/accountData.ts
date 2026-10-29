/**
 * CoinPlus Stable Demonstration Data for My Account (/account)
 * NOTE: Simulated demonstration profile data. Not connected to real backend identity services.
 */

export interface UserAccountProfile {
  // Identity & Profile
  uid: string
  displayName: string
  fullName: string
  email: string
  phone: string
  avatarInitials: string
  accountCreationDate: string
  accountStatus: 'active' | 'suspended' | 'pending'
  verificationTier: 'Tier 1 (Basic)' | 'Tier 2 (Verified)' | 'Tier 3 (Institutional)'
  vipLevel: string

  // Personal Information
  country: string
  language: string
  timeZone: string
  displayCurrency: string
  dateFormat: string

  // Preferences
  defaultDashboardView: 'pro_terminal' | 'classic' | 'portfolio'
  themePreference: 'black_gold' | 'oled_dark'
  notifications: {
    tradeFills: boolean
    securityAlerts: boolean
    priceAlerts: boolean
    marketingNews: boolean
  }
}

export const DEFAULT_USER_PROFILE: UserAccountProfile = {
  uid: 'UID-884920',
  displayName: 'Alex Vance',
  fullName: 'Alexander Vance',
  email: 'alex.v@coinplus.io',
  phone: '+1 555-019-8921',
  avatarInitials: 'AV',
  accountCreationDate: 'Nov 14, 2024',
  accountStatus: 'active',
  verificationTier: 'Tier 2 (Verified)',
  vipLevel: 'VIP 1',

  country: 'United States',
  language: 'English (US)',
  timeZone: 'UTC-05:00 (Eastern Time)',
  displayCurrency: 'USD',
  dateFormat: 'YYYY-MM-DD',

  defaultDashboardView: 'pro_terminal',
  themePreference: 'black_gold',
  notifications: {
    tradeFills: true,
    securityAlerts: true,
    priceAlerts: true,
    marketingNews: false,
  },
}

import { COUNTRY_NAMES } from '@/constants/countries'

export const COUNTRY_OPTIONS = COUNTRY_NAMES


export const LANGUAGE_OPTIONS = [
  'English (US)',
  'English (UK)',
  'Español (Spanish)',
  'Deutsch (German)',
  'Français (French)',
  '日本語 (Japanese)',
  '简体中文 (Simplified Chinese)',
  'Português (Portuguese)',
]

export const TIMEZONE_OPTIONS = [
  'UTC-08:00 (Pacific Time)',
  'UTC-05:00 (Eastern Time)',
  'UTC+00:00 (UTC / London)',
  'UTC+01:00 (Central European Time)',
  'UTC+04:00 (Dubai / Gulf Standard)',
  'UTC+08:00 (Singapore / Hong Kong)',
  'UTC+09:00 (Tokyo / JST)',
  'UTC+10:00 (Sydney / AEST)',
]

export const CURRENCY_OPTIONS = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
]

export const DATE_FORMAT_OPTIONS = [
  'YYYY-MM-DD',
  'DD/MM/YYYY',
  'MM/DD/YYYY',
  'YYYY/MM/DD',
]
