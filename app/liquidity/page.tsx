"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useWalletContext } from "@/context/wallet-context"
import { fetchCreatedTokens, type TokenData } from "@/lib/token-service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock data for user liquidity positions
const mockUserPositions = [
  {
    id: "1",
    poolId: "1",
    token1: "YOUR_TOKEN",
    token2: "SOL",
    token1Amount: "1000000",
    token2Amount: "5.0",
    share: "100%",
    value: "$500.00",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    poolId: "2",
    token1: "YOUR_TOKEN2",
    token2: "USDC",
    token1Amount: "500000",
    token2Amount: "250.0",
    share: "100%",
    value: "$250.00",
    createdAt: new Date().toISOString(),
  },
]

export default function LiquidityPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [userTokens, setUserTokens] = useState<TokenData[]>([])
  const [selectedToken, setSelectedToken] = useState<string>("")
  const [secondToken, setSecondToken] = useState<string>("SOL")
  const [tokenAmount, setTokenAmount] = useState<string>("")
  const [secondTokenAmount, setSecondTokenAmount] = useState<string>("")
  const [feeTier, setFeeTier] = useState<string>("0.3")
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()
  const { connected, publicKey, connection, network } = useWalletContext()

  // Fetch user's created tokens
  useEffect(() => {
    const loadUserTokens = async () => {
      if (connected && publicKey && connection) {
        try {
          const tokens = await fetchCreatedTokens(connection, publicKey, network)
          setUserTokens(tokens)
        } catch (error) {
          console.error("Error loading user tokens:", error)
        }
      }
    }

    loadUserTokens()
  }, [connected, publicKey, connection, network])

  // If no tokens are available, use mock data for demonstration
  useEffect(() => {
    if (userTokens.length === 0) {
      // Mock tokens for demonstration
      setUserTokens([
        {
          name: "My Sample Token",
          symbol: "MST",
          mintAddress: "TokenMint123456789",
          decimals: 9,
          createdAt: new Date().toISOString(),
        },
        {
          name: "Another Token",
          symbol: "ANT",
          mintAddress: "TokenMint987654321",
          decimals: 9,
          createdAt: new Date().toISOString(),
        },
      ])
    }
  }, [userTokens])

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm)
  }

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Liquidity Pool Created",
        description: "Your liquidity pool has been successfully created",
      })

      // Reset form and go back to pools list
      setSelectedToken("")
      setSecondToken("SOL")
      setTokenAmount("")
      setSecondTokenAmount("")
      setFeeTier("0.3")
      setShowCreateForm(false)
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

  // Check if user is connected
  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-24">
        <Card>
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>Please connect your wallet to manage your token liquidity</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-6">
            <Button>Connect Wallet</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {showCreateForm ? "Add Liquidity for Your Token" : "Your Token Liquidity"}
          </h1>
          <Button onClick={toggleCreateForm}>
            {showCreateForm ? (
              <>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pools
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> Add Liquidity
              </>
            )}
          </Button>
        </div>

        {!showCreateForm ? (
          <>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                This page allows you to add liquidity for tokens you've created. Adding liquidity pairs your token with
                SOL or USDC to create a trading pool.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">{userTokens.length}</CardTitle>
                  <CardDescription>Your Created Tokens</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">{mockUserPositions.length}</CardTitle>
                  <CardDescription>Active Liquidity Pools</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">$750</CardTitle>
                  <CardDescription>Total Liquidity Value</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">2</CardTitle>
                  <CardDescription>Paired Tokens</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <Tabs defaultValue="my-pools">
              <TabsList>
                <TabsTrigger value="my-pools">My Liquidity Pools</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="my-pools">
                <div className="rounded-md border">
                  <div className="p-4">
                    <h2 className="text-xl font-semibold">Your Token Liquidity Pools</h2>
                    <p className="text-sm text-muted-foreground">Manage liquidity for your created tokens</p>
                  </div>

                  {mockUserPositions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="px-4 py-3 text-left text-sm font-medium">Pool</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Liquidity</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Share</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Value</th>
                            <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockUserPositions.map((position) => (
                            <tr key={position.id} className="border-b">
                              <td className="px-4 py-3 text-sm">
                                {position.token1}/{position.token2}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {position.token1Amount} {position.token1} + {position.token2Amount} {position.token2}
                              </td>
                              <td className="px-4 py-3 text-sm">{position.share}</td>
                              <td className="px-4 py-3 text-sm">{position.value}</td>
                              <td className="px-4 py-3 text-right">
                                <Button variant="outline" size="sm" className="mr-2">
                                  Add
                                </Button>
                                <Button variant="outline" size="sm">
                                  Remove
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground mb-4">
                        You haven't added liquidity to any of your tokens yet
                      </p>
                      <Button onClick={toggleCreateForm}>Add Liquidity</Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics</CardTitle>
                    <CardDescription>
                      Detailed analytics for your token liquidity pools will be available soon.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center border rounded-md">
                      <p className="text-muted-foreground">Analytics charts coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Add Liquidity for Your Token</CardTitle>
              <CardDescription>Create a liquidity pool by pairing your token with SOL or USDC</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreatePool} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(e.target.value)}
                    />
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
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={secondTokenAmount}
                      onChange={(e) => setSecondTokenAmount(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Balance: {secondToken === "SOL" ? "10.5 SOL" : "105.0 USDC"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Fee Tier</Label>
                  <div className="grid grid-cols-4 gap-2">
                    <div
                      className={`border rounded-md p-2 text-center cursor-pointer ${feeTier === "0.01" ? "bg-primary/10" : "hover:bg-primary/10"}`}
                      onClick={() => setFeeTier("0.01")}
                    >
                      <div className="font-medium">0.01%</div>
                      <div className="text-xs text-muted-foreground">Best for stable pairs</div>
                    </div>
                    <div
                      className={`border rounded-md p-2 text-center cursor-pointer ${feeTier === "0.05" ? "bg-primary/10" : "hover:bg-primary/10"}`}
                      onClick={() => setFeeTier("0.05")}
                    >
                      <div className="font-medium">0.05%</div>
                      <div className="text-xs text-muted-foreground">Best for stable pairs</div>
                    </div>
                    <div
                      className={`border rounded-md p-2 text-center cursor-pointer ${feeTier === "0.3" ? "bg-primary/10" : "hover:bg-primary/10"}`}
                      onClick={() => setFeeTier("0.3")}
                    >
                      <div className="font-medium">0.3%</div>
                      <div className="text-xs text-muted-foreground">Best for most pairs</div>
                    </div>
                    <div
                      className={`border rounded-md p-2 text-center cursor-pointer ${feeTier === "1" ? "bg-primary/10" : "hover:bg-primary/10"}`}
                      onClick={() => setFeeTier("1")}
                    >
                      <div className="font-medium">1%</div>
                      <div className="text-xs text-muted-foreground">Best for exotic pairs</div>
                    </div>
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

                <div className="bg-muted/50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Pool Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Pool share:</span>
                      <span>100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fee tier:</span>
                      <span>{feeTier}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>LP tokens:</span>
                      <span>{tokenAmount && secondTokenAmount ? "Calculated on-chain" : "Enter amounts"}</span>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Liquidity Pool..." : "Create Liquidity Pool"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
