import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ConnectWalletButton } from '@/components/wallet/ConnectWalletButton'
import { useWallet } from '@/hooks/useWallet'

vi.mock('@/hooks/useWallet', () => ({
  useWallet: vi.fn(),
}))

const useWalletMock = vi.mocked(useWallet)

describe('ConnectWalletButton', () => {
  beforeEach(() => {
    useWalletMock.mockReturnValue({
      address: null,
      network: null,
      status: 'disconnected',
      error: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
    })
  })

  it('shows Connect Wallet when disconnected and connects on click', async () => {
    const connect = vi.fn().mockResolvedValue(undefined)
    useWalletMock.mockReturnValue({
      address: null,
      network: null,
      status: 'disconnected',
      error: null,
      connect,
      disconnect: vi.fn(),
    })

    render(<ConnectWalletButton />)
    await userEvent.click(screen.getByRole('button', { name: 'Connect Wallet' }))
    expect(connect).toHaveBeenCalledTimes(1)
  })

  it('shows a disabled button while connecting', () => {
    useWalletMock.mockReturnValue({
      address: null,
      network: null,
      status: 'connecting',
      error: null,
      connect: vi.fn(),
      disconnect: vi.fn(),
    })

    render(<ConnectWalletButton />)
    expect(screen.getByRole('button', { name: 'Connecting…' })).toBeDisabled()
  })

  it('shows the shortened address and disconnects', async () => {
    const disconnect = vi.fn()
    useWalletMock.mockReturnValue({
      address: 'GABCDEFGHIJKLMNOPQRSTUVWXYZ12345678',
      network: 'TESTNET',
      status: 'connected',
      error: null,
      connect: vi.fn(),
      disconnect,
    })

    render(<ConnectWalletButton />)
    expect(screen.getByText('GABC…5678')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Disconnect' }))
    expect(disconnect).toHaveBeenCalledTimes(1)
  })
})