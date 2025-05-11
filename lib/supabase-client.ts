import { createClient } from "@supabase/supabase-js"

// Define types for our database tables
export type LiquidityPool = {
  id: string
  token_a_mint: string
  token_a_name: string
  token_a_symbol: string
  token_b_mint: string
  token_b_name: string
  token_b_symbol: string
  fee_tier: number
  total_liquidity_usd: number
  volume_24h: number
  created_at: string
  updated_at: string
}

export type UserLiquidity = {
  id: string
  user_wallet: string
  pool_id: string
  token_a_amount: number
  token_b_amount: number
  lp_tokens: number
  created_at: string
  updated_at: string
}

// Create a single supabase client for the entire app
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Track if we've already shown the table missing error
let hasShownTableError = false

// Mock data for when tables don't exist
export const mockLiquidityPools: LiquidityPool[] = [
  {
    id: "1",
    token_a_mint: "So11111111111111111111111111111111111111112",
    token_a_name: "Solana",
    token_a_symbol: "SOL",
    token_b_mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    token_b_name: "USD Coin",
    token_b_symbol: "USDC",
    fee_tier: 0.3,
    total_liquidity_usd: 1250000,
    volume_24h: 450000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    token_a_mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    token_a_name: "USD Coin",
    token_a_symbol: "USDC",
    token_b_mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    token_b_name: "USDT",
    token_b_symbol: "USDT",
    fee_tier: 0.05,
    total_liquidity_usd: 2500000,
    volume_24h: 750000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const mockUserLiquidity: UserLiquidity[] = [
  {
    id: "1",
    user_wallet: "demo_wallet",
    pool_id: "1",
    token_a_amount: 10,
    token_b_amount: 2500,
    lp_tokens: 500,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Function to fetch all liquidity pools
export async function fetchLiquidityPools(): Promise<LiquidityPool[]> {
  try {
    const { data, error } = await supabase.from("liquidity_pools").select("*").order("created_at", { ascending: false })

    if (error) {
      // Check if the error is because the table doesn't exist
      if (error.message.includes("relation") && error.message.includes("does not exist")) {
        if (!hasShownTableError) {
          console.warn("liquidity_pools table does not exist. Using mock data instead.")
          hasShownTableError = true
        }
        return mockLiquidityPools
      }
      throw error
    }
    return data || []
  } catch (error) {
    if (!hasShownTableError) {
      console.error("Error fetching liquidity pools:", error)
      hasShownTableError = true
    }
    return mockLiquidityPools
  }
}

// Function to fetch user liquidity positions
export async function fetchUserLiquidity(walletAddress: string): Promise<UserLiquidity[]> {
  try {
    const { data, error } = await supabase
      .from("user_liquidity")
      .select("*")
      .eq("user_wallet", walletAddress)
      .order("created_at", { ascending: false })

    if (error) {
      // Check if the error is because the table doesn't exist
      if (error.message.includes("relation") && error.message.includes("does not exist")) {
        return mockUserLiquidity.filter((item) => item.user_wallet === walletAddress)
      }
      throw error
    }
    return data || []
  } catch (error) {
    console.error("Error fetching user liquidity:", error)
    return mockUserLiquidity.filter((item) => item.user_wallet === walletAddress)
  }
}

// Function to create a new liquidity pool
export async function createLiquidityPool(
  pool: Omit<LiquidityPool, "id" | "created_at" | "updated_at">,
): Promise<LiquidityPool | null> {
  try {
    const { data, error } = await supabase
      .from("liquidity_pools")
      .insert([
        {
          ...pool,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      // Check if the error is because the table doesn't exist
      if (error.message.includes("relation") && error.message.includes("does not exist")) {
        const mockPool: LiquidityPool = {
          ...pool,
          id: (mockLiquidityPools.length + 1).toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        mockLiquidityPools.push(mockPool)
        return mockPool
      }
      throw error
    }
    return data
  } catch (error) {
    console.error("Error creating liquidity pool:", error)
    return null
  }
}

// Function to add liquidity to a pool
export async function addLiquidity(
  userLiquidity: Omit<UserLiquidity, "id" | "created_at" | "updated_at">,
): Promise<UserLiquidity | null> {
  try {
    const { data, error } = await supabase
      .from("user_liquidity")
      .insert([
        {
          ...userLiquidity,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      // Check if the error is because the table doesn't exist
      if (error.message.includes("relation") && error.message.includes("does not exist")) {
        const mockUserLiq: UserLiquidity = {
          ...userLiquidity,
          id: (mockUserLiquidity.length + 1).toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        mockUserLiquidity.push(mockUserLiq)
        return mockUserLiq
      }
      throw error
    }
    return data
  } catch (error) {
    console.error("Error adding liquidity:", error)
    return null
  }
}

// Function to get liquidity pool stats
export async function getLiquidityStats() {
  try {
    const pools = await fetchLiquidityPools()

    const totalLiquidity = pools.reduce((sum, pool) => sum + pool.total_liquidity_usd, 0)
    const totalVolume24h = pools.reduce((sum, pool) => sum + pool.volume_24h, 0)
    const avgFee = pools.reduce((sum, pool) => sum + pool.fee_tier, 0) / (pools.length || 1)

    return {
      totalLiquidity,
      totalVolume24h,
      avgFee,
      poolCount: pools.length,
    }
  } catch (error) {
    console.error("Error getting liquidity stats:", error)
    return {
      totalLiquidity: 3750000,
      totalVolume24h: 1200000,
      avgFee: 0.175,
      poolCount: 2,
    }
  }
}

// SQL to create the necessary tables
export const createTablesSql = `
-- Create liquidity_pools table
CREATE TABLE IF NOT EXISTS public.liquidity_pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_a_mint TEXT NOT NULL,
  token_a_name TEXT NOT NULL,
  token_a_symbol TEXT NOT NULL,
  token_b_mint TEXT NOT NULL,
  token_b_name TEXT NOT NULL,
  token_b_symbol TEXT NOT NULL,
  fee_tier NUMERIC NOT NULL,
  total_liquidity_usd NUMERIC NOT NULL DEFAULT 0,
  volume_24h NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_liquidity table
CREATE TABLE IF NOT EXISTS public.user_liquidity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_wallet TEXT NOT NULL,
  pool_id UUID NOT NULL REFERENCES public.liquidity_pools(id),
  token_a_amount NUMERIC NOT NULL,
  token_b_amount NUMERIC NOT NULL,
  lp_tokens NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_liquidity_user_wallet ON public.user_liquidity(user_wallet);
CREATE INDEX IF NOT EXISTS idx_user_liquidity_pool_id ON public.user_liquidity(pool_id);
`
