"use client"

import { useWalletContext } from "@/context/wallet-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, ExternalLink } from "lucide-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"

export default function WalletStatus() {
  const { connected, publicKey, walletName, balance } = useWalletContext()
  const { setVisible } = useWalletModal()
  const formattedPublicKey = publicKey ? publicKey.slice(0, 4) + "..." + publicKey.slice(-4) : "N/A"
  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet Status</CardTitle>
          <CardDescription>Connect your wallet to manage your tokens</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <Wallet className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No wallet connected</p>
            <Button onClick={() => setVisible(true)} className="gradient-border">
              Connect Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Connected</CardTitle>
        <CardDescription>Your Solana wallet is connected and ready to use</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Wallet</span>
            <span className="font-medium">{walletName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Address</span>
            <div className="flex items-center">
              <span className="font-medium">{formattedPublicKey}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 ml-1"
                onClick={() => window.open(`https://explorer.solana.com/address/${publicKey}`, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">View on Explorer</span>
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Balance</span>
            <span className="font-medium">{balance !== null ? `${balance} SOL` : "Loading..."}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
