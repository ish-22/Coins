import React from 'react'
import { cn } from '@/utils/cn'

export type BadgeVariant = 'gold' | 'positive' | 'negative' | 'neutral' | 'outline'
export type BadgeSize = 'sm' | 'md'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  withDot?: boolean
  pulseDot?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}

const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
  gold: {
    container: 'bg-cp-gold/10 text-cp-gold border border-cp-gold/30',
    dot: 'bg-cp-gold',
  },
  positive: {
    container: 'bg-cp-positive/10 text-cp-positive border border-cp-positive/30',
    dot: 'bg-cp-positive',
  },
  negative: {
    container: 'bg-cp-negative/10 text-cp-negative border border-cp-negative/30',
    dot: 'bg-cp-negative',
  },
  neutral: {
    container: 'bg-cp-elevated text-cp-text-secondary border border-cp-border',
    dot: 'bg-cp-text-secondary',
  },
  outline: {
    container: 'bg-transparent text-cp-text-primary border border-cp-border',
    dot: 'bg-cp-text-primary',
  },
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-[11px] px-2 py-0.5 gap-1.5 font-medium rounded-md',
  md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold rounded-lg',
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  withDot = false,
  pulseDot = false,
  icon,
  className,
  children,
  ...props
}) => {
  const styles = variantStyles[variant]

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center tracking-wide select-none',
        styles.container,
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {withDot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulseDot && (
            <span
              className={cn(
                'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                styles.dot
              )}
            />
          )}
          <span
            className={cn('relative inline-flex rounded-full h-1.5 w-1.5', styles.dot)}
          />
        </span>
      )}
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  )
}

export default Badge
