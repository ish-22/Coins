import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'elevated'
  | 'outline'
  | 'ghost'
  | 'success'
  | 'danger'

export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gold-gradient text-cp-bg font-bold shadow-gold-sm hover:bg-gold-gradient-hover hover:shadow-gold-md active:opacity-95 focus-visible:ring-cp-gold border border-cp-gold/40',
  secondary:
    'bg-cp-card text-cp-text-primary border border-cp-border hover:border-cp-gold/50 hover:text-cp-gold hover:bg-cp-card-hover focus-visible:ring-cp-gold',
  elevated:
    'bg-cp-elevated text-cp-text-primary border border-cp-border shadow-card hover:bg-cp-elevated-hover hover:border-cp-border-light focus-visible:ring-cp-gold',
  outline:
    'bg-transparent text-cp-text-primary border border-cp-border hover:border-cp-gold hover:text-cp-gold active:bg-cp-gold/5 focus-visible:ring-cp-gold',
  ghost:
    'bg-transparent text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-elevated/60 active:bg-cp-elevated focus-visible:ring-cp-gold',
  success:
    'bg-cp-positive text-cp-bg font-bold hover:bg-cp-positive-hover hover:shadow-[0_0_15px_rgba(0,214,160,0.3)] focus-visible:ring-cp-positive border border-cp-positive/40',
  danger:
    'bg-cp-negative text-cp-text-primary font-bold hover:bg-cp-negative-hover hover:shadow-[0_0_15px_rgba(255,83,100,0.3)] focus-visible:ring-cp-negative border border-cp-negative/40',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-md min-h-[32px]',
  md: 'text-sm px-4 py-2.5 gap-2 rounded-lg min-h-[40px]',
  lg: 'text-base px-6 py-3.5 gap-2.5 rounded-xl min-h-[48px]',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 select-none cursor-pointer',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cp-bg',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading && (
          <Loader2 className={cn('animate-spin text-current', size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
        )}
        {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
