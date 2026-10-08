import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { useWallet } from '@/hooks/useWallet'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { PriceChart } from '@/components/market/PriceChart'
import { useMarket, usePriceHistory } from '@/hooks/useMarket'
import { useTrade } from '@/hooks/useTrade'
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

function TradePanel({ market }: { market: Market }) {
  const { status } = useWallet()
  const { executeTrade, isTrading, error } = useTrade()
  const isOpen = market.status === 'open'
  const [buyAmount, setBuyAmount] = useState<string>('')

  const handleTrade = async (action: 'buy' | 'sell', outcomeIndex: number) => {
    if (!buyAmount || parseFloat(buyAmount) <= 0) return
    const result = await executeTrade({
      marketId: market.id,
      outcomeIndex,
      shares: buyAmount,
      action,
    })
    if (result.success) {
      setBuyAmount('')
    }
  }

  return (
    <Card className="p-5">
      <h2 className="text-lg font-semibold mb-4">Trade</h2>
      {status !== 'connected' ? (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground mb-4">Connect your wallet to trade.</p>
          <Link to="/" className="text-brand-600 hover:underline">
            Connect Wallet
          </Link>
        </div>
      ) : !isOpen ? (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            This market is {market.status}. Trading is no longer available.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {error && (
            <div className="rounded-md bg-danger-500/10 p-3 text-sm text-danger-600" role="alert">
              {error}
            </div>
          )}
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Shares"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
              className="flex-1"
              min="1"
              step="1"
            />
            <span className="flex items-center text-sm text-muted-foreground">shares</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {market.outcomes.map((outcome, i) => (
              <Button
                key={i}
                variant="outline"
                onClick={() => handleTrade('buy', i)}
                disabled={isTrading || !buyAmount || parseFloat(buyAmount) <= 0}
                className="flex flex-col items-start gap-1 p-3 text-left"
              >
                <span className="font-medium">{outcome.label}</span>
                <span className="text-xs text-muted-foreground">Buy @ {(outcome.price * 100).toFixed(1)}¢</span>
              </Button>
            ))}
          </div>
          {isTrading && <p className="text-sm text-muted-foreground text-center">Submitting transaction…</p>}
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
          <TradePanel market={market} />
        </div>
      </div>
    </div>
  )
}