/**
 * CoinPlus Stable Demonstration Data for Deposit Workflow
 * NOTE: Simulated demonstration data. Never use for real transactions.
 */

export interface NetworkConfig {
  id: string
  name: string
  protocol: string
  simulatedAddress: string
  memoTag?: string
  minDeposit: string
  expectedArrival: string
  confirmationsRequired: string
  estimatedFee: string
  warningNotice?: string
  isPopular?: boolean
}

export interface DepositAssetConfig {
  id: string
  symbol: string
  name: string
  iconBg: string
  networks: NetworkConfig[]
}

export interface DepositHistoryRecord {
  id: string
  txHash: string
  asset: string
  amount: number
  network: string
  status: 'completed' | 'pending' | 'failed'
  date: string
  time: string
  address: string
  memoTag?: string
  confirmations: string
  explorerUrl?: string
}

export const DEPOSIT_ASSETS: DepositAssetConfig[] = [
  {
    id: 'USDT',
    symbol: 'USDT',
    name: 'Tether USD',
    iconBg: '#00D6A0',
    networks: [
      {
        id: 'TRC20',
        name: 'TRC-20 (Tron)',
        protocol: 'Tron Network',
        simulatedAddress: 'TX9QeSimulatedDemoTRC20WalletAddress48zK99',
        minDeposit: '5.00 USDT',
        expectedArrival: '≈ 1 - 2 minutes',
        confirmationsRequired: '20 network confirmations',
        estimatedFee: '0 USDT (Zero CoinPlus Fee)',
        isPopular: true,
      },
      {
        id: 'ERC20',
        name: 'ERC-20 (Ethereum)',
        protocol: 'Ethereum Network',
        simulatedAddress: '0x71C94SimulatedDemoERC20DepositAddress8B2091',
        minDeposit: '20.00 USDT',
        expectedArrival: '≈ 3 - 5 minutes',
        confirmationsRequired: '12 block confirmations',
        estimatedFee: '0 USDT (Zero CoinPlus Fee)',
      },
      {
        id: 'BEP20',
        name: 'BEP-20 (BNB Smart Chain)',
        protocol: 'BNB Smart Chain',
        simulatedAddress: '0x71C94SimulatedDemoBEP20DepositAddress8B2091',
        minDeposit: '1.00 USDT',
        expectedArrival: '≈ 30 - 60 seconds',
        confirmationsRequired: '15 block confirmations',
        estimatedFee: '0 USDT (Zero CoinPlus Fee)',
        isPopular: true,
      },
      {
        id: 'SOL',
        name: 'Solana (SPL)',
        protocol: 'Solana Network',
        simulatedAddress: 'SOLdemoxSPLTokenDepositAddress99Simulated11',
        minDeposit: '1.00 USDT',
        expectedArrival: '≈ 15 - 30 seconds',
        confirmationsRequired: '32 slot confirmations',
        estimatedFee: '0 USDT (Zero CoinPlus Fee)',
      },
    ],
  },
  {
    id: 'BTC',
    symbol: 'BTC',
    name: 'Bitcoin',
    iconBg: '#F0B93A',
    networks: [
      {
        id: 'BTC-SEGWIT',
        name: 'Bitcoin (Native SegWit bech32)',
        protocol: 'Bitcoin Mainnet',
        simulatedAddress: 'bc1q9demosimulatedsegwitbtcaddress77xkx42',
        minDeposit: '0.0001 BTC',
        expectedArrival: '≈ 10 - 30 minutes',
        confirmationsRequired: '1 network confirmation',
        estimatedFee: '0 BTC (Zero CoinPlus Fee)',
        isPopular: true,
      },
      {
        id: 'BTC-LEGACY',
        name: 'Bitcoin (Legacy P2PKH)',
        protocol: 'Bitcoin Mainnet (Legacy)',
        simulatedAddress: '1DemoBTCLegacyP2PKHSimulatedAddress8891vK',
        minDeposit: '0.0005 BTC',
        expectedArrival: '≈ 20 - 40 minutes',
        confirmationsRequired: '2 network confirmations',
        estimatedFee: '0 BTC (Zero CoinPlus Fee)',
      },
      {
        id: 'BTC-LIGHTNING',
        name: 'Lightning Network (Instant)',
        protocol: 'Lightning Fast Channel',
        simulatedAddress: 'lnbc1demosimulatedlightninginvoicefast0099xky',
        minDeposit: '0.00001 BTC',
        expectedArrival: 'Instant (< 5 seconds)',
        confirmationsRequired: '0 confirmations (Off-chain)',
        estimatedFee: '0 BTC',
        isPopular: true,
      },
    ],
  },
  {
    id: 'ETH',
    symbol: 'ETH',
    name: 'Ethereum',
    iconBg: '#38BDF8',
    networks: [
      {
        id: 'ETH-ERC20',
        name: 'Ethereum (ERC-20 Mainnet)',
        protocol: 'Ethereum Mainnet',
        simulatedAddress: '0x71C94SimulatedDemoERC20DepositAddress8B2091',
        minDeposit: '0.005 ETH',
        expectedArrival: '≈ 2 - 4 minutes',
        confirmationsRequired: '12 block confirmations',
        estimatedFee: '0 ETH (Zero CoinPlus Fee)',
        isPopular: true,
      },
      {
        id: 'ETH-ARBITRUM',
        name: 'Arbitrum One (L2)',
        protocol: 'Arbitrum Rollup',
        simulatedAddress: '0x71C94SimulatedDemoERC20DepositAddress8B2091',
        minDeposit: '0.001 ETH',
        expectedArrival: '≈ 30 seconds',
        confirmationsRequired: '64 block confirmations',
        estimatedFee: '0 ETH',
        isPopular: true,
      },
      {
        id: 'ETH-OPTIMISM',
        name: 'Optimism (OP Mainnet)',
        protocol: 'Optimism Rollup',
        simulatedAddress: '0x71C94SimulatedDemoERC20DepositAddress8B2091',
        minDeposit: '0.001 ETH',
        expectedArrival: '≈ 30 seconds',
        confirmationsRequired: '64 block confirmations',
        estimatedFee: '0 ETH',
      },
    ],
  },
  {
    id: 'SOL',
    symbol: 'SOL',
    name: 'Solana',
    iconBg: '#A855F7',
    networks: [
      {
        id: 'SOL-NATIVE',
        name: 'Solana Native',
        protocol: 'Solana Mainnet-Beta',
        simulatedAddress: 'SOLdemoxSPLTokenDepositAddress99Simulated11',
        minDeposit: '0.05 SOL',
        expectedArrival: '≈ 15 - 30 seconds',
        confirmationsRequired: '32 slot confirmations',
        estimatedFee: '0 SOL (Zero CoinPlus Fee)',
        isPopular: true,
      },
    ],
  },
  {
    id: 'BNB',
    symbol: 'BNB',
    name: 'BNB Chain',
    iconBg: '#F59E0B',
    networks: [
      {
        id: 'BNB-BSC',
        name: 'BNB Smart Chain (BEP-20)',
        protocol: 'BNB Smart Chain (BSC)',
        simulatedAddress: '0x71C94SimulatedDemoBEP20DepositAddress8B2091',
        minDeposit: '0.01 BNB',
        expectedArrival: '≈ 45 seconds',
        confirmationsRequired: '15 block confirmations',
        estimatedFee: '0 BNB',
        isPopular: true,
      },
    ],
  },
  {
    id: 'XRP',
    symbol: 'XRP',
    name: 'Ripple',
    iconBg: '#3B82F6',
    networks: [
      {
        id: 'XRP-LEDGER',
        name: 'XRP Ledger (Native)',
        protocol: 'Ripple Network',
        simulatedAddress: 'rDemoXRPCommunitySimulatedDeposit77vK91',
        memoTag: '884920',
        minDeposit: '1.00 XRP',
        expectedArrival: '≈ 4 seconds',
        confirmationsRequired: '1 ledger confirmation',
        estimatedFee: '0 XRP',
        warningNotice: 'Destination Tag (884920) is required for XRP deposits to credit your account.',
        isPopular: true,
      },
    ],
  },
  {
    id: 'DOGE',
    symbol: 'DOGE',
    name: 'Dogecoin',
    iconBg: '#EAB308',
    networks: [
      {
        id: 'DOGE-NATIVE',
        name: 'Dogecoin Native',
        protocol: 'Dogecoin Core Network',
        simulatedAddress: 'DdemoxDogecoinNativeDepositAddress33k88',
        minDeposit: '10.0 DOGE',
        expectedArrival: '≈ 5 - 10 minutes',
        confirmationsRequired: '6 block confirmations',
        estimatedFee: '0 DOGE',
      },
    ],
  },
]

export const MOCK_DEPOSIT_HISTORY: DepositHistoryRecord[] = [
  {
    id: 'dep-101',
    txHash: '0x8f3c71a4819d9b2e04f7c11a2245bb318029e1f5',
    asset: 'USDT',
    amount: 2000.0,
    network: 'TRC-20 (Tron)',
    status: 'completed',
    date: 'Oct 20, 2026',
    time: '06:40 UTC',
    address: 'TX9Qe...48zK99',
    confirmations: '20/20 Blocks Confirmed',
  },
  {
    id: 'dep-102',
    txHash: '0x3b1944af029910d8a11c88340192e10a88194fa0',
    asset: 'USDT',
    amount: 500.0,
    network: 'ERC-20 (Ethereum)',
    status: 'pending',
    date: 'Oct 20, 2026',
    time: '08:55 UTC',
    address: '0x71C...8B2091',
    confirmations: '8/12 Blocks Confirming...',
  },
  {
    id: 'dep-103',
    txHash: '34a1b0298812c37719d2a019b8821948ac912088194',
    asset: 'BTC',
    amount: 0.2,
    network: 'Bitcoin (Native SegWit)',
    status: 'completed',
    date: 'Oct 17, 2026',
    time: '09:12 UTC',
    address: 'bc1q9...77xkx42',
    confirmations: '6/6 Blocks Confirmed',
  },
  {
    id: 'dep-104',
    txHash: '5wKn48812c0199a0b1298811d7f4ac91882019482011',
    asset: 'SOL',
    amount: 15.5,
    network: 'Solana Native',
    status: 'completed',
    date: 'Oct 15, 2026',
    time: '18:24 UTC',
    address: 'SOLdem...11',
    confirmations: '32/32 Slots Confirmed',
  },
  {
    id: 'dep-105',
    txHash: '0x91da40198820c7719d2a019b8821948ac912066cb',
    asset: 'ETH',
    amount: 0.05,
    network: 'Ethereum (ERC-20)',
    status: 'failed',
    date: 'Oct 12, 2026',
    time: '11:05 UTC',
    address: '0x71C...8B2091',
    confirmations: 'Reverted on-chain (Gas limit exceeded)',
  },
]
