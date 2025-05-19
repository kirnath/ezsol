import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog | EzSol",
  description: "Latest articles, guides, and updates about Solana token creation and management.",
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <main className="min-h-screen bg-background text-foreground">{children}</main>
}
