"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { TokenData } from "@/lib/token-service"
import { useToast } from "@/hooks/use-toast"
import { createSerumLiquidityPool } from "@/lib/serum-service"
import { useWalletContext } from "@/context/wallet-context"
import { PublicKey } from "@solana/web3.js"

interface LiquidityPoolFormProps {
  userTokens: TokenData[]
  onCancel: () => void
  onSuccess: () => void
}

export function LiquidityPoolForm({ userTokens, onCancel, onSuccess }: LiquidityPoolFormProps) {
  const [selectedToken, setSelectedToken] = useState<string>("")
  const [secondToken, setSecondToken] = useState<string>("SOL")
  const [tokenAmount, setTokenAmount] = useState<string>("")
  const [secondTokenAmount, setSecondTokenAmount] = useState<string>("")
  const [feeTier, setFeeTier] = useState<string>("0.3")
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()
  const { connected, publicKey, connection } = useWalletContext()

  const handleCreatePool = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedToken || !secondToken || !tokenAmount || !secondTokenAmount) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Convert fee tier from percentage to basis points
      const feeTierBps = Number.parseFloat(feeTier) * 100

      // Create liquidity pool using Serum
      const result = await createSerumLiquidityPool({
        connection: connection!,
        wallet: { publicKey }, // Simplified wallet object
        baseTokenMint: new PublicKey(selectedToken),
        quoteTokenMint: new PublicKey(
          secondToken === "SOL"
            ? "So11111111111111111111111111111111111111112" // SOL mint address
            : "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        ), // USDC mint address
        baseTokenAmount: Number.parseFloat(tokenAmount),
        quoteTokenAmount: Number.parseFloat(secondTokenAmount),
        feeTier: feeTierBps,
      })

      if (result.success) {
        toast({
          title: "Liquidity Pool Created",
          description: `Your liquidity pool has been successfully created. Market ID: ${result.marketId}`,
        })
        onSuccess()
      } else {
        throw new Error(result.error || "Failed to create liquidity pool")
      }
    } catch (error) {
      console.error("Error creating pool:", error)
      toast({
        title: "Error",
        description: "Failed to create liquidity pool. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Liquidity for Your Token</CardTitle>
        <CardDescription>Create a liquidity pool by pairing your token with SOL or USDC</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreatePool} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label>Your Token</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <Select value={selectedToken} onValueChange={setSelectedToken}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your token" />
                        </SelectTrigger>
                        <SelectContent>
                          {userTokens.map((token) => (
                            <SelectItem key={token.mintAddress} value={token.mintAddress}>
                              {token.symbol} - {token.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Info className="h-4 w-4 absolute right-10 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px]">Only tokens you've created are available for adding liquidity</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value)}
                  className="pr-[180px]"
                />
                <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs px-2 bg-muted hover:bg-muted/50"
                    onClick={() => setTokenAmount("500000")} // 50% of mock balance
                  >
                    50%
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs px-2 bg-muted hover:bg-muted/50"
                    onClick={() => setTokenAmount("900000")} // 90% of mock balance
                  >
                    90%
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs px-2 bg-muted hover:bg-muted/50"
                    onClick={() => setTokenAmount("1000000")} // Max of mock balance
                  >
                    Max
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Balance: {selectedToken ? "1,000,000 Tokens" : "Select a token"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Pair With</Label>
              <Select value={secondToken} onValueChange={setSecondToken}>
                <SelectTrigger>
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOL">SOL - Solana</SelectItem>
                  <SelectItem value="USDC">USDC - USD Coin</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={secondTokenAmount}
                  onChange={(e) => setSecondTokenAmount(e.target.value)}
                  className="pr-[180px]"
                />
                <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs px-2 bg-muted hover:bg-muted/50"
                    onClick={() => {
                      if (secondToken === "SOL") {
                        setSecondTokenAmount("5.25") // 50% of mock SOL balance
                      } else {
                        setSecondTokenAmount("52.5") // 50% of mock USDC balance
                      }
                    }}
                  >
                    50%
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs px-2 bg-muted hover:bg-muted/50"
                    onClick={() => {
                      if (secondToken === "SOL") {
                        setSecondTokenAmount("9.45") // 90% of mock SOL balance
                      } else {
                        setSecondTokenAmount("94.5") // 90% of mock USDC balance
                      }
                    }}
                  >
                    90%
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs px-2 bg-muted hover:bg-muted/50"
                    onClick={() => {
                      if (secondToken === "SOL") {
                        setSecondTokenAmount("10.5") // Max of mock SOL balance
                      } else {
                        setSecondTokenAmount("105.0") // Max of mock USDC balance
                      }
                    }}
                  >
                    Max
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Balance: {secondToken === "SOL" ? "10.5 SOL" : "105.0 USDC"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Fee Tier</Label>
              <Select value={feeTier} onValueChange={setFeeTier}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fee tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.01">0.01% - Very Low</SelectItem>
                  <SelectItem value="0.05">0.05% - Low</SelectItem>
                  <SelectItem value="0.3">0.3% - Medium</SelectItem>
                  <SelectItem value="1.0">1.0% - High</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Higher fees may attract more traders for volatile pairs</p>
            </div>
          </div>

          <Alert className="bg-muted/50">
            <div className="space-y-2">
              <h3 className="font-medium">Important Information</h3>
              <p className="text-sm">
                Adding liquidity pairs your token with {secondToken}, creating a trading pool where users can swap
                between the two tokens. You will receive LP tokens representing your share of the pool.
              </p>
            </div>
          </Alert>
          <div className="flex space-x-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Creating Liquidity Pool..." : "Create Liquidity Pool"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
