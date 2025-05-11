import Image from "next/image"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface TokenCardProps {
  name: string
  symbol: string
  price: string
  change: string
  volume: string
  image: string
}

const TokenCard = ({ name, symbol, price, change, volume, image }: TokenCardProps) => {
  const isPositive = change.startsWith("+")

  return (
    <div className="glass-effect rounded-lg p-6 transition-all duration-300 hover:translate-y-[-5px]">
      <div className="flex items-center mb-4">
        <div className="relative h-12 w-12 mr-4 overflow-hidden rounded-full bg-primary/10">
          <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
        </div>
        <div>
          <h3 className="text-lg font-bold">{name}</h3>
          <p className="text-sm text-muted-foreground">{symbol}</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Price</span>
          <span className="font-medium">{price}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">24h Change</span>
          <span className={cn("flex items-center font-medium", isPositive ? "text-green-500" : "text-red-500")}>
            {isPositive ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
            {change}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">24h Volume</span>
          <span className="font-medium">{volume}</span>
        </div>
      </div>
    </div>
  )
}

export default TokenCard
