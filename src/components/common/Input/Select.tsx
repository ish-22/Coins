import React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface SelectOption {
  value: string
  label: string
  sublabel?: string
  disabled?: boolean
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  helperText?: string
  error?: string
  options: SelectOption[]
  containerClassName?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      options,
      containerClassName,
      className,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className={cn('w-full flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold text-cp-text-secondary tracking-wide select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full appearance-none bg-cp-card border border-cp-border rounded-lg text-sm text-cp-text-primary',
              'py-2.5 pl-3.5 pr-10 transition-all duration-200 cursor-pointer',
              'hover:border-cp-border-light',
              'focus:outline-none focus:border-cp-gold focus:ring-1 focus:ring-cp-gold/50 focus:bg-cp-elevated/40',
              'disabled:bg-cp-card/50 disabled:text-cp-text-muted disabled:cursor-not-allowed',
              error && 'border-cp-negative focus:border-cp-negative focus:ring-cp-negative/40',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="bg-cp-elevated text-cp-text-primary py-1.5"
              >
                {opt.label} {opt.sublabel ? `(${opt.sublabel})` : ''}
              </option>
            ))}
          </select>

          <ChevronDown className="absolute right-3.5 w-4 h-4 text-cp-text-muted pointer-events-none transition-transform duration-200" />
        </div>

        {error && <p className="text-xs text-cp-negative font-medium mt-0.5">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-cp-text-muted mt-0.5">{helperText}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
