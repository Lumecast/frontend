const env = import.meta.env

export const config = {
  indexerApiUrl: env.VITE_INDEXER_API_URL ?? 'http://localhost:8080',
  sorobanRpcUrl: env.VITE_SOROBAN_RPC_URL ?? 'https://soroban-testnet.stellar.org',
  marketContractId: env.VITE_MARKET_CONTRACT_ID ?? '',
  usdcContractId: env.VITE_USDC_CONTRACT_ID ?? '',
  networkPassphrase:
    env.VITE_NETWORK_PASSPHRASE ?? 'Test SDF Network ; September 2015',
} as const