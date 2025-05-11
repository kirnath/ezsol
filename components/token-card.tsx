import Image from "next/image";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TokenCardProps {
  name: string;
  symbol: string;
  price: string;
  fdv: string;
  liquidity: string;
  image: string;
  tokenAddress?: string;
  priceChange24h?: number; // <-- add this line
}

const TokenCard = ({
  name,
  symbol,
  price,
  fdv,
  liquidity,
  image,
  tokenAddress,
  priceChange24h // <-- add this line
}: TokenCardProps) => {
  const isPositive = typeof priceChange24h === "number" ? priceChange24h >= 0 : false;
  const isSmallChange =
    (typeof priceChange24h === "number" && priceChange24h > 0 && priceChange24h < 0.5) ||
    priceChange24h == null;

  return (
    <a
      href={`https://dexscreener.com/solana/${tokenAddress ?? ""}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="glass-effect rounded-lg p-6 transition-all duration-300 hover:translate-y-[-5px] hover:cursor-pointer">
        <div className="flex items-center mb-4">
          <div className="relative h-12 w-12 mr-4 overflow-hidden rounded-full bg-primary/10">
            <Image
              src={image || "/placeholder.svg"}
              alt="image"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold">{name}</h3>
            <p className="text-sm text-muted-foreground">{symbol}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Price</span>
            <span
              className={cn(
                "flex items-center font-medium",
                !isSmallChange && (isPositive ? "text-green-500" : "text-red-500")
              )}
            >
              {!isSmallChange ? (
                isPositive ? (
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                )
              ) : null}
              {price}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">FDV</span>
            <span
              className=
                "flex items-center font-medium">
              {fdv}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Liquidity</span>
            <span className="font-medium">{liquidity}</span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default TokenCard;
