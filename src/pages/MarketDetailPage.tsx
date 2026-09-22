import { useParams } from 'react-router-dom'
import { EmptyState } from '@/components/ui/EmptyState'

export function MarketDetailPage() {
  const { marketId } = useParams()

  return (
    <div>
      <EmptyState
        title={marketId ? `Market ${marketId}` : 'Market detail'}
        description="Live odds, volume, and order entry will appear here in the M2 milestone."
      />
    </div>
  )
}