import React from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

export interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'horizontal' | 'vertical' | 'icon-only'
  showSubtitle?: boolean
  asLink?: boolean
  to?: string
}

const sizeConfig = {
  sm: {
    iconSize: 28,
    titleSize: 'text-base',
    subtitleSize: 'text-[9px]',
    gap: 'gap-2',
  },
  md: {
    iconSize: 36,
    titleSize: 'text-xl',
    subtitleSize: 'text-[10px]',
    gap: 'gap-2.5',
  },
  lg: {
    iconSize: 44,
    titleSize: 'text-2xl',
    subtitleSize: 'text-xs',
    gap: 'gap-3',
  },
  xl: {
    iconSize: 56,
    titleSize: 'text-3xl',
    subtitleSize: 'text-sm',
    gap: 'gap-3.5',
  },
}

export const GeometricCoinMark: React.FC<{ size?: number; className?: string }> = ({
  size = 36,
  className,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('transition-transform duration-300 group-hover:scale-105', className)}
    >
      <defs>
        {/* Gold Metallic Gradients */}
        <linearGradient id="cpGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F7C95C" />
          <stop offset="50%" stopColor="#F0B93A" />
          <stop offset="100%" stopColor="#D89C1D" />
        </linearGradient>
        
        <linearGradient id="cpFacetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#141E2B" />
          <stop offset="100%" stopColor="#080B12" />
        </linearGradient>

        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Hexagonal Outer Coin Base */}
      <polygon
        points="24,2 44,13.5 44,34.5 24,46 4,34.5 4,13.5"
        fill="url(#cpFacetGradient)"
        stroke="url(#cpGoldGradient)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Internal Geometry & Accent Cuts */}
      <polygon
        points="24,7 39,15.6 39,32.4 24,41 9,32.4 9,15.6"
        fill="none"
        stroke="#243042"
        strokeWidth="1.2"
        strokeDasharray="3 2"
      />

      {/* Stylized 'C' lettermark in Gold */}
      <path
        d="M22 17 H16 C14.34 17 13 18.34 13 20 V28 C13 29.66 14.34 31 16 31 H22"
        stroke="url(#cpGoldGradient)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Stylized '+' Cross in Gold */}
      <path
        d="M27 24 H35 M31 20 V28"
        stroke="url(#cpGoldGradient)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Central Polished Gold Accent Bead */}
      <circle cx="24" cy="24" r="1.5" fill="#F0B93A" />
    </svg>
  )
}

export const Logo: React.FC<LogoProps> = ({
  className,
  size = 'md',
  variant = 'horizontal',
  showSubtitle = true,
  asLink = true,
  to = '/',
}) => {
  const config = sizeConfig[size]
  const isVertical = variant === 'vertical'
  const isIconOnly = variant === 'icon-only'

  const content = (
    <div
      className={cn(
        'group flex items-center select-none cursor-pointer',
        isVertical ? 'flex-col text-center gap-2' : config.gap,
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        {/* Ambient Gold Glow backdrop */}
        <div className="absolute inset-0 rounded-full bg-cp-gold/15 blur-md -z-10 transition-opacity duration-300 group-hover:bg-cp-gold/25" />
        <GeometricCoinMark size={config.iconSize} />
      </div>

      {!isIconOnly && (
        <div className="flex flex-col leading-none">
          <span
            className={cn(
              'font-extrabold tracking-tight font-sans transition-colors duration-200',
              config.titleSize
            )}
          >
            <span className="text-cp-text-primary">COIN</span>
            <span className="text-cp-gold">PLUS</span>
          </span>
          {showSubtitle && (
            <span
              className={cn(
                'font-semibold text-cp-text-secondary tracking-widest uppercase mt-0.5',
                config.subtitleSize
              )}
            >
              EXCHANGE
            </span>
          )}
        </div>
      )}
    </div>
  )

  if (asLink) {
    return (
      <Link to={to} className="inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-cp-gold rounded-lg">
        {content}
      </Link>
    )
  }

  return content
}

export default Logo
