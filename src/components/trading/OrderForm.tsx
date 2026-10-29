import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import {
  Wallet,
  PlusCircle,
  AlertCircle,
  Info,
  CheckCircle2,
  Lock,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/common/Button'
import { TradingPairConfig } from '@/mock/tradingData'
import { formatCurrency, formatCrypto } from '@/utils/formatters'
import { useAuth } from '@/context/AuthContext'

export interface OrderFormProps {
  pair: TradingPairConfig
  selectedPrice: number | null
  availableUsdt: number
  availableCrypto: number
  onReviewOrder: (orderPayload: {
    side: 'buy' | 'sell'
    type: 'limit' | 'market' | 'stop_limit'
    price: number
    stopPrice?: number
    amount: number
    total: number
    fee: number
  }) => void
}

export const OrderForm: React.FC<OrderFormProps> = ({
  pair,
  selectedPrice,
  availableUsdt,
  availableCrypto,
  onReviewOrder,
}) => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [orderType, setOrderType] = useState<'limit' | 'market' | 'stop_limit'>('limit')
  const [priceInput, setPriceInput] = useState<string>(pair.price.toString())
  const [stopPriceInput, setStopPriceInput] = useState<string>(
    (pair.price * 1.01).toFixed(2)
  )
  const [amountInput, setAmountInput] = useState<string>('')
  const [activePercent, setActivePercent] = useState<number | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // When selectedPrice changes from OrderBook click, update price input
  useEffect(() => {
    if (selectedPrice && orderType !== 'market') {
      setPriceInput(selectedPrice.toString())
    }
  }, [selectedPrice, orderType])

  // Reset when pair changes
  useEffect(() => {
    setPriceInput(pair.price.toString())
    setAmountInput('')
    setActivePercent(null)
    setErrorMsg(null)
  }, [pair.id])

  const parsedPrice =
    orderType === 'market' ? pair.price : parseFloat(priceInput) || 0
  const parsedAmount = parseFloat(amountInput) || 0
  const estimatedTotal = parsedPrice * parsedAmount
  const estimatedFee = estimatedTotal * pair.makerFee

  const currentAvailable = side === 'buy' ? availableUsdt : availableCrypto
  const currentAsset = side === 'buy' ? pair.quoteAsset : pair.baseAsset

  // Percentage shortcut click handler
  const handlePercentClick = (percent: number) => {
    setActivePercent(percent)
    setErrorMsg(null)

    if (side === 'buy') {
      const budget = (availableUsdt * percent) / 100
      const price = parsedPrice || pair.price
      if (price > 0) {
        const calculatedAmount = (budget / price).toFixed(pair.amountDecimals)
        setAmountInput(calculatedAmount)
      }
    } else {
      const calculatedAmount = (
        (availableCrypto * percent) /
        100
      ).toFixed(pair.amountDecimals)
      setAmountInput(calculatedAmount)
    }
  }

  // Handle Review Order Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (orderType !== 'market' && (!parsedPrice || parsedPrice <= 0)) {
      setErrorMsg('Please enter a valid price.')
      return
    }

    if (!parsedAmount || parsedAmount < pair.minAmount) {
      setErrorMsg(`Minimum order amount is ${pair.minAmount} ${pair.baseAsset}.`)
      return
    }

    if (side === 'buy' && estimatedTotal > availableUsdt) {
      setErrorMsg(
        `Insufficient USDT balance. Available: ${formatCurrency(availableUsdt)}`
      )
      return
    }

    if (side === 'sell' && parsedAmount > availableCrypto) {
      setErrorMsg(
        `Insufficient ${pair.baseAsset} balance. Available: ${availableCrypto} ${pair.baseAsset}`
      )
      return
    }

    if (orderType === 'stop_limit') {
      const parsedStop = parseFloat(stopPriceInput) || 0
      if (!parsedStop || parsedStop <= 0) {
        setErrorMsg('Please enter a valid Stop Price.')
        return
      }
    }

    onReviewOrder({
      side,
      type: orderType,
      price: parsedPrice,
      stopPrice: orderType === 'stop_limit' ? parseFloat(stopPriceInput) : undefined,
      amount: parsedAmount,
      total: estimatedTotal,
      fee: estimatedFee,
    })
  }

  return (
    <div className="w-full bg-cp-card flex flex-col p-4 sm:p-5 select-none text-xs">
      {/* 1. Buy / Sell Tab Buttons */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-cp-elevated rounded-xl border border-cp-border mb-4">
        <button
          type="button"
          onClick={() => {
            setSide('buy')
            setErrorMsg(null)
          }}
          className={cn(
            'py-2 font-bold rounded-lg text-xs transition-all tracking-wide uppercase',
            side === 'buy'
              ? 'bg-cp-positive text-cp-bg shadow-[0_0_15px_rgba(0,214,160,0.3)]'
              : 'text-cp-text-muted hover:text-cp-text-primary'
          )}
        >
          Buy {pair.baseAsset}
        </button>

        <button
          type="button"
          onClick={() => {
            setSide('sell')
            setErrorMsg(null)
          }}
          className={cn(
            'py-2 font-bold rounded-lg text-xs transition-all tracking-wide uppercase',
            side === 'sell'
              ? 'bg-cp-negative text-cp-text-primary shadow-[0_0_15px_rgba(255,83,100,0.3)]'
              : 'text-cp-text-muted hover:text-cp-text-primary'
          )}
        >
          Sell {pair.baseAsset}
        </button>
      </div>

      {/* 2. Order Type Switcher (Limit, Market, Stop-Limit) */}
      <div className="flex items-center gap-4 border-b border-cp-border pb-2.5 mb-4 text-xs font-semibold">
        {(['limit', 'market', 'stop_limit'] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => {
              setOrderType(type)
              setErrorMsg(null)
            }}
            className={cn(
              'capitalize transition-colors pb-1 relative',
              orderType === type
                ? 'text-cp-gold'
                : 'text-cp-text-muted hover:text-cp-text-primary'
            )}
          >
            {type.replace('_', '-')}
            {orderType === type && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cp-gold rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Available Balance Strip */}
      <div className="flex items-center justify-between text-[11px] mb-3">
        <span className="text-cp-text-muted flex items-center gap-1">
          <Wallet className="w-3.5 h-3.5 text-cp-gold" />
          <span>Available:</span>
        </span>
        <div className="flex items-center gap-1.5 font-mono">
          <span className="font-bold text-cp-text-primary">
            {side === 'buy'
              ? formatCurrency(availableUsdt)
              : `${availableCrypto} ${pair.baseAsset}`}
          </span>
          <Link
            to="/deposit"
            className="text-cp-gold hover:underline text-[10px] font-sans flex items-center"
          >
            + Deposit
          </Link>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Stop Price (if Stop-Limit) */}
        {orderType === 'stop_limit' && (
          <div>
            <label className="text-[10px] font-semibold text-cp-text-muted uppercase tracking-wider block mb-1">
              Stop Price
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                step="any"
                value={stopPriceInput}
                onChange={(e) => setStopPriceInput(e.target.value)}
                className="w-full bg-cp-elevated border border-cp-border rounded-lg py-2 pl-3 pr-14 text-xs font-mono text-cp-text-primary focus:outline-none focus:border-cp-gold"
              />
              <span className="absolute right-3 text-[11px] font-mono font-semibold text-cp-text-muted pointer-events-none">
                {pair.quoteAsset}
              </span>
            </div>
          </div>
        )}

        {/* Order Price */}
        <div>
          <label className="text-[10px] font-semibold text-cp-text-muted uppercase tracking-wider block mb-1">
            Price
          </label>
          <div className="relative flex items-center">
            <input
              type="number"
              step="any"
              disabled={orderType === 'market'}
              value={orderType === 'market' ? 'Market Best Price' : priceInput}
              onChange={(e) => {
                setPriceInput(e.target.value)
                setActivePercent(null)
              }}
              className={cn(
                'w-full bg-cp-elevated border border-cp-border rounded-lg py-2 pl-3 pr-14 text-xs font-mono text-cp-text-primary focus:outline-none focus:border-cp-gold transition-colors',
                orderType === 'market' && 'text-cp-text-muted bg-cp-card/60 italic'
              )}
            />
            <span className="absolute right-3 text-[11px] font-mono font-semibold text-cp-text-muted pointer-events-none">
              {pair.quoteAsset}
            </span>
          </div>
        </div>

        {/* Order Amount */}
        <div>
          <label className="text-[10px] font-semibold text-cp-text-muted uppercase tracking-wider block mb-1">
            Amount
          </label>
          <div className="relative flex items-center">
            <input
              type="number"
              step="any"
              placeholder={`Min: ${pair.minAmount}`}
              value={amountInput}
              onChange={(e) => {
                setAmountInput(e.target.value)
                setActivePercent(null)
              }}
              className="w-full bg-cp-elevated border border-cp-border rounded-lg py-2 pl-3 pr-14 text-xs font-mono text-cp-text-primary focus:outline-none focus:border-cp-gold"
            />
            <span className="absolute right-3 text-[11px] font-mono font-semibold text-cp-text-muted pointer-events-none">
              {pair.baseAsset}
            </span>
          </div>
        </div>

        {/* Percentage Shortcuts (25%, 50%, 75%, 100%) */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {[25, 50, 75, 100].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => handlePercentClick(pct)}
              className={cn(
                'py-1 rounded font-mono text-[10px] font-semibold transition-all',
                activePercent === pct
                  ? 'bg-cp-gold text-cp-bg shadow-sm'
                  : 'bg-cp-elevated border border-cp-border/80 text-cp-text-secondary hover:text-cp-text-primary hover:border-cp-gold/40'
              )}
            >
              {pct}%
            </button>
          ))}
        </div>

        {/* Estimated Total & Fee Breakdown */}
        <div className="p-2.5 rounded-lg bg-cp-elevated/60 border border-cp-border/50 space-y-1 font-mono text-[11px]">
          <div className="flex justify-between">
            <span className="text-cp-text-muted">Estimated Total:</span>
            <span className="text-cp-text-primary font-bold">
              {formatCurrency(estimatedTotal)}
            </span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-cp-text-muted">Estimated Fee (0.02%):</span>
            <span className="text-cp-gold font-medium">
              ≈ ${estimatedFee.toFixed(3)} {pair.quoteAsset}
            </span>
          </div>
        </div>

        {/* Error notice if validation fails */}
        {errorMsg && (
          <div className="p-2 rounded bg-cp-negative/10 border border-cp-negative/30 text-cp-negative text-[11px] flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit Review Button or Guest Login Prompt */}
        {isAuthenticated ? (
          <Button
            type="submit"
            variant={side === 'buy' ? 'success' : 'danger'}
            size="lg"
            fullWidth
            className="text-xs uppercase tracking-wider font-bold py-3 mt-2"
          >
            {side === 'buy' ? `Review Buy ${pair.baseAsset}` : `Review Sell ${pair.baseAsset}`}
          </Button>
        ) : (
          <div className="space-y-2 mt-2">
            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate('/login', { state: { from: { pathname: '/trade' } } })}
              className="text-xs uppercase tracking-wider font-bold py-3"
              leftIcon={<Lock className="w-3.5 h-3.5" />}
            >
              Log In to Trade
            </Button>
            <div className="text-center text-[11px] text-cp-text-muted">
              Don't have an account?{' '}
              <Link to="/register" className="text-cp-gold hover:underline font-semibold">
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default OrderForm
