/**
 * CoinPlus Stable Demonstration Data for KYC Verification (/kyc)
 * NOTE: Simulated demonstration data. No real identity verification is conducted.
 */

export type KYCStatus = 'not_started' | 'in_progress' | 'pending_review' | 'approved' | 'rejected'

export type DocumentType = 'passport' | 'id_card' | 'drivers_license' | 'residence_permit'
export type AddressDocType = 'utility_bill' | 'bank_statement' | 'tax_document'

export interface UploadedMockDoc {
  id: string
  name: string
  size: string
  type: string
  previewUrl?: string
  uploadedAt: string
}

export interface KYCFormData {
  // Personal Info
  firstName: string
  lastName: string
  dateOfBirth: string
  nationality: string
  
  // Residence
  country: string
  streetAddress: string
  city: string
  postalCode: string

  // Identity Document
  docType: DocumentType
  docNumber: string
  docExpiry: string
  frontDoc: UploadedMockDoc | null
  backDoc: UploadedMockDoc | null

  // Proof of Address
  addressDocType: AddressDocType
  addressDoc: UploadedMockDoc | null
}

export const INITIAL_KYC_FORM: KYCFormData = {
  firstName: 'Alexander',
  lastName: 'Vance',
  dateOfBirth: '1992-06-18',
  nationality: 'United States',

  country: 'United States',
  streetAddress: '742 Evergreen Terrace',
  city: 'Springfield',
  postalCode: '97477',

  docType: 'passport',
  docNumber: 'P488291039',
  docExpiry: '2030-08-15',
  frontDoc: {
    id: 'mock-doc-front',
    name: 'passport_front_cover_sample.jpg',
    size: '2.4 MB',
    type: 'image/jpeg',
    uploadedAt: 'Today at 09:15 UTC',
  },
  backDoc: null,

  addressDocType: 'utility_bill',
  addressDoc: {
    id: 'mock-doc-address',
    name: 'electric_utility_statement_sep2026.pdf',
    size: '1.1 MB',
    type: 'application/pdf',
    uploadedAt: 'Today at 09:16 UTC',
  },
}

export const KYC_TIERS_INFO = [
  {
    tier: 'Tier 1 (Basic)',
    status: 'Verified',
    benefits: ['Deposit Crypto & Fiat', 'Daily Withdrawal: 2 BTC ($136,000)', 'Standard Spot Trading'],
    requirements: ['Email & Mobile Verification'],
  },
  {
    tier: 'Tier 2 (Verified Identity)',
    status: 'Active Goal',
    badge: 'Recommended',
    benefits: ['Daily Withdrawal: 100 BTC ($6,845,000)', 'Unlimited Crypto Deposits', 'P2P Trading Access', 'VIP Fee Tier Eligibility'],
    requirements: ['Government-Issued Photo ID', 'Proof of Residential Address (within 90 days)'],
  },
  {
    tier: 'Tier 3 (Institutional)',
    status: 'Enterprise',
    benefits: ['Unlimited Daily Withdrawals', 'Dedicated Account Manager', 'Custom API Rate Limits', 'OTC Trading Desk'],
    requirements: ['Certificate of Incorporation', 'Proof of Ultimate Beneficial Owners (UBO)'],
  },
]

export const REJECTION_SAMPLE_EXPLANATION = {
  reason: 'Document image unreadable or partially cut off',
  details:
    'The uploaded document photo was blurry and reflections obscured the date of birth and document number. In addition, the bottom MRZ barcode lines were not fully visible.',
  suggestedAction:
    'Please take a well-lit photo of your government-issued ID with all four corners visible, without glare or flash reflection.',
}
