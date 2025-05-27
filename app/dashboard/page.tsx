"use client"

import { useEffect, useState } from "react"
import { useWalletContext } from "@/context/wallet-context"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { PublicKey } from "@solana/web3.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, ArrowUpRight, ArrowDownRight, BarChart3, Users, Coins, Activity, Wallet } from "lucide-react"
import TokenTable from "@/components/token-table"
import { TokenTableTooltip } from "@/components/token-table-tooltip"
import TokenStats from "@/components/token-stats"
import WalletStatus from "@/components/wallet-status"
import { RecentTokens } from "@/components/recent-tokens"
import { PortfolioOverview } from "@/components/dashboard/portfolio-overview"
import { useToastNotification } from "@/components/toast-notification"
import { fetchCreatedTokens, fetchOwnedTokens, type TokenData } from "@/lib/token-service"
import { Skeleton } from "@/components/ui/skeleton"
import fetchPortfolioData from "@/lib/portfolio-utils"


interface PortfolioData {
  wallet: string
  totalUSD: number
  items: [
    {
      address: string
      decimals: number
      balance: number
      uiAmount: number
      chainId: string
      name: string
      symbol: string
      logoURI: string
      priceUsd: number
      valueUsd: number
    }
  ]
}
export default function DashboardPage() {
  const { connected, publicKey, connection, network } = useWalletContext()
  const { setVisible } = useWalletModal()
  const toast = useToastNotification()

  // State for dashboard stats
  const [dashboardStats, setDashboardStats] = useState({
    totalValue: 0,
    totalHolders: 0,
    totalTokens: 0,
    solBalance: 0,
    isLoading: true,
  })

  // State for tokens
  const [ownedTokens, setOwnedTokens] = useState<PortfolioData["items"]>()
  const [isLoadingTokens, setIsLoadingTokens] = useState(true)
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null)

  // Fetch dashboard stats and tokens
  useEffect(() => {
    if (connected && publicKey && connection) {
      const fetchData = async () => {
        setIsLoadingTokens(true)
        try {
          const walletPortfolio = await fetchPortfolioData(publicKey.toString())
          setPortfolio(walletPortfolio)

          // Get SOL balance
          const balance = await connection.getBalance(new PublicKey(publicKey))
          const solBalance = Number(balance) / 1e9 // Convert lamports to SOL

          setDashboardStats({
            totalValue: portfolio?.totalUSD || 0,
            totalHolders: 0,
            totalTokens: portfolio?.items.length || 0,
            solBalance,
            isLoading: false,
          })
          setOwnedTokens(walletPortfolio.items)
        } catch (error) {
          console.error("Error fetching token data:", error)
          toast.error({
            title: "Failed to load token data",
            description: "Please try again later",
          })
        } finally {
          setIsLoadingTokens(false)
        }
      }

      fetchData()
    }
  }, [connected, publicKey, connection, network])

  // If not connected, show wallet connection prompt
  if (!connected) {
    return (
      <div className="container py-32">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight">Portfolio Dashboard</h1>
            <p className="mt-4 text-muted-foreground">Connect your wallet to view your crypto portfolio.</p>
          </div>

          <Card className="mx-auto max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Wallet Required
              </CardTitle>
              <CardDescription>
                Connect your Solana wallet to access your portfolio dashboard and manage tokens.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6 space-y-4">
              <div className="p-4 rounded-full bg-muted">
                <Wallet className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-center">No wallet connected</p>
              <Button onClick={() => setVisible(true)}>Connect Wallet</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Portfolio Dashboard</h1>
          <p className="text-muted-foreground">Monitor your Solana portfolio and tokens.</p>
        </div>
        <Button onClick={() => (window.location.href = "/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Token
        </Button>
      </div>

      {/* Portfolio Overview */}
      <div className="mb-8">
        <PortfolioOverview totalTokens={dashboardStats.totalTokens} solBalance={dashboardStats.solBalance} />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Holders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {dashboardStats.isLoading ? (
              <Skeleton className="h-8 w-24" />
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
            <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {dashboardStats.isLoading ? (
              <Skeleton className="h-8 w-24" />
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SOL Balance</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {dashboardStats.isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{dashboardStats.solBalance.toFixed(4)} SOL</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-muted-foreground">Wallet balance</span>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Tabs Section */}
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
