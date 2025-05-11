import { 
  Connection, 
  PublicKey, 
  Transaction 
} from "@solana/web3.js";
import {
  createCreateMetadataAccountV3Instruction,
  PROGRAM_ID as METADATA_PROGRAM_ID
} from "@metaplex-foundation/mpl-token-metadata";

/**
 * Attaches metadata to an existing token
 * 
 * @param connection Solana connection
 * @param mintAddress Public key of the token mint
 * @param payer Public key of the payer/authority
 * @param signTransaction Function to sign the transaction
 * @param uri URI to the off-chain metadata (IPFS link)
 * @param name Token name
 * @param symbol Token symbol
 * @returns Transaction signature
 */
export async function attachMetadata(
  connection: Connection,
  mintAddress: PublicKey | string,
  payer: PublicKey,
  signTransaction: (transaction: Transaction) => Promise<Transaction>,
  uri: string,
  name: string,
  symbol: string
): Promise<string> {
  // Convert mintAddress to PublicKey if it's a string
  const mintKey = typeof mintAddress === 'string' ? new PublicKey(mintAddress) : mintAddress;
  
  // Derive the metadata PDA (Program Derived Address)
  const [metadataAccount] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      METADATA_PROGRAM_ID.toBuffer(),
      mintKey.toBuffer(),
    ],
    METADATA_PROGRAM_ID
  );
  
  // Prepare the metadata instruction
  const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
    {
      metadata: metadataAccount,
      mint: mintKey,
      mintAuthority: payer,
      payer: payer,
      updateAuthority: payer,
    },
    {
      createMetadataAccountArgsV3: {
        data: {
          name,
          symbol,
          uri,
          sellerFeeBasisPoints: 0,
          creators: null,
          collection: null,
          uses: null,
        },
        isMutable: true,
        collectionDetails: null,
      },
    }
  );
  
  // Create transaction and add the instruction
  const transaction = new Transaction().add(createMetadataInstruction);
  
  // Get recent blockhash
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = payer;
  
  // Sign and send transaction
  const signedTx = await signTransaction(transaction);
  const txid = await connection.sendRawTransaction(signedTx.serialize());
  
  // Wait for confirmation
  await connection.confirmTransaction(
    {
      blockhash,
      lastValidBlockHeight,
      signature: txid,
    },
    "confirmed"
  );
  
  return txid;
}