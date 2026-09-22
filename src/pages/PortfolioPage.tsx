import { EmptyState } from '@/components/ui/EmptyState'

export function PortfolioPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Portfolio</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Your positions across all markets.
      </p>
      <div className="mt-8">
        <EmptyState
          title="No positions yet"
          description="Open positions and unrealized value will appear here after your first trade (M3)."
        />
      </div>
    </div>
  )
}