"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  ConnectionProvider,
  WalletProvider,
  useWallet as useWalletAdapter,
  useConnection,
} from "@solana/wallet-adapter-react"
import type { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets"
import { clusterApiUrl, type Connection, type PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"

// Import wallet adapter CSS
import "@solana/wallet-adapter-react-ui/styles.css"

export type NetworkType = "devnet" | "mainnet-beta" | "testnet"

interface WalletContextProps {
  connected: boolean
  connecting: boolean
  publicKey: string | null
  walletName: string | null
  walletIcon: string | null
  balance: number | null
  network: NetworkType
  connection: Connection | null
  connectWallet: () => void
  disconnectWallet: () => void
  refreshBalance: () => Promise<void>
}

const WalletContext = createContext<WalletContextProps>({
  connected: false,
  connecting: false,
  publicKey: null,
  walletName: null,
  walletIcon: null,
  balance: null,
  network: "devnet",
  connection: null,
  connectWallet: () => {},
  disconnectWallet: () => {},
  refreshBalance: async () => {},
})

export const useWalletContext = () => useContext(WalletContext)

interface WalletContextProviderProps {
  children: ReactNode
}

export function WalletContextProvider({ children }: WalletContextProviderProps) {
  // Get network from env, default to 'devnet' if not set
  const network = (process.env.NEXT_PUBLIC_NETWORK as NetworkType) || "devnet"
  const DEVNET_RPC = `https://courtney-pgsun1-fast-devnet.helius-rpc.com`
  const HELIUS_RPC = `https://alma-cecxft-fast-mainnet.helius-rpc.com`
  // Get the endpoint based on the selected network
  const endpoint = network === "mainnet-beta" ? HELIUS_RPC : DEVNET_RPC

  // Initialize wallet adapters
  const wallets = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new CoinbaseWalletAdapter(),
    new TorusWalletAdapter(),
    new LedgerWalletAdapter(),
  ]

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletContextContent network={network}>{children}</WalletContextContent>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

function WalletContextContent({
  children,
  network,
}: {
  children: ReactNode
  network: NetworkType
}) {
  const { publicKey, connected, connecting, wallet, disconnect, select } = useWalletAdapter()
  const { connection } = useConnection()
  const [balance, setBalance] = useState<number | null>(null)

  // Format public key for display
  const formattedPublicKey = publicKey
    ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`
    : null

  // Get wallet name and icon
  const walletName = wallet?.adapter.name || null
  const walletIcon = wallet?.adapter.icon || null

  // Connect wallet function
  const connectWallet = () => {
    if (wallet) {
      select(wallet.adapter.name)
    }
  }

  // Disconnect wallet function
  const disconnectWallet = () => {
    disconnect()
  }

  // Fetch balance function
  const fetchBalance = async (pubKey: PublicKey) => {
    try {
      const balanceInLamports = await connection.getBalance(pubKey)
      return balanceInLamports / LAMPORTS_PER_SOL
    } catch (error) {
      console.error("Error fetching balance:", error)
      return null
    }
  }

  // Refresh balance function
  const refreshBalance = async () => {
    if (connected && publicKey) {
      const newBalance = await fetchBalance(publicKey)
      setBalance(newBalance !== null ? Number(newBalance.toFixed(2)) : null)
    }
  }

  // Fetch balance when connected or network changes
  useEffect(() => {
    if (connected && publicKey) {
      refreshBalance()
    } else {
      setBalance(null)
    }
  }, [connected, publicKey, network, connection])

  const contextValue: WalletContextProps = {
    connected,
    connecting,
    publicKey: publicKey ? publicKey.toString() : null,
    walletName,
    walletIcon,
    balance,
    network,
    connection,
    connectWallet,
    disconnectWallet,
    refreshBalance,
  }

  return <WalletContext.Provider value={contextValue}>{children}</WalletContext.Provider>
}

export const useWallet = useWalletAdapter
