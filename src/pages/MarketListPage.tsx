import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { MarketCard } from '@/components/market/MarketCard'
import { useMarkets } from '@/hooks/useMarkets'
import type { MarketStatus } from '@/lib/api/types'

const categories = ['All', 'Sports', 'Politics', 'Crypto', 'Tech', 'Entertainment', 'Other']

export function MarketListPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState<MarketStatus | 'all'>('all')

  const params = {
    search: search || undefined,
    category: category !== 'All' ? category : undefined,
    status: status !== 'all' ? status : undefined,
  }

  const { data, isLoading, error, refetch } = useMarkets(params)

  const markets = data?.markets ?? []

  if (isLoading && markets.length === 0) {
    return (
      <div>
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Markets</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse and search prediction markets.
            </p>
          </div>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-5">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Markets</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse and search prediction markets.
            </p>
          </div>
        </header>
        <EmptyState
          title="Failed to load markets"
          description={error.message}
        />
      </div>
    )
  }

  return (
    <div>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Markets</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse and search prediction markets.
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          Refresh
        </Button>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Search markets…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select
          value={category}
          onValueChange={setCategory}
          options={categories.map((c) => ({ value: c, label: c }))}
          className="w-full sm:w-40"
        />
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as MarketStatus | 'all')}
          options={['all', 'open', 'closed', 'resolved'].map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
          className="w-full sm:w-40"
        />
      </div>

      {markets.length === 0 ? (
        <EmptyState
          title="No markets found"
          description="Try adjusting your filters or search query."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {markets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      )}
    </div>
  )
}