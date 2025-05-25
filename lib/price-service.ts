export interface SolPriceData {
    tokenAddress: string
    pairAddress: string
    exchangeName: string
    exchangeAddress: string
    nativePrice: {
      value: string
      symbol: string
      name: string
      decimals: number
    }
    usdPrice: number
    usdPrice24h: number
    usdPrice24hrUsdChange: number
    usdPrice24hrPercentChange: number
    logo: string
    name: string
    symbol: string
    isVerifiedContract: boolean
  }
  
  export async function fetchSolPrice(): Promise<SolPriceData | null> {
    try {
      const response = await fetch("https://pinata.ezsol.xyz/price")
      if (!response.ok) {
        throw new Error("Failed to fetch SOL price")
      }
      const data: SolPriceData = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching SOL price:", error)
      return null
    }
  }
  