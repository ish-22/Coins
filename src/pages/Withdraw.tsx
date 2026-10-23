import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowUpFromLine,
  BookMarked,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Copy,
  ChevronRight,
  Info,
  Clock,
  Sparkles,
  ArrowRight,
  X,
  Wallet,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Typography } from '@/components/common/Typography'
import {
  WITHDRAW_ASSETS,
  WithdrawAssetConfig,
  WithdrawNetworkConfig,
  INITIAL_WITHDRAW_HISTORY,
  WithdrawHistoryRecord,
  SavedAddress,
} from '@/mock/withdrawData'
import { formatCrypto, truncateHash } from '@/utils/formatters'
import {
  AddressBookModal,
  WithdrawConfirmationModal,
  WithdrawPayload,
  SecurityVerificationModal,
  WithdrawTransactionDetailModal,
} from '@/components/withdraw'
import { walletService } from '@/services'

export const Withdraw: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const coinParam = searchParams.get('coin') || searchParams.get('asset')

  // Initial asset selection
  const initialAsset =
    WITHDRAW_ASSETS.find(
      (a) => a.symbol.toLowerCase() === coinParam?.toLowerCase() || a.id.toLowerCase() === coinParam?.toLowerCase()
    ) || WITHDRAW_ASSETS[0]

  const [selectedAsset, setSelectedAsset] = useState<WithdrawAssetConfig>(initialAsset)
  const [selectedNetwork, setSelectedNetwork] = useState<WithdrawNetworkConfig>(initialAsset.networks[0])

  // Form inputs
  const [destinationAddress, setDestinationAddress] = useState('')
  const [memoTag, setMemoTag] = useState('')
  const [amountInput, setAmountInput] = useState('')
  const [activePercent, setActivePercent] = useState<number | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  // Balances state (allows deducting after withdrawal for internal consistency)
  const [balances, setBalances] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {}
    WITHDRAW_ASSETS.forEach((a) => {
      map[a.id] = a.availableBalance
    })
    return map
  })

  // History state (allows appending new simulated withdrawals)
  const [history, setHistory] = useState<WithdrawHistoryRecord[]>(INITIAL_WITHDRAW_HISTORY)
  const [historyFilter, setHistoryFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'rejected' | 'failed'>('all')

  // Modals state
  const [isAddressBookOpen, setIsAddressBookOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false)
  const [selectedTxDetail, setSelectedTxDetail] = useState<WithdrawHistoryRecord | null>(null)

  // Active Pending payload
  const [pendingPayload, setPendingPayload] = useState<WithdrawPayload | null>(null)

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  // Sync state if URL param changes
  useEffect(() => {
    if (coinParam) {
      const match = WITHDRAW_ASSETS.find(
        (a) => a.symbol.toLowerCase() === coinParam.toLowerCase() || a.id.toLowerCase() === coinParam.toLowerCase()
      )
      if (match) {
        setSelectedAsset(match)
        setSelectedNetwork(match.networks[0])
      }
    }
  }, [coinParam])

  // Current available balance for active asset
  const availableAmount = balances[selectedAsset.id] ?? selectedAsset.availableBalance

  // Number calculations
  const parsedAmount = parseFloat(amountInput) || 0
  const fee = selectedNetwork.fee
  const receivedAmount = Math.max(0, parsedAmount - fee)

  // Handle asset switch
  const handleSelectAsset = (asset: WithdrawAssetConfig) => {
    setSelectedAsset(asset)
    setSelectedNetwork(asset.networks[0])
    setDestinationAddress('')
    setMemoTag('')
    setAmountInput('')
    setActivePercent(null)
    setFormError(null)
    setSearchParams({ coin: asset.symbol })
  }

  // Percentage shortcut handler (25%, 50%, 75%, 100%)
  const handlePercentClick = (percent: number) => {
    setActivePercent(percent)
    setFormError(null)
    const calculated = ((availableAmount * percent) / 100).toFixed(selectedAsset.decimals)
    setAmountInput(calculated)
  }

  // Address book selection
  const handleSelectSavedAddress = (saved: SavedAddress) => {
    setDestinationAddress(saved.address)
    if (saved.memoTag) {
      setMemoTag(saved.memoTag)
    }
    setToastMessage(`Selected address: ${saved.label}`)
  }

  // Paste address helper
  const handlePasteAddress = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText()
        if (text) {
          setDestinationAddress(text.trim())
          setToastMessage('Address pasted from clipboard!')
        }
      }
    } catch {
      // ignore
    }
  }

  // Form Validation and Review Action
  const handleReviewWithdrawal = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!destinationAddress.trim() || destinationAddress.length < 15) {
      setFormError('Please enter a valid destination address.')
      return
    }

    if (selectedNetwork.requiresMemo && !memoTag.trim()) {
      setFormError('Destination Tag / Memo is required for XRP withdrawals.')
      return
    }

    if (!parsedAmount || parsedAmount <= 0) {
      setFormError('Please enter a withdrawal amount greater than 0.')
      return
    }

    if (parsedAmount < selectedNetwork.minWithdraw) {
      setFormError(
        `Amount is below the minimum withdrawal limit of ${selectedNetwork.minWithdraw} ${selectedAsset.symbol}.`
      )
      return
    }

    if (parsedAmount > selectedNetwork.maxWithdraw) {
      setFormError(
        `Amount exceeds the maximum single withdrawal limit of ${selectedNetwork.maxWithdraw} ${selectedAsset.symbol}.`
      )
      return
    }

    if (parsedAmount > availableAmount) {
      setFormError(
        `Insufficient balance. Available: ${formatCrypto(availableAmount, selectedAsset.symbol)}.`
      )
      return
    }

    if (parsedAmount <= fee) {
      setFormError(`Withdrawal amount must be higher than the network fee of ${selectedNetwork.feeDisplay}.`)
      return
    }

    const payload: WithdrawPayload = {
      assetSymbol: selectedAsset.symbol,
      assetName: selectedAsset.name,
      networkName: selectedNetwork.name,
      networkId: selectedNetwork.id,
      destinationAddress: destinationAddress.trim(),
      memoTag: memoTag.trim() || undefined,
      amount: parsedAmount,
      fee,
      receivedAmount,
    }

    setPendingPayload(payload)
    setIsConfirmModalOpen(true)
  }

  // Step 1 -> Step 2: From Confirmation to 2FA Verification
  const handleProceedToVerification = () => {
    setIsConfirmModalOpen(false)
    setIsVerificationModalOpen(true)
  }

  // Step 2 Completion: Final simulated withdrawal submission
  const handleFinalSubmit = async () => {
    if (!pendingPayload) return

    // Trigger API if available
    try {
      await walletService.withdraw({
        asset: pendingPayload.assetSymbol,
        network: pendingPayload.networkName,
        address: pendingPayload.destinationAddress,
        memo: pendingPayload.memoTag,
        amount: pendingPayload.amount,
      })
    } catch {
      // Offline fallback: maintain smooth UI simulation
    }

    // Deduct simulated balance
    setBalances((prev) => ({
      ...prev,
      [selectedAsset.id]: Math.max(0, (prev[selectedAsset.id] ?? selectedAsset.availableBalance) - pendingPayload.amount),
    }))

    const now = new Date()
    const newRecord: WithdrawHistoryRecord = {
      id: `wth-${Date.now().toString().slice(-4)}`,
      txHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      asset: pendingPayload.assetSymbol,
      amount: pendingPayload.amount,
      receivedAmount: pendingPayload.receivedAmount,
      fee: pendingPayload.fee,
      network: pendingPayload.networkName,
      destinationAddress: pendingPayload.destinationAddress,
      memoTag: pendingPayload.memoTag,
      status: 'processing',
      date: 'Today',
      time: now.toTimeString().split(' ')[0] + ' UTC',
    }

    setHistory((prev) => [newRecord, ...prev])
    setIsVerificationModalOpen(false)
    setPendingPayload(null)
    setAmountInput('')
    setActivePercent(null)
    setDestinationAddress('')
    setMemoTag('')

    setToastMessage(
      `Withdrawal Submitted: Disbursing ${formatCrypto(pendingPayload.amount, pendingPayload.assetSymbol)}. Status: Processing.`
    )
  }

  // Filtered history list
  const filteredHistory = history.filter((item) => {
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

      {/* Demonstration Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 rounded-xl bg-cp-elevated border border-cp-gold/30 text-xs shadow-sm">
        <div className="flex items-center gap-2.5">
          <Badge variant="gold" size="sm" withDot pulseDot className="shrink-0">
            SIMULATED WITHDRAWAL
          </Badge>
          <span className="text-cp-text-secondary leading-relaxed">
            All withdrawals on this page are demonstration simulations. No cryptocurrency is broadcasted or deducted from real wallets.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link to="/wallet" className="text-cp-gold hover:underline font-semibold flex items-center gap-1">
            <span>Check Wallet Balances</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 1 & 2. Page Header & Explanation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-cp-text-muted mb-1.5">
            <Link to="/dashboard" className="hover:text-cp-gold transition-colors">CoinPlus</Link>
            <ChevronRight className="w-3.5 h-3.5 text-cp-border-light" />
            <Link to="/wallet" className="hover:text-cp-gold transition-colors">Wallet</Link>
            <ChevronRight className="w-3.5 h-3.5 text-cp-border-light" />
            <span className="text-cp-gold font-medium">Withdraw</span>
          </nav>

          <Typography variant="h1" className="text-2xl sm:text-3xl font-extrabold text-cp-text-primary">
            Withdraw Assets
          </Typography>

          <Typography variant="body-sm" color="secondary" className="mt-1 max-w-2xl">
            Simulate secure cryptocurrency payouts to whitelisted destination addresses with multi-factor authentication.
          </Typography>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/deposit">
            <Button variant="outline" size="md">
              Need to Deposit?
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Form Layout (2 Columns on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Withdrawal Form Card */}
        <div className="lg:col-span-7 space-y-6">
          <Card variant="default" padding="lg" className="space-y-6">
            <form onSubmit={handleReviewWithdrawal} className="space-y-5">
              {/* 3. Cryptocurrency Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-cp-text-secondary block">
                  1. Select Cryptocurrency
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {WITHDRAW_ASSETS.map((asset) => {
                    const isSelected = asset.id === selectedAsset.id
                    const bal = balances[asset.id] ?? asset.availableBalance

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
                          <span className="text-[10px] text-cp-text-muted truncate block font-mono">
                            {bal} {asset.symbol}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 4. Network Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-cp-text-secondary block">
                    2. Withdrawal Network
                  </label>
                  <span className="text-[11px] text-cp-text-muted">
                    Matched for <span className="text-cp-gold font-bold">{selectedAsset.symbol}</span>
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedAsset.networks.map((net) => {
                    const isSelected = net.id === selectedNetwork.id
                    return (
                      <div
                        key={net.id}
                        onClick={() => setSelectedNetwork(net)}
                        className={cn(
                          'p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all select-none',
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
                            <span className="font-bold text-xs sm:text-sm text-cp-text-primary block">
                              {net.name}
                            </span>
                            <span className="text-[11px] text-cp-text-muted block">
                              Arrival: {net.expectedTime} • Fee: {net.feeDisplay}
                            </span>
                          </div>
                        </div>

                        <Badge variant="neutral" size="sm" className="hidden sm:inline-flex text-[10px]">
                          Min: {net.minWithdraw} {selectedAsset.symbol}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 5 & 6. Destination Address & Address Book */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-cp-text-secondary block">
                    3. Destination Address
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePasteAddress}
                      className="text-xs text-cp-text-muted hover:text-cp-gold transition-colors font-medium"
                    >
                      Paste
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setIsAddressBookOpen(true)}
                      className="text-xs text-cp-gold hover:underline font-bold flex items-center gap-1"
                    >
                      <BookMarked className="w-3.5 h-3.5" />
                      <span>Address Book</span>
                    </button>
                  </div>
                </div>

                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder={`Enter ${selectedAsset.symbol} destination address...`}
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    className="w-full bg-cp-elevated border border-cp-border rounded-xl py-2.5 px-3.5 text-xs font-mono text-cp-text-primary placeholder:text-cp-text-muted focus:outline-none focus:border-cp-gold"
                  />
                </div>
              </div>

              {/* Memo Tag Input (if required, e.g. XRP) */}
              {selectedNetwork.requiresMemo && (
                <div className="space-y-2 p-3 rounded-xl bg-cp-elevated border border-cp-gold/60">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-cp-gold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Destination Tag / Memo (Mandatory)</span>
                    </label>
                  </div>

                  <input
                    type="text"
                    placeholder="Enter 6-9 digit destination tag..."
                    value={memoTag}
                    onChange={(e) => setMemoTag(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-cp-card border border-cp-border rounded-lg py-2 px-3 text-xs font-mono text-cp-text-primary focus:outline-none focus:border-cp-gold"
                  />
                  <p className="text-[10px] text-cp-text-muted leading-relaxed">
                    Most exchanges require a Destination Tag to credit XRP. Omission may result in lost funds.
                  </p>
                </div>
              )}

              {/* 7 & 8. Amount Input & Percentage Shortcuts */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold uppercase tracking-wider text-cp-text-secondary block">
                    4. Withdrawal Amount
                  </label>

                  <div className="flex items-center gap-1 font-mono text-[11px]">
                    <span className="text-cp-text-muted">Available:</span>
                    <span className="font-bold text-cp-text-primary">
                      {formatCrypto(availableAmount, selectedAsset.symbol)}
                    </span>
                  </div>
                </div>

                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="any"
                    placeholder={`Min: ${selectedNetwork.minWithdraw}`}
                    value={amountInput}
                    onChange={(e) => {
                      setAmountInput(e.target.value)
                      setActivePercent(null)
                    }}
                    className="w-full bg-cp-elevated border border-cp-border rounded-xl py-2.5 pl-3.5 pr-16 text-xs font-mono text-cp-text-primary focus:outline-none focus:border-cp-gold"
                  />
                  <span className="absolute right-3.5 font-mono text-xs font-bold text-cp-text-muted pointer-events-none">
                    {selectedAsset.symbol}
                  </span>
                </div>

                {/* Percentage Shortcuts: 25%, 50%, 75%, 100% */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handlePercentClick(pct)}
                      className={cn(
                        'py-1.5 rounded-lg font-mono text-xs font-semibold transition-all select-none',
                        activePercent === pct
                          ? 'bg-cp-gold text-cp-bg shadow-sm'
                          : 'bg-cp-elevated border border-cp-border/80 text-cp-text-secondary hover:text-cp-text-primary hover:border-cp-gold/40'
                      )}
                    >
                      {pct === 100 ? 'Max (100%)' : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* 9, 10, 11. Fee, Received Amount, and Min/Max Info */}
              <div className="p-4 rounded-xl bg-cp-elevated border border-cp-border space-y-2 font-mono text-xs">
                <div className="flex justify-between py-1 border-b border-cp-border/50">
                  <span className="font-sans text-cp-text-muted">Network Fee:</span>
                  <span className="text-cp-text-primary font-bold">
                    {formatCrypto(fee, selectedAsset.symbol)}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-cp-border/50">
                  <span className="font-sans text-cp-text-muted">You Will Receive:</span>
                  <span className="text-base font-extrabold text-cp-gold">
                    {formatCrypto(receivedAmount, selectedAsset.symbol)}
                  </span>
                </div>

                <div className="flex justify-between text-[11px] text-cp-text-muted pt-1">
                  <span>
                    Min: {selectedNetwork.minWithdraw} {selectedAsset.symbol}
                  </span>
                  <span>
                    Max: {selectedNetwork.maxWithdraw.toLocaleString()} {selectedAsset.symbol}
                  </span>
                </div>
              </div>

              {/* Form Error Banner */}
              {formError && (
                <div className="p-3 rounded-xl bg-cp-negative/10 border border-cp-negative/30 text-cp-negative text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* 12. Review Withdrawal Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                className="py-3.5 font-bold uppercase tracking-wider text-xs"
              >
                Review Withdrawal
              </Button>
            </form>
          </Card>
        </div>

        {/* Right 5 Columns: Security Guidelines & Limit Status */}
        <div className="lg:col-span-5 space-y-6">
          {/* Daily Limit Card */}
          <Card variant="gold" padding="md" className="space-y-3.5 border-cp-gold/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cp-gold uppercase tracking-wider">
                Daily Withdrawal Quota
              </span>
              <Badge variant="positive" size="sm">
                100 BTC / 24h
              </Badge>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-cp-text-muted font-sans">Remaining Today:</span>
                <span className="font-bold text-cp-text-primary">$500,000 USD (99.8%)</span>
              </div>
              <div className="w-full bg-cp-card rounded-full h-2 overflow-hidden border border-cp-border/50">
                <div className="bg-cp-gold h-full rounded-full" style={{ width: '99.8%' }} />
              </div>
            </div>

            <div className="pt-2 border-t border-cp-border/60 text-xs text-cp-text-secondary flex items-center justify-between">
              <span>Security Tier: Tier 2 (Verified)</span>
              <Link to="/kyc" className="text-cp-gold hover:underline text-[11px] font-semibold">
                Upgrade Tier →
              </Link>
            </div>
          </Card>

          {/* Security Checklist Card */}
          <Card variant="elevated" padding="md" className="space-y-3">
            <div className="flex items-center gap-2.5 text-cp-gold">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <h4 className="font-bold text-xs text-cp-text-primary">Withdrawal Safety Checks</h4>
            </div>

            <ul className="space-y-2.5 text-xs text-cp-text-secondary leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cp-gold mt-1.5 shrink-0" />
                <span>Double-check that the destination address belongs to the selected network.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cp-positive mt-1.5 shrink-0" />
                <span>Addresses are checked against simulated global sanctions and AML lists.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cp-gold mt-1.5 shrink-0" />
                <span>Simulated Google 2FA and Email codes are required for final authorization.</span>
              </li>
            </ul>
          </Card>

          {/* Quick Support FAQ */}
          <Card variant="default" padding="md" className="space-y-2.5">
            <h4 className="font-bold text-xs text-cp-text-primary">Withdrawal Processing</h4>
            <p className="text-xs text-cp-text-muted leading-relaxed">
              In this demonstration environment, payouts transition from <strong className="text-cp-gold">Processing</strong> to <strong className="text-cp-positive">Completed</strong> immediately without incurring blockchain gas fees.
            </p>
          </Card>
        </div>
      </div>

      {/* 15. Withdrawal History with All Statuses */}
      <Card variant="default" padding="none" className="overflow-hidden">
        {/* Header & Status Filter Tabs */}
        <div className="p-4 sm:p-5 border-b border-cp-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cp-card">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cp-gold/10 text-cp-gold">
              <ArrowUpFromLine className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg">Withdrawal History</CardTitle>
              <p className="text-xs text-cp-text-muted">
                Track status across Pending, Processing, Completed, Rejected, and Failed records
              </p>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {(['all', 'pending', 'processing', 'completed', 'rejected', 'failed'] as const).map(
              (status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setHistoryFilter(status)}
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all select-none whitespace-nowrap',
                    historyFilter === status
                      ? 'bg-cp-gold text-cp-bg shadow-sm'
                      : 'text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated'
                  )}
                >
                  {status}
                </button>
              )
            )}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-cp-border/50 text-[10px] text-cp-text-muted uppercase tracking-wider bg-cp-elevated/40">
                <th className="py-3 px-4 font-sans">Timestamp</th>
                <th className="py-3 px-4 font-sans">Asset</th>
                <th className="py-3 px-4 font-sans">Amount</th>
                <th className="py-3 px-4 font-sans">Network</th>
                <th className="py-3 px-4 font-sans">Destination</th>
                <th className="py-3 px-4 font-sans">Status</th>
                <th className="py-3 px-4 text-right font-sans">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cp-border/40">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-cp-text-muted font-sans">
                    No withdrawal records found under the "{historyFilter}" filter.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((rec) => (
                  <tr
                    key={rec.id}
                    onClick={() => setSelectedTxDetail(rec)}
                    className="hover:bg-cp-elevated/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 text-cp-text-muted font-sans text-[11px]">
                      {rec.date} {rec.time}
                    </td>

                    <td className="py-3 px-4 font-bold text-cp-text-primary font-sans">
                      {rec.asset}
                    </td>

                    <td className="py-3 px-4 font-bold text-cp-negative">
                      -{formatCrypto(rec.amount, rec.asset)}
                    </td>

                    <td className="py-3 px-4 text-cp-text-secondary font-sans">
                      {rec.network}
                    </td>

                    <td className="py-3 px-4 text-cp-text-muted">
                      {truncateHash(rec.destinationAddress, 8, 4)}
                    </td>

                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          rec.status === 'completed'
                            ? 'positive'
                            : rec.status === 'processing'
                            ? 'gold'
                            : rec.status === 'pending'
                            ? 'neutral'
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
                          setSelectedTxDetail(rec)
                        }}
                        className="text-cp-gold hover:underline text-xs font-semibold"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Cards View */}
        <div className="md:hidden divide-y divide-cp-border/40">
          {filteredHistory.length === 0 ? (
            <div className="py-10 text-center text-cp-text-muted text-xs">
              No withdrawal records in this view.
            </div>
          ) : (
            filteredHistory.map((rec) => (
              <div
                key={rec.id}
                onClick={() => setSelectedTxDetail(rec)}
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
                        : rec.status === 'processing'
                        ? 'gold'
                        : rec.status === 'pending'
                        ? 'neutral'
                        : 'negative'
                    }
                    size="sm"
                    className="capitalize text-[10px]"
                  >
                    {rec.status}
                  </Badge>
                </div>

                <div className="flex items-baseline justify-between font-mono">
                  <span className="text-sm font-bold text-cp-negative">
                    -{formatCrypto(rec.amount, rec.asset)}
                  </span>
                  <span className="text-xs text-cp-text-muted">{rec.date}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 sm:px-6 bg-cp-elevated/40 border-t border-cp-border text-xs text-cp-text-muted flex items-center justify-between">
          <span>Displaying {filteredHistory.length} records</span>
          <Link to="/wallet" className="text-cp-gold hover:underline font-semibold">
            Return to Wallet Overview →
          </Link>
        </div>
      </Card>

      {/* Address Book Modal */}
      <AddressBookModal
        isOpen={isAddressBookOpen}
        currentAssetSymbol={selectedAsset.symbol}
        onSelectAddress={handleSelectSavedAddress}
        onClose={() => setIsAddressBookOpen(false)}
      />

      {/* 13. Step 1: Confirmation Modal */}
      <WithdrawConfirmationModal
        isOpen={isConfirmModalOpen}
        payload={pendingPayload}
        onProceedToVerification={handleProceedToVerification}
        onClose={() => {
          setIsConfirmModalOpen(false)
          setPendingPayload(null)
        }}
      />

      {/* 14. Step 2: Mock Security Verification Modal */}
      <SecurityVerificationModal
        isOpen={isVerificationModalOpen}
        payload={pendingPayload}
        onSuccess={handleFinalSubmit}
        onBack={() => {
          setIsVerificationModalOpen(false)
          setIsConfirmModalOpen(true)
        }}
        onClose={() => {
          setIsVerificationModalOpen(false)
          setPendingPayload(null)
        }}
      />

      {/* Details View Modal */}
      <WithdrawTransactionDetailModal
        isOpen={!!selectedTxDetail}
        record={selectedTxDetail}
        onClose={() => setSelectedTxDetail(null)}
        onCopyText={(text, label) => {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(text).catch(() => {})
          }
          setToastMessage(`Copied ${label} to clipboard!`)
        }}
      />
    </div>
  )
}

export default Withdraw
