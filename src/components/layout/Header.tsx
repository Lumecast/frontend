import { NavLink } from 'react-router-dom'
import { ConnectWalletButton } from '@/components/wallet/ConnectWalletButton'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-brand-50 text-brand-700'
      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
  }`

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <NavLink to="/" className="text-lg font-bold tracking-tight text-foreground">
            Lumecast
          </NavLink>
          <nav className="hidden items-center gap-1 sm:flex">
            <NavLink to="/" className={navLinkClass} end>
              Markets
            </NavLink>
            <NavLink to="/portfolio" className={navLinkClass}>
              Portfolio
            </NavLink>
          </nav>
        </div>
        <ConnectWalletButton />
      </div>
    </header>
  )
}