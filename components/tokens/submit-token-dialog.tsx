"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, CheckCircle } from "lucide-react"
import { useToastNotification } from "@/components/toast-notification"
import { supabase } from "@/lib/supabase-client"
import fetchTokenOverview from "@/lib/fetch-token-data"
import { useWalletContext } from "@/context/wallet-context"

interface SubmitTokenDialogProps {
  onTokenSubmitted?: () => void
}

export function SubmitTokenDialog({ onTokenSubmitted }: SubmitTokenDialogProps) {
  const [open, setOpen] = useState(false)
  const [tokenAddress, setTokenAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [tokenData, setTokenData] = useState<any>(null)
  const [step, setStep] = useState<"input" | "preview" | "success">("input")
  const toast = useToastNotification()
  const { connected, publicKey, connection, network } = useWalletContext()

  const handleFetchToken = async () => {
    //dev mode
    // return toast.success({
    //   title: "Coming Soon!",
    //   description: `This feature is coming soon.`,
    // })

    if (!tokenAddress.trim()) {
      toast.error({
        title: "Invalid Address",
        description: "Please enter a valid token address",
      })
      return
    }
    if (!connected) {
      toast.error({
        title: "Wallet Not Connected",
        description: "You need to connect your wallet to submit a token.",
      })
      return
    }
    setIsLoading(true)
    try {
      // Fetch token data using existing function
      const tokenInfo = await fetchTokenOverview(tokenAddress.trim())

      if (!tokenInfo) {
        toast.error({
          title: "Token Not Found",
          description: "Could not fetch token information. Please check the address.",
        })
        return
      }

      setTokenData(tokenInfo)
      setStep("preview")
    } catch (error) {
      console.error("Error fetching token:", error)
      toast.error({
        title: "Fetch Failed",
        description: "Failed to fetch token information. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }
  const formatMarketCap = (value: string | number) => {
    const num = Number(value)
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B"
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M"
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K"
    return num.toFixed(2)
  }
  const handleSubmitToken = async () => {
    if (!tokenData) return

    setIsLoading(true)
    try {
      // Insert token into database
      const { data: existingToken, error: checkError } = await supabase
        .from("tokens")
        .select("id")
        .eq("mint_address", tokenAddress.trim())
        .single()

      if (existingToken) {
        toast.error({
          title: "Token Already Exists",
          description: "This token has already been submitted to our platform.",
        })
        setIsLoading(false)
        return
      }

      // Insert new token
      const { data: newToken, error: insertError } = await supabase
        .from("tokens")
        .insert([
          {
            mint_address: tokenAddress.trim(),
            name: tokenData.name || "Unknown Token",
            symbol: tokenData.symbol || "UNKNOWN",
            image_url: tokenData.logoURI || null,
            decimals: tokenData.decimals || 9,
            supply: tokenData.supply || null,
          },
        ])
        .select()
        .single()

      if (insertError) {
        console.error("Error inserting token:", insertError)
        toast.error({
          title: "Submission Failed",
          description: "Failed to submit token to database.",
        })
        return
      }

      // Initialize pump stats for the new token
      const { error: statsError } = await supabase.from("token_pump_stats").insert([
        {
          token_id: newToken.id,
          total_pumps: 0,
          free_pumps: 0,
          paid_pumps: 0,
          pumps_1h: 0,
          pumps_24h: 0,
          pumps_7d: 0,
          pumps_30d: 0,
          pump_velocity: "",
          weighted_score: 0,
          rank_position: null,
        },
      ])

      if (statsError) {
        console.error("Error creating pump stats:", statsError)
        // Don't fail the whole operation for this
      }

      setStep("success")
      toast.success({
        title: "Token Submitted! 🎉",
        description: `${tokenData.name} has been added to our platform.`,
      })

      // Call callback to refresh token list
      onTokenSubmitted?.()
    } catch (error) {
      console.error("Error submitting token:", error)
      toast.error({
        title: "Submission Error",
        description: "An unexpected error occurred.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setTokenAddress("")
    setTokenData(null)
    setStep("input")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-violet-500/30 text-violet-400 hover:bg-violet-500 hover:text-white">
          <Plus className="h-4 w-4 mr-2" />
          Submit Token
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === "success" ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                Token Submitted Successfully!
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Submit New Token
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {step === "input" && "Enter a Solana token address to add it to our pump platform."}
            {step === "preview" && "Review the token information before submitting."}
            {step === "success" && "Your token has been successfully added to the platform!"}
          </DialogDescription>
        </DialogHeader>

        {step === "input" && (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="token-address">Token Address</Label>
              <Input
                id="token-address"
                placeholder="Enter Solana token mint address..."
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
          </div>
        )}

        {step === "preview" && tokenData && (
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              {tokenData.logoURI && (
                <img
                  src={tokenData.logoURI || "/placeholder.svg"}
                  alt={tokenData.name}
                  className="w-12 h-12 rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=48&width=48"
                  }}
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold">{tokenData.name || "Unknown Token"}</h3>
                <p className="text-sm text-muted-foreground">{tokenData.symbol || "UNKNOWN"}</p>
                <p className="text-xs text-muted-foreground font-mono">{tokenAddress}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Decimals:</span>
                <span className="ml-2">{tokenData.decimals || 9}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Market Cap:</span>
                <span className="ml-2">${formatMarketCap(Number(tokenData.marketCap || 0)).toLocaleString()}</span>
              </div>
              {tokenData.supply && (
                <div>
                  <span className="text-muted-foreground">Supply:</span>
                  <span className="ml-2">{Number(tokenData.supply).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <div className="text-center">
              <h3 className="font-semibold text-lg">Token Added Successfully!</h3>
              <p className="text-muted-foreground">{tokenData?.name} is now available for pumping on our platform.</p>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === "input" && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleFetchToken} disabled={isLoading || !tokenAddress.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  "Fetch Token Info"
                )}
              </Button>
            </>
          )}

          {step === "preview" && (
            <>
              <Button variant="outline" onClick={() => setStep("input")}>
                Back
              </Button>
              <Button onClick={handleSubmitToken} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Token"
                )}
              </Button>
            </>
          )}

          {step === "success" && (
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
