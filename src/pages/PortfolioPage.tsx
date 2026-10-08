import { useWallet } from '@/hooks/useWallet'
import { usePositions } from '@/hooks/usePositions'
import { useClaim } from '@/hooks/useClaim'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { Link } from 'react-router-dom'
import { formatUsd } from '@/lib/utils'
import type { Position } from '@/lib/api/types'

function PositionCard({ position, onClaim }: { position: Position; onClaim: (marketId: string) => void }) {
  const isResolved = position.resolved
  const pnl = position.unrealizedValueUsd - position.shares * position.averagePrice
  const pnlColor = pnl >= 0 ? 'text-success-600' : 'text-danger-600'

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <Link
            to={`/markets/${position.marketId}`}
            className="font-semibold text-foreground hover:underline block truncate"
          >
            {position.marketQuestion}
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">
            Outcome: {position.outcomeLabel}
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="font-mono text-lg font-semibold">
            {formatUsd(position.unrealizedValueUsd)}
          </div>
          <div className={`text-sm font-medium ${pnlColor}`}>
            {pnl >= 0 ? '+' : ''}{formatUsd(pnl)}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Shares</p>
          <p className="font-medium">{position.shares.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Avg Price</p>
          <p className="font-medium">{(position.averagePrice * 100).toFixed(1)}¢</p>
        </div>
        <div>
          <p className="text-muted-foreground">Status</p>
          <p className={`font-medium ${isResolved ? 'text-success-600' : 'text-brand-600'}`}>
            {isResolved ? 'Resolved' : 'Open'}
          </p>
        </div>
      </div>

      {isResolved && (
        <div className="mt-4 pt-4 border-t border-border">
          <Button
            variant="primary"
            onClick={() => onClaim(position.marketId)}
            className="w-full"
          >
            Claim Winnings
          </Button>
        </div>
      )}
    </Card>
  )
}

export function PortfolioPage() {
  const { status } = useWallet()
  const { data: positions, isLoading, error, refetch } = usePositions()
  const { executeClaim, isClaiming, error: claimError } = useClaim()

  const handleClaim = async (marketId: string) => {
    const result = await executeClaim(marketId)
    if (result.success) {
      refetch()
    }
  }

  if (status !== 'connected') {
    return (
      <div>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Portfolio</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your positions across all markets.
          </p>
        </header>
        <EmptyState
          title="Connect your wallet"
          description="Connect a wallet to view your positions and claim winnings."
        />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div>
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Portfolio</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your positions across all markets.
            </p>
          </div>
          <Button variant="outline" onClick={() => refetch()}>
            Refresh
          </Button>
        </header>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-5">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-16" />
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
            <h1 className="text-2xl font-bold tracking-tight">Portfolio</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your positions across all markets.
            </p>
          </div>
          <Button variant="outline" onClick={() => refetch()}>
            Refresh
          </Button>
        </header>
        <EmptyState
          title="Failed to load positions"
          description={error.message}
        />
      </div>
    )
  }

  const openPositions = positions?.filter((p) => !p.resolved) ?? []
  const resolvedPositions = positions?.filter((p) => p.resolved) ?? []

  return (
    <div>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Portfolio</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your positions across all markets.
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          Refresh
        </Button>
      </header>

      {claimError && (
        <div className="mb-6 rounded-md bg-danger-500/10 p-3 text-sm text-danger-600" role="alert">
          {claimError}
        </div>
      )}

      {openPositions.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Open Positions ({openPositions.length})</h2>
          <div className="space-y-4">
            {openPositions.map((position) => (
              <PositionCard key={position.marketId} position={position} onClaim={handleClaim} />
            ))}
          </div>
        </section>
      )}

      {resolvedPositions.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Resolved Positions ({resolvedPositions.length})</h2>
          <div className="space-y-4">
            {resolvedPositions.map((position) => (
              <PositionCard key={position.marketId} position={position} onClaim={handleClaim} />
            ))}
          </div>
        </section>
      )}

      {openPositions.length === 0 && resolvedPositions.length === 0 && (
        <EmptyState
          title="No positions yet"
          description="Open positions and unrealized value will appear here after your first trade."
        />
      )}

      {isClaiming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-600 border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Claiming winnings…</p>
          </Card>
        </div>
      )}
    </div>
  )
}