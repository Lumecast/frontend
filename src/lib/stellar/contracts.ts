import { config } from '@/lib/config'
import { Contract, rpc, xdr, TransactionBuilder, BASE_FEE, Address, nativeToScVal, Transaction } from '@stellar/stellar-sdk'

export interface MarketContract {
  contractId: string
  rpcUrl: string
}

export function createMarketContract(): MarketContract {
  return {
    contractId: config.marketContractId,
    rpcUrl: config.sorobanRpcUrl,
  }
}

export async function simulateTransaction(
  contract: MarketContract,
  tx: Transaction,
): Promise<rpc.Api.SimulateTransactionResponse> {
  const server = new rpc.Server(contract.rpcUrl)
  const simulation = await server.simulateTransaction(tx)
  return simulation
}

export async function prepareTransaction(
  contract: MarketContract,
  sourceAccount: string,
  operation: xdr.Operation,
): Promise<Transaction> {
  const server = new rpc.Server(contract.rpcUrl)
  const account = await server.getAccount(sourceAccount)

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: config.networkPassphrase,
  })
    .addOperation(operation)
    .setTimeout(300)
    .build()

  const simulation = await simulateTransaction(contract, tx)
  if (rpc.Api.isSimulationError(simulation)) {
    throw new Error(`Simulation failed: ${simulation.error}`)
  }

  const preparedTx = rpc.assembleTransaction(tx, simulation).build()
  return preparedTx
}

function toScAddress(address: string): xdr.ScVal {
  return nativeToScVal(new Address(address))
}

function toI128(value: string): xdr.ScVal {
  return nativeToScVal(BigInt(value), { type: 'i128' })
}

function toU64(value: number | string): xdr.ScVal {
  return nativeToScVal(BigInt(value), { type: 'u64' })
}

function toU32(value: number): xdr.ScVal {
  return nativeToScVal(value, { type: 'u32' })
}

export function createBuySharesOperation(
  contractId: string,
  buyer: string,
  marketId: string,
  outcomeIndex: number,
  shares: string,
): xdr.Operation {
  const contract = new Contract(contractId)
  return contract.call(
    'buy_shares',
    toScAddress(buyer),
    nativeToScVal(marketId),
    toU32(outcomeIndex),
    toI128(shares),
  )
}

export function createSellSharesOperation(
  contractId: string,
  seller: string,
  marketId: string,
  outcomeIndex: number,
  shares: string,
): xdr.Operation {
  const contract = new Contract(contractId)
  return contract.call(
    'sell_shares',
    toScAddress(seller),
    nativeToScVal(marketId),
    toU32(outcomeIndex),
    toI128(shares),
  )
}

export function createClaimWinningsOperation(
  contractId: string,
  claimant: string,
  marketId: string,
): xdr.Operation {
  const contract = new Contract(contractId)
  return contract.call(
    'claim_winnings',
    toScAddress(claimant),
    nativeToScVal(marketId),
  )
}

export function createResolveMarketOperation(
  contractId: string,
  resolver: string,
  marketId: string,
  winningOutcomeIndex: number,
): xdr.Operation {
  const contract = new Contract(contractId)
  return contract.call(
    'resolve_market',
    toScAddress(resolver),
    nativeToScVal(marketId),
    toU32(winningOutcomeIndex),
  )
}

export function createCreateMarketOperation(
  contractId: string,
  creator: string,
  question: string,
  outcomes: string[],
  closeTime: number,
  resolutionTime: number,
  resolver: string,
  category: string,
): xdr.Operation {
  const contract = new Contract(contractId)
  return contract.call(
    'create_market',
    toScAddress(creator),
    nativeToScVal(question),
    nativeToScVal(outcomes),
    toU64(closeTime),
    toU64(resolutionTime),
    toScAddress(resolver),
    nativeToScVal(category),
  )
}