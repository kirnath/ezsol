"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ArrowUpDown, ExternalLink } from "lucide-react"
import Image from "next/image"
import { useWallet } from "@/context/wallet-context"

interface TokenListingProps {
  name: string
  symbol: string
  logo?: string
  created: string
  liquidity: string
  marketCap: string
  swaps: number
  volume: string
  price: string
  priceChange: number
  address: string
}

// Mock data for demonstration
const mockTokens: TokenListingProps[] = [
  {
    name: "Solana Meme",
    symbol: "MEME",
    logo: "/placeholder.svg?height=40&width=40",
    created: "12s",
    liquidity: "$10K",
    marketCap: "$0",
    swaps: 0,
    volume: "$0",
    price: "$0.00482",
    priceChange: 0,
    address: "abc123",
  },
  {
    name: "SueSin Horny",
    symbol: "HORNY",
    logo: "/placeholder.svg?height=40&width=40",
    created: "16s",
    liquidity: "$10K",
    marketCap: "$5K",
    swaps: 0,
    volume: "$0",
    price: "$0.04895",
    priceChange: 0,
    address: "def456",
  },
  {
    name: "JMB IN MY WALLET",
    symbol: "JMB",
    logo: "/placeholder.svg?height=40&width=40",
    created: "21s",
    liquidity: "$11K",
    marketCap: "$5K",
    swaps: 0,
    volume: "$0",
    price: "$0.04746",
    priceChange: 0,
    address: "ghi789",
  },
  {
    name: "CON Concurrency",
    symbol: "CON",
    logo: "/placeholder.svg?height=40&width=40",
    created: "28s",
    liquidity: "$11K",
    marketCap: "$0",
    swaps: 2,
    volume: "$69",
    price: "$0.04979",
    priceChange: 0,
    address: "jkl012",
  },
  {
    name: "LIESOCIAL NO TRUST",
    symbol: "LIE",
    logo: "/placeholder.svg?height=40&width=40",
    created: "28s",
    liquidity: "$11K",
    marketCap: "$5K",
    swaps: 3,
    volume: "$702",
    price: "$0.04963",
    priceChange: 0,
    address: "mno345",
  },
  {
    name: "Badge the coolest",
    symbol: "BADGE",
    logo: "/placeholder.svg?height=40&width=40",
    created: "30s",
    liquidity: "$13K",
    marketCap: "$7K",
    swaps: 1,
    volume: "$58",
    price: "$0.07037",
    priceChange: 0,
    address: "pqr678",
  },
  {
    name: "5FCADE",
    symbol: "5FC",
    logo: "/placeholder.svg?height=40&width=40",
    created: "31s",
    liquidity: "$11K",
    marketCap: "$0",
    swaps: 2,
    volume: "$104",
    price: "$0.05196",
    priceChange: 0,
    address: "stu901",
  },
]

export default function TokensPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [tokens, setTokens] = useState<TokenListingProps[]>(mockTokens)
  const { connection, publicKey, network } = useWallet()

  // Filter tokens based on search term
  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // In a real implementation, you would fetch real token data here
  useEffect(() => {
    const loadTokens = async () => {
      if (connection && publicKey) {
        try {
          // This would be replaced with actual API calls to get new tokens
          // For now, we're using mock data
          // const createdTokens = await fetchCreatedTokens(connection, publicKey.toString(), network)
          // Map the tokens to the format needed for display
        } catch (error) {
          console.error("Error loading tokens:", error)
        }
      }
    }

    loadTokens()
  }, [connection, publicKey, network])

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
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
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
                            <span>Swaps</span>
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
                      {filteredTokens.map((token, index) => (
                        <tr
                          key={index}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                <Image
                                  src={token.logo || "/placeholder.svg?height=40&width=40"}
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
                            <div className="text-red-500">{token.created}</div>
                          </td>
                          <td className="p-4 align-middle">
                            <div>{token.liquidity}</div>
                          </td>
                          <td className="p-4 align-middle">
                            <div>{token.marketCap}</div>
                            <div className="text-xs text-muted-foreground">{token.price}</div>
                          </td>
                          <td className="p-4 align-middle">{token.swaps}</td>
                          <td className="p-4 align-middle">{token.volume}</td>
                          <td className="p-4 align-middle">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="h-8 px-2 text-xs">
                                <span className="mr-1">Buy</span>
                                <span className="text-green-500">1 SOL </span>
                              </Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8">
                                <ExternalLink className="h-4 w-4" />
                                <span className="sr-only">View on Explorer</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
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

        <TabsContent value="trending" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Trending Tokens</CardTitle>
              <CardDescription>Tokens with the highest trading volume in the last 24 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">No trending tokens found.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
