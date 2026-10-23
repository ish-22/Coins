import React, { useState, useMemo } from 'react'
import {
  ArrowDownToLine,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  ExternalLink,
  X,
  Copy,
  Check,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { AdminDepositRecord, INITIAL_ADMIN_DEPOSITS } from '@/mock/adminData'
import { formatUSD } from '@/utils/formatters'

export const AdminDeposits: React.FC = () => {
  const [deposits] = useState<AdminDepositRecord[]>(INITIAL_ADMIN_DEPOSITS)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'confirming' | 'pending'>('all')
  const [assetFilter, setAssetFilter] = useState<'all' | 'BTC' | 'ETH' | 'SOL' | 'USDT'>('all')
  const [selectedDeposit, setSelectedDeposit] = useState<AdminDepositRecord | null>(null)
  const [copiedHash, setCopiedHash] = useState(false)

  const filteredDeposits = useMemo(() => {
    return deposits.filter((d) => {
      const matchSearch =
        d.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.depositRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.destinationAddress.toLowerCase().includes(searchQuery.toLowerCase())

      const matchStatus = statusFilter === 'all' || d.status === statusFilter
      const matchAsset = assetFilter === 'all' || d.asset === assetFilter

      return matchSearch && matchStatus && matchAsset
    })
  }, [deposits, searchQuery, statusFilter, assetFilter])

  const handleCopyHash = (text: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedHash(true)
      setTimeout(() => setCopiedHash(false), 2000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-cp-text-primary tracking-tight">
            Deposit Ledger & Confirmation Monitor
          </h1>
          <p className="text-xs text-cp-text-muted mt-0.5">
            Audit multi-network cryptocurrency inflows, block confirmation velocity, and simulated ledger credits
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="gold" size="sm">
            Total Logged Inflows: {deposits.length}
          </Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="bg-[#0c121c] border-cp-border">
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cp-text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search by deposit reference, user, txHash, or wallet address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141d2b] border border-cp-border rounded-xl pl-9 pr-3 py-2 text-xs text-cp-text-primary placeholder:text-cp-text-muted/60 focus:outline-none focus:border-cp-gold/60"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Status filters */}
            <div className="flex items-center gap-1">
              {(['all', 'completed', 'confirming', 'pending'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1.5 rounded-lg border font-semibold transition-all capitalize ${
                    statusFilter === st
                      ? 'bg-cp-gold text-cp-bg border-cp-gold'
                      : 'bg-cp-card hover:bg-cp-elevated text-cp-text-secondary border-cp-border'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Asset filter */}
            <select
              value={assetFilter}
              onChange={(e) => setAssetFilter(e.target.value as any)}
              className="bg-[#141d2b] border border-cp-border rounded-lg px-2.5 py-1.5 text-xs text-cp-text-primary focus:outline-none"
            >
              <option value="all">All Assets</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
              <option value="SOL">SOL</option>
              <option value="USDT">USDT</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Deposits Table */}
      <Card className="bg-[#0c121c] border-cp-border overflow-hidden">
        {filteredDeposits.length === 0 ? (
          <div className="p-12 text-center text-xs text-cp-text-muted space-y-2">
            <ArrowDownToLine className="w-8 h-8 text-cp-text-muted mx-auto" />
            <p>No deposit records match your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-cp-border bg-cp-elevated/40 text-cp-text-muted uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-4">Deposit Ref</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Asset & Amount</th>
                  <th className="py-3 px-4">Network</th>
                  <th className="py-3 px-4">Status & Confirmations</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cp-border/50 text-cp-text-secondary">
                {filteredDeposits.map((d) => (
                  <tr key={d.id} className="hover:bg-cp-elevated/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-cp-gold">
                      {d.depositRef}
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-cp-text-primary block">{d.userName}</span>
                        <span className="text-[10px] text-cp-text-muted font-mono block">{d.userId}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-mono font-bold text-cp-text-primary block">
                          +{d.amount} {d.asset}
                        </span>
                        <span className="text-[10px] text-cp-text-muted font-mono block">
                          ≈ {formatUSD(d.amountUsd)}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-cp-elevated border border-cp-border text-[11px] font-medium text-cp-text-secondary">
                        {d.network}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <Badge
                          variant={d.status === 'completed' ? 'positive' : d.status === 'confirming' ? 'gold' : 'neutral'}
                          size="sm"
                          className="capitalize"
                        >
                          {d.status}
                        </Badge>
                        <span className="text-[10px] text-cp-text-muted font-mono block">
                          {d.confirmations} / {d.requiredConfirmations} blocks
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-cp-text-muted">
                      {d.createdAt}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedDeposit(d)}
                        className="px-2.5 py-1 rounded-lg bg-cp-elevated hover:bg-cp-card border border-cp-border text-cp-text-secondary hover:text-cp-gold transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* DEPOSIT DETAIL DRAWER */}
      {selectedDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedDeposit(null)}
          />

          <div className="relative w-full max-w-lg bg-[#0c121c] border border-cp-border rounded-2xl shadow-2xl p-6 z-10 animate-fadeIn space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-cp-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-cp-text-primary">
                    Deposit: {selectedDeposit.depositRef}
                  </h3>
                  <Badge
                    variant={selectedDeposit.status === 'completed' ? 'positive' : selectedDeposit.status === 'confirming' ? 'gold' : 'neutral'}
                    size="sm"
                    className="capitalize"
                  >
                    {selectedDeposit.status}
                  </Badge>
                </div>
                <span className="text-xs text-cp-text-muted">
                  Beneficiary: <strong>{selectedDeposit.userName}</strong> ({selectedDeposit.userId})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDeposit(null)}
                className="p-1 rounded-lg text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3.5 text-xs">
              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase">Credited Amount</span>
                <span className="font-mono text-base font-bold text-cp-positive mt-0.5 block">
                  +{selectedDeposit.amount} {selectedDeposit.asset}
                </span>
                <span className="text-[10px] text-cp-text-muted font-mono">
                  ≈ {formatUSD(selectedDeposit.amountUsd)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
                <span className="text-cp-text-muted block text-[10px] uppercase">Blockchain Network</span>
                <span className="font-semibold text-cp-text-primary mt-1 block">
                  {selectedDeposit.network}
                </span>
                <span className="text-[10px] text-cp-gold font-mono block mt-0.5">
                  Confirmations: {selectedDeposit.confirmations} / {selectedDeposit.requiredConfirmations}
                </span>
              </div>

              <div className="col-span-2 p-3 rounded-xl bg-cp-elevated/40 border border-cp-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-cp-text-muted text-[10px] uppercase">Transaction Hash (Simulated)</span>
                  <button
                    type="button"
                    onClick={() => handleCopyHash(selectedDeposit.txHash)}
                    className="text-cp-gold hover:underline text-[10px] flex items-center gap-1"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-cp-positive" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <span className="font-mono text-cp-text-primary block text-xs break-all">
                  {selectedDeposit.txHash}
                </span>
              </div>

              <div className="col-span-2 p-3 rounded-xl bg-cp-elevated/40 border border-cp-border space-y-1">
                <span className="text-cp-text-muted text-[10px] uppercase">Destination Deposit Address</span>
                <span className="font-mono text-cp-text-secondary block text-xs break-all">
                  {selectedDeposit.destinationAddress}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-cp-border text-xs text-cp-text-muted">
              <span>Timestamp: {selectedDeposit.createdAt}</span>
              <Button variant="outline" size="sm" onClick={() => setSelectedDeposit(null)}>
                Close Drawer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDeposits
