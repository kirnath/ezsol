"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react"
import { fetchSolPrice, type SolPriceData } from "@/lib/price-service"
import { Skeleton } from "@/components/ui/skeleton"

interface PortfolioOverviewProps {
  totalTokens: number
  solBalance: number // SOL balance from wallet
}

export function PortfolioOverview({ totalTokens, solBalance }: PortfolioOverviewProps) {
  const [solPrice, setSolPrice] = useState<SolPriceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSolPrice = async () => {
      setIsLoading(true)
      const price = await fetchSolPrice()
      setSolPrice(price)
      setIsLoading(false)
    }

    loadSolPrice()
    // Refresh price every 30 seconds
    const interval = setInterval(loadSolPrice, 30000)
    return () => clearInterval(interval)
  }, [])

  const portfolioValueUSD = solBalance * (solPrice?.usdPrice || 0)
  const isPositive = (solPrice?.usdPrice24hrPercentChange || 0) >= 0

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <DollarSign className="h-5 w-5 text-muted-foreground" />
          Portfolio Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Portfolio Value Section */}
        <div className="space-y-3 pt-4 border-t border-border">
          <span className="text-sm font-medium text-muted-foreground">Your Portfolio</span>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">SOL Balance</div>
              <div className="text-xl font-bold">{solBalance.toFixed(4)} SOL</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">USD Value</div>
              <div className="text-xl font-bold">${portfolioValueUSD.toFixed(2)}</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-muted-foreground">Total Tokens</span>
            <span className="text-lg font-semibold">{totalTokens}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
