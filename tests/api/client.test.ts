import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, IndexerApiClient } from '@/lib/api/client'

function jsonResponse(payload: unknown) {
  return { ok: true, status: 200, json: async () => payload }
}

describe('IndexerApiClient', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
  })

  it('queries the markets endpoint', async () => {
    const payload = { markets: [], total: 0 }
    fetchMock.mockResolvedValue(jsonResponse(payload))

    const client = new IndexerApiClient('http://indexer.test')
    await expect(client.listMarkets()).resolves.toEqual(payload)
    expect(fetchMock).toHaveBeenCalledWith('http://indexer.test/markets')
  })

  it('serializes only provided query params', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ markets: [], total: 0 }))

    const client = new IndexerApiClient('http://indexer.test')
    await client.listMarkets({ category: 'sports', status: 'open', search: 'will it' })
    expect(fetchMock).toHaveBeenCalledWith(
      'http://indexer.test/markets?category=sports&status=open&search=will+it',
    )
  })

  it('strips a trailing slash from the base URL', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: 'm1', question: 'Q' }))

    const client = new IndexerApiClient('http://indexer.test/')
    await client.getMarket('m1')
    expect(fetchMock).toHaveBeenCalledWith('http://indexer.test/markets/m1')
  })

  it('throws ApiError with the status on a non-ok response', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 404 })

    const client = new IndexerApiClient('http://indexer.test')
    await expect(client.getMarket('missing')).rejects.toBeInstanceOf(ApiError)
    await expect(client.getMarket('missing')).rejects.toMatchObject({ status: 404 })
  })

  it('tracks price history and positions endpoints', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse([{ timestamp: 't', price: 0.5 }]))
      .mockResolvedValueOnce(jsonResponse([{ marketId: 'm1', shares: 10 }]))

    const client = new IndexerApiClient('http://indexer.test')
    await client.getPriceHistory('m1')
    await client.getPositions('GABC')

    expect(fetchMock).toHaveBeenNthCalledWith(1, 'http://indexer.test/markets/m1/prices')
    expect(fetchMock).toHaveBeenNthCalledWith(2, 'http://indexer.test/positions/GABC')
  })
})