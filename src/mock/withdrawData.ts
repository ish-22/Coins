/**
 * CoinPlus Stable Demonstration Data for Withdrawal Workflow
 * NOTE: Simulated demonstration data. Never broadcasted to real blockchains.
 */

export interface WithdrawNetworkConfig {
  id: string
  name: string
  protocol: string
  fee: number
  feeDisplay: string
  minWithdraw: number
  maxWithdraw: number
  expectedTime: string
  requiresMemo?: boolean
}

export interface WithdrawAssetConfig {
  id: string
  symbol: string
  name: string
  iconBg: string
  availableBalance: number
  decimals: number
  networks: WithdrawNetworkConfig[]
}

export interface SavedAddress {
  id: string
  label: string
  asset: string
  networkId: string
  address: string
  memoTag?: string
  isWhitelisted: boolean
}

export interface WithdrawHistoryRecord {
  id: string
  txHash?: string
  asset: string
  amount: number
  receivedAmount: number
  fee: number
  network: string
  destinationAddress: string
  memoTag?: string
  status: 'pending' | 'processing' | 'completed' | 'rejected' | 'failed'
  date: string
  time: string
  failureReason?: string
}

export const WITHDRAW_ASSETS: WithdrawAssetConfig[] = [
  {
    id: 'USDT',
    symbol: 'USDT',
    name: 'Tether USD',
    iconBg: '#00D6A0',
    availableBalance: 5850.0,
    decimals: 2,
    networks: [
      {
        id: 'TRC20',
        name: 'TRC-20 (Tron)',
        protocol: 'Tron Network',
        fee: 1.0,
        feeDisplay: '1.00 USDT',
        minWithdraw: 10.0,
        maxWithdraw: 100000.0,
        expectedTime: '≈ 2 - 5 minutes',
      },
      {
        id: 'ERC20',
        name: 'ERC-20 (Ethereum)',
        protocol: 'Ethereum Mainnet',
        fee: 4.5,
        feeDisplay: '4.50 USDT',
        minWithdraw: 25.0,
        maxWithdraw: 100000.0,
        expectedTime: '≈ 5 - 10 minutes',
      },
      {
        id: 'BEP20',
        name: 'BEP-20 (BNB Smart Chain)',
        protocol: 'BNB Smart Chain',
        fee: 0.5,
        feeDisplay: '0.50 USDT',
        minWithdraw: 5.0,
        maxWithdraw: 100000.0,
        expectedTime: '≈ 1 - 3 minutes',
      },
      {
        id: 'SOL',
        name: 'Solana (SPL)',
        protocol: 'Solana Network',
        fee: 0.8,
        feeDisplay: '0.80 USDT',
        minWithdraw: 5.0,
        maxWithdraw: 100000.0,
        expectedTime: '≈ 1 minute',
      },
    ],
  },
  {
    id: 'BTC',
    symbol: 'BTC',
    name: 'Bitcoin',
    iconBg: '#F0B93A',
    availableBalance: 0.2245,
    decimals: 4,
    networks: [
      {
        id: 'BTC-SEGWIT',
        name: 'Bitcoin (Native SegWit bech32)',
        protocol: 'Bitcoin Mainnet',
        fee: 0.00015,
        feeDisplay: '0.00015 BTC',
        minWithdraw: 0.001,
        maxWithdraw: 5.0,
        expectedTime: '≈ 15 - 30 minutes',
      },
      {
        id: 'BTC-LIGHTNING',
        name: 'Lightning Network',
        protocol: 'Lightning Fast Channel',
        fee: 0.000005,
        feeDisplay: '0.000005 BTC',
        minWithdraw: 0.0001,
        maxWithdraw: 0.5,
        expectedTime: 'Instant (< 10 seconds)',
      },
    ],
  },
  {
    id: 'ETH',
    symbol: 'ETH',
    name: 'Ethereum',
    iconBg: '#38BDF8',
    availableBalance: 2.85,
    decimals: 4,
    networks: [
      {
        id: 'ETH-ERC20',
        name: 'Ethereum (ERC-20 Mainnet)',
        protocol: 'Ethereum Mainnet',
        fee: 0.0012,
        feeDisplay: '0.0012 ETH',
        minWithdraw: 0.01,
        maxWithdraw: 50.0,
        expectedTime: '≈ 5 - 10 minutes',
      },
      {
        id: 'ETH-ARBITRUM',
        name: 'Arbitrum One (L2)',
        protocol: 'Arbitrum Rollup',
        fee: 0.0002,
        feeDisplay: '0.0002 ETH',
        minWithdraw: 0.005,
        maxWithdraw: 50.0,
        expectedTime: '≈ 1 - 2 minutes',
      },
    ],
  },
  {
    id: 'SOL',
    symbol: 'SOL',
    name: 'Solana',
    iconBg: '#A855F7',
    availableBalance: 22.5,
    decimals: 2,
    networks: [
      {
        id: 'SOL-NATIVE',
        name: 'Solana Native',
        protocol: 'Solana Mainnet-Beta',
        fee: 0.005,
        feeDisplay: '0.005 SOL',
        minWithdraw: 0.1,
        maxWithdraw: 500.0,
        expectedTime: '≈ 1 minute',
      },
    ],
  },
  {
    id: 'BNB',
    symbol: 'BNB',
    name: 'BNB Chain',
    iconBg: '#F59E0B',
    availableBalance: 2.8,
    decimals: 2,
    networks: [
      {
        id: 'BNB-BSC',
        name: 'BNB Smart Chain (BEP-20)',
        protocol: 'BNB Smart Chain',
        fee: 0.001,
        feeDisplay: '0.001 BNB',
        minWithdraw: 0.05,
        maxWithdraw: 100.0,
        expectedTime: '≈ 1 - 2 minutes',
      },
    ],
  },
  {
    id: 'XRP',
    symbol: 'XRP',
    name: 'Ripple',
    iconBg: '#3B82F6',
    availableBalance: 1200.0,
    decimals: 2,
    networks: [
      {
        id: 'XRP-LEDGER',
        name: 'XRP Ledger (Native)',
        protocol: 'Ripple Network',
        fee: 0.25,
        feeDisplay: '0.25 XRP',
        minWithdraw: 10.0,
        maxWithdraw: 25000.0,
        expectedTime: '≈ 4 seconds',
        requiresMemo: true,
      },
    ],
  },
  {
    id: 'DOGE',
    symbol: 'DOGE',
    name: 'Dogecoin',
    iconBg: '#EAB308',
    availableBalance: 4200.0,
    decimals: 1,
    networks: [
      {
        id: 'DOGE-NATIVE',
        name: 'Dogecoin Native',
        protocol: 'Dogecoin Core Network',
        fee: 2.0,
        feeDisplay: '2.00 DOGE',
        minWithdraw: 20.0,
        maxWithdraw: 50000.0,
        expectedTime: '≈ 5 - 10 minutes',
      },
    ],
  },
]

export const MOCK_SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-1',
    label: 'Ledger Cold Wallet (Personal)',
    asset: 'USDT',
    networkId: 'TRC20',
    address: 'TX9QeColdVaultStorageAddress48zK99TronWhitelisted',
    isWhitelisted: true,
  },
  {
    id: 'addr-2',
    label: 'Trezor Safe 3 (Bitcoin SegWit)',
    asset: 'BTC',
    networkId: 'BTC-SEGWIT',
    address: 'bc1q9demosimulatedsegwitbtcaddress77xkx42',
    isWhitelisted: true,
  },
  {
    id: 'addr-3',
    label: 'MetaMask Vault (Ethereum)',
    asset: 'ETH',
    networkId: 'ETH-ERC20',
    address: '0x71C94SimulatedDemoERC20DepositAddress8B2091',
    isWhitelisted: true,
  },
  {
    id: 'addr-4',
    label: 'Phantom Wallet (Solana)',
    asset: 'SOL',
    networkId: 'SOL-NATIVE',
    address: 'SOLdemoxPhantomVaultDestinationAddress99k',
    isWhitelisted: true,
  },
  {
    id: 'addr-5',
    label: 'External Exchange (XRP with Tag)',
    asset: 'XRP',
    networkId: 'XRP-LEDGER',
    address: 'rDemoXRPExternalExchangeAccountAddress99v',
    memoTag: '449120',
    isWhitelisted: true,
  },
]

export const INITIAL_WITHDRAW_HISTORY: WithdrawHistoryRecord[] = [
  {
    id: 'wth-201',
    txHash: '0x2e11a88b65ff99bc88110948ac91208477192019',
    asset: 'USDT',
    amount: 500.0,
    receivedAmount: 499.0,
    fee: 1.0,
    network: 'TRC-20 (Tron)',
    destinationAddress: 'TV42jWhitelistedColdStorage88wM',
    status: 'completed',
    date: 'Oct 18, 2026',
    time: '14:22 UTC',
  },
  {
    id: 'wth-202',
    txHash: '0x77aa8812c3019a2b019b8821948ac91208811bc0',
    asset: 'BTC',
    amount: 0.05,
    receivedAmount: 0.04985,
    fee: 0.00015,
    network: 'Bitcoin (Native SegWit)',
    destinationAddress: 'bc1q9demosimulatedsegwit77xk',
    status: 'processing',
    date: 'Oct 20, 2026',
    time: '08:45 UTC',
  },
  {
    id: 'wth-203',
    asset: 'ETH',
    amount: 1.2,
    receivedAmount: 1.1988,
    fee: 0.0012,
    network: 'Ethereum (ERC-20)',
    destinationAddress: '0x71C94SimulatedERC20Vault8B20',
    status: 'pending',
    date: 'Oct 20, 2026',
    time: '09:10 UTC',
  },
  {
    id: 'wth-204',
    asset: 'SOL',
    amount: 50.0,
    receivedAmount: 49.995,
    fee: 0.005,
    network: 'Solana Native',
    destinationAddress: 'SOLdemoxBlacklistedAddress99k',
    status: 'rejected',
    date: 'Oct 16, 2026',
    time: '16:30 UTC',
    failureReason: 'Address failed simulated sanctions & AML risk screening.',
  },
  {
    id: 'wth-205',
    txHash: '0x55cc77fa0192881b2091c7719d2a019b8821948a',
    asset: 'USDT',
    amount: 2500.0,
    receivedAmount: 2495.5,
    fee: 4.5,
    network: 'ERC-20 (Ethereum)',
    destinationAddress: '0x33A9912DemoSmartContractVault',
    status: 'failed',
    date: 'Oct 14, 2026',
    time: '10:15 UTC',
    failureReason: 'On-chain simulated contract execution out-of-gas error.',
  },
]
