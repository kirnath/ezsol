"use client"

import { useState, useEffect } from "react"
import { useWalletContext } from "@/context/wallet-context"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useWallet } from "@solana/wallet-adapter-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import TokenCreationForm from "@/components/token-creation-form"
import TokenPreview from "@/components/token-preview"
import { Wallet, Sparkles, Zap, TrendingUp } from "lucide-react"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { ProgressSteps, type Step } from "@/components/progress-steps"
import { useToastNotification } from "@/components/toast-notification"
import { createToken, calculateDeploymentCost, type TokenConfig } from "@/lib/token-utils"
import { storeCreatedToken } from "@/lib/token-service"
import { attachMetadata } from "@/lib/metaplex"
import { useRouter } from "next/navigation"
import { storeTokenCompletion } from "@/lib/token-completion-service"

const tokenCreationSteps: Step[] = [
  {
    id: "prepare",
    title: "Prepare Token",
    description: "Preparing token metadata and configuration",
  },
  {
    id: "upload",
    title: "Upload Metadata",
    description: "Uploading token logo and metadata to IPFS",
  },
  {
    id: "create",
    title: "Create Token",
    description: "Creating token on the Solana blockchain",
  },
  {
    id: "mint",
    title: "Mint Initial Supply",
    description: "Minting the initial token supply",
  },
  {
    id: "finalize",
    title: "Finalize",
    description: "Finalizing token creation and updating records",
  },
]

export default function CreatePage() {
  const { connected, connection, network, refreshBalance } = useWalletContext()
  const { setVisible } = useWalletModal()
  const { publicKey, signTransaction } = useWallet()
  const toast = useToastNotification()
  const router = useRouter()

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [tokenConfig, setTokenConfig] = useState<TokenConfig | null>(null)

  const [isCreating, setIsCreating] = useState(false)
  const [currentStep, setCurrentStep] = useState<string>("prepare")
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const [createdToken, setCreatedToken] = useState<any>(null)
  const [tokenCompletionId, setTokenCompletionId] = useState<string | null>(null)

  const [deploymentCost, setDeploymentCost] = useState(0.23)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)

  // Animation states
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [isPreviewVisible, setIsPreviewVisible] = useState(false)
  const [isCostVisible, setIsCostVisible] = useState(false)

  useEffect(() => {
    // Staggered animations on mount
    const timer1 = setTimeout(() => setIsFormVisible(true), 200)
    const timer2 = setTimeout(() => setIsPreviewVisible(true), 400)
    const timer3 = setTimeout(() => setIsCostVisible(true), 600)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  useEffect(() => {
    if (tokenConfig) {
      const cost = calculateDeploymentCost({
        isMintable: tokenConfig.isMintable,
        isBurnable: tokenConfig.isBurnable,
        isPausable: tokenConfig.isPausable,
      })
      setDeploymentCost(cost)
    }
  }, [tokenConfig])

  useEffect(() => {
    if (createdToken && tokenCompletionId) {
      router.push(`/completed?id=${tokenCompletionId}`)
    }
  }, [createdToken, tokenCompletionId, router])

  const handleFormSubmit = (values: TokenConfig) => {
    setTokenConfig(values)
    setSaved(true)
  }

  const createTokenOnChain = async () => {
    if (!tokenConfig || !publicKey || !connection || !signTransaction) {
      toast.error({
        title: "Error",
        description: "Missing required information to create token",
      })
      return
    }

    setIsCreating(true)
    setCurrentStep("prepare")
    setCompletedSteps([])

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCompletedSteps((prev) => [...prev, "prepare"])
      setCurrentStep("upload")

      if (tokenConfig.logo) {
        await new Promise((resolve) => setTimeout(resolve, 1500))
      }
      setCompletedSteps((prev) => [...prev, "upload"])
      setCurrentStep("create")

      const result = await createToken(connection, publicKey, signTransaction, tokenConfig)

      setCompletedSteps((prev) => [...prev, "create"])

      let metadataTxid = ""
      if (result.metadataCID) {
        metadataTxid = await attachMetadata(
          connection,
          result.mintAddress,
          publicKey,
          signTransaction,
          `https://ipfs.io/ipfs/${result.metadataCID}`,
          tokenConfig.name,
          tokenConfig.symbol,
        )
        console.log("Metadata attached successfully, txid:", metadataTxid)
      }

      setCompletedSteps((prev) => [...prev, "metadata"])
      setCurrentStep("mint")

      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCompletedSteps((prev) => [...prev, "mint"])
      setCurrentStep("finalize")

      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCompletedSteps((prev) => [...prev, "finalize"])

      await refreshBalance()

      const createdTokenData = {
        tokenName: tokenConfig.name,
        tokenSymbol: tokenConfig.symbol,
        tokenLogo: tokenConfig.logo,
        mintAddress: result.mintAddress,
        supply: tokenConfig.initialSupply,
        decimals: tokenConfig.decimals,
        network: network,
        txid: result.txid,
        metadataTxid: metadataTxid,
        logoCID: result.logoCID,
        metadataCID: result.metadataCID,
        walletAddress: publicKey.toBase58(),
      }

      localStorage.setItem("createdToken", JSON.stringify(createdTokenData))

      const completionId = await storeTokenCompletion(createdTokenData)
      setTokenCompletionId(completionId)

      await storeCreatedToken(publicKey.toBase58(), {
        name: tokenConfig.name,
        symbol: tokenConfig.symbol,
        mintAddress: result.mintAddress,
        createdAt: new Date().toISOString(),
        logo: tokenConfig.logo,
        decimals: tokenConfig.decimals,
        supply: tokenConfig.initialSupply.toString(),
      })

      toast.success({
        title: "Token Created Successfully",
        description: `Please wait... you will be redirected to the token page shortly.`,
      })

      setCreatedToken(createdTokenData)
    } catch (error) {
      console.error("Token creation failed:", error)
      toast.error({
        title: "Token Creation Failed",
        description:
          error instanceof Error ? error.message : "There was an error creating your token. Please try again.",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const validateTokenConfig = (config: TokenConfig | null) => {
    if (!config)
      return {
        isValid: false,
        errors: { form: "No token configuration found" },
      }

    const errors: Record<string, string> = {}

    if (!config.name || config.name.trim() === "") {
      errors.name = "Token name is required"
    }

    if (!config.symbol || config.symbol.trim() === "") {
      errors.symbol = "Token symbol is required"
    }

    if (config.initialSupply === undefined || config.initialSupply <= 0) {
      errors.initialSupply = "Initial supply must be greater than zero"
    }

    if (config.decimals === undefined || config.decimals < 0 || config.decimals > 9) {
      errors.decimals = "Decimals must be between 0 and 9"
    }

    if (config.logo && typeof config.logo !== "string") {
      errors.logo = "Token logo format is invalid"
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }

  const handleDeployClick = () => {
    const validation = validateTokenConfig(tokenConfig)

    if (validation.isValid) {
      setFieldErrors({})
      setConfirmDialogOpen(true)
    } else {
      setFieldErrors(validation.errors)
      console.error("Token validation errors:", validation.errors)
    }
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container py-32">
          <div className="mx-auto max-w-5xl">
            {/* Animated Header */}
            <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-primary mr-3 animate-pulse" />
                <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                  Create Your Token
                </h1>
                <Sparkles className="h-8 w-8 text-primary ml-3 animate-pulse" />
              </div>
              <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
                Connect your wallet to start creating your revolutionary Solana token with our advanced platform.
              </p>
            </div>

            {/* Enhanced Wallet Connection Card */}
            <Card className="mx-auto max-w-md glass-effect border-primary/20 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20">
                  <Wallet className="h-12 w-12 text-primary animate-bounce" />
                </div>
                <CardTitle className="text-2xl">Wallet Required</CardTitle>
                <CardDescription className="text-base">
                  Connect your Solana wallet to unlock the power of token creation and deployment.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-6 space-y-6">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                    Fast
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                    Secure
                  </div>
                  <div className="flex items-center">
                    <Sparkles className="h-4 w-4 mr-1 text-purple-500" />
                    Easy
                  </div>
                </div>
                <Button
                  onClick={() => setVisible(true)}
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  size="lg"
                >
                  <Wallet className="mr-2 h-5 w-5" />
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (isCreating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container py-32">
          <div className="mx-auto max-w-2xl">
            {/* Animated Creation Header */}
            <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
              <div className="flex items-center justify-center mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                  Creating Your Token
                </h1>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary ml-3"></div>
              </div>
              <p className="mt-4 text-muted-foreground">
                Please wait while we create your token on the Solana blockchain. This magical process may take a few
                moments.
              </p>
            </div>

            {/* Enhanced Progress Card */}
            <Card className="glass-effect border-primary/20 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-primary animate-pulse" />
                  Token Creation Progress
                </CardTitle>
                <CardDescription>
                  Your token is being forged on the blockchain. Each step brings you closer to success!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ProgressSteps
                  steps={tokenCreationSteps}
                  currentStep={currentStep}
                  completedSteps={completedSteps}
                  isProcessing={isCreating}
                />

                {/* Animated Progress Bar */}
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-1000 ease-out"
                    style={{
                      width: `${(completedSteps.length / tokenCreationSteps.length) * 100}%`,
                      boxShadow: "0 0 10px rgba(139, 92, 246, 0.5)",
                    }}
                  />
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  Step {completedSteps.length + 1} of {tokenCreationSteps.length}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container py-32">
        <div className="mx-auto max-w-6xl">
          {/* Enhanced Header */}
          <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-10 w-10 text-primary mr-4 animate-pulse" />
              <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                Create Your Token
              </h1>
              <Sparkles className="h-10 w-10 text-primary ml-4 animate-pulse" />
            </div>
            <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">
              Customize and deploy your revolutionary Solana token in minutes with our cutting-edge platform. Join
              thousands of creators who have brought their vision to life.
            </p>

            {/* Feature Highlights */}
            <div className="flex items-center justify-center space-x-8 mt-8 text-sm">
              <div className="flex items-center text-muted-foreground">
                <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                Lightning Fast
              </div>
              <div className="flex items-center text-muted-foreground">
                <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                Secure & Reliable
              </div>
              <div className="flex items-center text-muted-foreground">
                <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                No Code Required
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Token Creation Form */}
            <div
              className={`transition-all duration-1000 ${isFormVisible ? "animate-in fade-in slide-in-from-left-8" : "opacity-0"}`}
            >
              <Card className="glass-effect border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-500">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Sparkles className="h-6 w-6 mr-3 text-primary" />
                    Token Configuration
                  </CardTitle>
                  <CardDescription className="text-base">
                    Configure the fundamental properties and features of your token.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TokenCreationForm
                    onSubmit={handleFormSubmit}
                    onChange={(values) => {
                      setTokenConfig(values)
                      setSaved(false)

                      if (fieldErrors) {
                        const updatedErrors = { ...fieldErrors }
                        Object.keys(values).forEach((key) => {
                          if (
                            updatedErrors[key] &&
                            ((key === "name" && values.name && values.name.trim() !== "") ||
                              (key === "symbol" && values.symbol && values.symbol.trim() !== "") ||
                              (key === "initialSupply" && values.initialSupply > 0) ||
                              (key === "decimals" && values.decimals >= 0 && values.decimals <= 9))
                          ) {
                            delete updatedErrors[key]
                          }
                        })
                        setFieldErrors(updatedErrors)
                      }
                    }}
                    initialValues={tokenConfig}
                    fieldErrors={fieldErrors}
                    saved={saved}
                    setSaved={setSaved}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Enhanced Token Preview */}
              <div
                className={`transition-all duration-1000 delay-200 ${isPreviewVisible ? "animate-in fade-in slide-in-from-right-8" : "opacity-0"}`}
              >
                <Card className="glass-effect border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-purple-500/20 mr-3 group-hover:scale-110 transition-transform duration-300">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      Live Token Preview
                    </CardTitle>
                    <CardDescription>See how your token will appear in real-time as you configure it.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TokenPreview
                      tokenData={
                        tokenConfig
                          ? {
                              ...tokenConfig,
                              initialSupply: tokenConfig.initialSupply?.toString(),
                            }
                          : null
                      }
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Deployment Cost */}
              <div
                className={`transition-all duration-1000 delay-400 ${isCostVisible ? "animate-in fade-in slide-in-from-right-8" : "opacity-0"}`}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Deployment Cost</CardTitle>
                    <CardDescription>
                      Estimated cost to deploy your token.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Base Fee</span>
                        <span>FREE</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Network Fee
                        </span>
                        <span>FREE</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Platform Fee
                        </span>
                        <span>0.23 SOL</span>
                      </div>

                      <div className="border-t pt-4 flex justify-between font-bold">
                        <span>Total</span>
                        <span>{deploymentCost.toFixed(2)} SOL</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full gradient-border"
                      onClick={handleDeployClick}
                      disabled={!tokenConfig}
                    >
                      Deploy Token
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>

          {/* Enhanced Confirmation Dialog */}
          <ConfirmationDialog
            title="🚀 Deploy Your Token"
            description={`Are you ready to deploy ${tokenConfig?.name || "your amazing token"} (${
              tokenConfig?.symbol || ""
            }) to the Solana ${network}? This revolutionary action will bring your vision to life and costs approximately ${deploymentCost.toFixed(
              2,
            )} SOL. Once deployed, your token will be permanently recorded on the blockchain!`}
            open={confirmDialogOpen}
            onOpenChange={setConfirmDialogOpen}
            onConfirm={createTokenOnChain}
            confirmText="🚀 Launch Token"
          />
        </div>
      </div>
    </div>
  )
}
