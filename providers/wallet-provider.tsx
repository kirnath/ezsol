"use client"

import type { ReactNode } from "react"
import { WalletContextProvider } from "@/context/wallet-context"

export function WalletProvider({ children }: { children: ReactNode }) {
  return <WalletContextProvider>{children}</WalletContextProvider>
}
