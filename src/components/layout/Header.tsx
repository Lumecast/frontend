import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ConnectWalletButton } from '@/components/wallet/ConnectWalletButton'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-brand-50 text-brand-700'
      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
  }`

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <NavLink to="/" className="text-lg font-bold tracking-tight text-foreground">
            Lumecast
          </NavLink>
          <nav className="hidden items-center gap-1 sm:flex" aria-label="Main navigation">
            <NavLink to="/" className={navLinkClass} end>
              Markets
            </NavLink>
            <NavLink to="/portfolio" className={navLinkClass}>
              Portfolio
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ConnectWalletButton />
          <button
            className="sm:hidden p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <nav id="mobile-menu" className="sm:hidden py-4 border-t border-border" aria-label="Mobile navigation">
          <div className="mx-auto flex flex-col gap-2 max-w-5xl px-4">
            <NavLink to="/" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
              Markets
            </NavLink>
            <NavLink to="/portfolio" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
              Portfolio
            </NavLink>
          </div>
        </nav>
      )}
    </header>
  )
}