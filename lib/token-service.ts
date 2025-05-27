import { createClient } from "@supabase/supabase-js"
import type { Connection } from "@solana/web3.js"
import type { NetworkType } from "@/context/wallet-context"
import axios from "axios"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export interface TokenData {
  name: string
  symbol: string
  mintAddress: string
  createdAt: string
  logo?: string
  balance?: string
  decimals: number
  supply?: string
  network?: NetworkType
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
 * Fetch all recently created tokens
 */
export async function fetchRecentTokens(limit = 20): Promise<TokenData[]> {
  try {
    // Get recent coins ordered by creation date
    const { data: coins, error: coinsError } = await supabase
      .from("coins")
      .select("*")
      .order("createdAt", { ascending: false })
      .limit(limit)

    if (coinsError || !coins) return []

    return coins as TokenData[]
  } catch (error) {
    console.error("Error fetching recent tokens:", error)
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
      .order("createdAt", { ascending: false })
      .single()
      

    if (userError || !user) return []

    // Get coins by user id and network
    const { data: coins, error: coinsError } = await supabase
      .from("coins")
      .select("*")
      .eq("owner_id", user.id)
      .order("createdAt", { ascending: false })

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
export async function getTokenMarketData(mintAddress: string) {
  if(!mintAddress) return;
  try{
    const response = await axios.get(`https://pinata.ezsol.xyz/token-overview/${mintAddress}`)
    return response.data
  }catch (error) {
    console.error("Error fetching token market data:", error)
  }
}
