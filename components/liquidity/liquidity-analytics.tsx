import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function LiquidityAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
        <CardDescription>Detailed analytics for your token liquidity pools will be available soon.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center border rounded-md">
          <p className="text-muted-foreground">Analytics charts coming soon</p>
        </div>
      </CardContent>
    </Card>
  )
}
