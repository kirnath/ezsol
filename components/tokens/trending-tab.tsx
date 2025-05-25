"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ExternalLink } from "lucide-react"
import Image from "next/image"
import { useToastNotification } from "@/components/toast-notification"
import { fetchTrendingTokens } from "@/lib/birdeye-utils"

function formatMarketCap(value: string | number) {
  const num = Number(value)
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B"
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M"
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K"
  return num.toFixed(2)
}

function formatTrendingPrice(value: string | number) {
  const num = Number(value)
  if (num > 0.1) {
    return num.toFixed(2)
  } else {
    return num.toFixed(6)
  }
}

interface TrendingTabProps {
  searchTerm: string
}

export default function TrendingTab({ searchTerm }: TrendingTabProps) {
  const [trendingTokens, setTrendingTokens] = useState([])
  const toast = useToastNotification()

  useEffect(() => {
    const getTrendingTokens = async () => {
      const trendingTokens = await fetchTrendingTokens()
      setTrendingTokens(trendingTokens)
    }
    getTrendingTokens()
  }, [])

  const filteredTokens = trendingTokens.filter(
    (token: any) =>
      token.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
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
                {filteredTokens.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      Loading trending tokens...
                    </td>
                  </tr>
                ) : (
                  filteredTokens.map((token: any, index: number) => (
                    <tr
                      key={index}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                            <Image
                              src={token.logoURI || "/placeholder.svg?height=40&width=40" || "/placeholder.svg"}
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
                            <span className="text-green-500">+{Number(token.volume24hChangePercent).toFixed(2)}%</span>
                          ) : (
                            <span className="text-red-500">{Number(token.volume24hChangePercent).toFixed(2)}%</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div>${formatTrendingPrice(token.price)}</div>
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
  )
}
