import { useState } from 'react'

export function ConnectWalletButton() {
  const [address, setAddress] = useState<string | null>(null)

  return (
    <button
      type="button"
      onClick={() => void setAddress('')}
      className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
    >
      {address ? 'Connected' : 'Connect Wallet'}
    </button>
  )
}