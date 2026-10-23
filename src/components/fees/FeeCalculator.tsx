import React, { useState } from 'react'
import {
  Calculator,
  ArrowRight,
  TrendingUp,
  Percent,
  CheckCircle2,
  Sparkles,
  Info,
  DollarSign,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { CALCULATOR_CATEGORIES, FeeCalculatorOption } from '@/mock/feesData'
import { formatUSD, formatCurrency } from '@/utils/formatters'

export const FeeCalculator: React.FC = () => {
  const [tradeValueInput, setTradeValueInput] = useState<string>('10000')
  const [selectedCategory, setSelectedCategory] = useState<FeeCalculatorOption>(
    CALCULATOR_CATEGORIES[0] // VIP 1 Maker (0.02%)
  )

  // Parse trade value
  const numericValue = parseFloat(tradeValueInput.replace(/,/g, '')) || 0
  const isValid = numericValue > 0

  // Standard fee comparison (0.10%)
  const standardFeeRate = 0.001
  const standardFee = isValid ? numericValue * standardFeeRate : 0

  // Calculated fee
  const calculatedFee = isValid ? numericValue * selectedCategory.rate : 0
  const netValue = isValid ? numericValue - calculatedFee : 0
  const savings = Math.max(0, standardFee - calculatedFee)

  const handleQuickAmount = (amount: number) => {
    setTradeValueInput(amount.toString())
  }

  return (
    <Card className="border-cp-border bg-cp-card overflow-hidden shadow-card">
      <CardHeader className="border-b border-cp-border/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-cp-gold" />
            <div>
              <CardTitle className="text-base text-cp-text-primary">
                Trading Fee Estimator
              </CardTitle>
              <p className="text-xs text-cp-text-secondary">
                Calculate illustrative execution fees, discounts, and net proceeds
              </p>
            </div>
          </div>
          <Badge variant="gold" size="sm">
            Live Simulator
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6 text-xs">
        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trade Value Input */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-cp-text-primary block">
                Trade Value (USDT) <span className="text-cp-negative">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-cp-text-secondary">
                  $
                </span>
                <input
                  type="text"
                  value={tradeValueInput}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/[^0-9.]/g, '')
                    setTradeValueInput(clean)
                  }}
                  placeholder="Enter trade value in USDT..."
                  className="w-full bg-cp-elevated border border-cp-border rounded-xl pl-8 pr-4 py-2.5 text-xs sm:text-sm font-mono text-cp-text-primary focus:outline-none focus:border-cp-gold transition-colors"
                />
              </div>
            </div>

            {/* Quick Amount Shortcuts */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-cp-text-secondary mr-1">Quick:</span>
              {[1000, 5000, 10000, 50000, 100000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleQuickAmount(amt)}
                  className={`px-2 py-1 rounded-md text-[11px] font-mono border transition-colors ${
                    numericValue === amt
                      ? 'bg-cp-gold text-cp-bg border-cp-gold font-bold'
                      : 'bg-cp-elevated text-cp-text-secondary border-cp-border hover:border-cp-gold hover:text-cp-text-primary'
                  }`}
                >
                  ${(amt / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>

          {/* Fee Tier Category Selector */}
          <div className="space-y-1.5">
            <label className="font-semibold text-cp-text-primary block">
              Fee Tier & Role Category
            </label>
            <select
              value={selectedCategory.id}
              onChange={(e) => {
                const found = CALCULATOR_CATEGORIES.find((c) => c.id === e.target.value)
                if (found) setSelectedCategory(found)
              }}
              className="w-full bg-cp-elevated border border-cp-border rounded-xl px-3.5 py-2.5 text-xs font-semibold text-cp-text-primary focus:outline-none focus:border-cp-gold cursor-pointer"
            >
              {CALCULATOR_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-cp-text-secondary mt-1">
              Select your VIP bracket and whether your order provides liquidity (Maker) or takes liquidity (Taker).
            </p>
          </div>
        </div>

        {/* Calculation Result Breakdown */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-cp-elevated via-cp-card to-cp-elevated border border-cp-border space-y-4">
          <div className="flex items-center justify-between border-b border-cp-border/50 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-cp-text-primary text-xs uppercase tracking-wider">
                Calculation Breakdown
              </span>
              <Badge variant={selectedCategory.type === 'maker' ? 'positive' : 'gold'} size="sm">
                {selectedCategory.type.toUpperCase()}
              </Badge>
            </div>
            <span className="text-[11px] font-mono text-cp-gold">
              Rate: {(selectedCategory.rate * 100).toFixed(4)}%
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            {/* Gross Value */}
            <div className="p-3 rounded-xl bg-cp-card border border-cp-border">
              <span className="text-[11px] text-cp-text-secondary block mb-1">Gross Order Value</span>
              <span className="font-mono font-bold text-sm text-cp-text-primary">
                {formatUSD(numericValue)}
              </span>
            </div>

            {/* Estimated Fee */}
            <div className="p-3 rounded-xl bg-cp-card border border-cp-border">
              <span className="text-[11px] text-cp-text-secondary block mb-1">Illustrative Fee</span>
              <span className="font-mono font-bold text-sm text-cp-negative">
                {formatUSD(calculatedFee)}
              </span>
            </div>

            {/* Net Value */}
            <div className="p-3 rounded-xl bg-cp-card border border-cp-border">
              <span className="text-[11px] text-cp-text-secondary block mb-1">Net Settled Value</span>
              <span className="font-mono font-bold text-sm text-cp-gold">
                {formatUSD(netValue)}
              </span>
            </div>

            {/* VIP Savings */}
            <div className="p-3 rounded-xl bg-cp-card border border-cp-positive/30">
              <span className="text-[11px] text-cp-positive block mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> VIP Savings
              </span>
              <span className="font-mono font-bold text-sm text-cp-positive">
                +{formatUSD(savings)}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-cp-text-secondary flex items-center gap-1.5 pt-1">
            <Info className="w-3.5 h-3.5 text-cp-gold shrink-0" />
            <span>
              By trading as a <strong>{selectedCategory.tier} {selectedCategory.type}</strong>, you save {formatUSD(savings)} compared to the standard 0.10% base rate.
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
