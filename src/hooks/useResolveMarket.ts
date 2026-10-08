import { useCallback, useState } from 'react'
import { useWallet } from '@/hooks/useWallet'
import {
  createMarketContract,
  prepareTransaction,
  createResolveMarketOperation,
  signTransactionXdr,
  WalletError,
} from '@/lib/stellar'
import { config } from '@/lib/config'
import { rpc, TransactionBuilder } from '@stellar/stellar-sdk'

export interface ResolveMarketParams {
  marketId: string
  winningOutcomeIndex: number
}

export interface ResolveMarketResult {
  success: boolean
  txHash?: string
  error?: string
}

export function useResolveMarket() {
  const { address, network, status } = useWallet()
  const [isResolving, setIsResolving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const executeResolve = useCallback(
    async ({ marketId, winningOutcomeIndex }: ResolveMarketParams): Promise<ResolveMarketResult> => {
      if (!address || status !== 'connected') {
        return { success: false, error: 'Wallet not connected' }
      }

      setError(null)
      setIsResolving(true)

      try {
        const contract = createMarketContract()

        const operation = createResolveMarketOperation(
          contract.contractId,
          address,
          marketId,
          winningOutcomeIndex,
        )

        const preparedTx = await prepareTransaction(contract, address, operation)

        const txXdr = preparedTx.toEnvelope().toXDR('base64')
        const { signedTxXdr } = await signTransactionXdr(txXdr, {
          networkPassphrase: network ?? config.networkPassphrase,
          address,
        })

        const signedTx = TransactionBuilder.fromXdr(signedTxXdr, network ?? config.networkPassphrase)

        const server = new rpc.Server(config.sorobanRpcUrl)
        const sendResult = await server.sendTransaction(signedTx)

        if (sendResult.status === 'ERROR') {
          throw new Error(`Transaction failed: ${sendResult.errorResult}`)
        }

        let getResult = await server.getTransaction(sendResult.hash)
        while (getResult.status === 'NOT_FOUND') {
          await new Promise((r) => setTimeout(r, 2000))
          getResult = await server.getTransaction(sendResult.hash)
        }

        if (getResult.status === 'SUCCESS') {
          return { success: true, txHash: sendResult.hash }
        }

        throw new Error(`Transaction failed: ${getResult.resultXdr}`)
      } catch (err) {
        const message = err instanceof WalletError ? err.message : err instanceof Error ? err.message : 'Resolution failed'
        setError(message)
        return { success: false, error: message }
      } finally {
        setIsResolving(false)
      }
    },
    [address, network, status],
  )

  return { executeResolve, isResolving, error }
}