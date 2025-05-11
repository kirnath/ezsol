import { Connection, PublicKey, Transaction, SystemProgram, Keypair } from "@solana/web3.js"
import {
  createInitializeMintInstruction,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
  createMintToInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token"
import { uploadToIPFS, dataURLtoFile, createTokenMetadata } from "./ipfs-utils"

export interface TokenConfig {
  name: string
  symbol: string
  description?: string
  decimals: number
  initialSupply: number
  logo?: string
  isMintable: boolean
  isBurnable: boolean
  isPausable: boolean
}
export interface TokenCreationResult {
  mintAddress: string
  txid: string
  logoCID?: string
  metadataCID?: string
}

/**
 * Calculate the deployment cost based on enabled features
 */
export function calculateDeploymentCost(features: {
  isMintable?: boolean
  isBurnable?: boolean
  isPausable?: boolean
}): number {
  // Base cost
  let cost = 0.08 // Base fee (0.05) + Network fee (0.01) + Platform fee (0.02)

  // Add feature costs
  if (features.isMintable) cost += 0.05
  if (features.isBurnable) cost += 0.05
  if (features.isPausable) cost += 0.05

  return cost
}

/**
 * Create a new token on Solana
 */
export async function createToken(
  connection: Connection,
  payer: PublicKey,
  signTransaction: (transaction: Transaction) => Promise<Transaction>,
  tokenConfig: TokenConfig,
): Promise<TokenCreationResult> {
  try {
    // Step 1: Upload logo to IPFS if provided
    let logoCID: string | undefined
    let metadataCID: string | undefined

    if (tokenConfig.logo) {
      // Convert data URL to file
      const logoFile = dataURLtoFile(tokenConfig.logo, `${tokenConfig.symbol.toLowerCase()}_logo.png`)

      // Upload to IPFS
      logoCID = await uploadToIPFS(logoFile)

      // Create and upload metadata
      metadataCID = await createTokenMetadata(
        {
          name: tokenConfig.name,
          symbol: tokenConfig.symbol,
          description: tokenConfig.description,
        },
        logoCID,
      )
    }

    // Step 2: Create a new mint account
    const mintAccount = Keypair.generate()
    const mintAddress = mintAccount.publicKey.toString()

    // Get minimum lamports required for rent exemption
    const lamports = await getMinimumBalanceForRentExemptMint(connection)

    // Create transaction to create mint account
    const transaction = new Transaction()

    // === Add fee payment instruction ===
    if (!process.env.NEXT_PUBLIC_PLATFORM_PUBLIC_KEY) {
      throw new Error("PLATFORM PUBLIC KEY is not set")
    }
    const FEE_RECIPIENT = new PublicKey(process.env.NEXT_PUBLIC_PLATFORM_PUBLIC_KEY) // <-- Replace with your wallet
    const feeLamports = Math.floor(calculateDeploymentCost(tokenConfig) * 1e9) // Convert SOL to lamports

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: FEE_RECIPIENT,
        lamports: feeLamports,
      }),
    )
    // === End fee payment instruction ===

    // Add instruction to create account
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: mintAccount.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
    )

    // Add instruction to initialize mint
    transaction.add(
      createInitializeMintInstruction(mintAccount.publicKey, tokenConfig.decimals, payer, payer, TOKEN_PROGRAM_ID),
    )

    // Get the associated token account for the payer
    const associatedTokenAccount = await getAssociatedTokenAddress(mintAccount.publicKey, payer)

    // Add instruction to create associated token account if it doesn't exist
    transaction.add(
      createAssociatedTokenAccountInstruction(payer, associatedTokenAccount, payer, mintAccount.publicKey),
    )

    // Add instruction to mint initial supply
    if (tokenConfig.initialSupply > 0) {
      const mintAmount = tokenConfig.initialSupply * Math.pow(10, tokenConfig.decimals)
      transaction.add(createMintToInstruction(mintAccount.publicKey, associatedTokenAccount, payer, BigInt(mintAmount)))
    }

    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = payer

    // Sign transaction with wallet
    const signedTx = await signTransaction(transaction)

    // Sign with mint account
    signedTx.partialSign(mintAccount)

    // Send and confirm transaction
    const txid = await connection.sendRawTransaction(signedTx.serialize())

    // Wait for confirmation
    await connection.confirmTransaction(
      {
        blockhash,
        lastValidBlockHeight,
        signature: txid,
      },
      "confirmed",
    )

    return {
      mintAddress,
      txid,
      logoCID,
      metadataCID,
    }
  } catch (error) {
    console.error("Error creating token:", error)
    throw error
  }
}
