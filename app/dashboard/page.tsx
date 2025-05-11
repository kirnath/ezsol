"use client"

import { useEffect, useState } from "react"
import { useWalletContext } from "@/context/wallet-context"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, ArrowUpRight, ArrowDownRight, BarChart3, Users, Coins, Activity, Wallet } from "lucide-react"
import TokenTable from "@/components/token-table"
import { TokenTableTooltip } from "@/components/token-table-tooltip"
import TokenStats from "@/components/token-stats"
import WalletStatus from "@/components/wallet-status"
import { RecentTokens } from "@/components/recent-tokens"
import { useToastNotification } from "@/components/toast-notification"
import { fetchCreatedTokens, fetchOwnedTokens, type TokenData } from "@/lib/token-service"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const { connected, publicKey, connection, network } = useWalletContext()
  const { setVisible } = useWalletModal()
  const toast = useToastNotification()

  // State for dashboard stats
  const [dashboardStats, setDashboardStats] = useState({
    totalValue: 0,
    totalHolders: 0,
    volume24h: 0,
    totalTokens: 0,
    isLoading: true,
  })

  // State for tokens
  const [recentTokens, setRecentTokens] = useState<TokenData[]>([])
  const [ownedTokens, setOwnedTokens] = useState<TokenData[]>([])
  const [isLoadingTokens, setIsLoadingTokens] = useState(true)

  // Fetch dashboard stats and tokens
  useEffect(() => {
    
  if (connected && publicKey && connection) {
    const fetchData = async () => {
      setIsLoadingTokens(true);
      try {
        const createdTokens = await fetchCreatedTokens(connection, publicKey, network);
        setRecentTokens(createdTokens.slice(0, 2));
        const tokens = await fetchOwnedTokens(connection, publicKey, network);
        setOwnedTokens(tokens);
        setDashboardStats({
          totalValue: tokens.reduce((sum, token) => sum + (Number.parseFloat(token.balance || "0") * 1.5), 0),
          totalHolders: createdTokens.length > 0 ? Math.floor(Math.random() * 1000) + 100 : 0,
          volume24h: tokens.length > 0 ? Math.floor(Math.random() * 10000) + 1000 : 0,
          totalTokens: createdTokens.length,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error fetching token data:", error);
        toast.error({
          title: "Failed to load token data",
          description: "Please try again later",
        });
      } finally {
        setIsLoadingTokens(false);
      }
    };

    fetchData();
  }
}, [connected, publicKey, connection, network]);

  // If not connected, show wallet connection prompt
  if (!connected) {
    return (
      <div className="container py-32">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight gradient-text">Dashboard</h1>
            <p className="mt-4 text-muted-foreground">Connect your wallet to view your dashboard.</p>
          </div>

          <Card className="mx-auto max-w-md">
            <CardHeader>
              <CardTitle>Wallet Required</CardTitle>
              <CardDescription>
                You need to connect a Solana wallet to view your dashboard and manage tokens.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6 space-y-4">
              <Wallet className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No wallet connected</p>
              <Button onClick={() => setVisible(true)} className="gradient-border">
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-32">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight gradient-text">Dashboard</h1>
          <p className="text-muted-foreground">Manage and monitor your Solana tokens.</p>
        </div>
        <Button className="gradient-border" onClick={() => (window.location.href = "/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Token
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {dashboardStats.isLoading ? (
              <div className="text-2xl font-bold animate-pulse">Loading...</div>
            ) : (
              <>
                <div className="text-2xl font-bold">${dashboardStats.totalValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 inline-flex items-center">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    +12.5%
                  </span>{" "}
                  from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Holders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {dashboardStats.isLoading ? (
              <div className="text-2xl font-bold animate-pulse">Loading...</div>
            ) : (
              <>
                <div className="text-2xl font-bold">{dashboardStats.totalHolders.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 inline-flex items-center">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    +7.2%
                  </span>{" "}
                  from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {dashboardStats.isLoading ? (
              <div className="text-2xl font-bold animate-pulse">Loading...</div>
            ) : (
              <>
                <div className="text-2xl font-bold">${dashboardStats.volume24h.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-500 inline-flex items-center">
                    <ArrowDownRight className="mr-1 h-3 w-3" />
                    -2.5%
                  </span>{" "}
                  from yesterday
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {dashboardStats.isLoading ? (
              <div className="text-2xl font-bold animate-pulse">Loading...</div>
            ) : (
              <>
                <div className="text-2xl font-bold">{dashboardStats.totalTokens}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardStats.totalTokens > 0 ? (
                    <span className="text-green-500 inline-flex items-center">
                      <ArrowUpRight className="mr-1 h-3 w-3" />+{Math.min(dashboardStats.totalTokens, 2)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">No tokens yet</span>
                  )}{" "}
                  from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 mb-8">
        <WalletStatus />
        {isLoadingTokens ? (
          <Card>
            <CardHeader>
              <CardTitle>Recently Created Tokens</CardTitle>
              <CardDescription>Loading your recently created tokens...</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <RecentTokens tokens={recentTokens} />
        )}
      </div>

      <Tabs defaultValue="tokens" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tokens">My Tokens</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="holders">Holders</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="tokens" className="space-y-4">
          {isLoadingTokens ? (
            <Card>
              <CardHeader>
                <CardTitle>My Tokens</CardTitle>
                <CardDescription>Loading your tokens...</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <TokenTableTooltip />
              <TokenTable tokens={ownedTokens} />
            </>
          )}
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Token Analytics</CardTitle>
              <CardDescription>View detailed analytics for your tokens.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <TokenStats />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="holders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Token Holders</CardTitle>
              <CardDescription>View and manage token holders.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View all transactions related to your tokens.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
