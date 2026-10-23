/**
 * CoinPlus Shared Type Definitions
 */

// UI Component Variant Types
export type ButtonVariant = 'primary' | 'secondary' | 'elevated' | 'outline' | 'ghost' | 'danger' | 'success'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type BadgeVariant = 'gold' | 'positive' | 'negative' | 'neutral' | 'outline'
export type BadgeSize = 'sm' | 'md'

export type CardVariant = 'default' | 'elevated' | 'gold' | 'flat'

export type TypographyVariant = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'body' 
  | 'body-sm' 
  | 'caption' 
  | 'mono' 
  | 'mono-lg'

// Crypto Market Mock Types
export interface CryptoAsset {
  id: string
  symbol: string
  name: string
  priceUsd: number
  change24h: number
  high24h: number
  low24h: number
  volume24h: number
  sparkline: number[]
}

export type OrderType = 'limit' | 'market' | 'stop-limit'
export type OrderSide = 'buy' | 'sell'
