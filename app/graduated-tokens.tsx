"use client"
import TokenCard from "@/components/token-card";
import { getGraduatedTokens } from "@/lib/moralis-utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface TokenDetails {
    tokenAddress: string;
    decimals: string;
    fullyDilutedValuation: string;
    graduatedAt: string;
    liquidity: string;
    logo: string | null;
    name: string;
    priceNative: string;
    priceUsd: string;
    symbol: string;
}

function formatNumber(numStr: string) {
    const num = parseFloat(numStr);
    if (isNaN(num)) return "0";
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return num.toString();
}

function formatPrice(numStr: string) {
    const num = parseFloat(numStr);
    if (isNaN(num)) return "0";
    if (num >= 1) return num.toFixed(2); // e.g. $1.23
    if (num >= 0.01) return num.toFixed(4); // e.g. $0.0123
    return num.toFixed(6); // e.g. $0.000311
}

export default function GraduatedTokens() {
    const [graduatedTokens, setGraduatedTokens] = useState<TokenDetails[]>([]);

    useEffect(() => {
        const fetchGraduatedTokens = async () => {
            const fetchGraduated = await getGraduatedTokens();
            const tokens = Array.isArray(fetchGraduated)
                ? fetchGraduated.map((token: any) => ({
                      tokenAddress: token.tokenAddress,
                      decimals: token.decimals.toString(),
                      fullyDilutedValuation: token.marketCap?.toString() ?? "0",
                      graduatedAt: token.createdAt?.toString() ?? "",
                      liquidity: token.liquidityUsd?.toString() ?? "0",
                      logo: token.logo || null,
                      name: token.name,
                      priceNative: "", // Not available in your data
                      priceUsd: token.usdPrice?.toString() ?? "0",
                      symbol: token.symbol,
                  }))
                : [];
            console.log("Graduated Tokens:", tokens);
            setGraduatedTokens(tokens);
        };
        fetchGraduatedTokens();
    }, []);

    return (
        <section className="py-20 relative">
            <div className="container">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Popular <span className="gradient-text">Tokens</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Check out some of the most successful tokens created with our platform.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {graduatedTokens.map((token) => (
                        <TokenCard
                            key={token.tokenAddress}
                            name={token.name}
                            symbol={token.symbol}
                            price={`$${formatPrice(token.priceUsd)}`}
                            fdv={`$${formatNumber(token.fullyDilutedValuation)}`}
                            liquidity={`$${formatNumber(token.liquidity)}`}
                            image={token.logo || "/placeholder.svg?height=80&width=80"}
                            tokenAddress={token.tokenAddress}
                        />
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Link href="/tokens" className="text-primary hover:underline">
                        View all tokens
                        <ArrowRight className="ml-1 h-4 w-4 inline" />
                    </Link>
                </div>
            </div>
        </section>
    );
}