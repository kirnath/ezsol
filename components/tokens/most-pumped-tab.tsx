"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ChevronUp, Flame, TrendingUp, Crown, ChevronsUp } from "lucide-react"
import Image from "next/image"
import { useToastNotification } from "@/components/toast-notification"
import { supabase } from "@/lib/supabase-client"
import { SubmitTokenDialog } from "./submit-token-dialog"
import { BuyPumpsDialog } from "./buy-pumps-dialog"
import fetchTokenOverview from "@/lib/fetch-token-data"

interface PumpedToken {
  id: string
  name: string
  symbol: string
  image_url: string
  mint_address: string
  total_pumps: number
  pumps_1h: number
  pumps_24h: number
  pumps_7d: number
  pump_velocity: "hot" | "rising" | "stable" | "cooling" | ""
  weighted_score: number
  rank_position: number
  last_pump_at: string
  // Additional fields for display
  price?: string
  marketCap?: string
  volume24h?: string
  change24h?: number
}

interface UserPumpStatus {
  token_id: string
  free_pumps_used: number
  paid_pumps_count: number
  total_sol_spent: number
}

interface MostPumpedTabProps {
  searchTerm: string
}

interface FloatingNumber {
  id: string
  tokenId: string
  x: number
  y: number
}

function getPumpTier(pumpCount: number) {
  if (pumpCount >= 1000) return { tier: "Diamond", color: "from-cyan-400 to-blue-500", glow: "shadow-cyan-500/50" }
  if (pumpCount >= 500) return { tier: "Gold", color: "from-yellow-400 to-orange-500", glow: "shadow-yellow-500/50" }
  if (pumpCount >= 100) return { tier: "Silver", color: "from-gray-300 to-gray-500", glow: "shadow-gray-500/50" }
  return { tier: "Bronze", color: "from-amber-600 to-amber-800", glow: "shadow-amber-500/50" }
}

function getVelocityIndicator(velocity: string) {
  switch (velocity) {
    case "hot":
      return { icon: "🔥", color: "text-red-400", label: "Hot" }
    case "rising":
      return { icon: "📈", color: "text-green-400", label: "Rising" }
    case "stable":
      return { icon: "➡️", color: "text-blue-400", label: "Stable" }
    case "cooling":
      return { icon: "❄️", color: "text-gray-400", label: "Cooling" }
    default:
      return { icon: "", color: "text-gray-400", label: "" }
  }
}

export default function MostPumpedTab({ searchTerm }: MostPumpedTabProps) {
  const [pumpedTokens, setPumpedTokens] = useState<PumpedToken[]>([])
  const [userPumpStatus, setUserPumpStatus] = useState<UserPumpStatus[]>([])
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUserWallet, setCurrentUserWallet] = useState<string>("")
  const toast = useToastNotification()
  const [buyPumpsDialog, setBuyPumpsDialog] = useState<{
    open: boolean
    tokenId: string
    tokenName: string
    tokenSymbol: string
  }>({
    open: false,
    tokenId: "",
    tokenName: "",
    tokenSymbol: "",
  })

  // Mock user wallet for demo - replace with actual wallet connection
  useEffect(() => {
    setCurrentUserWallet("DummyUserWallet123")
  }, [])

  // Fetch tokens and user pump status
  useEffect(() => {
    fetchPumpedTokens()
    if (currentUserWallet) {
      fetchUserPumpStatus()
    }
  }, [currentUserWallet])

  const fetchPumpedTokens = async () => {
    try {
      setIsLoading(true)

      // First, get tokens with pump stats, ordered correctly
      const { data: tokensData, error } = await supabase
        .from("tokens")
        .select(`
        id,
        name,
        symbol,
        image_url,
        mint_address,
        token_pump_stats!inner (
          total_pumps,
          pumps_1h,
          pumps_24h,
          pumps_7d,
          pump_velocity,
          weighted_score,
          rank_position,
          last_pump_at
        )
      `)
        .order("weighted_score", { ascending: false, foreignTable: "token_pump_stats" })
        .limit(50)

      if (error) {
        console.error("Error fetching tokens:", error)
        toast.error({
          title: "Error loading tokens",
          description: "Failed to fetch pump data from database",
        })
        return
      }

      // Transform data and fetch real price/market data
      const transformedTokens: PumpedToken[] = await Promise.all(
        tokensData?.map(async (token: any, index: number) => {
          let price = "0"
          let marketCap = "0"
          let volume24h = "0"
          let change24h = 0

          try {
            const marketData = await fetchTokenOverview(token.mint_address)
            if (marketData) {
              price = marketData.price?.toFixed(6) || "0"
              marketCap = marketData.marketCap ? `${(marketData.marketCap / 1000000).toFixed(1)}M` : "0"
              volume24h = marketData.v24hUSD ? `${(marketData.v24hUSD / 1000).toFixed(0)}K` : "0"
              change24h = marketData.priceChange24hPercent || 0
            }
          } catch (error) {
            console.error(`Error fetching market data for ${token.symbol}:`, error)
          }

          return {
            id: token.id,
            name: token.name,
            symbol: token.symbol,
            image_url: token.image_url,
            mint_address: token.mint_address,
            total_pumps: token.token_pump_stats?.total_pumps || 0,
            pumps_1h: token.token_pump_stats?.pumps_1h || 0,
            pumps_24h: token.token_pump_stats?.pumps_24h || 0,
            pumps_7d: token.token_pump_stats?.pumps_7d || 0,
            pump_velocity: token.token_pump_stats?.pump_velocity || "",
            weighted_score: token.token_pump_stats?.weighted_score || 0,
            rank_position: token.token_pump_stats?.rank_position || index + 1,
            last_pump_at: token.token_pump_stats?.last_pump_at || "",
            price,
            marketCap,
            volume24h,
            change24h,
          }
        }) || []
      )

      setPumpedTokens(transformedTokens)

      // Staggered loading animation
      setTimeout(() => setIsLoaded(true), 100)
    } catch (error) {
      console.error("Error in fetchPumpedTokens:", error)
      toast.error({
        title: "Database Error",
        description: "Failed to connect to database",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserPumpStatus = async () => {
    if (!currentUserWallet) return

    try {
      const { data, error } = await supabase
        .from("user_pump_history")
        .select("token_id, free_pumps_used, paid_pumps_count, total_sol_spent")
        .eq("user_wallet", currentUserWallet)

      if (error) {
        console.error("Error fetching user pump status:", error)
        return
      }

      setUserPumpStatus(data || [])
    } catch (error) {
      console.error("Error in fetchUserPumpStatus:", error)
    }
  }

  const createFloatingNumber = (tokenId: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const id = Math.random().toString(36).substr(2, 9)
    const newFloating: FloatingNumber = {
      id,
      tokenId,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }

    setFloatingNumbers((prev) => [...prev, newFloating])

    // Remove after animation
    setTimeout(() => {
      setFloatingNumbers((prev) => prev.filter((f) => f.id !== id))
    }, 1000)
  }

  const handlePump = async (tokenId: string, event: React.MouseEvent) => {
    if (!currentUserWallet) {
      toast.error({
        title: "Wallet not connected",
        description: "Please connect your wallet to pump tokens",
      })
      return
    }

    const userStatus = userPumpStatus.find((status) => status.token_id === tokenId)
    const hasUsedFreePump = userStatus?.free_pumps_used > 0

    if (hasUsedFreePump) {
      toast.error({
        title: "Additional Pump Required Payment",
        description: "You've already pumped this token. Pay 0.02 SOL to pump again!",
      })
      return
    }

    try {
      createFloatingNumber(tokenId, event)

      // Call the record_pump function
      const { data, error } = await supabase.rpc("record_pump", {
        p_token_id: tokenId,
        p_user_wallet: currentUserWallet,
        p_pump_type: "free",
        p_sol_amount: 0,
      })

      if (error) {
        console.error("Error recording pump:", error)
        toast.error({
          title: "Pump failed",
          description: error.message,
        })
        return
      }

      // Refresh data
      await fetchPumpedTokens()
      await fetchUserPumpStatus()

      toast.success({
        title: "Token pumped! 🚀",
        description: "You've successfully pumped this token! Additional pumps cost 0.02 SOL.",
      })
    } catch (error) {
      console.error("Error in handlePump:", error)
      toast.error({
        title: "Error",
        description: "Failed to record pump",
      })
    }
  }

  const handlePaidPump = (tokenId: string, tokenName: string, tokenSymbol: string) => {
    setBuyPumpsDialog({
      open: true,
      tokenId,
      tokenName,
      tokenSymbol,
    })
  }

  const getUserPumpStatus = (tokenId: string) => {
    return userPumpStatus.find((status) => status.token_id === tokenId)
  }

  const filteredTokens = pumpedTokens
    .filter(
      (token) =>
        token.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.symbol?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => b.weighted_score - a.weighted_score)

  const handleTokenSubmitted = () => {
    fetchPumpedTokens()
  }

  const handlePumpsPurchased = () => {
    fetchPumpedTokens()
    fetchUserPumpStatus()
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
          <span className="loader"></span>            
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-4 border-b bg-muted/20">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Most Pumped Tokens</h3>
              <p className="text-sm text-muted-foreground">Community favorites ranked by upvotes</p>
            </div>
            <SubmitTokenDialog onTokenSubmitted={handleTokenSubmitted} />
          </div>
        </div>
        <div className="rounded-md border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b bg-muted/50">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <span>Rank</span>
                    </div>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <span>Token</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <span>Price</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <span>MarketCap</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <span>Volume 24h</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    <div className="flex items-center justify-end space-x-1">
                      <Flame className="h-4 w-4 text-violet-400 animate-pulse" />
                      <span>Pumps</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {filteredTokens.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No pumped tokens found...
                    </td>
                  </tr>
                ) : (
                  filteredTokens.map((token, index) => {
                    const tier = getPumpTier(token.total_pumps)
                    const velocity = getVelocityIndicator(token.pump_velocity)
                    const isTopThree = index < 3
                    const userStatus = getUserPumpStatus(token.id)
                    const hasUsedFreePump = userStatus?.free_pumps_used > 0

                    return (
                      <tr
                        key={token.id}
                        className={`border-b transition-all duration-500 hover:bg-muted/50 data-[state=selected]:bg-muted ${
                          isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                        } ${isTopThree ? "bg-gradient-to-r from-violet-500/5 to-red-500/5" : ""}`}
                        style={{
                          transitionDelay: `${index * 100}ms`,
                          boxShadow: isTopThree ? "0 0 20px rgba(139, 92, 246, 0.1)" : "none",
                        }}
                      >
                        <td className="p-1 align-middle">
                          <div className="relative flex items-center justify-center">
                            {isTopThree && <Crown className="absolute -top-2 -right-2 h-4 w-4 text-yellow-400" />}
                            <div className={`flex items-center justify-center w-8 h-8hover:scale-110`}>
                              {isTopThree ? "#" + (index + 1) : index + 1}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-105 hover:border-violet-500/40">
                              <Image
                                src={token.image_url || "/placeholder.svg"}
                                alt={token.name}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                              {token.pump_velocity === "hot" && (
                                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full animate-pulse" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {token.name}
                                {velocity.icon && (
                                  <span className={`text-xs ${velocity.color} flex items-center gap-1`}>
                                    {velocity.icon}
                                    <span className="hidden sm:inline">{velocity.label}</span>
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-2">
                                {token.symbol}
                                <span className="text-violet-400">+{token.pumps_1h} recent</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div>${token.price}</div>
                          <div className="text-xs text-muted-foreground">
                            {token.change24h && token.change24h > 0 ? (
                              <span className="text-emerald-400 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />+{token.change24h.toFixed(2)}%
                              </span>
                            ) : (
                              <span className="text-red-400">{token.change24h?.toFixed(2)}%</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div>${token.marketCap}</div>
                        </td>
                        <td className="p-4 align-middle">
                          <div>${token.volume24h}</div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center justify-end relative">
                            {/* Floating +1 animations */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              {floatingNumbers
                                .filter((floating) => floating.tokenId === token.id)
                                .map((floating) => (
                                  <div
                                    key={floating.id}
                                    className="text-violet-400 font-bold text-lg animate-ping"
                                    style={{
                                      left: floating.x,
                                      top: floating.y,
                                      animation: "float-up 1s ease-out forwards",
                                    }}
                                  >
                                    +1
                                  </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-2">
                              {hasUsedFreePump && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 px-3 text-xs font-medium border-orange-500/30 text-orange-400 hover:bg-orange-500 hover:text-white transition-all duration-300"
                                  onClick={() => handlePaidPump(token.id, token.name, token.symbol)}
                                >
                                  <ChevronsUp className="h-3 w-3 mr-1" />
                                  Buy Pumps
                                </Button>
                              )}

                              <Button
                                size="sm"
                                variant={hasUsedFreePump ? "secondary" : "outline"}
                                disabled={hasUsedFreePump}
                                className={`h-8 px-3 text-xs font-medium transition-all duration-300 relative overflow-hidden group ${
                                  hasUsedFreePump
                                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                                    : "border-violet-500/30 text-violet-400 hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-600 hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-violet-500/25 hover:scale-105"
                                }`}
                                onClick={(e) => !hasUsedFreePump && handlePump(token.id, e)}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                <ChevronUp className="h-3 w-3 mr-1 transition-transform duration-300 group-hover:scale-110" />
                                <span className="font-bold relative z-10">{token.total_pumps.toLocaleString()}</span>
                              </Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        <BuyPumpsDialog
          open={buyPumpsDialog.open}
          onOpenChange={(open) => setBuyPumpsDialog((prev) => ({ ...prev, open }))}
          tokenId={buyPumpsDialog.tokenId}
          tokenName={buyPumpsDialog.tokenName}
          tokenSymbol={buyPumpsDialog.tokenSymbol}
          userWallet={currentUserWallet}
          onPumpsPurchased={handlePumpsPurchased}
        />
      </CardContent>

      <style jsx>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px) scale(1.2);
          }
        }
      `}</style>
    </Card>
  )
}
