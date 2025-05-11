"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, X } from "lucide-react"
import { getIPFSUrl } from "@/lib/ipfs-utils"

interface TokenInfoCardProps {
  tokenName: string
  tokenSymbol: string
  tokenLogo?: string
  mintAddress: string
  supply: number
  decimals: number
  network: string
  txid?: string
  logoCID?: string
  metadataCID?: string
  onClose?: () => void
}

export function TokenInfoCard({
  tokenName,
  tokenSymbol,
  tokenLogo,
  mintAddress,
  supply,
  decimals,
  network,
  txid,
  logoCID,
  metadataCID,
  onClose,
}: TokenInfoCardProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const getExplorerUrl = (address: string, type: "address" | "tx" = "address") => {
    const baseUrl =
      network === "mainnet" ? "https://explorer.solana.com" : `https://explorer.solana.com/?cluster=${network}`

    return `${baseUrl}/${type}/${address}`
  }

  const formatNetworkName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader className="relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {tokenLogo || logoCID ? (
                <AvatarImage src={tokenLogo || (logoCID ? getIPFSUrl(logoCID) : undefined)} alt={tokenName} />
              ) : null}
              <AvatarFallback>{tokenSymbol.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{tokenName}</CardTitle>
              <CardDescription>{tokenSymbol}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="capitalize">
            {formatNetworkName(network)}
          </Badge>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Mint Address</h3>
            <div className="flex items-center gap-2">
              <code className="bg-muted px-2 py-1 rounded text-xs flex-1 overflow-hidden text-ellipsis">
                {mintAddress}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => copyToClipboard(mintAddress, "mintAddress")}
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy mint address</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => window.open(getExplorerUrl(mintAddress), "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">View on explorer</span>
              </Button>
            </div>
            {copied === "mintAddress" && <p className="text-xs text-green-500 mt-1">Copied to clipboard!</p>}
          </div>

          {txid && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Transaction ID</h3>
              <div className="flex items-center gap-2">
                <code className="bg-muted px-2 py-1 rounded text-xs flex-1 overflow-hidden text-ellipsis">{txid}</code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => copyToClipboard(txid, "txid")}
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy transaction ID</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => window.open(getExplorerUrl(txid, "tx"), "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">View on explorer</span>
                </Button>
              </div>
              {copied === "txid" && <p className="text-xs text-green-500 mt-1">Copied to clipboard!</p>}
            </div>
          )}

          {logoCID && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Logo IPFS CID</h3>
              <div className="flex items-center gap-2">
                <code className="bg-muted px-2 py-1 rounded text-xs flex-1 overflow-hidden text-ellipsis">
                  {logoCID}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => copyToClipboard(logoCID, "logoCID")}
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy logo CID</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => window.open(getIPFSUrl(logoCID), "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">View on IPFS</span>
                </Button>
              </div>
              {copied === "logoCID" && <p className="text-xs text-green-500 mt-1">Copied to clipboard!</p>}
            </div>
          )}

          {metadataCID && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Metadata IPFS CID</h3>
              <div className="flex items-center gap-2">
                <code className="bg-muted px-2 py-1 rounded text-xs flex-1 overflow-hidden text-ellipsis">
                  {metadataCID}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => copyToClipboard(metadataCID, "metadataCID")}
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy metadata CID</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => window.open(getIPFSUrl(metadataCID), "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">View on IPFS</span>
                </Button>
              </div>
              {copied === "metadataCID" && <p className="text-xs text-green-500 mt-1">Copied to clipboard!</p>}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground">Total Supply</h3>
            <p className="text-xl font-bold">{supply.toLocaleString()}</p>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground">Decimals</h3>
            <p className="text-xl font-bold">{decimals}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <p className="text-xs text-muted-foreground text-center">
          Your token has been successfully created on the Solana {formatNetworkName(network)}. The token logo and
          metadata are stored on IPFS for decentralized access.
        </p>
      </CardFooter>
    </Card>
  )
}
