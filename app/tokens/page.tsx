"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ArrowUpDown, ExternalLink } from "lucide-react"
import Image from "next/image"
import { useWallet } from "@/context/wallet-context"
import { io } from "socket.io-client"
import fetchTokenOverview from "@/lib/fetch-token-data"
import { useToastNotification } from "@/components/toast-notification"
import { fetchTrendingTokens } from "@/lib/birdeye-utils"

interface TokenListingProps {
  tokenMint: string
  tokenName: string
  tokenSymbol: string
  tokenDescription: string
  tokenImage?: string
  tokenWebsite?: string
  tokenTwitter?: string
  tokenTelegram?: string
  liquidity: string
  marketCap: string
  holders: number
  volume: string
  price: string
}

interface TrendingToken24H {
  tokenMint: string
  tokenName: string
  tokenSymbol: string
  tokenImage: string
  tokenMarketCap: string
  tokenPrice: string
  tokenPriceChange24h: string
  tokenVolume24h: string
}

const socket = io(process.env.NEXT_PUBLIC_WSS_LOCAL || "http://localhost:4000")

function formatMarketCap(value: string | number) {
  const num = Number(value)
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B"
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M"
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K"
  return num.toFixed(2)
}

function formatPrice(value: string | number) {
  const num = Number(value)
  if (num < 0.01) return num.toExponential(2)
  return num.toFixed(6)
}

export default function TokensPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [tokens, setTokens] = useState<TokenListingProps[]>([])
  const [trendingTokens, setTrendingTokens] = useState([])
  const toast = useToastNotification()
  const [, forceUpdate] = useState(0)
  const [animatedTokens, setAnimatedTokens] = useState<Set<string>>(new Set())

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate((n) => n + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleNewToken(token: TokenListingProps) {
      const processToken = async () => {
        if (!token.tokenMint) return
        const tokenData = await fetchTokenOverview(token.tokenMint)
        const withTokenData = {
          ...token,
          created: Date.now(),
          liquidity: tokenData.liquidity,
          marketCap: tokenData.marketCap,
          holders: tokenData.holder,
          volume: tokenData.v24hUSD,
          price: tokenData.price,
          tokenName: tokenData.name,
          tokenSymbol: tokenData.symbol,
          tokenImage: tokenData.logoURI,
          tokenWebsite: tokenData.extensions?.website || undefined,
          tokenTwitter: tokenData.extensions?.twitter || undefined,
          tokenTelegram: tokenData.extensions?.telegram || undefined,
        }
        setTokens((prev) => [withTokenData, ...prev].slice(0, 20))

        // Add shake animation for new token
        setAnimatedTokens((prev) => new Set(prev).add(token.tokenMint))

        // Remove animation after 2 seconds
        setTimeout(() => {
          setAnimatedTokens((prev) => {
            const newSet = new Set(prev)
            newSet.delete(token.tokenMint)
            return newSet
          })
        }, 800)
      }
      processToken()
    }
    socket.on("new_token", handleNewToken)
    return () => socket.off("new_token", handleNewToken)
  }, [])

  useEffect(() => {
    const getTrendingTokens = async () => {
      const trendingTokens = await fetchTrendingTokens()
      setTrendingTokens(trendingTokens)
    }
    getTrendingTokens()
  }, [])

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">New Tokens</h1>
        <p className="text-muted-foreground">Find the latest tokens across Solana network</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tokens by name or symbol..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <span>Filter</span>
          </Button>
          <Button variant="outline">
            <span>Advanced</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Tokens</TabsTrigger>

          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border overflow-hidden">
                <div className="relative w-full overflow-x-hidden">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b bg-muted/50">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <span>Token</span>
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <span>Created</span>
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <span>Liquidity</span>
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
                            <span>Holders</span>
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <span>Volume</span>
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          <span>Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {tokens.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-muted-foreground">
                            Loading tokens...
                          </td>
                        </tr>
                      ) : (
                        tokens?.map((token, index) => (
                          <tr
                            key={index}
                            className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${
                              animatedTokens.has(token.tokenMint) ? "animate-shake-row" : ""
                            }`}
                          >
                            <td className="p-4 align-middle overflow-hidden">
                              <div
                                className={`flex items-center gap-3 ${
                                  animatedTokens.has(token.tokenMint) ? "animate-shake-content" : ""
                                }`}
                              >
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                  <Image
                                    src={token.tokenImage || "/placeholder.svg?height=40&width=40"}
                                    alt={token.tokenName}
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-medium">{token.tokenName}</div>
                                  <div className="text-xs text-muted-foreground">{token.tokenSymbol}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 align-middle overflow-hidden">
                              <div
                                className={`text-red-500 ${
                                  animatedTokens.has(token.tokenMint) ? "animate-shake-content" : ""
                                }`}
                              >
                                {(() => {
                                  const seconds = Math.floor((Date.now() - (token as any).created) / 1000)
                                  if (seconds >= 60) {
                                    const minutes = Math.floor(seconds / 60)
                                    return `${minutes}m`
                                  }
                                  return `${seconds}s`
                                })()}
                              </div>
                            </td>
                            <td className="p-4 align-middle overflow-hidden">
                              <div className={animatedTokens.has(token.tokenMint) ? "animate-shake-content" : ""}>
                                ${formatMarketCap(token.liquidity)}
                              </div>
                            </td>
                            <td className="p-4 align-middle overflow-hidden">
                              <div className={animatedTokens.has(token.tokenMint) ? "animate-shake-content" : ""}>
                                <div>${formatMarketCap(token.marketCap)}</div>
                                <div className="text-xs text-muted-foreground">{formatPrice(token.price)}</div>
                              </div>
                            </td>
                            <td className="p-4 align-middle overflow-hidden">
                              <div className={animatedTokens.has(token.tokenMint) ? "animate-shake-content" : ""}>
                                {token.holders}
                              </div>
                            </td>
                            <td className="p-4 align-middle overflow-hidden">
                              <div className={animatedTokens.has(token.tokenMint) ? "animate-shake-content" : ""}>
                                ${formatMarketCap(token.volume)}
                              </div>
                            </td>
                            <td className="p-4 align-middle overflow-hidden">
                              <div
                                className={`flex space-x-2 ${
                                  animatedTokens.has(token.tokenMint) ? "animate-shake-content" : ""
                                }`}
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 px-2 text-xs"
                                  onClick={() => {
                                    console.log("Toast")
                                    toast.success({
                                      title: "Coming soon!",
                                      description: "This feature is not available yet. Please check back later.",
                                    })
                                  }}
                                >
                                  <span className="mr-1">Quick Buy</span>
                                  <span className="text-green-500">0.5 SOL </span>
                                </Button>
                                <a
                                  href={`https://pump.fun/${token.tokenMint}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button size="icon" variant="ghost" className="h-8 w-8">
                                    <ExternalLink className="h-4 w-4" />
                                    <span className="sr-only">View on Pump.fun</span>
                                  </Button>
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trending" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Trending Tokens</CardTitle>
              <CardDescription>Tokens with the highest trading volume in the last 24 hours.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b bg-muted/50">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <span>Token</span>
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <span>Liquidity</span>
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
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <span>Price</span>
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                          <span>Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {trendingTokens.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-muted-foreground">
                            Loading trending tokens...
                          </td>
                        </tr>
                      ) : (
                        trendingTokens.map((token: any, index: number) => (
                          <tr
                            key={index}
                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                          >
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                  <Image
                                    src={token.logoURI || "/placeholder.svg?height=40&width=40"}
                                    alt={token.name}
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-medium">{token.name}</div>
                                  <div className="text-xs text-muted-foreground">{token.symbol}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <div>${formatMarketCap(token.liquidity)}</div>
                            </td>
                            <td className="p-4 align-middle">
                              <div>${formatMarketCap(token.marketcap)}</div>
                            </td>
                            <td className="p-4 align-middle">
                              <div>${formatMarketCap(token.volume24hUSD)}</div>
                              <div className="text-xs text-muted-foreground">
                                {token.volume24hChangePercent > 0 ? (
                                  <span className="text-green-500">
                                    +{Number(token.volume24hChangePercent).toFixed(2)}%
                                  </span>
                                ) : (
                                  <span className="text-red-500">
                                    {Number(token.volume24hChangePercent).toFixed(2)}%
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <div>{formatPrice(token.price)}</div>
                              <div className="text-xs text-muted-foreground">
                                {token.price24hChangePercent > 0 ? (
                                  <span className="text-green-500">+{token.price24hChangePercent.toFixed(2)}%</span>
                                ) : (
                                  <span className="text-red-500">{token.price24hChangePercent.toFixed(2)}%</span>
                                )}
                              </div>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 px-2 text-xs gradient-border rounded-md"
                                  onClick={() => {
                                    toast.success({
                                      title: "Coming soon!",
                                      description: "This feature is not available yet. Please check back later.",
                                    })
                                  }}
                                >
                                  <span className="mr-1 ">Quick Copy</span>
                                </Button>
                                <a
                                  href={`https://dexscreener.com/solana/${token.address}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button size="icon" variant="ghost" className="h-8 w-8">
                                    <ExternalLink className="h-4 w-4" />
                                    <span className="sr-only">View on Pump.fun</span>
                                  </Button>
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verified" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Verified Tokens</CardTitle>
              <CardDescription>Tokens that have been verified by the community.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">No verified tokens found.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
