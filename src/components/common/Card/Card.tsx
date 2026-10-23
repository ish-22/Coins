import React from 'react'
import { cn } from '@/utils/cn'

export type CardVariant = 'default' | 'elevated' | 'gold' | 'flat'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  padding?: CardPadding
  hoverEffect?: boolean
  children: React.ReactNode
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-cp-card border border-cp-border shadow-card',
  elevated: 'bg-cp-elevated border border-cp-border shadow-elevated',
  gold: 'bg-gradient-to-b from-cp-elevated to-cp-card border border-cp-gold/30 shadow-[0_0_20px_rgba(240,185,58,0.06)]',
  flat: 'bg-transparent border border-cp-border/50',
}

const paddingStyles: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8',
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hoverEffect = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl transition-all duration-200 relative overflow-hidden',
          variantStyles[variant],
          paddingStyles[padding],
          hoverEffect &&
            'hover:border-cp-border-light hover:shadow-lg hover:-translate-y-0.5',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 border-b border-cp-border pb-4 mb-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <h3
      className={cn(
        'text-base sm:text-lg font-bold text-cp-text-primary tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <p
      className={cn('text-xs sm:text-sm text-cp-text-secondary mt-0.5', className)}
      {...props}
    >
      {children}
    </p>
  )
}

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return <div className={cn('relative', className)} {...props}>{children}</div>
}

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 border-t border-cp-border pt-4 mt-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
