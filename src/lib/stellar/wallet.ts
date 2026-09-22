import {
  getAddress,
  getNetwork,
  isAllowed,
  isConnected,
  requestAccess,
  signTransaction,
} from '@stellar/freighter-api'
import { config } from '@/lib/config'

export class WalletError extends Error {
  readonly code?: string

  constructor(message: string, code?: string) {
    super(message)
    this.name = 'WalletError'
    this.code = code
  }
}

export interface NetworkInfo {
  /** Freighter's network key, e.g. 'TESTNET' or 'PUBLIC'. */
  network: string
  networkPassphrase: string
}

export interface WalletInfo extends NetworkInfo {
  address: string
}

function firstMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'An unknown wallet error occurred'
}

/** True when running inside a browser with a Freighter-accessible environment. */
export function isWalletAvailable(): Promise<boolean> {
  return isConnected()
    .then((res) => res.isConnected)
    .catch(() => false)
}

export async function restoreWalletAddress(): Promise<string | null> {
  const allowed = await isAllowed().catch(() => ({ isAllowed: false }))
  if (!allowed.isAllowed) return null
  const { address, error } = await getAddress().catch(() => ({ address: '', error: null }))
  if (error || !address) return null
  return address
}

export async function getWalletNetwork(): Promise<NetworkInfo> {
  const { network, networkPassphrase, error } = await getNetwork()
  if (error || !networkPassphrase) {
    throw new WalletError(error?.message ?? 'Could not read the wallet network', error?.code)
  }
  return { network, networkPassphrase }
}

export function assertNetworkMatches(network: NetworkInfo): void {
  if (network.networkPassphrase !== config.networkPassphrase) {
    throw new WalletError(
      `Wallet is on ${network.network} but this app expects ${config.networkPassphrase}. Switch networks in Freighter and try again.`,
    )
  }
}

export async function connectWallet(): Promise<WalletInfo> {
  const { address, error } = await requestAccess()
  if (error || !address) {
    throw new WalletError(
      error?.message ?? 'Connection to Freighter was not granted.',
      error?.code,
    )
  }
  const network = await getWalletNetwork()
  assertNetworkMatches(network)
  return { address, ...network }
}

export interface Signature {
  signedTxXdr: string
  signerAddress: string
}

export async function signTransactionXdr(
  transactionXdr: string,
  opts?: { networkPassphrase?: string; address?: string },
): Promise<Signature> {
  const { signedTxXdr, signerAddress, error } = await signTransaction(transactionXdr, {
    networkPassphrase: opts?.networkPassphrase ?? config.networkPassphrase,
    address: opts?.address,
  })
  if (error || !signedTxXdr) {
    throw new WalletError(error?.message ?? 'Transaction signing was rejected.', error?.code)
  }
  return { signedTxXdr, signerAddress }
}

/** Truncate a public key for display, e.g. GABCD...WXYZ. */
export function shortenAddress(address: string, side = 4): string {
  if (address.length <= side * 2) return address
  return `${address.slice(0, side)}…${address.slice(-side)}`
}

export { firstMessage }