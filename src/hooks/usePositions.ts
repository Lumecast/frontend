import { useQuery } from '@tanstack/react-query'
import { indexerApi } from '@/lib/api'
import type { Position } from '@/lib/api/types'
import { useWallet } from '@/hooks/useWallet'

export function usePositions() {
  const { address, status } = useWallet()

  return useQuery<Position[], Error>({
    queryKey: ['positions', address],
    queryFn: () => indexerApi.getPositions(address!),
    enabled: status === 'connected' && !!address,
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
}