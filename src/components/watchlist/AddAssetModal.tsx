import React, { useState, useMemo } from 'react'
import { Search, X, Plus, Check, TrendingUp, TrendingDown, Star } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { MarketItem, mockMarketItems } from '@/mock/marketsPageData'
import { formatCurrency, formatPercentage } from '@/utils/formatters'

export interface AddAssetModalProps {
  isOpen: boolean
  currentWatchlistIds: string[]
  onAdd: (asset: MarketItem) => void
  onClose: () => void
}

export const AddAssetModal: React.FC<AddAssetModalProps> = ({
  isOpen,
  currentWatchlistIds,
  onAdd,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter available coins
  const filteredCoins = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return mockMarketItems
    return mockMarketItems.filter(
      (coin) =>
        coin.name.toLowerCase().includes(q) ||
        coin.symbol.toLowerCase().includes(q) ||
        coin.pair.toLowerCase().includes(q)
    )
  }, [searchQuery])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-cp-elevated border border-cp-border shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-cp-border flex items-center justify-between bg-cp-card/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cp-gold/10 border border-cp-gold/30 flex items-center justify-center text-cp-gold">
              <Star className="w-5 h-5 fill-cp-gold" />
            </div>
            <div>
              <h3 className="text-base font-bold text-cp-text-primary">Add to Watchlist</h3>
              <p className="text-xs text-cp-text-secondary">
                Select cryptocurrency pairs to pin to your active watchlist
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-cp-border bg-cp-card/30">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cp-text-secondary" />
            <input
              type="text"
              placeholder="Search by coin name or ticker (e.g. BTC, ETH, SOL)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full bg-cp-elevated border border-cp-border rounded-xl pl-9 pr-8 py-2.5 text-xs text-cp-text-primary placeholder:text-cp-text-secondary/60 focus:outline-none focus:border-cp-gold transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cp-text-secondary hover:text-cp-text-primary"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Coin List */}
        <div className="p-4 overflow-y-auto divide-y divide-cp-border/40 space-y-1">
          {filteredCoins.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-xs text-cp-text-secondary">
                No cryptocurrencies match &quot;{searchQuery}&quot;
              </p>
            </div>
          ) : (
            filteredCoins.map((coin) => {
              const isAlreadyAdded = currentWatchlistIds.includes(coin.id)
              const isPos = coin.change24h >= 0

              return (
                <div
                  key={coin.id}
                  className="py-3 px-2 flex items-center justify-between hover:bg-cp-card/50 rounded-xl transition-colors"
                >
                  {/* Coin Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-cp-elevated border border-cp-border flex items-center justify-center font-bold text-xs text-cp-gold shrink-0">
                      {coin.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-cp-text-primary">{coin.name}</span>
                        <span className="text-[10px] font-mono text-cp-text-secondary uppercase">
                          {coin.pair}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-mono font-semibold text-cp-text-primary">
                          {formatCurrency(coin.priceUsd)}
                        </span>
                        <span
                          className={`text-[11px] font-mono font-medium flex items-center ${
                            isPos ? 'text-cp-positive' : 'text-cp-negative'
                          }`}
                        >
                          {isPos ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                          {formatPercentage(coin.change24h)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Add / Added Button */}
                  <div>
                    {isAlreadyAdded ? (
                      <Badge variant="neutral" size="sm" className="gap-1 opacity-75">
                        <Check className="w-3 h-3 text-cp-positive" />
                        <span>Pinned</span>
                      </Badge>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onAdd(coin)}
                        className="h-7 text-xs px-2.5"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        <span>Add</span>
                      </Button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cp-border bg-cp-card/60 flex items-center justify-between text-xs text-cp-text-secondary">
          <span>{currentWatchlistIds.length} assets currently pinned</span>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
