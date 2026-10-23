import React from 'react'
import { X, BookMarked, ShieldCheck, Check } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { SavedAddress, MOCK_SAVED_ADDRESSES } from '@/mock/withdrawData'

export interface AddressBookModalProps {
  isOpen: boolean
  currentAssetSymbol: string
  onSelectAddress: (address: SavedAddress) => void
  onClose: () => void
}

export const AddressBookModal: React.FC<AddressBookModalProps> = ({
  isOpen,
  currentAssetSymbol,
  onSelectAddress,
  onClose,
}) => {
  if (!isOpen) return null

  const filteredAddresses = MOCK_SAVED_ADDRESSES.filter(
    (a) => a.asset === currentAssetSymbol
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-lg rounded-2xl bg-cp-elevated border border-cp-border shadow-elevated overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-cp-border flex items-center justify-between bg-cp-card">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cp-gold/10 text-cp-gold">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-cp-text-primary">
                Saved Address Book
              </h3>
              <span className="text-xs text-cp-text-muted">
                Whitelisted destination addresses for {currentAssetSymbol}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Address List */}
        <div className="p-4 sm:p-5 max-h-80 overflow-y-auto space-y-3">
          {filteredAddresses.length === 0 ? (
            <div className="py-12 text-center text-cp-text-muted text-xs font-sans space-y-2">
              <BookMarked className="w-8 h-8 mx-auto text-cp-text-muted/60" />
              <p className="font-semibold text-cp-text-primary">No saved addresses for {currentAssetSymbol}</p>
              <p className="max-w-xs mx-auto">
                You can manually paste your destination address or add addresses to your whitelist in Security Settings.
              </p>
            </div>
          ) : (
            filteredAddresses.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectAddress(item)
                  onClose()
                }}
                className="p-3.5 rounded-xl bg-cp-card border border-cp-border hover:border-cp-gold/60 hover:bg-cp-elevated/70 transition-all cursor-pointer group space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-cp-text-primary group-hover:text-cp-gold transition-colors">
                    {item.label}
                  </span>
                  <Badge variant="positive" size="sm" className="text-[9px] py-0">
                    <ShieldCheck className="w-3 h-3 mr-0.5" />
                    Whitelisted
                  </Badge>
                </div>

                <p className="font-mono text-xs text-cp-text-secondary break-all bg-cp-elevated/80 p-2 rounded border border-cp-border/40">
                  {item.address}
                </p>

                {item.memoTag && (
                  <div className="flex items-center gap-1.5 text-[11px] text-cp-gold font-mono">
                    <span>Memo/Tag:</span>
                    <span className="font-bold">{item.memoTag}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cp-border bg-cp-card flex items-center justify-between text-xs">
          <span className="text-cp-text-muted">
            {filteredAddresses.length} address{filteredAddresses.length === 1 ? '' : 'es'} found
          </span>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddressBookModal
