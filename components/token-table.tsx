"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { type TokenData, getTokenMarketData } from "@/lib/token-service"
import { cn } from "@/lib/utils"

interface TokenTableProps {
  tokens: TokenData[]
}

export default function TokenTable({ tokens }: TokenTableProps) {
  if (!tokens || tokens.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Tokens</CardTitle>
          <CardDescription>You don't have any tokens yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            <p className="text-muted-foreground mb-4">Create or receive tokens to see them here.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Token</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">24h Change</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">24h Volume</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Balance</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {tokens.map(async (token) => {
              const marketData = await getTokenMarketData(token.mintAddress)

              return (
                <tr
                  key={token.mintAddress}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        {token.logo ? (
                          <Image
                            src={token.logo || "/placeholder.svg"}
                            alt={token.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <div className="font-bold text-sm">{token.symbol.slice(0, 2)}</div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{token.name}</div>
                        <div className="text-xs text-muted-foreground">{token.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">{marketData.price}</td>
                  <td className="p-4 align-middle">
                    <span
                      className={cn("flex items-center font-medium", isPositive ? "text-green-500" : "text-red-500")}
                    >
                      {isPositive ? (
                        <ArrowUpRight className="mr-1 h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-3 w-3" />
                      )}
                      {marketData.change}
                    </span>
                  </td>
                  <td className="p-4 align-middle">{marketData.volume}</td>
                  <td className="p-4 align-middle">
                    {token.balance ? Number.parseFloat(token.balance).toLocaleString() : "0"} {token.symbol}
                  </td>
                  <td className="p-4 align-middle">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        window.open(
                          `https://explorer.solana.com/address/${token.mintAddress}?cluster=${
                            token.network !== "mainnet-beta" ? token.network : ""
                          }`,
                          "_blank",
                        )
                      }
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">View on Explorer</span>
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
