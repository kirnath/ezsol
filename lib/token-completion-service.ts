import { supabase } from "./supabase-client"

export interface CompletedTokenData {
  id?: string
  tokenName: string
  tokenSymbol: string
  tokenLogo?: string
  mintAddress: string
  supply: number | string
  decimals: number
  network: string
  txid: string
  metadataTxid?: string
  logoCID?: string
  metadataCID?: string
  createdAt?: string
  walletAddress: string
}

/**
 * Store token completion data in Supabase
 */
export async function storeTokenCompletion(tokenData: CompletedTokenData): Promise<string | null> {
  try {
   

   // Insert the token completion data
    const { data, error } = await supabase
      .from("completed_tokens")
      .insert([
        {
          token_name: tokenData.tokenName,
          token_symbol: tokenData.tokenSymbol,
          token_logo: tokenData.tokenLogo,
          mint_address: tokenData.mintAddress,
          supply: tokenData.supply.toString(),
          decimals: tokenData.decimals,
          network: tokenData.network,
          txid: tokenData.txid,
          metadata_txid: tokenData.metadataTxid,
          logo_cid: tokenData.logoCID,
          metadata_cid: tokenData.metadataCID,
          wallet_address: tokenData.walletAddress,
          created_at: new Date().toISOString(),
        },
      ])
      .select("id")
      .single()

    if (error) {
      console.error("Error storing token completion:", error)
      return null
    }

    return data?.id || null
  } catch (error) {
    console.error("Error in storeTokenCompletion:", error)
    return null
  }
}

/**
 * Retrieve token completion data from Supabase by ID
 */
export async function getTokenCompletionById(id: string): Promise<CompletedTokenData | null> {
  try {
    const { data, error } = await supabase.from("completed_tokens").select("*").eq("id", id).single()

    if (error) {
      console.error("Error retrieving token completion:", error)
      return null
    }

    if (!data) return null

    return {
      id: data.id,
      tokenName: data.token_name,
      tokenSymbol: data.token_symbol,
      tokenLogo: data.token_logo,
      mintAddress: data.mint_address,
      supply: data.supply,
      decimals: data.decimals,
      network: data.network,
      txid: data.txid,
      metadataTxid: data.metadata_txid,
      logoCID: data.logo_cid,
      metadataCID: data.metadata_cid,
      createdAt: data.created_at,
      walletAddress: data.wallet_address,
    }
  } catch (error) {
    console.error("Error in getTokenCompletionById:", error)
    return null
  }
}

/**
 * SQL function to create the completed_tokens table if it doesn't exist
 */
export const createCompletedTokensTableSql = `
CREATE OR REPLACE FUNCTION create_completed_tokens_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.completed_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_name TEXT NOT NULL,
    token_symbol TEXT NOT NULL,
    token_logo TEXT,
    mint_address TEXT NOT NULL,
    supply TEXT NOT NULL,
    decimals INTEGER NOT NULL,
    network TEXT NOT NULL,
    txid TEXT NOT NULL,
    metadata_txid TEXT,
    logo_cid TEXT,
    metadata_cid TEXT,
    wallet_address TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
  
  -- Create index for better performance
  CREATE INDEX IF NOT EXISTS idx_completed_tokens_wallet_address ON public.completed_tokens(wallet_address);
END;
$$ LANGUAGE plpgsql;
`
