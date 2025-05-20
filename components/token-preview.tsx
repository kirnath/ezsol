"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Coins } from "lucide-react";
import CodeBlock from "./code-block";

interface TokenPreviewProps {
  tokenData?: {
    name?: string;
    symbol?: string;
    decimals?: number;
    initialSupply?: string;
    logo?: string | null;
  } | null;
}

export default function TokenPreview({ tokenData }: TokenPreviewProps) {
  const previewData = {
    name: tokenData?.name || "My Awesome Token",
    symbol: tokenData?.symbol || "MAT",
    decimals: tokenData?.decimals || 9,
    initialSupply: tokenData?.initialSupply
      ? Number(tokenData.initialSupply).toLocaleString()
      : "1,000,000",
    logo: tokenData?.logo || null,
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 h-24 flex items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center">
            {previewData.logo ? (
              <img
                src={previewData.logo || "/placeholder.svg"}
                alt={previewData.name}
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <Coins className="h-8 w-8 text-primary" />
            )}
          </div>
        </div>
        <CardContent className="pt-4">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">{previewData.name}</h3>
            <p className="text-sm text-muted-foreground">
              {previewData.symbol}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Decimals</span>
              <span>{previewData.decimals}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Initial Supply</span>
              <span>{previewData.initialSupply}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Token Contract Preview</h3>
        <div className="text-xs font-mono overflow-x-auto">
          <CodeBlock language="rust">
            {`@program_id = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
              @instruction
              def initialize_mint(
                  mint_authority: Pubkey,
                  freeze_authority: Pubkey | None,
                  decimals: u8,
                  mint: Mint,
              ):
                  // Initialize a new SPL token
                  mint.mint_authority = mint_authority
                  mint.freeze_authority = freeze_authority
                  mint.decimals = ${previewData.decimals}
                  mint.is_initialized = True
                  mint.supply = 0`}
          </CodeBlock>
        </div>
      </div>
    </div>
  );
}
