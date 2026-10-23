/**
 * Financial & Currency Formatting Utilities
 */

export function formatCurrency(
  value: number,
  currency: 'USD' | 'EUR' = 'USD',
  compact: boolean = false
): string {
  if (compact && Math.abs(value) >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`
  }
  if (compact && Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`
  }
  if (compact && Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value)
}

export function formatUSD(value: number, compact: boolean = false): string {
  return formatCurrency(value, 'USD', compact)
}

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatCrypto(value: number, symbol?: string, decimals: number = 4): string {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  }).format(value)

  return symbol ? `${formatted} ${symbol}` : formatted
}

export function formatPercentage(value: number, includeSign: boolean = true): string {
  const sign = includeSign && value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function truncateHash(hash?: string, left: number = 6, right: number = 4): string {
  if (!hash) return ''
  if (hash.length <= left + right) return hash
  return `${hash.slice(0, left)}...${hash.slice(-right)}`
}
