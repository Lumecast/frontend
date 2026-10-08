import { useQuery } from '@tanstack/react-query'
import { indexerApi } from '@/lib/api'
import type { ListMarketsParams, ListMarketsResponse } from '@/lib/api/types'

export function useMarkets(params?: ListMarketsParams) {
  return useQuery<ListMarketsResponse, Error>({
    queryKey: ['markets', params],
    queryFn: () => indexerApi.listMarkets(params),
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
}