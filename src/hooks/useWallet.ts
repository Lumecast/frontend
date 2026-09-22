import { useCallback, useEffect, useState } from 'react'
import {
  connectWallet,
  getWalletNetwork,
  restoreWalletAddress,
} from '@/lib/stellar/wallet'

export type WalletStatus = 'disconnected' | 'connecting' | 'connected'

export interface UseWalletResult {
  address: string | null
  network: string | null
  status: WalletStatus
  error: string | null
  connect: () => Promise<void>
  disconnect: () => void
}

function toMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'An unknown wallet error occurred'
}

export function useWallet(): UseWalletResult {
  const [address, setAddress] = useState<string | null>(null)
  const [network, setNetwork] = useState<string | null>(null)
  const [status, setStatus] = useState<WalletStatus>('disconnected')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void restoreWalletAddress()
      .then(async (addr) => {
        if (cancelled || !addr) return
        const net = await getWalletNetwork().catch(() => null)
        if (cancelled) return
        setAddress(addr)
        setNetwork(net?.network ?? null)
        setStatus('connected')
      })
      .catch(() => {
        if (!cancelled) setStatus('disconnected')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const connect = useCallback(async () => {
    setError(null)
    setStatus('connecting')
    try {
      const info = await connectWallet()
      setAddress(info.address)
      setNetwork(info.network)
      setStatus('connected')
    } catch (err) {
      setStatus('disconnected')
      setError(toMessage(err))
    }
  }, [])

  const disconnect = useCallback(() => {
    setAddress(null)
    setNetwork(null)
    setStatus('disconnected')
    setError(null)
  }, [])

  return { address, network, status, error, connect, disconnect }
}