"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Clock, TrendingUp, Rocket } from "lucide-react"
import TrendingTab from "@/components/tokens/trending-tab"
import MostPumpedTab from "@/components/tokens/most-pumped-tab"
import NewListingsTab from "@/components/tokens/new-listings-tab"

export default function TokensPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const getTabDescription = () => {
    switch (activeTab) {
      case "all":
        return "Discover the latest tokens launched across the Solana network. Fresh opportunities await with newly minted tokens ready for exploration."
      case "trending":
        return "Explore tokens gaining momentum in the market. These tokens are experiencing significant trading volume and community interest right now."
      case "most-pumped":
        return "Community favorites ranked by upvotes. These tokens have earned the most support and enthusiasm from our vibrant community of traders and investors."
      default:
        return "Find the latest tokens across Solana network"
    }
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Token Explorer</h1>
        <p className="text-muted-foreground mb-4">Find the latest tokens across Solana network</p>

        {/* Dynamic description based on active tab */}
        <div className="bg-muted/30 border border-muted rounded-lg p-4 mb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">{getTabDescription()}</p>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tokens by name or symbol..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <span>Filter</span>
          </Button>
          <Button variant="outline">
            <span>Advanced</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="mb-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3 h-12 p-1 bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg">
            <TabsTrigger
              value="all"
              className="h-10 px-6 data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:shadow-sm font-medium text-slate-400 transition-all duration-200 rounded-md"
            >
              <Clock className="h-4 w-4 mr-2" />
              New Listing
            </TabsTrigger>
            <TabsTrigger
              value="trending"
              className="h-10 px-6 data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:shadow-sm font-medium text-slate-400 transition-all duration-200 rounded-md"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger
              value="most-pumped"
              className="h-10 px-6 data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:shadow-sm font-medium text-slate-400 transition-all duration-200 rounded-md"
            >
              <Rocket className="h-4 w-4 mr-2" />
              Most Pumped
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          <NewListingsTab searchTerm={searchTerm} />
        </TabsContent>

        <TabsContent value="trending" className="mt-0">
          <TrendingTab searchTerm={searchTerm} />
        </TabsContent>

        <TabsContent value="most-pumped" className="mt-0">
          <MostPumpedTab searchTerm={searchTerm} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
