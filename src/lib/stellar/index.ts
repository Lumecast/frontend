export {
  WalletError,
  assertNetworkMatches,
  connectWallet,
  getWalletNetwork,
  isWalletAvailable,
  restoreWalletAddress,
  shortenAddress,
  signTransactionXdr,
} from '@/lib/stellar/wallet'
export type { NetworkInfo, Signature, WalletInfo } from '@/lib/stellar/wallet'