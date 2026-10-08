import { useState } from 'react'
import { useWallet } from '@/hooks/useWallet'
import { useCreateMarket } from '@/hooks/useCreateMarket'
import { useResolveMarket } from '@/hooks/useResolveMarket'
import { useDisputeMarket } from '@/hooks/useDisputeMarket'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { EmptyState } from '@/components/ui/EmptyState'
import { shortenAddress } from '@/lib/utils'
import type { SelectOption } from '@/components/ui/Select'

const ALLOWLIST = [
  'GABC123...',
  'GBDEF456...',
]

function isAllowlisted(address: string | null): boolean {
  if (!address) return false
  return ALLOWLIST.some((allowed) => address.startsWith(allowed.slice(0, 4)))
}

export function AdminPage() {
  const { address, status } = useWallet()

  if (status !== 'connected' || !address) {
    return (
      <div>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Market creation and resolution — gated to allowlisted resolvers.
          </p>
        </header>
        <EmptyState
          title="Connect your wallet"
          description="Connect an allowlisted wallet to access the admin panel."
        />
      </div>
    )
  }

  if (!isAllowlisted(address)) {
    const addr = address!
    return (
      <div>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Market creation and resolution — gated to allowlisted resolvers.
          </p>
        </header>
        <EmptyState
          title="Access denied"
          description={
            <>
              Your wallet <code className="font-mono">{shortenAddress(addr)}</code> is not on the admin allowlist.
              <br />
              Contact an administrator to request access.
            </>
          }
        />
      </div>
    )
  }

  const addr = address!
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Connected as <code className="font-mono">{shortenAddress(addr)}</code>
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <MarketCreationForm />
        <ResolutionPanel />
      </div>
    </div>
  )
}

function MarketCreationForm() {
  const [question, setQuestion] = useState('')
  const [outcomes, setOutcomes] = useState(['Yes', 'No'])
  const [category, setCategory] = useState('Sports')
  const [closeTime, setCloseTime] = useState('')
  const [resolutionTime, setResolutionTime] = useState('')
  const [resolver, setResolver] = useState('')
  const { executeCreate, isCreating, error } = useCreateMarket()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const closeTimestamp = Math.floor(new Date(closeTime).getTime() / 1000)
    const resolutionTimestamp = Math.floor(new Date(resolutionTime).getTime() / 1000)

    await executeCreate({
      question,
      outcomes,
      closeTime: closeTimestamp,
      resolutionTime: resolutionTimestamp,
      resolver,
      category,
    })
  }

  const categories: SelectOption[] = [
    { value: 'Sports', label: 'Sports' },
    { value: 'Politics', label: 'Politics' },
    { value: 'Crypto', label: 'Crypto' },
    { value: 'Tech', label: 'Tech' },
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Other', label: 'Other' },
  ]

  return (
    <Card className="p-5">
      <h2 className="text-lg font-semibold mb-4">Create Market</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-danger-500/10 p-3 text-sm text-danger-600" role="alert">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Question</label>
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Will Bitcoin reach $100k by end of 2024?"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Outcomes (one per line)</label>
          <Textarea
            value={outcomes.join('\n')}
            onChange={(e) => setOutcomes(e.target.value.split('\n').filter((o) => o.trim()))}
            placeholder="Yes\nNo"
            rows={3}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <Select
              value={category}
              onValueChange={setCategory}
              options={categories}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Resolver Address</label>
            <Input
              value={resolver}
              onChange={(e) => setResolver(e.target.value)}
              placeholder="G..."
              required
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Close Time (UTC)</label>
            <Input
              type="datetime-local"
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Resolution Time (UTC)</label>
            <Input
              type="datetime-local"
              value={resolutionTime}
              onChange={(e) => setResolutionTime(e.target.value)}
              required
            />
          </div>
        </div>

        <Button type="submit" variant="primary" disabled={isCreating} className="w-full">
          {isCreating ? 'Creating…' : 'Create Market'}
        </Button>
      </form>
    </Card>
  )
}

function ResolutionPanel() {
  const [marketId, setMarketId] = useState('')
  const [winningOutcome, setWinningOutcome] = useState(0)
  const [disputeMarketId, setDisputeMarketId] = useState('')
  const [counterBond, setCounterBond] = useState('')
  const { executeResolve, isResolving, error: resolveError } = useResolveMarket()
  const { executeDispute, isDisputing, error: disputeError } = useDisputeMarket()

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault()
    await executeResolve({ marketId, winningOutcomeIndex: winningOutcome })
  }

  const handleDispute = async (e: React.FormEvent) => {
    e.preventDefault()
    await executeDispute({ marketId: disputeMarketId, counterBond })
  }

  return (
    <Card className="p-5">
      <h2 className="text-lg font-semibold mb-4">Resolve Market</h2>
      <form onSubmit={handleResolve} className="space-y-4">
        {resolveError && (
          <div className="rounded-md bg-danger-500/10 p-3 text-sm text-danger-600" role="alert">
            {resolveError}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Market ID</label>
          <Input
            value={marketId}
            onChange={(e) => setMarketId(e.target.value)}
            placeholder="market-123"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Winning Outcome</label>
          <Select
            value={winningOutcome.toString()}
            onValueChange={(v) => setWinningOutcome(parseInt(v, 10))}
            options={[
              { value: '0', label: 'Outcome 0 (first)' },
              { value: '1', label: 'Outcome 1 (second)' },
              { value: '2', label: 'Outcome 2 (third)' },
              { value: '3', label: 'Outcome 3 (fourth)' },
            ]}
          />
        </div>

        <Button type="submit" variant="primary" disabled={isResolving} className="w-full">
          {isResolving ? 'Resolving…' : 'Propose Resolution'}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="text-sm font-semibold mb-3">Dispute Resolution</h3>
        <form onSubmit={handleDispute} className="space-y-4">
          {disputeError && (
            <div className="rounded-md bg-danger-500/10 p-3 text-sm text-danger-600" role="alert">
              {disputeError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Market ID</label>
            <Input
              value={disputeMarketId}
              onChange={(e) => setDisputeMarketId(e.target.value)}
              placeholder="market-123"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Counter Bond (USDC)</label>
            <Input
              type="number"
              value={counterBond}
              onChange={(e) => setCounterBond(e.target.value)}
              placeholder="10000000"
              min="1"
              step="1"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">Amount in stroops (1 USDC = 10,000,000 stroops)</p>
          </div>

          <Button type="submit" variant="outline" disabled={isDisputing} className="w-full">
            {isDisputing ? 'Submitting Dispute…' : 'Open Dispute'}
          </Button>
        </form>
      </div>
    </Card>
  )
}