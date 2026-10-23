import React from 'react'
import { cn } from '@/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  prefixText?: string
  suffixText?: string
  containerClassName?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      prefixText,
      suffixText,
      containerClassName,
      className,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className={cn('w-full flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-cp-text-secondary tracking-wide select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center group">
          {leftIcon && (
            <div className="absolute left-3 text-cp-text-muted group-focus-within:text-cp-gold transition-colors duration-200 pointer-events-none">
              {leftIcon}
            </div>
          )}

          {prefixText && (
            <span className="absolute left-3 text-xs font-mono font-medium text-cp-text-muted select-none pointer-events-none">
              {prefixText}
            </span>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full bg-cp-card border border-cp-border rounded-lg text-sm text-cp-text-primary placeholder:text-cp-text-muted/60',
              'py-2.5 px-3.5 transition-all duration-200',
              'hover:border-cp-border-light',
              'focus:outline-none focus:border-cp-gold focus:ring-1 focus:ring-cp-gold/50 focus:bg-cp-elevated/40',
              'disabled:bg-cp-card/50 disabled:text-cp-text-muted disabled:cursor-not-allowed disabled:border-cp-border/40',
              leftIcon && 'pl-9',
              prefixText && 'pl-10',
              (rightIcon || suffixText) && 'pr-12',
              error && 'border-cp-negative focus:border-cp-negative focus:ring-cp-negative/40',
              className
            )}
            {...props}
          />

          {suffixText && (
            <span className="absolute right-3 text-xs font-mono font-semibold text-cp-text-secondary select-none pointer-events-none">
              {suffixText}
            </span>
          )}

          {rightIcon && !suffixText && (
            <div className="absolute right-3 text-cp-text-muted group-focus-within:text-cp-gold transition-colors duration-200">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="text-xs text-cp-negative font-medium mt-0.5">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-cp-text-muted mt-0.5">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
