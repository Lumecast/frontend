import { useCallback, useState } from 'react'
import { useWallet } from '@/hooks/useWallet'
import {
  createMarketContract,
  prepareTransaction,
  createBuySharesOperation,
  createSellSharesOperation,
  signTransactionXdr,
  WalletError,
} from '@/lib/stellar'
import { config } from '@/lib/config'
import { rpc, TransactionBuilder } from '@stellar/stellar-sdk'

export type TradeAction = 'buy' | 'sell'

export interface TradeParams {
  marketId: string
  outcomeIndex: number
  shares: string
  action: TradeAction
}

export interface TradeResult {
  success: boolean
  txHash?: string
  error?: string
}

export function useTrade() {
  const { address, network, status } = useWallet()
  const [isTrading, setIsTrading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const executeTrade = useCallback(
    async ({ marketId, outcomeIndex, shares, action }: TradeParams): Promise<TradeResult> => {
      if (!address || status !== 'connected') {
        return { success: false, error: 'Wallet not connected' }
      }

      setError(null)
      setIsTrading(true)

      try {
        const contract = createMarketContract()

        const operation =
          action === 'buy'
            ? createBuySharesOperation(contract.contractId, address, marketId, outcomeIndex, shares)
            : createSellSharesOperation(contract.contractId, address, marketId, outcomeIndex, shares)

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
        const message = err instanceof WalletError ? err.message : err instanceof Error ? err.message : 'Trade failed'
        setError(message)
        return { success: false, error: message }
      } finally {
        setIsTrading(false)
      }
    },
    [address, network, status],
  )

  return { executeTrade, isTrading, error }
}