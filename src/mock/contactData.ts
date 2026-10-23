/**
 * CoinPlus Demonstration Data & Config for Contact Us (/contact)
 * NOTE: All contact endpoints, emails, and channels are configurable placeholders
 * strictly for platform demonstration purposes. No real emails or messages are sent.
 */

export type InquiryCategoryId = 'general' | 'account' | 'trading' | 'security' | 'business'

export interface InquiryCategoryConfig {
  id: InquiryCategoryId
  label: string
  description: string
  estimatedResponse: string
}

export const INQUIRY_CATEGORIES: InquiryCategoryConfig[] = [
  {
    id: 'general',
    label: 'General Inquiry',
    description: 'General questions regarding the CoinPlus demonstration platform and features',
    estimatedResponse: '< 24 hours (Simulated)',
  },
  {
    id: 'account',
    label: 'Account Support',
    description: 'Assistance with demonstration credentials, session management, or KYC stages',
    estimatedResponse: '< 4 hours (Simulated)',
  },
  {
    id: 'trading',
    label: 'Trading',
    description: 'Spot matching engine simulation, limit/market orders, and fee schedules',
    estimatedResponse: '< 2 hours (Simulated)',
  },
  {
    id: 'security',
    label: 'Security',
    description: 'Demonstration 2FA, biometric passkeys, or simulated security audits',
    estimatedResponse: 'Immediate priority (Simulated)',
  },
  {
    id: 'business',
    label: 'Business Inquiry',
    description: 'Institutional partnerships, liquidity concept discussions, and API integrations',
    estimatedResponse: '1-2 business days (Simulated)',
  },
]

export interface ContactPlaceholderChannel {
  id: string
  title: string
  label: string
  placeholderValue: string
  note: string
  badgeText: string
}

export const OFFICIAL_CONTACT_PLACEHOLDERS: ContactPlaceholderChannel[] = [
  {
    id: 'support-desk',
    title: 'Customer Support Desk',
    label: 'Demonstration Support Inbox',
    placeholderValue: 'support@coinplus.demo.local',
    note: 'Configurable placeholder for client assistance inquiries',
    badgeText: 'Demonstration Desk',
  },
  {
    id: 'institutional',
    title: 'Institutional Partnerships',
    label: 'Corporate & Liquidity Desk',
    placeholderValue: 'institutional@coinplus.demo.local',
    note: 'Configurable placeholder for market maker and VIP inquiries',
    badgeText: 'Concept Partner Desk',
  },
  {
    id: 'security-compliance',
    title: 'Security & Compliance',
    label: 'Demonstration Security Inbox',
    placeholderValue: 'security@coinplus.demo.local',
    note: 'Configurable placeholder for AML/KYC and security questions',
    badgeText: 'Audit Placeholder',
  },
]

export interface SubmittedContactRecord {
  referenceId: string
  name: string
  email: string
  category: InquiryCategoryId
  categoryLabel: string
  subject: string
  message: string
  timestamp: string
}
