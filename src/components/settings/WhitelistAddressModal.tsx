import React, { useState } from 'react'
import { X, BookMarked, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { WhitelistAddressItem } from '@/mock/settingsData'

export interface WhitelistAddressModalProps {
  isOpen: boolean
  editItem: WhitelistAddressItem | null
  onSave: (item: WhitelistAddressItem) => void
  onClose: () => void
}

export const WhitelistAddressModal: React.FC<WhitelistAddressModalProps> = ({
  isOpen,
  editItem,
  onSave,
  onClose,
}) => {
  const [label, setLabel] = useState(editItem?.label || '')
  const [asset, setAsset] = useState(editItem?.asset || 'BTC')
  const [network, setNetwork] = useState(editItem?.network || 'Bitcoin Native (SegWit)')
  const [address, setAddress] = useState(editItem?.address || '')
  const [memoTag, setMemoTag] = useState(editItem?.memoTag || '')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!isOpen) return null

  const handleAssetChange = (newAsset: string) => {
    setAsset(newAsset)
    if (newAsset === 'BTC') setNetwork('Bitcoin Native (SegWit)')
    else if (newAsset === 'ETH') setNetwork('Ethereum (ERC-20)')
    else if (newAsset === 'USDT') setNetwork('Tron (TRC-20)')
    else if (newAsset === 'SOL') setNetwork('Solana Native')
    else if (newAsset === 'XRP') setNetwork('XRP Ledger')
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!label.trim()) {
      setErrorMsg('Please specify an address label (e.g. Ledger Cold Wallet).')
      return
    }

    if (!address.trim() || address.trim().length < 15) {
      setErrorMsg('Please enter a valid destination address.')
      return
    }

    onSave({
      id: editItem ? editItem.id : `wl-${Date.now().toString().slice(-4)}`,
      label: label.trim(),
      asset,
      network,
      address: address.trim(),
      memoTag: memoTag.trim() || undefined,
      addedDate: editItem ? editItem.addedDate : new Date().toISOString().split('T')[0],
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-cp-elevated border border-cp-border shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-cp-border flex items-center justify-between bg-cp-card/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cp-gold/10 border border-cp-gold/30 flex items-center justify-center text-cp-gold">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-cp-text-primary">
                {editItem ? 'Edit Allowlist Address' : 'Add Withdrawal Allowlist Address'}
              </h3>
              <p className="text-xs text-cp-text-secondary">Whitelisted payout destinations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
          {/* Label */}
          <div className="space-y-1.5">
            <label className="font-semibold text-cp-text-primary block">
              Address Label <span className="text-cp-negative">*</span>
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. My Ledger Cold Storage"
              className="w-full bg-cp-card border border-cp-border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold"
            />
          </div>

          {/* Asset & Network */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-cp-text-secondary block">Asset</label>
              <select
                value={asset}
                onChange={(e) => handleAssetChange(e.target.value)}
                className="w-full bg-cp-card border border-cp-border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold cursor-pointer"
              >
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="USDT">Tether (USDT)</option>
                <option value="SOL">Solana (SOL)</option>
                <option value="XRP">Ripple (XRP)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-cp-text-secondary block">Network</label>
              <input
                type="text"
                readOnly
                value={network}
                className="w-full bg-cp-elevated/70 border border-cp-border rounded-lg py-2.5 px-3 text-xs text-cp-text-secondary cursor-not-allowed font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Destination Address */}
          <div className="space-y-1.5">
            <label className="font-semibold text-cp-text-primary block">
              Destination Address <span className="text-cp-negative">*</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Paste cryptocurrency destination address..."
              className="w-full bg-cp-card border border-cp-border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary font-mono focus:outline-none focus:border-cp-gold"
            />
          </div>

          {/* Destination Tag / Memo */}
          {asset === 'XRP' && (
            <div className="space-y-1.5">
              <label className="font-semibold text-cp-gold block">
                Destination Tag (Mandatory for XRP)
              </label>
              <input
                type="text"
                value={memoTag}
                onChange={(e) => setMemoTag(e.target.value.replace(/\D/g, ''))}
                placeholder="6-9 digit destination tag..."
                className="w-full bg-cp-card border border-cp-border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary font-mono focus:outline-none focus:border-cp-gold"
              />
            </div>
          )}

          {errorMsg && <p className="text-[11px] text-cp-negative">{errorMsg}</p>}

          <div className="p-3 rounded-lg bg-cp-card border border-cp-border text-[11px] text-cp-text-secondary leading-relaxed">
            Allowlisted addresses are approved for instant withdrawals without additional 24h security hold periods.
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <Button variant="secondary" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              {editItem ? 'Save Address' : 'Whitelist Address'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
