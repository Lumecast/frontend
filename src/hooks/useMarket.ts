import { useQuery } from '@tanstack/react-query'
import { indexerApi } from '@/lib/api'
import type { Market, PricePoint } from '@/lib/api/types'

export function useMarket(id: string) {
  return useQuery<Market, Error>({
    queryKey: ['market', id],
    queryFn: () => indexerApi.getMarket(id),
    staleTime: 15_000,
    refetchInterval: 30_000,
    enabled: !!id,
  })
}

export function usePriceHistory(marketId: string) {
  return useQuery<PricePoint[], Error>({
    queryKey: ['priceHistory', marketId],
    queryFn: () => indexerApi.getPriceHistory(marketId),
    staleTime: 30_000,
    refetchInterval: 60_000,
    enabled: !!marketId,
  })
}