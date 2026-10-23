/**
 * CoinPlus Stable Demonstration Data for Fees & Limits (/fees)
 * NOTE: Simulated demonstration data. These are illustrative rates for showcase purposes only.
 */

export interface SpotFeeTier {
  tier: string
  volume30d: string
  makerFee: number
  takerFee: number
  makerDisplay: string
  takerDisplay: string
  isCurrent?: boolean
}

export interface DepositFeeItem {
  asset: string
  symbol: string
  networks: string
  fee: string
  minDeposit: string
  confirmations: string
  speed: string
}

export interface WithdrawalFeeItem {
  asset: string
  symbol: string
  network: string
  fee: string
  feeUsd: string
  minWithdraw: string
  dailyLimit: string
}

export interface LimitTierItem {
  tier: string
  kycRequirement: string
  cryptoDeposit: string
  fiatDeposit: string
  dailyWithdrawal: string
  monthlyWithdrawal: string
  isCurrent?: boolean
}

export interface FeeCalculatorOption {
  id: string
  label: string
  rate: number
  type: 'maker' | 'taker'
  tier: string
}

export const SPOT_FEE_TIERS: SpotFeeTier[] = [
  {
    tier: 'Regular (VIP 0)',
    volume30d: '< 10,000 USDT',
    makerFee: 0.001,
    takerFee: 0.001,
    makerDisplay: '0.1000%',
    takerDisplay: '0.1000%',
  },
  {
    tier: 'VIP 1 (Current)',
    volume30d: '≥ 50,000 USDT',
    makerFee: 0.0002,
    takerFee: 0.0004,
    makerDisplay: '0.0200%',
    takerDisplay: '0.0400%',
    isCurrent: true,
  },
  {
    tier: 'VIP 2',
    volume30d: '≥ 250,000 USDT',
    makerFee: 0.00015,
    takerFee: 0.00035,
    makerDisplay: '0.0150%',
    takerDisplay: '0.0350%',
  },
  {
    tier: 'VIP 3',
    volume30d: '≥ 1,000,000 USDT',
    makerFee: 0.0001,
    takerFee: 0.0003,
    makerDisplay: '0.0100%',
    takerDisplay: '0.0300%',
  },
  {
    tier: 'VIP 4',
    volume30d: '≥ 5,000,000 USDT',
    makerFee: 0.00005,
    takerFee: 0.00025,
    makerDisplay: '0.0050%',
    takerDisplay: '0.0250%',
  },
  {
    tier: 'VIP 5',
    volume30d: '≥ 20,000,000 USDT',
    makerFee: 0.0,
    takerFee: 0.0002,
    makerDisplay: '0.0000%',
    takerDisplay: '0.0200%',
  },
  {
    tier: 'Institutional',
    volume30d: '≥ 50,000,000 USDT',
    makerFee: -0.00005,
    takerFee: 0.00015,
    makerDisplay: '-0.0050% (Rebate)',
    takerDisplay: '0.0150%',
  },
]

export const DEPOSIT_FEE_TABLE: DepositFeeItem[] = [
  {
    asset: 'Bitcoin',
    symbol: 'BTC',
    networks: 'Bitcoin Native (SegWit)',
    fee: '0.00% (Free)',
    minDeposit: '0.0001 BTC',
    confirmations: '2 Confirmations',
    speed: '~15-30 Mins',
  },
  {
    asset: 'Ethereum',
    symbol: 'ETH',
    networks: 'ERC-20, Arbitrum, Optimism',
    fee: '0.00% (Free)',
    minDeposit: '0.005 ETH',
    confirmations: '12 Confirmations',
    speed: '~3-5 Mins',
  },
  {
    asset: 'Tether USD',
    symbol: 'USDT',
    networks: 'TRC-20, ERC-20, BEP-20',
    fee: '0.00% (Free)',
    minDeposit: '5.00 USDT',
    confirmations: '20 Confirmations',
    speed: '< 2 Mins',
  },
  {
    asset: 'Solana',
    symbol: 'SOL',
    networks: 'Solana Native',
    fee: '0.00% (Free)',
    minDeposit: '0.05 SOL',
    confirmations: '32 Confirmations',
    speed: '< 1 Min',
  },
  {
    asset: 'BNB',
    symbol: 'BNB',
    networks: 'BNB Smart Chain (BEP-20)',
    fee: '0.00% (Free)',
    minDeposit: '0.01 BNB',
    confirmations: '15 Confirmations',
    speed: '< 1 Min',
  },
  {
    asset: 'Ripple',
    symbol: 'XRP',
    networks: 'XRP Ledger',
    fee: '0.00% (Free)',
    minDeposit: '10.0 XRP',
    confirmations: '1 Confirmation',
    speed: 'Instant (~10s)',
  },
  {
    asset: 'Dogecoin',
    symbol: 'DOGE',
    networks: 'Dogecoin Native',
    fee: '0.00% (Free)',
    minDeposit: '20.0 DOGE',
    confirmations: '6 Confirmations',
    speed: '~10 Mins',
  },
]

export const WITHDRAWAL_FEE_TABLE: WithdrawalFeeItem[] = [
  {
    asset: 'Bitcoin',
    symbol: 'BTC',
    network: 'Bitcoin Native (SegWit)',
    fee: '0.0002 BTC',
    feeUsd: '~$13.69',
    minWithdraw: '0.001 BTC',
    dailyLimit: '100 BTC',
  },
  {
    asset: 'Ethereum',
    symbol: 'ETH',
    network: 'Ethereum (ERC-20)',
    fee: '0.0025 ETH',
    feeUsd: '~$9.06',
    minWithdraw: '0.01 ETH',
    dailyLimit: '500 ETH',
  },
  {
    asset: 'Ethereum',
    symbol: 'ETH',
    network: 'Arbitrum One',
    fee: '0.0003 ETH',
    feeUsd: '~$1.08',
    minWithdraw: '0.005 ETH',
    dailyLimit: '500 ETH',
  },
  {
    asset: 'Tether USD',
    symbol: 'USDT',
    network: 'Tron (TRC-20)',
    fee: '1.00 USDT',
    feeUsd: '~$1.00',
    minWithdraw: '10.00 USDT',
    dailyLimit: '500,000 USDT',
  },
  {
    asset: 'Tether USD',
    symbol: 'USDT',
    network: 'Ethereum (ERC-20)',
    fee: '3.50 USDT',
    feeUsd: '~$3.50',
    minWithdraw: '25.00 USDT',
    dailyLimit: '500,000 USDT',
  },
  {
    asset: 'Solana',
    symbol: 'SOL',
    network: 'Solana Native',
    fee: '0.005 SOL',
    feeUsd: '~$0.92',
    minWithdraw: '0.1 SOL',
    dailyLimit: '5,000 SOL',
  },
  {
    asset: 'BNB',
    symbol: 'BNB',
    network: 'BNB Smart Chain (BEP-20)',
    fee: '0.0005 BNB',
    feeUsd: '~$0.30',
    minWithdraw: '0.02 BNB',
    dailyLimit: '2,000 BNB',
  },
  {
    asset: 'Ripple',
    symbol: 'XRP',
    network: 'XRP Ledger',
    fee: '0.25 XRP',
    feeUsd: '~$0.15',
    minWithdraw: '15.0 XRP',
    dailyLimit: '500,000 XRP',
  },
  {
    asset: 'Dogecoin',
    symbol: 'DOGE',
    network: 'Dogecoin Native',
    fee: '4.0 DOGE',
    feeUsd: '~$0.57',
    minWithdraw: '50.0 DOGE',
    dailyLimit: '1,000,000 DOGE',
  },
]

export const LIMIT_TIERS_TABLE: LimitTierItem[] = [
  {
    tier: 'Tier 1 (Basic)',
    kycRequirement: 'Email & Phone Verification',
    cryptoDeposit: 'Unlimited',
    fiatDeposit: 'Disabled',
    dailyWithdrawal: '2 BTC (~$136,000 USD)',
    monthlyWithdrawal: '50 BTC',
  },
  {
    tier: 'Tier 2 (Verified Identity)',
    kycRequirement: 'Government Photo ID & Proof of Address',
    cryptoDeposit: 'Unlimited',
    fiatDeposit: 'Unlimited ($500k/day bank transfer)',
    dailyWithdrawal: '100 BTC (~$6,845,000 USD)',
    monthlyWithdrawal: '2,000 BTC',
    isCurrent: true,
  },
  {
    tier: 'Tier 3 (Institutional)',
    kycRequirement: 'Corporate Entity Docs & UBO Clearance',
    cryptoDeposit: 'Unlimited',
    fiatDeposit: 'Custom High-Volume Rails',
    dailyWithdrawal: 'Unlimited',
    monthlyWithdrawal: 'Unlimited',
  },
]

export const CALCULATOR_CATEGORIES: FeeCalculatorOption[] = [
  { id: 'vip1-maker', label: 'VIP 1 - Maker (0.02%)', rate: 0.0002, type: 'maker', tier: 'VIP 1' },
  { id: 'vip1-taker', label: 'VIP 1 - Taker (0.04%)', rate: 0.0004, type: 'taker', tier: 'VIP 1' },
  { id: 'vip0-standard', label: 'Regular - Standard (0.10%)', rate: 0.001, type: 'taker', tier: 'Regular' },
  { id: 'vip2-maker', label: 'VIP 2 - Maker (0.015%)', rate: 0.00015, type: 'maker', tier: 'VIP 2' },
  { id: 'vip2-taker', label: 'VIP 2 - Taker (0.035%)', rate: 0.00035, type: 'taker', tier: 'VIP 2' },
  { id: 'vip3-maker', label: 'VIP 3 - Maker (0.010%)', rate: 0.0001, type: 'maker', tier: 'VIP 3' },
  { id: 'vip3-taker', label: 'VIP 3 - Taker (0.030%)', rate: 0.0003, type: 'taker', tier: 'VIP 3' },
]

export const FEES_FAQS = [
  {
    question: 'How are Maker and Taker fees determined on CoinPlus?',
    answer:
      'Orders that provide liquidity to the order book (such as non-immediate limit orders) are classified as Maker orders and receive our lowest fee schedule. Orders that execute immediately against existing order book depth (such as market orders or crossing limit orders) are classified as Taker orders.',
  },
  {
    question: 'Are there any hidden fees for depositing cryptocurrency?',
    answer:
      'No. CoinPlus does not charge any fee for incoming cryptocurrency deposits. All sample deposits shown are 100% free of platform charges.',
  },
  {
    question: 'Why do withdrawal fees vary across different blockchain networks?',
    answer:
      'Withdrawal fees reflect the underlying blockchain network transaction cost (miner/gas fees) required to broadcast the transaction onto the decentralized ledger. For example, Layer-2 networks like Arbitrum or Tron TRC-20 cost significantly less than the native Bitcoin or Ethereum Layer-1 networks.',
  },
  {
    question: 'How can I qualify for lower VIP trading fee tiers?',
    answer:
      'VIP tiers are automatically evaluated daily at 00:00 UTC based on your trailing 30-day simulated spot trading volume in USDT equivalent.',
  },
  {
    question: 'Do negative maker fee rebates exist for high-volume market makers?',
    answer:
      'Yes, institutional traders with trailing 30-day volume exceeding $50M USDT receive negative maker fee rebates (-0.005%), effectively paying them a liquidity reward for each passive limit fill.',
  },
]
