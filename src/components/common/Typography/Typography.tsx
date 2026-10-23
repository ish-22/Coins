import React from 'react'
import { cn } from '@/utils/cn'

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
  | 'mono-sm'

export type TypographyColor =
  | 'primary'
  | 'secondary'
  | 'gold'
  | 'positive'
  | 'negative'
  | 'muted'
  | 'inherit'

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant
  color?: TypographyColor
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'
  as?: React.ElementType
  children: React.ReactNode
}

const variantStyles: Record<TypographyVariant, string> = {
  h1: 'text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight',
  h2: 'text-2xl sm:text-3xl font-bold tracking-tight leading-snug',
  h3: 'text-xl sm:text-2xl font-bold tracking-tight leading-snug',
  h4: 'text-lg sm:text-xl font-semibold leading-normal',
  body: 'text-base font-normal leading-relaxed',
  'body-sm': 'text-sm font-normal leading-relaxed',
  caption: 'text-xs font-medium tracking-wide uppercase',
  mono: 'font-mono text-sm tracking-tight',
  'mono-lg': 'font-mono text-lg sm:text-xl font-semibold tracking-tight',
  'mono-sm': 'font-mono text-xs tracking-tight',
}

const colorStyles: Record<TypographyColor, string> = {
  primary: 'text-cp-text-primary',
  secondary: 'text-cp-text-secondary',
  gold: 'text-cp-gold',
  positive: 'text-cp-positive',
  negative: 'text-cp-negative',
  muted: 'text-cp-text-muted',
  inherit: 'text-inherit',
}

const defaultElements: Record<TypographyVariant, React.ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  'body-sm': 'p',
  caption: 'span',
  mono: 'span',
  'mono-lg': 'span',
  'mono-sm': 'span',
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color = 'primary',
  weight,
  as,
  className,
  children,
  ...props
}) => {
  const Component = as || defaultElements[variant] || 'div'

  const weightClass = weight
    ? {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
        extrabold: 'font-extrabold',
      }[weight]
    : ''

  return (
    <Component
      className={cn(
        variantStyles[variant],
        colorStyles[color],
        weightClass,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Typography
