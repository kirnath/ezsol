import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { WalletContextProvider } from "@/context/wallet-context"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { GoogleTagManager } from "@next/third-parties/google"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EzSol | No-Code Solana Token Creation",
  description: "Launch your own Solana token in minutes with our no-code platform. Customize, deploy, and manage without writing code.",
  generator: "Next.js",
  applicationName: "EzSol",
  keywords: ["Solana", "Token Creator", "No-code", "Crypto", "Blockchain", "EzSol"],
  authors: [{ name: "EzSol Team", url: "https://www.ezsol.xyz" }],
  creator: "EzSol",
  publisher: "EzSol",
  metadataBase: new URL("https://www.ezsol.xyz"),
  openGraph: {
    title: "EzSol | No-Code Solana Token Creation",
    description: "Launch your own Solana token in minutes with our no-code platform.",
    url: "https://www.ezsol.xyz",
    siteName: "EzSol",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "EzSol No-Code Solana Token Platform"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "EzSol | No-Code Solana Token Creation",
    description: "Create your own Solana token easily without coding.",
    images: ["/og-image.png"]
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico"
  }
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-background to-background/80 antialiased`}>
      <GoogleTagManager gtmId="AW-17086610736" />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <WalletContextProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </WalletContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
