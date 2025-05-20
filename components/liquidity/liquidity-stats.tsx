import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { TokenData } from "@/lib/token-service"

interface LiquidityStatsProps {
  userTokens: TokenData[]
  positionsCount: number
  totalValue: string
  pairedTokensCount: number
}

export function LiquidityStats({ userTokens, positionsCount, totalValue, pairedTokensCount }: LiquidityStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">{userTokens.length}</CardTitle>
          <CardDescription>Your Created Tokens</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">{positionsCount}</CardTitle>
          <CardDescription>Active Liquidity Pools</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">{totalValue}</CardTitle>
          <CardDescription>Total Liquidity Value</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">{pairedTokensCount}</CardTitle>
          <CardDescription>Paired Tokens</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
