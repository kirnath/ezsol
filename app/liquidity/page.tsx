"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

// Mock data for liquidity pools
const mockPools = [
  {
    id: "1",
    token1: "SOL",
    token2: "USDC",
    token1Amount: "10.5",
    token2Amount: "105.0",
    apr: "12.5%",
    totalLiquidity: "$210.00",
    volume24h: "$1,250.00",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    token1: "SOL",
    token2: "BONK",
    token1Amount: "5.2",
    token2Amount: "1000000",
    apr: "18.2%",
    totalLiquidity: "$104.00",
    volume24h: "$520.00",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    token1: "USDC",
    token2: "BONK",
    token1Amount: "200",
    token2Amount: "40000000",
    apr: "8.5%",
    totalLiquidity: "$200.00",
    volume24h: "$850.00",
    createdAt: new Date().toISOString(),
  },
]

// Mock data for user liquidity positions
const mockUserPositions = [
  {
    id: "1",
    poolId: "1",
    token1: "SOL",
    token2: "USDC",
    token1Amount: "2.5",
    token2Amount: "25.0",
    share: "5.2%",
    value: "$50.00",
    createdAt: new Date().toISOString(),
  },
]

export default function LiquidityPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [setupGuideOpen, setSetupGuideOpen] = useState(true)
  const { toast } = useToast()

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm)
  }


  return (
    <div className="container mx-auto px-4 py-24">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{showCreateForm ? "Create Liquidity Pool" : "Liquidity Pools"}</h1>
          <Button onClick={toggleCreateForm}>
            {showCreateForm ? (
              <>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pools
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> Create Pool
              </>
            )}
          </Button>
        </div>


        {!showCreateForm ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">$515K</CardTitle>
                  <CardDescription>Total Value Locked</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">$24.5K</CardTitle>
                  <CardDescription>24h Volume</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">$1.2K</CardTitle>
                  <CardDescription>24h Fees</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">12</CardTitle>
                  <CardDescription>Active Pools</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <Tabs defaultValue="my-pools">
              <TabsList>
                <TabsTrigger value="my-pools">My Pools</TabsTrigger>
                <TabsTrigger value="all-pools">All Pools</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="my-pools">
                <div className="rounded-md border">
                  <div className="p-4">
                    <h2 className="text-xl font-semibold">Your Liquidity Positions</h2>
                    <p className="text-sm text-muted-foreground">Manage your liquidity positions across all pools</p>
                  </div>

                  {mockUserPositions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="px-4 py-3 text-left text-sm font-medium">Pool</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Your Liquidity</th>
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
                      <p className="text-muted-foreground mb-4">You don't have any liquidity positions yet</p>
                      <Button onClick={toggleCreateForm}>Add Liquidity</Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="all-pools">
                <div className="rounded-md border">
                  <div className="p-4">
                    <h2 className="text-xl font-semibold">All Liquidity Pools</h2>
                    <p className="text-sm text-muted-foreground">Browse all available liquidity pools</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="px-4 py-3 text-left text-sm font-medium">Pool</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">TVL</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Volume (24h)</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">APR</th>
                          <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockPools.map((pool) => (
                          <tr key={pool.id} className="border-b">
                            <td className="px-4 py-3 text-sm">
                              {pool.token1}/{pool.token2}
                            </td>
                            <td className="px-4 py-3 text-sm">{pool.totalLiquidity}</td>
                            <td className="px-4 py-3 text-sm">{pool.volume24h}</td>
                            <td className="px-4 py-3 text-sm">{pool.apr}</td>
                            <td className="px-4 py-3 text-right">
                              <Button variant="outline" size="sm">
                                Add Liquidity
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics</CardTitle>
                    <CardDescription>Detailed analytics for liquidity pools will be available soon.</CardDescription>
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
              <CardTitle>Create a New Liquidity Pool</CardTitle>
              <CardDescription>
                Create a new liquidity pool by selecting two tokens and specifying the amounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Token</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="SOL">SOL</option>
                      <option value="USDC">USDC</option>
                      <option value="BONK">BONK</option>
                      <option value="MYTOKEN">My Token</option>
                    </select>
                    <input type="number" placeholder="Amount" className="w-full p-2 border rounded-md" />
                    <p className="text-xs text-muted-foreground">Balance: 10.5 SOL</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Second Token</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="USDC">USDC</option>
                      <option value="SOL">SOL</option>
                      <option value="BONK">BONK</option>
                      <option value="MYTOKEN">My Token</option>
                    </select>
                    <input type="number" placeholder="Amount" className="w-full p-2 border rounded-md" />
                    <p className="text-xs text-muted-foreground">Balance: 105.0 USDC</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Fee Tier</label>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="border rounded-md p-2 text-center cursor-pointer hover:bg-primary/10">
                      <div className="font-medium">0.01%</div>
                      <div className="text-xs text-muted-foreground">Best for stable pairs</div>
                    </div>
                    <div className="border rounded-md p-2 text-center cursor-pointer bg-primary/10">
                      <div className="font-medium">0.05%</div>
                      <div className="text-xs text-muted-foreground">Best for stable pairs</div>
                    </div>
                    <div className="border rounded-md p-2 text-center cursor-pointer hover:bg-primary/10">
                      <div className="font-medium">0.3%</div>
                      <div className="text-xs text-muted-foreground">Best for most pairs</div>
                    </div>
                    <div className="border rounded-md p-2 text-center cursor-pointer hover:bg-primary/10">
                      <div className="font-medium">1%</div>
                      <div className="text-xs text-muted-foreground">Best for exotic pairs</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="auto-stake" className="rounded" />
                  <label htmlFor="auto-stake" className="text-sm">
                    Auto-stake LP tokens for additional rewards
                  </label>
                </div>

                <div className="bg-muted/50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Pool Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Pool share:</span>
                      <span>0.01%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated APR:</span>
                      <span>12.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>LP tokens:</span>
                      <span>0.0001</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full">Create Liquidity Pool</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
