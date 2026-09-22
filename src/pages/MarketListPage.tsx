import { EmptyState } from '@/components/ui/EmptyState'

export function MarketListPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Markets</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Browse and search prediction markets.
      </p>
      <div className="mt-8">
        <EmptyState
          title="Market discovery coming soon"
          description="Market list, filters, and search will populate here from the indexer API in the next milestone."
        />
      </div>
    </div>
  )
}