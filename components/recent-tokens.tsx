"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Image from "next/image"
import type { TokenData } from "@/lib/token-service"

interface RecentTokenProps {
  tokens: TokenData[]
}

export function RecentTokens({ tokens }: RecentTokenProps) {
  if (!tokens || tokens.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recently Created Tokens</CardTitle>
          <CardDescription>You haven't created any tokens yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            <p className="text-muted-foreground mb-4">Create your first token to get started.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recently Created Tokens</CardTitle>
        <CardDescription>Your most recently created tokens.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tokens.map((token) => (
            <div key={token.mintAddress} className="flex items-center justify-between p-3 border rounded-lg">
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
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>{token.symbol}</span>
                    <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground"></span>
                    <span>{token.network}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  window.open(
                    `https://explorer.solana.com/address/${token.mintAddress}?cluster=${token.network !== "mainnet-beta" ? token.network : ""}`,
                    "_blank",
                  )
                }
              >
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">View on Explorer</span>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
