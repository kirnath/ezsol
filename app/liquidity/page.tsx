"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useWalletContext } from "@/context/wallet-context"
import { fetchCreatedTokens, type TokenData } from "@/lib/token-service"
import { fetchSerumLiquidityPositions } from "@/lib/serum-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LiquidityStats } from "@/components/liquidity/liquidity-stats"
import { LiquidityPoolTable } from "@/components/liquidity/liquidity-pool-table"
import { LiquidityPoolForm } from "@/components/liquidity/liquidity-pool-form"
import { LiquidityAnalytics } from "@/components/liquidity/liquidity-analytics"
import WalletButton from "@/components/wallet-button"

export default function LiquidityPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [userTokens, setUserTokens] = useState<TokenData[]>([])
  const [userPositions, setUserPositions] = useState<any[]>([])

  const { connected, publicKey, connection, network } = useWalletContext()

  useEffect(() => {
    const loadUserData = async () => {
      if (connected && publicKey && connection) {
        try {
          // Fetch tokens
          const tokens = await fetchCreatedTokens(connection, publicKey, network)
          setUserTokens(tokens)

          // Fetch liquidity positions
          const positions = await fetchSerumLiquidityPositions(connection, publicKey)
          setUserPositions(positions)
        } catch (error) {
          console.error("Error loading user data:", error)
        }
      }
    }

    loadUserData()
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

  // Check if user is connected
  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-32">
        <Card>
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>Please connect your wallet to manage your token liquidity</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-6">
            <WalletButton className="bg-primary"/>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-32">
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

            <LiquidityStats
              userTokens={userTokens}
              positionsCount={userPositions.length}
              totalValue="$750"
              pairedTokensCount={2}
            />

            <Tabs defaultValue="my-pools">
              <TabsList>
                <TabsTrigger value="my-pools">My Liquidity Pools</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="my-pools">
                <LiquidityPoolTable positions={userPositions} onAddLiquidity={toggleCreateForm} />
              </TabsContent>

              <TabsContent value="analytics">
                <LiquidityAnalytics />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <LiquidityPoolForm
            userTokens={userTokens}
            onCancel={toggleCreateForm}
            onSuccess={() => {
              if (connected && publicKey && connection) {
                fetchSerumLiquidityPositions(connection, publicKey)
                  .then((positions) => setUserPositions(positions))
                  .catch((error) => console.error("Error refreshing positions:", error))
              }
              setShowCreateForm(false)
            }}
          />
        )}
      </div>
    </div>
  )
}
