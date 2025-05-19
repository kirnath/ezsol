import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Clock, Calendar, User, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CodeBlock from "@/components/code-block";

export const metadata: Metadata = {
  title: "How to Create Solana Token: Beginner's Guide | EzSol",
  description:
    "A comprehensive step-by-step guide for beginners on how to create your own Solana token with no prior experience required.",
};

export default function SolanaTokenGuide() {
  return (
    <div className="container mx-auto px-4 py-32 max-w-4xl">
      <div className="mb-8">
        <Link
          href="/blog"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>
      </div>

      <article className="prose prose-lg max-w-none">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            How to Create Solana Token: Beginner's Guide
          </h1>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              May 19, 2025
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              15 min read
            </div>
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              By EzSol Team
            </div>
          </div>

          <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-8">
            <img
              src="/solana.png?height=800&width=1200"
              alt="Solana token creation"
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <div className="space-y-6">
          <p className="lead text-xl text-foreground">
            Creating your own token on the Solana blockchain might seem
            intimidating if you're new to blockchain development, but with the
            right tools and guidance, it can be a straightforward process. This
            guide will walk you through creating your first Solana token using
            the command line interface (CLI).
          </p>

          <Alert>
            <AlertDescription className="text-foreground">
              This guide is intended for educational purposes. Always conduct
              thorough research and consider consulting with legal and financial
              advisors before launching a token for commercial purposes.
            </AlertDescription>
          </Alert>

          <h2 className="text-2xl font-bold mt-8 text-foreground">
            What is a Solana Token?
          </h2>

          <p className="text-foreground/90">
            Solana tokens are digital assets that exist on the Solana
            blockchain. They can represent anything from cryptocurrencies and
            stablecoins to governance rights or in-game items. Solana's high
            throughput and low transaction costs make it an attractive platform
            for token creation.
          </p>

          <p className="text-foreground/90">
            Tokens on Solana follow the SPL (Solana Program Library) Token
            standard, which is similar to Ethereum's ERC-20 but optimized for
            Solana's architecture.
          </p>

          <h2 className="text-2xl font-bold mt-8 text-foreground">
            Prerequisites
          </h2>

          <p className="text-foreground/90">
            Before you begin, make sure you have:
          </p>

          <ul className="text-foreground/90">
            <li>A Solana wallet (like Phantom or Solflare)</li>
            <li>
              Some SOL for transaction fees and account creation (approximately
              0.5-1 SOL)
            </li>
            <li>Basic understanding of command line interfaces</li>
            <li>Node.js and npm installed on your computer</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 text-foreground">
            Step 1: Set Up Your Development Environment
          </h2>

          <p className="text-foreground/90">
            First, you'll need to install the Solana CLI tools and other
            necessary components:
          </p>

          <CodeBlock language="bash" className="mt-6">
            {`# Install Solana CLI tools
sh -c "$(curl -sSfL https://release.solana.com/v1.16.0/install)"

# Update your PATH (add this to your .bashrc or .zshrc)
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Verify installation
solana --version

# Install SPL Token CLI
npm install -g @solana/spl-token`}
          </CodeBlock>

          <h2 className="text-2xl font-bold mt-8 text-foreground">
            Step 2: Create a Solana Wallet
          </h2>

          <p className="text-foreground/90">
            You'll need a Solana wallet to create and manage your token. You can
            create one using the Solana CLI:
          </p>

          <CodeBlock language="bash">
            {`# Generate a new keypair
solana-keygen new --outfile ~/my-solana-wallet.json

# Set this as your default wallet
solana config set --keypair ~/my-solana-wallet.json

# Check your wallet address
solana address`}
          </CodeBlock>

          <p className="text-foreground/90">
            Make sure to keep your wallet file secure and backed up. Anyone with
            access to this file can control your tokens.
          </p>

          <h2 className="text-2xl font-bold mt-8 text-foreground">
            Step 3: Connect to a Solana Cluster
          </h2>

          <p className="text-foreground/90">
            You can choose to work on the Solana mainnet, testnet, or devnet.
            For beginners, it's recommended to start with devnet:
          </p>

          <CodeBlock language="bash">
            {`# Connect to devnet
solana config set --url https://api.devnet.solana.com

# Request some SOL from the devnet faucet
solana airdrop 2`}
          </CodeBlock>

          <h2 className="text-2xl font-bold mt-8 text-foreground">
            Step 4: Create Your Token
          </h2>

          <p className="text-foreground/90">
            Now you're ready to create your token using the SPL Token CLI:
          </p>

          <CodeBlock language="bash">
            {`# Create a new token
spl-token create-token

# The output will show your token address, for example:
# Creating token AKxs9PN7RXLkJZU9ZfJXPPuREP7WJUGEyQEj9YAqFxMX`}
          </CodeBlock>

          <p className="text-foreground/90">
            By default, this creates a token with 9 decimals of precision. If
            you want to specify different parameters:
          </p>

          <CodeBlock language="bash">
            {`# Create a token with 6 decimals
spl-token create-token --decimals 6`}
          </CodeBlock>

          <h2 className="text-2xl font-bold mt-8 text-foreground">
            Step 5: Create a Token Account
          </h2>

          <p className="text-foreground/90">
            Before you can mint tokens, you need to create an account to hold
            them:
          </p>

          <CodeBlock language="bash">
            {`# Create a token account
spl-token create-account YOUR_TOKEN_ADDRESS

# For example:
# spl-token create-account AKxs9PN7RXLkJZU9ZfJXPPuREP7WJUGEyQEj9YAqFxMX`}
          </CodeBlock>

          <h2 className="text-2xl font-bold mt-8 text-foreground">
            Step 6: Mint Tokens
          </h2>

          <p className="text-foreground/90">
            Now you can mint tokens to your account:
          </p>

          <CodeBlock language="bash">
            {`# Mint 1000 tokens to your account
spl-token mint YOUR_TOKEN_ADDRESS 1000

# Check your balance
spl-token balance YOUR_TOKEN_ADDRESS`}
          </CodeBlock>

          <p className="text-foreground/90">
            Remember that the number of tokens will be adjusted based on the
            decimals you specified. For example, if you used 9 decimals, minting
            1000 tokens actually creates 1000 * 10^9 token units.
          </p>

          <h2 className="text-2xl font-bold mt-8 text-foreground">
            Step 7: Configure Token Properties
          </h2>

          <p className="text-foreground/90">
            You might want to disable future minting once you've created all the
            tokens you need:
          </p>

          <CodeBlock language="bash">
            {`# Disable future minting
spl-token authorize YOUR_TOKEN_ADDRESS mint --disable`}
          </CodeBlock>

          <h2 className="text-2xl font-bold mt-8 text-foreground">
            Step 8: Add Token Metadata
          </h2>

          <p className="text-foreground/90">
            To add metadata like a name, symbol, and logo to your token, you'll
            need to use the Metaplex Token Metadata program:
          </p>

          <CodeBlock language="javascript">
            {`# First, install the Metaplex CLI
npm install -g @metaplex-foundation/js @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults

# Create a metadata.json file with your token information
cat > metadata.json << EOF
{
  "name": "My Token",
  "symbol": "MTKN",
  "description": "This is my first Solana token",
  "image": "https://your-image-url.com/token-logo.png"
}
EOF

# Upload metadata to Arweave or IPFS (this is a simplified example)
# In practice, you would use a service like NFT.Storage or Arweave

# Then use Metaplex to create metadata for your token
# This is a complex step that requires custom code
# Here's a simplified example of what the code might look like:

node -e "
const { Metaplex } = require('@metaplex-foundation/js');
const { Connection, clusterApiUrl, PublicKey } = require('@solana/web3.js');
const { Keypair } = require('@solana/web3.js');
const fs = require('fs');

async function createMetadata() {
  const connection = new Connection(clusterApiUrl('devnet'));
  const wallet = Keypair.fromSecretKey(
    Buffer.from(JSON.parse(fs.readFileSync('~/my-solana-wallet.json', 'utf-8')))
  );
  
  const metaplex = new Metaplex(connection).use(walletAdapterIdentity(wallet));
  
  const metadata = {
    name: 'My Token',
    symbol: 'MTKN',
    uri: 'https://arweave.net/your-metadata-uri',
    sellerFeeBasisPoints: 0,
  };
  
  const tokenMint = new PublicKey('YOUR_TOKEN_ADDRESS');
  
  await metaplex.nfts().createSft({
    uri: metadata.uri,
    name: metadata.name,
    sellerFeeBasisPoints: metadata.sellerFeeBasisPoints,
    symbol: metadata.symbol,
    tokenOwner: wallet.publicKey,
    updateAuthority: wallet.publicKey,
    mintAuthority: wallet.publicKey,
    tokenStandard: 'fungible',
    mintAddress: tokenMint,
  });
  
  console.log('Metadata created successfully');
}

createMetadata().catch(console.error);
"`}
          </CodeBlock>

          <div className="bg-muted p-6 rounded-lg my-8">
            <h3 className="text-xl font-semibold mb-4 text-foreground">
              Note on Metadata
            </h3>
            <p className="text-foreground/90">
              Adding metadata is one of the more complex steps in token
              creation. The example above is simplified and may need adjustments
              based on the latest Metaplex SDK. For production tokens, you might
              want to use a more user-friendly solution.
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 text-foreground">
            Step 9: Transfer Tokens
          </h2>

          <p className="text-foreground/90">
            You can transfer tokens to other wallets:
          </p>

          <CodeBlock language="bash">
            {`# Transfer 100 tokens to another wallet
spl-token transfer YOUR_TOKEN_ADDRESS 100 RECIPIENT_WALLET_ADDRESS --allow-unfunded-recipient

# For example:
# spl-token transfer AKxs9PN7RXLkJZU9ZfJXPPuREP7WJUGEyQEj9YAqFxMX 100 9ZfJXPPuREP7WJUGEyQEj9YAqFxMXAKxs9PN7RXLkJZU --allow-unfunded-recipient`}
          </CodeBlock>

          <h2 className="text-2xl font-bold mt-8 text-foreground">
            Step 10: Create Liquidity (Optional)
          </h2>

          <p className="text-foreground/90">
            To make your token tradable, you'll need to create liquidity on a
            decentralized exchange. This typically involves:
          </p>

          <ol className="list-decimal pl-6 space-y-4 text-foreground/90">
            <li>
              <strong>Choose a DEX:</strong> Select a Solana-based decentralized
              exchange like Raydium or Orca.
            </li>
            <li>
              <strong>Connect your wallet</strong> to the DEX's web interface.
            </li>
            <li>
              <strong>Create a Liquidity Pool:</strong> Provide your token and
              SOL (or another established token) to create a trading pair.
            </li>
            <li>
              <strong>Set Initial Price:</strong> The ratio of tokens in the
              pool will determine the initial price.
            </li>
          </ol>

          <div className="bg-muted p-6 rounded-lg my-8">
            <h3 className="text-xl font-semibold mb-4 text-foreground">
              Pro Tip: Testing on Devnet
            </h3>
            <p className="text-foreground/90">
              Before deploying your token on the main Solana network (mainnet),
              it's wise to thoroughly test on devnet. This allows you to
              experiment without using real SOL.
            </p>
            <p className="mt-2 text-foreground/90">
              When you're ready for mainnet, simply change your Solana
              configuration:
            </p>
            <CodeBlock language="bash">
              solana config set --url https://api.mainnet-beta.solana.com
            </CodeBlock>
          </div>

          <h2 className="text-2xl font-bold mt-8 text-foreground">
            Common Challenges and Solutions
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                Insufficient SOL Balance
              </h3>
              <p className="text-foreground/90">
                Creating a token requires SOL for transaction fees and account
                creation. If you're on devnet, you can request more SOL using{" "}
                <code>solana airdrop 2</code>.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground">
                Transaction Failures
              </h3>
              <p className="text-foreground/90">
                If transactions fail, check your network connection and try
                again. Sometimes Solana can experience congestion, requiring a
                retry. You can also increase the compute budget for complex
                transactions:
                <code>--compute-budget 200000</code>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground">
                Token Not Appearing in Wallet
              </h3>
              <p className="text-foreground/90">
                Some wallets require you to manually add custom tokens. Use the
                "Add Token" feature in your wallet and enter your token's
                address.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 text-foreground">
            A Simpler Alternative: Using EzSol
          </h2>

          <p className="text-foreground/90">
            While creating tokens via CLI gives you complete control, it can be
            technical and time-consuming. If you prefer a more user-friendly
            approach, EzSol provides a simple web interface for token creation:
          </p>

          <ol className="list-decimal pl-6 space-y-4 text-foreground/90">
            <li>
              <strong>Connect Your Wallet:</strong> Navigate to the EzSol Create
              page and connect your Solana wallet.
            </li>
            <li>
              <strong>Fill in Token Details:</strong> Enter your token's name,
              symbol, decimals, and initial supply.
            </li>
            <li>
              <strong>Configure Advanced Options:</strong> Decide whether your
              token will be mintable and if you want to enable freezing
              functionality.
            </li>
            <li>
              <strong>Create Token:</strong> Approve the transaction in your
              wallet, and EzSol handles all the technical details for you.
            </li>
          </ol>

          <p className="text-foreground/90 mt-4">
            This approach is particularly useful for beginners or those who want
            to create tokens quickly without dealing with command-line
            interfaces.
          </p>

          <h2 className="text-2xl font-bold mt-8 text-foreground">
            Conclusion
          </h2>

          <p className="text-foreground/90">
            Creating a Solana token using the CLI gives you a deeper
            understanding of how tokens work on the blockchain. While it
            requires more technical knowledge than using a platform like EzSol,
            it provides complete control over the token creation process.
          </p>

          <p className="text-foreground/90">
            Remember that creating a token is just the beginning. Building
            utility, community, and liquidity are crucial steps for any
            successful token project.
          </p>

          <div className="my-8">
            <Separator />
          </div>

          <div className="flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link href="/blog" className="text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2 text-foreground"
            >
              <Share2 className="h-4 w-4" />
              Share Article
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}
