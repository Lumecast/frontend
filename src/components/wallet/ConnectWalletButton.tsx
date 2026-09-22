import { useState } from 'react'
import { Button } from '@/components/ui/Button'

export function ConnectWalletButton() {
  const [address, setAddress] = useState<string | null>(null)

  return (
    <Button variant={address ? 'outline' : 'primary'} onClick={() => void setAddress('')}>
      {address ? 'Connected' : 'Connect Wallet'}
    </Button>
  )
}