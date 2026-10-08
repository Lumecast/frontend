import { useCallback, useState } from 'react'
import { useWallet } from '@/hooks/useWallet'
import {
  createMarketContract,
  prepareTransaction,
  createCreateMarketOperation,
  signTransactionXdr,
  WalletError,
} from '@/lib/stellar'
import { config } from '@/lib/config'
import { rpc, TransactionBuilder } from '@stellar/stellar-sdk'

export interface CreateMarketParams {
  question: string
  outcomes: string[]
  closeTime: number
  resolutionTime: number
  resolver: string
  category: string
}

export interface CreateMarketResult {
  success: boolean
  txHash?: string
  error?: string
}

export function useCreateMarket() {
  const { address, network, status } = useWallet()
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const executeCreate = useCallback(
    async (params: CreateMarketParams): Promise<CreateMarketResult> => {
      if (!address || status !== 'connected') {
        return { success: false, error: 'Wallet not connected' }
      }

      setError(null)
      setIsCreating(true)

      try {
        const contract = createMarketContract()

        const operation = createCreateMarketOperation(
          contract.contractId,
          address,
          params.question,
          params.outcomes,
          params.closeTime,
          params.resolutionTime,
          params.resolver,
          params.category,
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
        const message = err instanceof WalletError ? err.message : err instanceof Error ? err.message : 'Market creation failed'
        setError(message)
        return { success: false, error: message }
      } finally {
        setIsCreating(false)
      }
    },
    [address, network, status],
  )

  return { executeCreate, isCreating, error }
}