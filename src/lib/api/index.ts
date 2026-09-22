import { config } from '@/lib/config'
import { IndexerApiClient } from '@/lib/api/client'

export const indexerApi = new IndexerApiClient(config.indexerApiUrl)

export { ApiError, IndexerApiClient } from '@/lib/api/client'
export type {
  ListMarketsParams,
  ListMarketsResponse,
  Market,
  MarketStatus,
  Outcome,
  Position,
  PricePoint,
} from '@/lib/api/types'