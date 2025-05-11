"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { getLiquidityStats } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"

export default function LiquidityStats() {
  const [stats, setStats] = useState({
    totalLiquidity: 0,
    totalVolume24h: 0,
    avgFee: 0,
    poolCount: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Use useCallback to memoize the loadStats function
  const loadStats = useCallback(async () => {
    try {
      setIsLoading(true)
      const liquidityStats = await getLiquidityStats()
      setStats(liquidityStats)
    } catch (error) {
      console.error("Error loading liquidity stats:", error)
      // Don't show toast on every render
      toast({
        title: "Error",
        description: "Failed to load liquidity stats. Using demo data instead.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, []) // Remove toast from dependencies

  useEffect(() => {
    // Only load stats once when component mounts
    loadStats()

    // No cleanup needed for this simple case
  }, [loadStats]) // loadStats is memoized so this won't cause re-renders

  const formatUSD = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Total Value Locked</span>
            {isLoading ? (
              <div className="h-8 bg-gray-200 rounded w-24 mt-1 animate-pulse"></div>
            ) : (
              <span className="text-2xl font-bold">{formatUSD(stats.totalLiquidity)}</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">24h Volume</span>
            {isLoading ? (
              <div className="h-8 bg-gray-200 rounded w-24 mt-1 animate-pulse"></div>
            ) : (
              <span className="text-2xl font-bold">{formatUSD(stats.totalVolume24h)}</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Average Fee</span>
            {isLoading ? (
              <div className="h-8 bg-gray-200 rounded w-24 mt-1 animate-pulse"></div>
            ) : (
              <span className="text-2xl font-bold">{formatPercent(stats.avgFee)}</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Total Pools</span>
            {isLoading ? (
              <div className="h-8 bg-gray-200 rounded w-24 mt-1 animate-pulse"></div>
            ) : (
              <span className="text-2xl font-bold">{stats.poolCount}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
