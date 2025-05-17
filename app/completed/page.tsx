"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TokenInfoCard } from "@/components/token-info-card"
import { getTokenCompletionById } from "@/lib/token-completion-service"
import { Share2, Copy, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useToastNotification } from "@/components/toast-notification"

export default function CompletedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const toast = useToastNotification()
  const [tokenData, setTokenData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Get token ID from URL params
  const tokenId = searchParams.get("id")

  useEffect(() => {
    async function fetchTokenData() {
      setLoading(true)

      // If we have a token ID in the URL, try to fetch from Supabase
      if (tokenId) {
        const tokenData = await getTokenCompletionById(tokenId)
        if (tokenData) {
          setTokenData(tokenData)
          setLoading(false)
          return
        }
      }

      // Fallback to localStorage if no token ID or Supabase fetch failed
      const storedToken = localStorage.getItem("createdToken")
      if (storedToken) {
        try {
          setTokenData(JSON.parse(storedToken))
        } catch (error) {
          console.error("Failed to parse token data:", error)
        }
      }

      setLoading(false)
    }

    fetchTokenData()
  }, [tokenId])

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success({
          title: "Copied!",
          description: message,
        })
      },
      (err) => {
        toast.error({
          title: "Failed to copy",
          description: "Could not copy to clipboard",
        })
        console.error("Could not copy text: ", err)
      },
    )
  }

  const getExplorerUrl = (mintAddress: string, network: string) => {
    const baseUrl =
      network === "mainnet" ? "https://explorer.solana.com" : "https://explorer.solana.com/?cluster=devnet"
    return `${baseUrl}/address/${mintAddress}`
  }

  if (loading) {
    return (
      <div className="container py-32">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight gradient-text">Loading...</h1>
            <p className="mt-4 text-muted-foreground">Retrieving your token information</p>
          </div>
          <Card className="glass-effect border-border/50">
            <CardContent className="flex items-center justify-center py-16">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-2 bg-slate-200 rounded"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                      <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                    </div>
                    <div className="h-2 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!tokenData) {
    return (
      <div className="container py-32">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight gradient-text">Token Information Not Found</h1>
            <p className="mt-4 text-muted-foreground">We couldn't find information about your created token.</p>
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <Button className="gradient-border" onClick={() => router.push("/create")}>
              Create a Token
            </Button>
            <Button variant="outline" className="border-border/50" onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-32">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight gradient-text">Token Created!</h1>
          <p className="mt-4 text-muted-foreground">
            Your token has been successfully created on the Solana blockchain.
          </p>
        </div>

        <TokenInfoCard {...tokenData} onClose={() => {}} />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => copyToClipboard(tokenData.mintAddress, "Token address copied to clipboard")}
          >
            <Copy className="h-4 w-4" /> Copy Address
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              const url = window.location.href
              copyToClipboard(url, "Link copied to clipboard")
            }}
          >
            <Share2 className="h-4 w-4" /> Share Token
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => window.open(getExplorerUrl(tokenData.mintAddress, tokenData.network), "_blank")}
          >
            <ExternalLink className="h-4 w-4" /> View on Explorer
          </Button>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Button
            variant="outline"
            className="border-border/50"
            onClick={() => {
              localStorage.removeItem("createdToken")
              router.push("/create")
            }}
          >
            Create Another Token
          </Button>
          <Button className="gradient-border" onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
