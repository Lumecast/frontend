import { NavLink } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { formatUsd, formatDate, shortenAddress } from '@/lib/utils'
import type { Market } from '@/lib/api/types'

export function MarketCard({ market }: { market: Market }) {
  const primaryOutcome = market.outcomes[0]
  const secondaryOutcome = market.outcomes[1]

  return (
    <NavLink to={`/markets/${market.id}`} className="block">
      <Card className="p-5 transition-shadow hover:shadow-popover">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-foreground line-clamp-2">
              {market.question}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Category: {market.category}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  market.status === 'open'
                    ? 'bg-success-500/10 text-success-600'
                    : market.status === 'closed'
                    ? 'bg-warning-500/10 text-warning-600'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {market.status}
              </span>
              <span className="text-muted-foreground">
                Closes {formatDate(market.closeTime)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs font-medium text-muted-foreground">Volume</p>
            <p className="font-semibold text-foreground">{formatUsd(market.volumeUsd)}</p>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs font-medium text-muted-foreground">Resolver</p>
            <p className="font-mono text-sm text-foreground truncate">
              {shortenAddress(market.resolver)}
            </p>
          </div>
        </div>

        {primaryOutcome && secondaryOutcome && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-border bg-surface p-3">
              <p className="text-xs font-medium text-muted-foreground">{primaryOutcome.label}</p>
              <p className="font-semibold text-foreground">
                {(primaryOutcome.price * 100).toFixed(1)}¢
              </p>
            </div>
            <div className="rounded-lg border border-border bg-surface p-3">
              <p className="text-xs font-medium text-muted-foreground">{secondaryOutcome.label}</p>
              <p className="font-semibold text-foreground">
                {(secondaryOutcome.price * 100).toFixed(1)}¢
              </p>
            </div>
          </div>
        )}
      </Card>
    </NavLink>
  )
}