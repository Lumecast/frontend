import { Outlet } from 'react-router-dom'
import { Header } from '@/components/layout/Header'

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <Outlet />
      </main>
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        Lumecast — prediction markets on Stellar
      </footer>
    </div>
  )
}