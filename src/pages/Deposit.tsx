import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowDownToLine,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  Filter,
  QrCode,
  Sparkles,
  ArrowRight,
  X,
  HelpCircle,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Typography } from '@/components/common/Typography'
import {
  DEPOSIT_ASSETS,
  DepositAssetConfig,
  NetworkConfig,
  MOCK_DEPOSIT_HISTORY,
  DepositHistoryRecord,
} from '@/mock/depositData'
import { formatCrypto, truncateHash } from '@/utils/formatters'
import { DemoQRCode, DepositTransactionDetailModal } from '@/components/deposit'
import { walletService } from '@/services'

export const Deposit: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const coinParam = searchParams.get('coin') || searchParams.get('asset')

  // Find initial asset from URL or default to USDT
  const initialAsset =
    DEPOSIT_ASSETS.find(
      (a) => a.symbol.toLowerCase() === coinParam?.toLowerCase() || a.id.toLowerCase() === coinParam?.toLowerCase()
    ) || DEPOSIT_ASSETS[0]

  const [selectedAsset, setSelectedAsset] = useState<DepositAssetConfig>(initialAsset)
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkConfig>(initialAsset.networks[0])
  const [activeAddress, setActiveAddress] = useState<string>(initialAsset.networks[0].simulatedAddress)

  // Toast & Copy status
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [copiedTag, setCopiedTag] = useState(false)

  // Transaction Detail Modal
  const [selectedTx, setSelectedTx] = useState<DepositHistoryRecord | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Deposit history filter
  const [historyFilter, setHistoryFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all')

  // Sync state when URL param changes
  useEffect(() => {
    if (coinParam) {
      const match = DEPOSIT_ASSETS.find(
        (a) => a.symbol.toLowerCase() === coinParam.toLowerCase() || a.id.toLowerCase() === coinParam.toLowerCase()
      )
      if (match) {
        setSelectedAsset(match)
        setSelectedNetwork(match.networks[0])
        setActiveAddress(match.networks[0].simulatedAddress)
      }
    }
  }, [coinParam])

  // Resolve deposit address via backend API with fallback
  useEffect(() => {
    let isSubscribed = true
    walletService
      .getDepositAddress(selectedAsset.symbol, selectedNetwork.name)
      .then((res: any) => {
        if (isSubscribed && res?.address) {
          setActiveAddress(res.address)
        }
      })
      .catch(() => {
        if (isSubscribed) {
          setActiveAddress(selectedNetwork.simulatedAddress)
        }
      })

    return () => {
      isSubscribed = false
    }
  }, [selectedAsset.symbol, selectedNetwork])

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  // Handle asset switch
  const handleSelectAsset = (asset: DepositAssetConfig) => {
    setSelectedAsset(asset)
    setSelectedNetwork(asset.networks[0])
    setActiveAddress(asset.networks[0].simulatedAddress)
    setSearchParams({ coin: asset.symbol })
  }

  // Copy to clipboard helper
  const handleCopy = (text: string, label: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {})
    }
    if (label.toLowerCase().includes('tag')) {
      setCopiedTag(true)
      setTimeout(() => setCopiedTag(false), 2000)
    } else {
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    }
    setToastMessage(`Simulated ${label} copied to clipboard!`)
  }

  // Filtered deposit history
  const filteredHistory = MOCK_DEPOSIT_HISTORY.filter((item) => {
    if (historyFilter === 'all') return true
    return item.status === historyFilter
  })

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-cp-elevated border border-cp-gold/60 text-cp-text-primary shadow-elevated animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-cp-positive shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-cp-text-muted hover:text-cp-text-primary ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Demonstration Environment Notice Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 rounded-xl bg-cp-elevated border border-cp-gold/30 text-xs shadow-sm">
        <div className="flex items-center gap-2.5">
          <Badge variant="gold" size="sm" withDot pulseDot className="shrink-0">
            SIMULATED INTERFACE
          </Badge>
          <span className="text-cp-text-secondary leading-relaxed">
            All deposit addresses, QR codes, and networks are demonstration models. Never send real cryptocurrency funds to these simulated addresses.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link to="/wallet" className="text-cp-gold hover:underline font-semibold flex items-center gap-1">
            <span>View Wallet Balances</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 1 & 2. Page Header & Instructions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-cp-text-muted mb-1.5">
            <Link to="/dashboard" className="hover:text-cp-gold transition-colors">CoinPlus</Link>
            <ChevronRight className="w-3.5 h-3.5 text-cp-border-light" />
            <Link to="/wallet" className="hover:text-cp-gold transition-colors">Wallet</Link>
            <ChevronRight className="w-3.5 h-3.5 text-cp-border-light" />
            <span className="text-cp-gold font-medium">Deposit</span>
          </nav>

          <Typography variant="h1" className="text-2xl sm:text-3xl font-extrabold text-cp-text-primary">
            Deposit Assets
          </Typography>

          <Typography variant="body-sm" color="secondary" className="mt-1 max-w-2xl">
            Select a cryptocurrency and its corresponding network protocol to generate your unique simulated deposit address and QR code.
          </Typography>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/trade">
            <Button variant="outline" size="md">
              Go to Trade Terminal
            </Button>
          </Link>
        </div>
      </div>

      {/* 3. Three-Step Workflow Indicator */}
      <Card variant="default" padding="sm" className="bg-cp-elevated/40">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          {/* Step 1 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 p-2 rounded-lg bg-cp-card border border-cp-gold/40">
            <span className="w-6 h-6 rounded-full bg-cp-gold text-cp-bg font-extrabold text-xs flex items-center justify-center shrink-0">
              1
            </span>
            <div className="text-left">
              <span className="text-xs font-bold text-cp-text-primary block leading-none">
                Select Asset
              </span>
              <span className="text-[10px] text-cp-gold font-mono">{selectedAsset.symbol}</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 p-2 rounded-lg bg-cp-card border border-cp-gold/40">
            <span className="w-6 h-6 rounded-full bg-cp-gold text-cp-bg font-extrabold text-xs flex items-center justify-center shrink-0">
              2
            </span>
            <div className="text-left">
              <span className="text-xs font-bold text-cp-text-primary block leading-none">
                Select Network
              </span>
              <span className="text-[10px] text-cp-gold font-mono truncate max-w-[120px] block">
                {selectedNetwork.name.split(' ')[0]}
              </span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 p-2 rounded-lg bg-cp-card border border-cp-gold/40">
            <span className="w-6 h-6 rounded-full bg-cp-gold text-cp-bg font-extrabold text-xs flex items-center justify-center shrink-0">
              3
            </span>
            <div className="text-left">
              <span className="text-xs font-bold text-cp-text-primary block leading-none">
                Deposit Details
              </span>
              <span className="text-[10px] text-cp-positive font-mono">Address Ready</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Workflow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Selection Controls & Deposit Details Card */}
        <div className="lg:col-span-7 space-y-6">
          {/* 4. Cryptocurrency Selector */}
          <Card variant="default" padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-cp-border pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cp-gold block">
                  Step 1
                </span>
                <CardTitle className="text-base sm:text-lg">Choose Cryptocurrency</CardTitle>
              </div>
              <Badge variant="neutral" size="sm">{DEPOSIT_ASSETS.length} Assets Available</Badge>
            </div>

            {/* Quick Asset Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {DEPOSIT_ASSETS.map((asset) => {
                const isSelected = asset.id === selectedAsset.id
                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => handleSelectAsset(asset)}
                    className={cn(
                      'p-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-left select-none',
                      isSelected
                        ? 'bg-cp-gold/10 border-cp-gold shadow-gold-sm ring-1 ring-cp-gold'
                        : 'bg-cp-elevated/70 border-cp-border hover:border-cp-border-light hover:bg-cp-elevated'
                    )}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs text-cp-bg shrink-0 shadow-sm"
                      style={{ backgroundColor: asset.iconBg }}
                    >
                      {asset.symbol.slice(0, 3)}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-cp-text-primary block truncate font-mono">
                        {asset.symbol}
                      </span>
                      <span className="text-[10px] text-cp-text-muted truncate block">
                        {asset.name}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </Card>

          {/* 5. Network Selector */}
          <Card variant="default" padding="md" className="space-y-4">
            <div className="flex items-center justify-between border-b border-cp-border pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cp-gold block">
                  Step 2
                </span>
                <CardTitle className="text-base sm:text-lg">Select Deposit Network</CardTitle>
              </div>
              <span className="text-xs text-cp-text-muted">
                Matched for <span className="text-cp-gold font-bold">{selectedAsset.symbol}</span>
              </span>
            </div>

            {/* Network Radio Cards */}
            <div className="space-y-2.5">
              {selectedAsset.networks.map((net) => {
                const isSelected = net.id === selectedNetwork.id
                return (
                  <div
                    key={net.id}
                    onClick={() => setSelectedNetwork(net)}
                    className={cn(
                      'p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all select-none',
                      isSelected
                        ? 'bg-cp-gold/10 border-cp-gold shadow-gold-sm ring-1 ring-cp-gold'
                        : 'bg-cp-elevated/60 border-cp-border hover:border-cp-border-light hover:bg-cp-elevated'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-4 h-4 rounded-full border flex items-center justify-center transition-colors',
                          isSelected
                            ? 'border-cp-gold bg-cp-gold'
                            : 'border-cp-border bg-cp-card'
                        )}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-cp-bg" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-cp-text-primary">
                            {net.name}
                          </span>
                          {net.isPopular && (
                            <Badge variant="gold" size="sm" className="text-[9px] py-0">
                              Popular
                            </Badge>
                          )}
                        </div>
                        <span className="text-[11px] text-cp-text-muted block">
                          Estimated Arrival: {net.expectedArrival} • {net.confirmationsRequired}
                        </span>
                      </div>
                    </div>

                    <div className="text-right text-[11px] font-mono text-cp-text-secondary hidden sm:block">
                      <span>Fee: {net.estimatedFee}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* 6. Deposit Information Card (Address, QR, Memo, Confirmations) */}
          <Card variant="gold" padding="lg" className="space-y-6 relative overflow-hidden border-cp-gold/40">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-cp-border/60 pb-4 gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cp-gold block">
                  Step 3: Deposit Address
                </span>
                <CardTitle className="text-lg">
                  {selectedAsset.symbol} on {selectedNetwork.name}
                </CardTitle>
              </div>

              <Badge variant="positive" size="sm" withDot pulseDot>
                Address Active
              </Badge>
            </div>

            {/* QR Code and Address Layout */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* QR Code Graphic */}
              <div className="shrink-0 flex flex-col items-center gap-2">
                <DemoQRCode value={activeAddress} size={160} />
                <span className="text-[10px] font-mono text-cp-text-muted flex items-center gap-1">
                  <QrCode className="w-3 h-3 text-cp-gold" />
                  <span>Scan with Trust Wallet camera</span>
                </span>
              </div>

              {/* Address details & Copy Controls */}
              <div className="flex-1 space-y-4 w-full">
                {/* Deposit Address */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-cp-text-muted uppercase tracking-wider">
                      Your {selectedAsset.symbol} Deposit Address
                    </label>
                    <span className="text-[10px] text-cp-gold font-mono">Trust Wallet Compatible</span>
                  </div>

                  <div className="p-3 rounded-xl bg-cp-card border border-cp-border flex items-center justify-between gap-3 group">
                    <span className="font-mono text-xs sm:text-sm text-cp-text-primary break-all select-all font-semibold">
                      {activeAddress}
                    </span>

                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => handleCopy(activeAddress, 'Deposit Address')}
                      className="shrink-0 text-xs px-3 py-1.5"
                    >
                      {copiedAddress ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 mr-1" />
                          <span>Copy Address</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Compatible Wallets Tag Strip */}
                <div className="flex items-center gap-2 pt-1 flex-wrap text-[10px] text-cp-text-muted">
                  <span className="text-cp-gold font-bold">Compatible:</span>
                  <span className="px-2 py-0.5 rounded-md bg-cp-elevated border border-cp-border font-medium text-cp-text-primary">Trust Wallet</span>
                  <span className="px-2 py-0.5 rounded-md bg-cp-elevated border border-cp-border font-medium text-cp-text-primary">MetaMask</span>
                  <span className="px-2 py-0.5 rounded-md bg-cp-elevated border border-cp-border font-medium text-cp-text-primary">Binance</span>
                  <span className="px-2 py-0.5 rounded-md bg-cp-elevated border border-cp-border font-medium text-cp-text-primary">Coinbase</span>
                  <span className="px-2 py-0.5 rounded-md bg-cp-elevated border border-cp-border font-medium text-cp-text-primary">Hardware Wallets</span>
                </div>

                {/* Memo / Destination Tag if required (e.g. XRP) */}
                {selectedNetwork.memoTag && (
                  <div className="space-y-1.5 p-3 rounded-xl bg-cp-card border border-cp-gold/60">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cp-gold flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Destination Tag / Memo (Required)</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <span className="font-mono text-base font-bold text-cp-text-primary">
                        {selectedNetwork.memoTag}
                      </span>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCopy(selectedNetwork.memoTag!, 'Destination Tag')}
                      >
                        {copiedTag ? 'Copied' : 'Copy Tag'}
                      </Button>
                    </div>

                    <p className="text-[10px] text-cp-text-muted leading-relaxed pt-1">
                      Both the deposit address and Destination Tag are mandatory for XRP deposits to credit your account.
                    </p>
                  </div>
                )}

                {/* Essential Rules Summary */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-cp-card/60 border border-cp-border/50">
                    <span className="text-[10px] text-cp-text-muted font-sans block">Minimum Deposit</span>
                    <span className="font-bold text-cp-text-primary">{selectedNetwork.minDeposit}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-cp-card/60 border border-cp-border/50">
                    <span className="text-[10px] text-cp-text-muted font-sans block">Confirmations</span>
                    <span className="font-bold text-cp-positive">{selectedNetwork.confirmationsRequired.split(' ')[0]} Blocks</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 5 Columns: Security Warnings, FAQs & Quick Status */}
        <div className="lg:col-span-5 space-y-6">
          {/* Trust Wallet & Web3 Walkthrough Card */}
          <Card variant="gold" padding="md" className="border-cp-gold/60 space-y-3.5 bg-gradient-to-br from-cp-card via-cp-elevated to-cp-card shadow-gold-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cp-gold/20 flex items-center justify-center text-cp-gold font-bold text-xs">
                  TW
                </div>
                <div>
                  <h4 className="font-bold text-sm text-cp-text-primary">Deposit with Trust Wallet</h4>
                  <span className="text-[10px] text-cp-gold">Instant mobile transfer</span>
                </div>
              </div>
              <Badge variant="gold" size="sm">Direct Scan</Badge>
            </div>

            <ol className="space-y-2 text-xs text-cp-text-secondary">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cp-gold/20 text-cp-gold text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span>Open your <strong>Trust Wallet</strong> app on your smartphone.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cp-gold/20 text-cp-gold text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span>Tap <strong>Send</strong> and select <strong>{selectedAsset.symbol}</strong>.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cp-gold/20 text-cp-gold text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span>Tap the <strong>QR Scanner icon</strong> in Trust Wallet to scan the code on the left, or paste the copied address.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cp-gold/20 text-cp-gold text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <span>Make sure network is set to <strong>{selectedNetwork.name}</strong>, enter amount, and confirm!</span>
              </li>
            </ol>
          </Card>

          {/* 7. Crucial Warning Card */}
          <Card variant="elevated" padding="md" className="border-cp-gold/40 space-y-3.5">
            <div className="flex items-center gap-2.5 text-cp-gold">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <h4 className="font-bold text-sm text-cp-text-primary">Deposit Safety Guidelines</h4>
            </div>

            <ul className="space-y-2.5 text-xs text-cp-text-secondary leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cp-gold mt-1.5 shrink-0" />
                <span>
                  Send only <strong className="text-cp-text-primary">{selectedAsset.symbol}</strong> to this simulated address. Depositing other coins will not credit.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cp-gold mt-1.5 shrink-0" />
                <span>
                  Ensure your source wallet or exchange supports <strong className="text-cp-text-primary">{selectedNetwork.name}</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cp-positive mt-1.5 shrink-0" />
                <span>
                  Deposits below the minimum of <strong className="text-cp-text-primary">{selectedNetwork.minDeposit}</strong> will not be credited.
                </span>
              </li>
            </ul>
          </Card>

          {/* Quick Account Limits Card */}
          <Card variant="default" padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cp-text-primary">Your Deposit Tier</span>
              <Badge variant="positive" size="sm" withDot>Tier 2 Verified</Badge>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-cp-border/50">
                <span className="text-cp-text-muted font-sans">Deposit Fee:</span>
                <span className="text-cp-positive font-bold">0.00% Free</span>
              </div>
              <div className="flex justify-between py-1 border-b border-cp-border/50">
                <span className="text-cp-text-muted font-sans">Daily Deposit Limit:</span>
                <span className="text-cp-text-primary font-bold">Unlimited</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-cp-text-muted font-sans">Internal Engine:</span>
                <span className="text-cp-gold font-bold">Multi-Sig Cold Storage</span>
              </div>
            </div>
          </Card>

          {/* Deposit Help & FAQ */}
          <Card variant="default" padding="md" className="space-y-3">
            <h4 className="font-bold text-xs text-cp-text-primary flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-cp-text-muted" />
              <span>Frequently Asked Questions</span>
            </h4>

            <div className="space-y-2.5 text-xs text-cp-text-secondary">
              <div className="p-2.5 rounded-lg bg-cp-elevated/60 border border-cp-border/40">
                <span className="font-semibold text-cp-text-primary block mb-0.5">
                  How long does a deposit take?
                </span>
                <p className="text-[11px] text-cp-text-muted leading-relaxed">
                  Arrival time varies by network traffic. Usually within 1 to 10 minutes following requisite block confirmations.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-cp-elevated/60 border border-cp-border/40">
                <span className="font-semibold text-cp-text-primary block mb-0.5">
                  Are these addresses real?
                </span>
                <p className="text-[11px] text-cp-text-muted leading-relaxed">
                  No, this platform runs in simulated demonstration mode. Never transfer real assets from live hardware or software wallets.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 8 & 9. Deposit History Section */}
      <Card variant="default" padding="none" className="overflow-hidden">
        {/* Header & Filter Controls */}
        <div className="p-4 sm:p-5 border-b border-cp-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cp-card">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cp-gold/10 text-cp-gold">
              <ArrowDownToLine className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg">Recent Deposit History</CardTitle>
              <p className="text-xs text-cp-text-muted">Tracking on-chain credits and simulated confirmations</p>
            </div>
          </div>

          {/* Status Filters: All, Pending, Completed, Failed */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {(['all', 'pending', 'completed', 'failed'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setHistoryFilter(status)}
                className={cn(
                  'px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all select-none',
                  historyFilter === status
                    ? 'bg-cp-gold text-cp-bg shadow-sm'
                    : 'text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated'
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-cp-border/50 text-[10px] text-cp-text-muted uppercase tracking-wider bg-cp-elevated/40">
                <th className="py-3 px-4 font-sans">Date / Time</th>
                <th className="py-3 px-4 font-sans">Asset</th>
                <th className="py-3 px-4 font-sans">Amount</th>
                <th className="py-3 px-4 font-sans">Network</th>
                <th className="py-3 px-4 font-sans">Tx Reference</th>
                <th className="py-3 px-4 font-sans">Status</th>
                <th className="py-3 px-4 text-right font-sans">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cp-border/40">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-cp-text-muted font-sans">
                    No deposit records found matching the "{historyFilter}" filter.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((rec) => (
                  <tr
                    key={rec.id}
                    onClick={() => {
                      setSelectedTx(rec)
                      setIsModalOpen(true)
                    }}
                    className="hover:bg-cp-elevated/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 text-cp-text-muted font-sans text-[11px]">
                      {rec.date} {rec.time}
                    </td>

                    <td className="py-3 px-4 font-bold text-cp-text-primary font-sans">
                      {rec.asset}
                    </td>

                    <td className="py-3 px-4 font-bold text-cp-positive">
                      +{formatCrypto(rec.amount, rec.asset)}
                    </td>

                    <td className="py-3 px-4 text-cp-text-secondary font-sans">
                      {rec.network}
                    </td>

                    <td className="py-3 px-4 text-cp-text-muted">
                      {truncateHash(rec.txHash)}
                    </td>

                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          rec.status === 'completed'
                            ? 'positive'
                            : rec.status === 'pending'
                            ? 'gold'
                            : 'negative'
                        }
                        size="sm"
                        className="text-[10px] py-0 capitalize"
                      >
                        {rec.status}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-right font-sans">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedTx(rec)
                          setIsModalOpen(true)
                        }}
                        className="text-cp-gold hover:underline text-xs font-semibold"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Card View */}
        <div className="md:hidden divide-y divide-cp-border/40">
          {filteredHistory.length === 0 ? (
            <div className="py-10 text-center text-cp-text-muted text-xs">
              No deposit records matching filter.
            </div>
          ) : (
            filteredHistory.map((rec) => (
              <div
                key={rec.id}
                onClick={() => {
                  setSelectedTx(rec)
                  setIsModalOpen(true)
                }}
                className="p-4 hover:bg-cp-elevated/40 active:bg-cp-elevated transition-colors space-y-2 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-cp-text-primary font-sans">
                      {rec.asset}
                    </span>
                    <span className="text-xs text-cp-text-muted font-sans">
                      {rec.network}
                    </span>
                  </div>

                  <Badge
                    variant={
                      rec.status === 'completed'
                        ? 'positive'
                        : rec.status === 'pending'
                        ? 'gold'
                        : 'negative'
                    }
                    size="sm"
                    className="capitalize text-[10px]"
                  >
                    {rec.status}
                  </Badge>
                </div>

                <div className="flex items-baseline justify-between font-mono">
                  <span className="text-sm font-bold text-cp-positive">
                    +{formatCrypto(rec.amount, rec.asset)}
                  </span>
                  <span className="text-xs text-cp-text-muted">{rec.date}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 sm:px-6 bg-cp-elevated/40 border-t border-cp-border text-xs text-cp-text-muted flex items-center justify-between">
          <span>Demonstration Deposit Ledger</span>
          <Link to="/wallet" className="text-cp-gold hover:underline font-semibold">
            All Wallet Transactions →
          </Link>
        </div>
      </Card>

      {/* 8. Transaction Details Modal */}
      <DepositTransactionDetailModal
        isOpen={isModalOpen}
        record={selectedTx}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedTx(null)
        }}
        onCopyText={handleCopy}
      />
    </div>
  )
}

export default Deposit
