import React, { useState } from 'react'
import {
  Coins,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  Sliders,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { AdminAssetRecord, INITIAL_ADMIN_ASSETS } from '@/mock/adminData'
import { formatUSD } from '@/utils/formatters'

export const AdminAssets: React.FC = () => {
  const [assets, setAssets] = useState<AdminAssetRecord[]>(INITIAL_ADMIN_ASSETS)
  const [searchQuery, setSearchQuery] = useState('')

  // Toggle confirmation modal state
  const [confirmAsset, setConfirmAsset] = useState<AdminAssetRecord | null>(null)
  const [confirmFeature, setConfirmFeature] = useState<'deposit' | 'withdraw' | 'trading' | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const filteredAssets = assets.filter(
    (a) =>
      a.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenToggle = (asset: AdminAssetRecord, feature: 'deposit' | 'withdraw' | 'trading') => {
    setConfirmAsset(asset)
    setConfirmFeature(feature)
  }

  const handleConfirmToggle = () => {
    if (!confirmAsset || !confirmFeature) return

    setAssets((prev) =>
      prev.map((a) => {
        if (a.id !== confirmAsset.id) return a

        if (confirmFeature === 'deposit') {
          return { ...a, depositEnabled: !a.depositEnabled }
        } else if (confirmFeature === 'withdraw') {
          return { ...a, withdrawEnabled: !a.withdrawEnabled }
        } else {
          return { ...a, tradingEnabled: !a.tradingEnabled }
        }
      })
    )

    const currentState =
      confirmFeature === 'deposit'
        ? confirmAsset.depositEnabled
        : confirmFeature === 'withdraw'
        ? confirmAsset.withdrawEnabled
        : confirmAsset.tradingEnabled

    setToastMessage(
      `${confirmAsset.symbol} ${confirmFeature} status switched to ${!currentState ? 'ENABLED' : 'DISABLED'} (Simulated State).`
    )
    setTimeout(() => setToastMessage(null), 3500)

    setConfirmAsset(null)
    setConfirmFeature(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-cp-text-primary tracking-tight">
            Supported Digital Assets & Gateways
          </h1>
          <p className="text-xs text-cp-text-muted mt-0.5">
            Configure multi-chain token parameters, minimum quotas, and toggle deposit/withdrawal availability
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="gold" size="sm">
            Active Coins: {assets.length}
          </Badge>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-cp-positive/15 border border-cp-positive/30 text-xs text-cp-positive flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button type="button" onClick={() => setToastMessage(null)} className="p-1 hover:text-cp-text-primary">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <Card className="bg-[#0c121c] border-cp-border">
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cp-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search by asset ticker or name (e.g. BTC, Ethereum)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141d2b] border border-cp-border rounded-xl pl-9 pr-3 py-2 text-xs text-cp-text-primary placeholder:text-cp-text-muted/60 focus:outline-none focus:border-cp-gold/60"
            />
          </div>

          <span className="text-xs text-cp-text-muted hidden sm:inline">
            Showing {filteredAssets.length} assets
          </span>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card className="bg-[#0c121c] border-cp-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-cp-border bg-cp-elevated/40 text-cp-text-muted uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Supported Networks</th>
                <th className="py-3 px-4 text-right">Reference Price</th>
                <th className="py-3 px-4 text-right">Min Deposit</th>
                <th className="py-3 px-4 text-right">Min Payout / Fee</th>
                <th className="py-3 px-4 text-center">Deposit Gateway</th>
                <th className="py-3 px-4 text-center">Withdrawal Gateway</th>
                <th className="py-3 px-4 text-center">Spot Trading</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cp-border/50 text-cp-text-secondary">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-cp-elevated/30 transition-colors">
                  {/* Symbol & Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-cp-card border border-cp-border flex items-center justify-center font-bold text-xs text-cp-gold">
                        {asset.symbol}
                      </div>
                      <div>
                        <span className="font-bold text-cp-text-primary block">{asset.name}</span>
                        <span className="text-[10px] font-mono text-cp-text-muted block">{asset.symbol}</span>
                      </div>
                    </div>
                  </td>

                  {/* Networks */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      {asset.networks.map((net) => (
                        <span key={net} className="px-1.5 py-0.5 rounded bg-cp-elevated border border-cp-border text-[10px] text-cp-text-secondary">
                          {net}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-cp-text-primary">
                    {formatUSD(asset.currentPriceUsd)}
                    <span className={`block text-[10px] ${asset.change24h >= 0 ? 'text-cp-positive' : 'text-cp-negative'}`}>
                      {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                    </span>
                  </td>

                  {/* Min Deposit */}
                  <td className="py-3.5 px-4 text-right font-mono text-cp-text-primary">
                    {asset.minDeposit} {asset.symbol}
                  </td>

                  {/* Min Payout & Fee */}
                  <td className="py-3.5 px-4 text-right font-mono text-cp-text-primary">
                    <div>{asset.minWithdrawal} {asset.symbol}</div>
                    <div className="text-[10px] text-cp-gold">Fee: {asset.withdrawalFee} {asset.symbol}</div>
                  </td>

                  {/* Deposit Toggle */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleOpenToggle(asset, 'deposit')}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                        asset.depositEnabled
                          ? 'bg-cp-positive/15 text-cp-positive border-cp-positive/30 hover:bg-cp-positive/25'
                          : 'bg-cp-negative/15 text-cp-negative border-cp-negative/30 hover:bg-cp-negative/25'
                      }`}
                    >
                      {asset.depositEnabled ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </td>

                  {/* Withdrawal Toggle */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleOpenToggle(asset, 'withdraw')}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                        asset.withdrawEnabled
                          ? 'bg-cp-positive/15 text-cp-positive border-cp-positive/30 hover:bg-cp-positive/25'
                          : 'bg-cp-negative/15 text-cp-negative border-cp-negative/30 hover:bg-cp-negative/25'
                      }`}
                    >
                      {asset.withdrawEnabled ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </td>

                  {/* Trading Toggle */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleOpenToggle(asset, 'trading')}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                        asset.tradingEnabled
                          ? 'bg-cp-positive/15 text-cp-positive border-cp-positive/30 hover:bg-cp-positive/25'
                          : 'bg-cp-negative/15 text-cp-negative border-cp-negative/30 hover:bg-cp-negative/25'
                      }`}
                    >
                      {asset.tradingEnabled ? 'ACTIVE' : 'HALTED'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* CONFIRMATION DIALOG */}
      {confirmAsset && confirmFeature && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            onClick={() => setConfirmAsset(null)}
          />

          <div className="relative w-full max-w-md bg-[#0c121c] border border-cp-border rounded-2xl shadow-2xl p-6 z-10 animate-fadeIn space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-cp-gold/15 text-cp-gold border border-cp-gold/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-cp-text-primary">
                  Confirm Gateway Status Toggle
                </h4>
                <p className="text-xs text-cp-text-muted">
                  Asset: <strong>{confirmAsset.name}</strong> ({confirmAsset.symbol}) • Gateway:{' '}
                  <strong className="uppercase">{confirmFeature}</strong>
                </p>
              </div>
            </div>

            <p className="text-xs text-cp-text-secondary leading-relaxed bg-cp-elevated/40 p-3 rounded-lg border border-cp-border">
              Are you sure you want to toggle the simulated {confirmFeature} status for {confirmAsset.symbol}? In a live platform, this would halt order routing or deposit credit generation.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-cp-border">
              <Button variant="outline" size="sm" onClick={() => setConfirmAsset(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmToggle}>
                Confirm Toggle State
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminAssets
