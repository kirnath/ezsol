"use client"

import { useState, useEffect, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, MinusCircle, BarChart3, Wallet } from "lucide-react"
import { fetchLiquidityPools, fetchUserLiquidity, type LiquidityPool, type UserLiquidity } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"

export default function LiquidityPoolTable() {
  const [allPools, setAllPools] = useState<LiquidityPool[]>([])
  const [userPools, setUserPools] = useState<UserLiquidity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all-pools")
  const { toast } = useToast()

  // Mock wallet address - in a real app, this would come from your wallet connection
  const walletAddress = "demo_wallet"

  // Use useCallback to memoize the loadData function
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)

      // Fetch all pools
      const pools = await fetchLiquidityPools()
      setAllPools(pools)

      // Fetch user pools
      const userLiquidity = await fetchUserLiquidity(walletAddress)
      setUserPools(userLiquidity)
    } catch (error) {
      console.error("Error loading liquidity data:", error)
      // Don't show toast on every render
      // Only show it once when there's an actual error
      toast({
        title: "Error",
        description: "Failed to load liquidity pools. Using demo data instead.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [walletAddress]) // Remove toast from dependencies

  useEffect(() => {
    // Only load data once when component mounts
    loadData()

    // No cleanup needed for this simple case
  }, [loadData]) // loadData is memoized so this won't cause re-renders

  const formatUSD = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100)
  }

  // Find user pools with details
  const userPoolsWithDetails = userPools.map((userPool) => {
    const poolDetails = allPools.find((pool) => pool.id === userPool.pool_id)
    return {
      ...userPool,
      poolDetails,
    }
  })

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <Tabs defaultValue="all-pools" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="my-pools" className="flex items-center gap-2">
              <Wallet size={16} />
              My Pools
            </TabsTrigger>
            <TabsTrigger value="all-pools" className="flex items-center gap-2">
              <BarChart3 size={16} />
              All Pools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-pools">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-pulse text-center">
                  <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
                </div>
              </div>
            ) : userPoolsWithDetails.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pool</TableHead>
                    <TableHead>Your Liquidity</TableHead>
                    <TableHead>LP Tokens</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userPoolsWithDetails.map((userPool) => (
                    <TableRow key={userPool.id}>
                      <TableCell>
                        {userPool.poolDetails ? (
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {userPool.poolDetails.token_a_symbol}/{userPool.poolDetails.token_b_symbol}
                            </span>
                            <Badge variant="outline" className="w-fit mt-1">
                              {userPool.poolDetails.fee_tier}% fee
                            </Badge>
                          </div>
                        ) : (
                          <span>Unknown Pool</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>
                            {userPool.token_a_amount} {userPool.poolDetails?.token_a_symbol || "Token A"}
                          </span>
                          <span>
                            {userPool.token_b_amount} {userPool.poolDetails?.token_b_symbol || "Token B"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{userPool.lp_tokens}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <PlusCircle size={14} />
                            Add
                          </Button>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <MinusCircle size={14} />
                            Remove
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You don't have any liquidity positions yet</p>
                <Button onClick={() => setActiveTab("all-pools")}>View Available Pools</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="all-pools">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-pulse text-center">
                  <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pool</TableHead>
                    <TableHead>TVL</TableHead>
                    <TableHead>Volume (24h)</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allPools.map((pool) => (
                    <TableRow key={pool.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {pool.token_a_symbol}/{pool.token_b_symbol}
                          </span>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {pool.fee_tier}% fee
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatUSD(pool.total_liquidity_usd)}</TableCell>
                      <TableCell>{formatUSD(pool.volume_24h)}</TableCell>
                      <TableCell>{formatPercent(pool.fee_tier)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <PlusCircle size={14} />
                          Add Liquidity
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
