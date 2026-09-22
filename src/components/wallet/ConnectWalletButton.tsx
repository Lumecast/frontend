import { useWallet } from '@/hooks/useWallet'
import { shortenAddress } from '@/lib/stellar/wallet'
import { Button } from '@/components/ui/Button'

export function ConnectWalletButton() {
  const { address, status, error, connect, disconnect } = useWallet()

  if (status === 'connected' && address) {
    return (
      <div className="flex items-center gap-2">
        <span
          className="rounded-md border border-border bg-muted px-3 py-2 font-mono text-sm text-foreground"
          title={`Connected to ${address}`}
        >
          {shortenAddress(address)}
        </span>
        <Button variant="ghost" onClick={disconnect}>
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <>
      <Button
        variant="primary"
        disabled={status === 'connecting'}
        onClick={() => void connect()}
        title={error ?? undefined}
      >
        {status === 'connecting' ? 'Connecting…' : 'Connect Wallet'}
      </Button>
      {error ? (
        <span role="alert" className="sr-only">
          {error}
        </span>
      ) : null}
    </>
  )
}