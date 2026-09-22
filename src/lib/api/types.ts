export type MarketStatus = 'open' | 'closed' | 'resolved'

/** One tradable outcome of a market, quoted as a share price in [0, 1]. */
export interface Outcome {
  label: string
  price: number
}

export interface Market {
  id: string
  question: string
  category: string
  status: MarketStatus
  volumeUsd: number
  closeTime: string
  resolver: string
  outcomes: Outcome[]
}

export interface PricePoint {
  timestamp: string
  price: number
}

export interface Position {
  marketId: string
  marketQuestion: string
  outcomeLabel: string
  shares: number
  averagePrice: number
  unrealizedValueUsd: number
  resolved: boolean
}

export interface ListMarketsParams {
  category?: string
  status?: MarketStatus
  search?: string
}

export interface ListMarketsResponse {
  markets: Market[]
  total: number
}