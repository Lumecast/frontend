import { useCallback, useState } from 'react'
import { useWallet } from '@/hooks/useWallet'
import {
  createMarketContract,
  prepareTransaction,
  createDisputeMarketOperation,
  signTransactionXdr,
  WalletError,
} from '@/lib/stellar'
import { config } from '@/lib/config'
import { rpc, TransactionBuilder } from '@stellar/stellar-sdk'

export interface DisputeMarketParams {
  marketId: string
  counterBond: string
}

export interface DisputeMarketResult {
  success: boolean
  txHash?: string
  error?: string
}

export function useDisputeMarket() {
  const { address, network, status } = useWallet()
  const [isDisputing, setIsDisputing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const executeDispute = useCallback(
    async ({ marketId, counterBond }: DisputeMarketParams): Promise<DisputeMarketResult> => {
      if (!address || status !== 'connected') {
        return { success: false, error: 'Wallet not connected' }
      }

      setError(null)
      setIsDisputing(true)

      try {
        const contract = createMarketContract()

        const operation = createDisputeMarketOperation(
          contract.contractId,
          address,
          marketId,
          counterBond,
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
        const message = err instanceof WalletError ? err.message : err instanceof Error ? err.message : 'Dispute failed'
        setError(message)
        return { success: false, error: message }
      } finally {
        setIsDisputing(false)
      }
    },
    [address, network, status],
  )

  return { executeDispute, isDisputing, error }
}