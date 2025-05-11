"use client"

import { useWalletContext, type NetworkType } from "@/context/wallet-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

export function NetworkSelector() {
  const { network, setNetwork } = useWalletContext()

  const networks: { value: NetworkType; label: string; color: string }[] = [
    { value: "devnet", label: "Devnet", color: "text-purple-500" },
    { value: "testnet", label: "Testnet", color: "text-blue-500" },
    { value: "mainnet-beta", label: "Mainnet", color: "text-green-500" },
  ]

  const currentNetwork = networks.find((n) => n.value === network)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 border-border/50">
          <Globe className="h-3.5 w-3.5" />
          <span className={currentNetwork?.color}>{currentNetwork?.label || "Network"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {networks.map((item) => (
          <DropdownMenuItem
            key={item.value}
            className={`${item.value === network ? "bg-accent" : ""}`}
            onClick={() => setNetwork(item.value)}
          >
            <span className={item.color}>{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
