"use client"

import { Button } from "@/components/ui/button"

interface LiquidityPosition {
  id: string
  poolId: string
  token1: string
  token2: string
  token1Amount: string
  token2Amount: string
  share: string
  value: string
  createdAt: string
}

interface LiquidityPoolTableProps {
  positions: LiquidityPosition[]
  onAddLiquidity: () => void
}

export function LiquidityPoolTable({ positions, onAddLiquidity }: LiquidityPoolTableProps) {
  return (
    <div className="rounded-md border">
      <div className="p-4">
        <h2 className="text-xl font-semibold">Your Token Liquidity Pools</h2>
        <p className="text-sm text-muted-foreground">Manage liquidity for your created tokens</p>
      </div>

      {positions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium">Pool</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Liquidity</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Share</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Value</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position) => (
                <tr key={position.id} className="border-b">
                  <td className="px-4 py-3 text-sm">
                    {position.token1}/{position.token2}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {position.token1Amount} {position.token1} + {position.token2Amount} {position.token2}
                  </td>
                  <td className="px-4 py-3 text-sm">{position.share}</td>
                  <td className="px-4 py-3 text-sm">{position.value}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="outline" size="sm" className="mr-2">
                      Add
                    </Button>
                    <Button variant="outline" size="sm">
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-muted-foreground mb-4">You haven't added liquidity to any of your tokens yet</p>
          <Button onClick={onAddLiquidity}>Add Liquidity</Button>
        </div>
      )}
    </div>
  )
}
