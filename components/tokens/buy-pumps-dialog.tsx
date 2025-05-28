"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Coins, Minus, Plus, Zap } from "lucide-react"
import { useToastNotification } from "@/components/toast-notification"
import { supabase } from "@/lib/supabase-client"
import { useWalletContext } from "@/context/wallet-context"

interface BuyPumpsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tokenId: string
  tokenName: string
  tokenSymbol: string
  userWallet: string
  onPumpsPurchased?: () => void
}

export function BuyPumpsDialog({
  open,
  onOpenChange,
  tokenId,
  tokenName,
  tokenSymbol,
  userWallet,
  onPumpsPurchased,
}: BuyPumpsDialogProps) {
  const [pumpCount, setPumpCount] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToastNotification()
  const { connected, publicKey, connection, network } = useWalletContext()
  const PUMP_PRICE = 0.002 // SOL per pump
  const totalCost = pumpCount * PUMP_PRICE

  const handlePumpCountChange = (value: string) => {
    const num = Number.parseInt(value)
    if (!isNaN(num) && num > 0 && num <= 1000) {
      setPumpCount(num)
    }
  }

  const incrementPumps = () => {
    if (pumpCount < 1000) {
      setPumpCount(pumpCount + 1)
    }
  }

  const decrementPumps = () => {
    if (pumpCount > 1) {
      setPumpCount(pumpCount - 1)
    }
  }

  const handlePurchase = async () => {
    //dev mode
    // return toast.success({
    //   title: "Coming Soon!",
    //   description: `This feature is coming soon.`,
    // })
    if (!connected) {
      toast.error({
        title: "Wallet not connected",
        description: "Please connect your wallet to purchase pumps",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate Solana payment processing
      // In a real implementation, this would integrate with Solana wallet
      const mockTxSignature = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Record multiple pumps
      const pumpPromises = []
      for (let i = 0; i < pumpCount; i++) {
        pumpPromises.push(
          supabase.rpc("record_pump", {
            p_token_id: tokenId,
            p_user_wallet: userWallet,
            p_pump_type: "paid",
            p_sol_amount: PUMP_PRICE,
            p_transaction_signature: `${mockTxSignature}_${i}`,
          }),
        )
      }

      const results = await Promise.all(pumpPromises)

      // Check if any failed
      const failedPumps = results.filter((result) => result.error)
      if (failedPumps.length > 0) {
        console.error("Some pumps failed:", failedPumps)
        toast.error({
          title: "Purchase Partially Failed",
          description: `${pumpCount - failedPumps.length} pumps purchased successfully, ${failedPumps.length} failed.`,
        })
      } else {
        toast.success({
          title: "Pumps Purchased! 💎",
          description: `Successfully purchased ${pumpCount} pumps for ${totalCost.toFixed(3)} SOL`,
        })
      }

      // Call callback to refresh data
      onPumpsPurchased?.()

      // Close dialog
      onOpenChange(false)
      setPumpCount(1)
    } catch (error) {
      console.error("Error purchasing pumps:", error)
      toast.error({
        title: "Purchase Failed",
        description: "Failed to process pump purchase. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setPumpCount(1)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-orange-500" />
            Buy Pumps
          </DialogTitle>
          <DialogDescription>
            Purchase additional pumps for{" "}
            <span className="font-semibold">
              {tokenName} ({tokenSymbol})
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Pump Count Selector */}
          <div className="grid gap-3">
            <Label htmlFor="pump-count">Number of Pumps</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={decrementPumps}
                disabled={pumpCount <= 1}
                className="h-10 w-10 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="pump-count"
                type="number"
                min="1"
                max="1000"
                value={pumpCount}
                onChange={(e) => handlePumpCountChange(e.target.value)}
                className="text-center font-semibold"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={incrementPumps}
                disabled={pumpCount >= 1000}
                className="h-10 w-10 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Select Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[5, 10, 25, 50].map((count) => (
              <Button
                key={count}
                variant="outline"
                size="sm"
                onClick={() => setPumpCount(count)}
                className={pumpCount === count ? "border-violet-500 bg-violet-500/10" : ""}
              >
                {count}
              </Button>
            ))}
          </div>

          {/* Cost Breakdown */}
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Price per pump:</span>
              <span className="font-mono">{PUMP_PRICE.toFixed(3)} SOL</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Quantity:</span>
              <span className="font-semibold">{pumpCount} pumps</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-semibold">
                <span>Total Cost:</span>
                <span className="font-mono text-lg">{totalCost.toFixed(3)} SOL</span>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>Instant pump boost for your favorite token</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-orange-500" />
              <span>Support the token's ranking and visibility</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handlePurchase}
            disabled={isLoading}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Coins className="mr-2 h-4 w-4" />
                Buy {pumpCount} Pump{pumpCount > 1 ? "s" : ""} for {totalCost.toFixed(3)} SOL
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
