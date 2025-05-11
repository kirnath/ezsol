"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { createLiquidityPool } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"

// Define the form schema
const formSchema = z.object({
  tokenA: z.string().min(1, "Token A is required"),
  tokenAAmount: z.string().min(1, "Amount is required"),
  tokenB: z.string().min(1, "Token B is required"),
  tokenBAmount: z.string().min(1, "Amount is required"),
  feeTier: z.string().min(1, "Fee tier is required"),
  autoStake: z.boolean().default(false),
})

// Mock token list - in a real app, this would come from your token service
const mockTokens = [
  { mint: "So11111111111111111111111111111111111111112", name: "Solana", symbol: "SOL" },
  { mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", name: "USD Coin", symbol: "USDC" },
  { mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", name: "USDT", symbol: "USDT" },
  { mint: "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So", name: "Marinade Staked SOL", symbol: "mSOL" },
]

export default function LiquidityPoolForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tokenA: "",
      tokenAAmount: "",
      tokenB: "",
      tokenBAmount: "",
      feeTier: "0.3",
      autoStake: false,
    },
  })

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)

      // Find token details
      const tokenADetails = mockTokens.find((token) => token.mint === values.tokenA)
      const tokenBDetails = mockTokens.find((token) => token.mint === values.tokenB)

      if (!tokenADetails || !tokenBDetails) {
        throw new Error("Token details not found")
      }

      // Create the pool
      const pool = await createLiquidityPool({
        token_a_mint: tokenADetails.mint,
        token_a_name: tokenADetails.name,
        token_a_symbol: tokenADetails.symbol,
        token_b_mint: tokenBDetails.mint,
        token_b_name: tokenBDetails.name,
        token_b_symbol: tokenBDetails.symbol,
        fee_tier: Number.parseFloat(values.feeTier),
        total_liquidity_usd: 0,
        volume_24h: 0,
      })

      if (pool) {
        toast({
          title: "Success",
          description: `Created ${tokenADetails.symbol}/${tokenBDetails.symbol} liquidity pool`,
        })

        // Reset the form
        form.reset()
      } else {
        throw new Error("Failed to create pool")
      }
    } catch (error) {
      console.error("Error creating pool:", error)
      toast({
        title: "Error",
        description: "Failed to create liquidity pool. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Token A */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="tokenA"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token A</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select token" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockTokens.map((token) => (
                            <SelectItem key={token.mint} value={token.mint}>
                              {token.symbol} - {token.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tokenAAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="0.0" {...field} type="number" step="any" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Token B */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="tokenB"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token B</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select token" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockTokens.map((token) => (
                            <SelectItem key={token.mint} value={token.mint}>
                              {token.symbol} - {token.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tokenBAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="0.0" {...field} type="number" step="any" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Fee Tier */}
            <FormField
              control={form.control}
              name="feeTier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fee Tier</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fee tier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0.01">0.01% - Best for stable pairs</SelectItem>
                      <SelectItem value="0.05">0.05% - Best for stable pairs</SelectItem>
                      <SelectItem value="0.3">0.3% - Best for most pairs</SelectItem>
                      <SelectItem value="1">1% - Best for exotic pairs</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Higher fees may earn more per trade but attract fewer traders</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Auto-stake */}
            <FormField
              control={form.control}
              name="autoStake"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Auto-stake LP tokens</FormLabel>
                    <FormDescription>Automatically stake your LP tokens to earn additional rewards</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Pool..." : "Create Liquidity Pool"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
