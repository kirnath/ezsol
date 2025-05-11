"use client"

import { useState } from "react"
import { useWalletContext } from "@/context/wallet-context"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface WalletButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  className?: string
}

export default function WalletButton({ variant = "outline", className }: WalletButtonProps) {
  const { connected, connecting, publicKey, walletName, balance, disconnectWallet } = useWalletContext()
  const { wallets } = useWallet()
  const { setVisible } = useWalletModal()
  const [copied, setCopied] = useState(false)

  // Handle wallet connection
  const handleConnect = () => {
    setVisible(true)
  }

  // Handle wallet disconnection
  const handleDisconnect = () => {
    disconnectWallet()
  }

  // Copy address to clipboard
  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey)
      setCopied(true)

      setTimeout(() => setCopied(false), 2000)
    }
  }

  // If connecting, show loading state
  if (connecting) {
    return (
      <Button variant={variant} className={cn("gradient-border", className)} disabled>
        <span className="animate-pulse">Connecting...</span>
      </Button>
    )
  }

  // If connected, show wallet info
  if (connected && publicKey) {
    const formattedPublicKey = publicKey.slice(0, 4) + "..." + publicKey.slice(-4)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} className={cn("gradient-border", className)}>
            <div className="flex items-center">
              <Wallet className="mr-2 h-4 w-4" />
              <span className="mr-1">{formattedPublicKey}</span>
              {balance !== null && <span className="text-xs text-muted-foreground ml-1">({balance} SOL)</span>}
              <ChevronDown className="ml-2 h-4 w-4" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span>{walletName}</span>
              <span className="text-xs text-muted-foreground">{formattedPublicKey}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyAddress}>{copied ? "Copied!" : "Copy Address"}</DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.open(`https://explorer.solana.com/address/${publicKey}`, "_blank")}>
            View on Explorer
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDisconnect} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // If not connected, show connect button
  return (
    <Button variant={variant} className={cn("gradient-border", className)} onClick={handleConnect}>
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  )
}
