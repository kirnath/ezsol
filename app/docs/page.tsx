import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function DocsPage() {
  return (
    <div className="container py-32">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight gradient-text">Documentation</h1>
          <p className="mt-4 text-muted-foreground">Learn how to use EzSol to create and manage your tokens.</p>
        </div>

        <Tabs defaultValue="getting-started" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started with EzSol</CardTitle>
                <CardDescription>Everything you need to know to create your first token.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What is EzSol?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground mb-4">
                        EzSol is a no-code platform that allows anyone to create and manage their own tokens on the
                        Solana blockchain without writing a single line of code.
                      </p>
                      <p className="text-muted-foreground">
                        Our platform provides an intuitive interface for customizing, deploying, and managing tokens,
                        making blockchain technology accessible to everyone.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>Prerequisites</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground mb-2">Before you start creating tokens, you'll need:</p>
                      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>A Solana wallet (Phantom, Solflare, etc.)</li>
                        <li>Some SOL for transaction fees</li>
                        <li>A clear idea of your token's purpose and parameters</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>Creating Your First Token</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground mb-4">Creating your first token is simple:</p>
                      <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                        <li>Connect your Solana wallet</li>
                        <li>Navigate to the "Create Token" page</li>
                        <li>Fill in your token details (name, symbol, supply, etc.)</li>
                        <li>Review your settings</li>
                        <li>Click "Deploy Token" and confirm the transaction in your wallet</li>
                      </ol>
                      <p className="text-muted-foreground mt-4">
                        That's it! Your token will be deployed to the Solana blockchain and you'll be able to manage it
                        from your dashboard.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger>Token Parameters Explained</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 text-muted-foreground">
                        <div>
                          <p className="font-medium text-foreground">Name</p>
                          <p>The full name of your token (e.g., "Solana").</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Symbol</p>
                          <p>A short ticker symbol for your token (e.g., "SOL").</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Decimals</p>
                          <p>
                            The number of decimal places your token can be divided into. Standard is 9 for Solana
                            tokens.
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Initial Supply</p>
                          <p>The initial amount of tokens to create.</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Maximum Supply</p>
                          <p>The maximum amount of tokens that can ever exist. Leave empty for unlimited supply.</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger>Managing Your Tokens</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground mb-4">
                        After creating your token, you can manage it from your dashboard:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>View token statistics and analytics</li>
                        <li>Track holder growth and distribution</li>
                        <li>Mint additional tokens (if enabled)</li>
                        <li>Burn tokens (if enabled)</li>
                        <li>Pause/unpause transfers (if enabled)</li>
                        <li>View transaction history</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guides">
            <Card>
              <CardHeader>
                <CardTitle>Guides & Tutorials</CardTitle>
                <CardDescription>Step-by-step guides to help you make the most of EzSol.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="text-lg font-medium mb-2">Creating a Community Token</h3>
                    <p className="text-muted-foreground mb-4">
                      Learn how to create and distribute a token for your community or fan base.
                    </p>
                    <p className="text-sm text-primary">Coming soon...</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h3 className="text-lg font-medium mb-2">Setting Up Token Vesting</h3>
                    <p className="text-muted-foreground mb-4">
                      A guide to implementing token vesting schedules for team members and investors.
                    </p>
                    <p className="text-sm text-primary">Coming soon...</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h3 className="text-lg font-medium mb-2">Creating an NFT Collection</h3>
                    <p className="text-muted-foreground mb-4">
                      Step-by-step guide to creating and managing an NFT collection on Solana.
                    </p>
                    <p className="text-sm text-primary">Coming soon...</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h3 className="text-lg font-medium mb-2">Integrating Your Token with DeFi Platforms</h3>
                    <p className="text-muted-foreground mb-4">
                      Learn how to list your token on DEXs and integrate with other DeFi platforms.
                    </p>
                    <p className="text-sm text-primary">Coming soon...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API Reference</CardTitle>
                <CardDescription>Technical documentation for developers integrating with EzSol.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64">
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
