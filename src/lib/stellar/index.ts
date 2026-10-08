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

export {
  createMarketContract,
  prepareTransaction,
  simulateTransaction,
  createBuySharesOperation,
  createSellSharesOperation,
  createClaimWinningsOperation,
  createResolveMarketOperation,
  createCreateMarketOperation,
  createDisputeMarketOperation,
} from '@/lib/stellar/contracts'
export type { MarketContract } from '@/lib/stellar/contracts'