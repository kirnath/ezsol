import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Blog | EzSol",
  description: "Latest articles, guides, and updates about Solana token creation and management.",
}

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-32 max-w-7xl">
      <div className="space-y-4 text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">EzSol Blog</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover the latest guides, tutorials, and insights about Solana token creation, management, and blockchain
          technology.
        </p>
        <Separator className="my-8" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="flex flex-col h-full">
          <CardHeader className="pb-4">
            <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
              <img
                src="/solana.png?height=400&width=600"
                alt="Solana token creation guide"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span>May 19, 2025</span>
              <span>•</span>
              <span>Beginner</span>
            </div>
            <CardTitle className="text-2xl">
              <Link href="/blog/how-to-create-solana-token-beginners-guide" className="hover:underline">
                How to Create Solana Token: Beginner's Guide
              </Link>
            </CardTitle>
            <CardDescription className="text-base text-foreground/80">
              A step-by-step guide to creating your first Solana token with no prior experience required.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-foreground/80">
              Learn the fundamentals of Solana token creation, from setting up your development environment to deploying
              your first token on the Solana blockchain.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="ghost" className="p-0 h-auto">
              <Link
                href="/blog/how-to-create-solana-token-beginners-guide"
                className="flex items-center gap-2 text-primary"
              >
                Read more <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Placeholder for future articles */}
        <Card className="flex flex-col h-full bg-muted/50">
          <CardHeader className="pb-4">
            <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-muted">
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">Coming Soon</div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span>Coming Soon</span>
            </div>
            <CardTitle className="text-2xl text-muted-foreground">Advanced Solana Token Features</CardTitle>
            <CardDescription className="text-base text-foreground/60">
              Exploring advanced features and customizations for Solana tokens.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-foreground/60">
              This upcoming article will cover advanced topics like token vesting, governance, and specialized use
              cases.
            </p>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-full bg-muted/50">
          <CardHeader className="pb-4">
            <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-muted">
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">Coming Soon</div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span>Coming Soon</span>
            </div>
            <CardTitle className="text-2xl text-muted-foreground">Solana Token Marketing Strategies</CardTitle>
            <CardDescription className="text-base text-foreground/60">
              Effective strategies to market and grow your Solana token project.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-foreground/60">
              Learn how to build community, create awareness, and drive adoption for your Solana token.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
        <p className="text-foreground/80 mb-6 max-w-2xl mx-auto">
          Stay updated with the latest articles, tutorials, and news about Solana token development and blockchain
          technology.
        </p>
        <div className="flex max-w-md mx-auto gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button>Subscribe</Button>
        </div>
      </div>
    </div>
  )
}
