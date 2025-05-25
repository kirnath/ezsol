"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Coins, Sparkles, TrendingUp, Zap } from "lucide-react"
import CodeBlock from "./code-block"
import { useState, useEffect } from "react"

interface TokenPreviewProps {
  tokenData?: {
    name?: string
    symbol?: string
    decimals?: number
    initialSupply?: string
    logo?: string | null
  } | null
}

export default function TokenPreview({ tokenData }: TokenPreviewProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [animatedSupply, setAnimatedSupply] = useState(0)

  const previewData = {
    name: tokenData?.name || "My Awesome Token",
    symbol: tokenData?.symbol || "MAT",
    decimals: tokenData?.decimals || 9,
    initialSupply: tokenData?.initialSupply ? Number(tokenData.initialSupply).toLocaleString() : "1,000,000",
    logo: tokenData?.logo || null,
  }

  // Animate supply counter
  useEffect(() => {
    const targetSupply = tokenData?.initialSupply ? Number(tokenData.initialSupply) : 1000000
    let current = 0
    const increment = targetSupply / 50
    const timer = setInterval(() => {
      current += increment
      if (current >= targetSupply) {
        current = targetSupply
        clearInterval(timer)
      }
      setAnimatedSupply(Math.floor(current))
    }, 30)

    return () => clearInterval(timer)
  }, [tokenData?.initialSupply])

  return (
    <div className="space-y-6">
      {/* Enhanced 3D Token Card */}
      <Card
        className="overflow-hidden transform transition-all duration-500 hover:scale-105 cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: isHovered
            ? "perspective(1000px) rotateY(5deg) rotateX(5deg)"
            : "perspective(1000px) rotateY(0deg) rotateX(0deg)",
          boxShadow: isHovered ? "0 25px 50px -12px rgba(139, 92, 246, 0.25)" : "0 10px 25px -3px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Animated Background */}
        <div className="relative bg-gradient-to-br from-primary/20 via-purple-500/20 to-cyan-400/20 h-20 flex items-center justify-center overflow-hidden">
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full animate-pulse"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${2 + i * 0.5}s`,
                }}
              />
            ))}
          </div>

          {/* Token Avatar with Glow */}
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-2xl group-hover:shadow-primary/50 transition-all duration-500">
              {previewData.logo ? (
                <img
                  src={previewData.logo || "/placeholder.svg"}
                  alt={previewData.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <Coins className="h-10 w-10 text-primary group-hover:scale-110 transition-transform duration-300" />
              )}
            </div>
            {/* Glow Effect */}
            <div className="absolute inset-0 h-12 w-12 rounded-full bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all duration-500" />
          </div>
        </div>

        <CardContent className="pt-4 space-y-4">
          {/* Token Info with Animations */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
              {previewData.name}
            </h3>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-base text-muted-foreground font-mono bg-secondary px-3 py-1 rounded-full">
                ${previewData.symbol}
              </span>
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 rounded-lg bg-secondary/50 group-hover:bg-secondary transition-colors duration-300">
              <span className="text-muted-foreground flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                Decimals
              </span>
              <span className="font-semibold">{previewData.decimals}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-secondary/50 group-hover:bg-secondary transition-colors duration-300">
              <span className="text-muted-foreground flex items-center">
                <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                Initial Supply
              </span>
              <span className="font-semibold font-mono">{animatedSupply.toLocaleString()}</span>
            </div>
          </div>

          {/* Token Features Preview */}
          <div className="flex justify-center space-x-4 pt-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
              Mintable
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-1 animate-pulse" />
              Burnable
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1 animate-pulse" />
              Pausable
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Contract Preview */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <h3 className="text-base font-semibold">Smart Contract Preview</h3>
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
        </div>
        <div className="text-xs font-mono overflow-x-auto">
          <CodeBlock language="rust">
            {`// Solana SPL Token Program
@program_id = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"

pub struct TokenMint {
    pub mint_authority: Option<Pubkey>,
    pub supply: u64,
    pub decimals: u8,
    pub is_initialized: bool,
    pub freeze_authority: Option<Pubkey>,
}

impl TokenMint {
    pub fn initialize(
        mint_authority: Pubkey,
        decimals: u8 = ${previewData.decimals},
        initial_supply: u64 = ${animatedSupply},
    ) -> Result<Self> {
        // Initialize ${previewData.name} (${previewData.symbol})
        Ok(Self {
            mint_authority: Some(mint_authority),
            supply: initial_supply,
            decimals,
            is_initialized: true,
            freeze_authority: Some(mint_authority),
        })
    }
}`}
          </CodeBlock>
        </div>
      </div>
    </div>
  )
}
