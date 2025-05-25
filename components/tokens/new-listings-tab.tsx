"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ExternalLink } from "lucide-react"
import Image from "next/image"
import { io } from "socket.io-client"
import fetchTokenOverview from "@/lib/fetch-token-data"
import { useToastNotification } from "@/components/toast-notification"

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

interface NewListingsTabProps {
  searchTerm: string
}

export default function NewListingsTab({ searchTerm }: NewListingsTabProps) {
  const [tokens, setTokens] = useState<TokenListingProps[]>([])
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

  const filteredTokens = tokens.filter(
    (token) =>
      token.tokenName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.tokenSymbol?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
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
                {filteredTokens.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      <span className="loader"></span>
                    </td>
                  </tr>
                ) : (
                  filteredTokens?.map((token, index) => (
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
                              src={token.tokenImage || "/placeholder.svg?height=40&width=40" || "/placeholder.svg"}
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
                              toast.success({
                                title: "Coming soon!",
                                description: "This feature is not available yet. Please check back later.",
                              })
                            }}
                          >
                            <span className="mr-1">Quick Buy</span>
                            <span className="text-green-500">0.5 SOL </span>
                          </Button>
                          <a href={`https://pump.fun/${token.tokenMint}`} target="_blank" rel="noopener noreferrer">
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
  )
}
