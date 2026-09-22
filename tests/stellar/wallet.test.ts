import { beforeEach, describe, expect, it, vi } from 'vitest'
import { config } from '@/lib/config'
import {
  connectWallet,
  shortenAddress,
  WalletError,
} from '@/lib/stellar/wallet'

const freighter = vi.hoisted(() => ({
  requestAccess: vi.fn(),
  getNetwork: vi.fn(),
  getAddress: vi.fn(),
  isAllowed: vi.fn(),
  isConnected: vi.fn(),
  signTransaction: vi.fn(),
}))

vi.mock('@stellar/freighter-api', () => freighter)

describe('connectWallet', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the address and network on grant', async () => {
    freighter.requestAccess.mockResolvedValue({ address: 'GABC', error: null })
    freighter.getNetwork.mockResolvedValue({
      network: 'TESTNET',
      networkPassphrase: config.networkPassphrase,
      error: null,
    })

    await expect(connectWallet()).resolves.toEqual({
      address: 'GABC',
      network: 'TESTNET',
      networkPassphrase: config.networkPassphrase,
    })
  })

  it('throws WalletError when access is denied or missing', async () => {
    freighter.requestAccess.mockResolvedValue({
      address: '',
      error: { code: 'USER_DENIED', message: 'Connection refused' },
    })

    await expect(connectWallet()).rejects.toThrow(WalletError)
  })

  it('throws WalletError when the wallet network mismatches the app', async () => {
    freighter.requestAccess.mockResolvedValue({ address: 'GABC', error: null })
    freighter.getNetwork.mockResolvedValue({
      network: 'PUBLIC',
      networkPassphrase: 'Public Global Stellar Network ; September 2015',
      error: null,
    })

    await expect(connectWallet()).rejects.toThrow(WalletError)
  })
})

describe('shortenAddress', () => {
  it('truncates a public key to 4 chars each side', () => {
    expect(shortenAddress('GABCDEFGHIJKLMNOPQRSTUVWXYZ12345678')).toBe('GABC…5678')
  })

  it('leaves short strings intact', () => {
    expect(shortenAddress('GABC1234')).toBe('GABC1234')
  })
})