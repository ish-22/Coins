/**
 * CoinPlus Design System Theme Tokens
 * Professional Cryptocurrency Trading Platform
 */

export const colors = {
  // Main background colours
  bg: {
    main: '#080B12',
    card: '#101824',
    cardHover: '#142030',
    elevated: '#141E2B',
    elevatedHover: '#1A283A',
  },
  // Accent & Brand colours
  gold: {
    DEFAULT: '#F0B93A',
    hover: '#F7C95C',
    light: 'rgba(240, 185, 58, 0.12)',
    border: 'rgba(240, 185, 58, 0.3)',
    glow: 'rgba(240, 185, 58, 0.25)',
  },
  // Typography colours
  text: {
    primary: '#F4F6FA',
    secondary: '#98A5B7',
    muted: '#627185',
    inverse: '#080B12',
  },
  // Structural borders
  border: {
    DEFAULT: '#243042',
    subtle: '#1A2332',
    light: '#314159',
  },
  // Market signals / status colours
  status: {
    positive: '#00D6A0',
    positiveHover: '#05E5AD',
    positiveSubtle: 'rgba(0, 214, 160, 0.12)',
    positiveBorder: 'rgba(0, 214, 160, 0.3)',
    
    negative: '#FF5364',
    negativeHover: '#FF6D7D',
    negativeSubtle: 'rgba(255, 83, 100, 0.12)',
    negativeBorder: 'rgba(255, 83, 100, 0.3)',
    
    warning: '#F0B93A',
    info: '#3B82F6',
  },
} as const

export const typography = {
  fontSans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  fontMono: '"JetBrains Mono", monospace',
} as const

export const breakpoints = {
  xs: '420px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

export default {
  colors,
  typography,
  breakpoints,
}
