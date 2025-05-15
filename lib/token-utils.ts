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

export function calculateDeploymentCost(features: {
  isMintable?: boolean
  isBurnable?: boolean
  isPausable?: boolean
}): number {
  let cost = 0.08

  if (features.isMintable) cost += 0.05
  if (features.isBurnable) cost += 0.05
  if (features.isPausable) cost += 0.05

  return cost
}

export async function createToken(
  connection: Connection,
  payer: PublicKey,
  signTransaction: (transaction: Transaction) => Promise<Transaction>,
  tokenConfig: TokenConfig,
): Promise<TokenCreationResult> {
  try {
    let logoCID: string | undefined
    let metadataCID: string | undefined

    if (tokenConfig.logo) {
      const logoFile = dataURLtoFile(tokenConfig.logo, `${tokenConfig.symbol.toLowerCase()}_logo.png`)
      logoCID = await uploadToIPFS(logoFile)
      metadataCID = await createTokenMetadata(
        {
          name: tokenConfig.name,
          symbol: tokenConfig.symbol,
          description: tokenConfig.description,
        },
        logoCID,
      )
    }else{
      metadataCID = await createTokenMetadata(
        {
          name: tokenConfig.name,
          symbol: tokenConfig.symbol,
          description: tokenConfig.description,
        },
        undefined,
      )
    }

    const mintAccount = Keypair.generate()
    const mintAddress = mintAccount.publicKey.toString()
    const lamports = await getMinimumBalanceForRentExemptMint(connection)
    const transaction = new Transaction()

    if (!process.env.NEXT_PUBLIC_PLATFORM_PUBLIC_KEY) {
      throw new Error("PLATFORM PUBLIC KEY is not set")
    }
    const FEE_RECIPIENT = new PublicKey(process.env.NEXT_PUBLIC_PLATFORM_PUBLIC_KEY)
    const feeLamports = Math.floor(calculateDeploymentCost(tokenConfig) * 1e9)
    const solToLamports = (feeLamports * 1e9) / Math.pow(10, 9)

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: FEE_RECIPIENT,
        lamports: feeLamports,
      }),
    )

    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: mintAccount.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
    )

    transaction.add(
      createInitializeMintInstruction(mintAccount.publicKey, tokenConfig.decimals, payer, payer, TOKEN_PROGRAM_ID),
    )

    const associatedTokenAccount = await getAssociatedTokenAddress(mintAccount.publicKey, payer)

    transaction.add(
      createAssociatedTokenAccountInstruction(payer, associatedTokenAccount, payer, mintAccount.publicKey),
    )

    if (tokenConfig.initialSupply > 0) {
      const mintAmount = tokenConfig.initialSupply * Math.pow(10, tokenConfig.decimals)
      transaction.add(createMintToInstruction(mintAccount.publicKey, associatedTokenAccount, payer, BigInt(mintAmount)))
    }

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = payer

    const signedTx = await signTransaction(transaction)
    signedTx.partialSign(mintAccount)
    const txid = await connection.sendRawTransaction(signedTx.serialize())

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