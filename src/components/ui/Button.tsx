import type { ReactNode } from 'react'

const variants = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500',
  secondary:
    'bg-muted text-foreground hover:bg-border focus-visible:ring-muted-foreground',
  outline:
    'border border-border bg-transparent text-foreground hover:bg-muted focus-visible:ring-brand-500',
  ghost:
    'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-muted-foreground',
} as const

export type ButtonVariant = keyof typeof variants

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: {
  children: ReactNode
  variant?: ButtonVariant
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}