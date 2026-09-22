import type {
  ListMarketsParams,
  ListMarketsResponse,
  Market,
  Position,
  PricePoint,
} from '@/lib/api/types'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export class IndexerApiClient {
  constructor(private readonly baseUrl: string) {}

  private url(path: string): string {
    return `${this.baseUrl.replace(/\/$/, '')}${path}`
  }

  private async request<T>(path: string, params?: Record<string, string>): Promise<T> {
    const search =
      params && Object.keys(params).length > 0
        ? `?${new URLSearchParams(params)}`
        : ''
    const res = await fetch(this.url(path) + search)
    if (!res.ok) {
      throw new ApiError(res.status, `Request failed (${res.status}) for ${path}`)
    }
    return (await res.json()) as T
  }

  async listMarkets(params?: ListMarketsParams): Promise<ListMarketsResponse> {
    const query: Record<string, string> = {}
    if (params?.category) query.category = params.category
    if (params?.status) query.status = params.status
    if (params?.search) query.search = params.search
    return this.request('/markets', query)
  }

  async getMarket(id: string): Promise<Market> {
    return this.request(`/markets/${encodeURIComponent(id)}`)
  }

  async getPriceHistory(marketId: string): Promise<PricePoint[]> {
    return this.request(`/markets/${encodeURIComponent(marketId)}/prices`)
  }

  async getPositions(address: string): Promise<Position[]> {
    return this.request(`/positions/${encodeURIComponent(address)}`)
  }
}