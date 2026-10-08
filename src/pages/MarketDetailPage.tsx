import { useParams, Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { PriceChart } from '@/components/market/PriceChart'
import { useMarket, usePriceHistory } from '@/hooks/useMarket'
import { formatUsd, formatDate, formatRelativeTime, shortenAddress } from '@/lib/utils'
import type { Market } from '@/lib/api/types'

function MarketMeta({ market }: { market: Market }) {
  return (
    <Card className="p-5">
      <h2 className="text-lg font-semibold mb-4">Market Details</h2>
      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-muted-foreground">Category</dt>
          <dd className="font-medium">{market.category}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Status</dt>
          <dd className="font-medium capitalize">{market.status}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Volume</dt>
          <dd className="font-medium">{formatUsd(market.volumeUsd)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Close Time</dt>
          <dd className="font-medium">{formatDate(market.closeTime)} ({formatRelativeTime(market.closeTime)})</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-muted-foreground">Resolver</dt>
          <dd className="font-mono truncate">{shortenAddress(market.resolver, 6)}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-muted-foreground">Market ID</dt>
          <dd className="font-mono text-xs truncate">{market.id}</dd>
        </div>
      </dl>
    </Card>
  )
}

function MarketOutcomes({ market }: { market: Market }) {
  return (
    <Card className="p-5">
      <h2 className="text-lg font-semibold mb-4">Current Odds</h2>
      <div className="space-y-3">
        {market.outcomes.map((outcome, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: i === 0 ? 'hsl(var(--brand-600))' : 'hsl(var(--success-500))' }}
              />
              <span className="font-medium">{outcome.label}</span>
            </div>
            <div className="text-right">
              <div className="font-mono text-lg font-semibold">
                {(outcome.price * 100).toFixed(1)}¢
              </div>
              <div className="text-xs text-muted-foreground">
                {market.outcomes.reduce((sum, o) => sum + o.price, 0).toFixed(2)} total
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function TradePanel({ market, address }: { market: Market; address: string | null }) {
  const isOpen = market.status === 'open'

  return (
    <Card className="p-5">
      <h2 className="text-lg font-semibold mb-4">Trade</h2>
      {address ? (
        isOpen ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Buy/sell shares for this market. Trading functionality will be implemented in the next milestone.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {market.outcomes.map((outcome, i) => (
                <button
                  key={i}
                  className="rounded-lg border border-border bg-surface p-4 text-left hover:border-brand-500 transition-colors"
                  disabled
                >
                  <div className="font-medium">{outcome.label}</div>
                  <div className="text-sm text-muted-foreground mt-1">{(outcome.price * 100).toFixed(1)}¢ per share</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              This market is {market.status}. Trading is no longer available.
            </p>
          </div>
        )
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground mb-4">Connect your wallet to trade.</p>
          <Link to="/" className="text-brand-600 hover:underline">
            Connect Wallet
          </Link>
        </div>
      )}
    </Card>
  )
}

export function MarketDetailPage() {
  const { marketId } = useParams()

  const { data: market, isLoading: marketLoading, error: marketError } = useMarket(marketId ?? '')
  const { data: priceHistory } = usePriceHistory(marketId ?? '')

  if (marketLoading) {
    return (
      <div>
        <header className="mb-8">
          <Link to="/" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
            ← Back to Markets
          </Link>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </header>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-5 h-72">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-full w-full" />
            </Card>
            <Card className="p-5">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="p-5">
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (marketError || !market) {
    return (
      <div>
        <header className="mb-8">
          <Link to="/" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
            ← Back to Markets
          </Link>
        </header>
        <EmptyState title="Market not found" description={marketError?.message ?? 'The requested market does not exist.'} />
      </div>
    )
  }

  return (
    <div>
      <header className="mb-8">
        <Link to="/" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">
          ← Back to Markets
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{market.question}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Category: {market.category} • Status: {market.status} • Volume: {formatUsd(market.volumeUsd)}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <PriceChart data={priceHistory ?? []} height={280} />
          <MarketOutcomes market={market} />
        </div>

        <div className="space-y-6">
          <MarketMeta market={market} />
          <TradePanel market={market} address={null} />
        </div>
      </div>
    </div>
  )
}