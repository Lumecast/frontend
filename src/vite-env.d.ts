/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INDEXER_API_URL?: string
  readonly VITE_SOROBAN_RPC_URL?: string
  readonly VITE_MARKET_CONTRACT_ID?: string
  readonly VITE_USDC_CONTRACT_ID?: string
  readonly VITE_NETWORK_PASSPHRASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}