import { createClient } from "@supabase/supabase-js"
import type { Connection } from "@solana/web3.js"
import type { NetworkType } from "@/context/wallet-context"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface TokenData {
  name: string
  symbol: string
  mintAddress: string
  createdAt: string
  logo?: string
  balance?: string
  decimals: number
  supply?: string
}

/**
 * Fetch tokens created by a specific wallet
 */
export async function fetchCreatedTokens(
  connection: Connection,
  walletAddress: string,
  network: NetworkType,
): Promise<TokenData[]> {
  try {
    // Get user by wallet address
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("wallet", walletAddress)
      .single()

    if (userError || !user) return []

    // Get coins by user id and network
    const { data: coins, error: coinsError } = await supabase
      .from("coins")
      .select("*")
      .eq("owner_id", user.id)
      .order("createdAt", { ascending: false })

    if (coinsError || !coins) return []

    return coins as TokenData[]
  } catch (error) {
    console.error("Error fetching created tokens:", error)
    return []
  }
}

/**
 * Store a newly created token
 */
export async function storeCreatedToken(walletAddress: string, tokenData: TokenData): Promise<void> {
  try {
    // Get user by wallet address
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("wallet", walletAddress)
      .single()

    // If user doesn't exist, create a new user and insert the coin details
    if (!user) {
      const { error: insertUserError } = await supabase
        .from("users")
        .insert([{ wallet: walletAddress, createdAt: new Date().toISOString() }])

      if (insertUserError) throw insertUserError

      // Fetch the newly created user
      const { data: newUser, error: newUserError } = await supabase
        .from("users")
        .select("id")
        .eq("wallet", walletAddress)
        .single()

      if (newUserError || !newUser) throw newUserError

      // Use the new user ID for inserting the coin
      const userId = newUser.id
      const { error: insertCoinError } = await supabase.from("coins").insert([
        {
          ...tokenData,
          owner_id: userId,
          createdAt: new Date().toISOString(),
        },
      ])
      if (insertCoinError) throw insertCoinError
      return
    }
    // If user exists, use their ID for inserting the coin
    // Insert new coin
    const { error: insertError } = await supabase.from("coins").insert([
      {
        ...tokenData,
        owner_id: user.id,
        createdAt: new Date().toISOString(),
      },
    ])

    if (insertError) throw insertError
  } catch (error) {
    console.error("Error storing created token:", error)
  }
}

/**
 * Fetch tokens owned by a specific wallet
 */
export async function fetchOwnedTokens(
  connection: Connection,
  walletAddress: string,
  network: NetworkType,
): Promise<TokenData[]> {
  try {
    // Get user by wallet address
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("wallet", walletAddress)
      .single()

    if (userError || !user) return []

    // Get coins by user id and network
    const { data: coins, error: coinsError } = await supabase
      .from("coins")
      .select("*")
      .eq("owner_id", user.id)

    if (coinsError || !coins) return []

    // Optionally, fetch balances from blockchain here if needed
    return coins as TokenData[]
  } catch (error) {
    console.error("Error fetching owned tokens:", error)
    return []
  }
}

/**
 * Get token price and market data (mock implementation)
 */
export function getTokenMarketData(mintAddress: string) {
  // In a real app, you would fetch this from a price API
  return {
    price: `$${(Math.random() * 10).toFixed(2)}`,
    change: `${Math.random() > 0.5 ? "+" : "-"}${(Math.random() * 10).toFixed(2)}%`,
    volume: `$${(Math.random() * 100000).toFixed(2)}`,
  }
}