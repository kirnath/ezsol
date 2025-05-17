"use client";

import { useState, useEffect } from "react";
import { useWalletContext } from "@/context/wallet-context";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TokenCreationForm from "@/components/token-creation-form";
import TokenPreview from "@/components/token-preview";
import { Wallet } from "lucide-react";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { ProgressSteps, type Step } from "@/components/progress-steps";
import { useToastNotification } from "@/components/toast-notification";
import {
  createToken,
  calculateDeploymentCost,
  type TokenConfig,
} from "@/lib/token-utils";
import { storeCreatedToken } from "@/lib/token-service";
import { attachMetadata } from "@/lib/metaplex";
import { useRouter } from "next/navigation";
import { storeTokenCompletion } from "@/lib/token-completion-service";
import { GoogleAnalytics } from "@next/third-parties/google";

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
];

export default function CreatePage() {
  const { connected, connection, network, refreshBalance } = useWalletContext();
  const { setVisible } = useWalletModal();
  const { publicKey, signTransaction } = useWallet();
  const toast = useToastNotification();
  const router = useRouter();

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [tokenConfig, setTokenConfig] = useState<TokenConfig | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>("prepare");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const [createdToken, setCreatedToken] = useState<any>(null);
  const [tokenCompletionId, setTokenCompletionId] = useState<string | null>(
    null
  );

  const [deploymentCost, setDeploymentCost] = useState(0.23);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (tokenConfig) {
      const cost = calculateDeploymentCost({
        isMintable: tokenConfig.isMintable,
        isBurnable: tokenConfig.isBurnable,
        isPausable: tokenConfig.isPausable,
      });
      setDeploymentCost(cost);
    }
  }, [tokenConfig]);

  useEffect(() => {
    if (createdToken && tokenCompletionId) {
      // Redirect to the completed page with the token ID
      router.push(`/completed?id=${tokenCompletionId}`);
    }
  }, [createdToken, tokenCompletionId, router]);

  const handleFormSubmit = (values: TokenConfig) => {
    setTokenConfig(values);
    setSaved(true);
  };

  const createTokenOnChain = async () => {
    if (!tokenConfig || !publicKey || !connection || !signTransaction) {
      toast.error({
        title: "Error",
        description: "Missing required information to create token",
      });
      return;
    }

    setIsCreating(true);
    setCurrentStep("prepare");
    setCompletedSteps([]);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCompletedSteps((prev) => [...prev, "prepare"]);
      setCurrentStep("upload");

      if (tokenConfig.logo) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      setCompletedSteps((prev) => [...prev, "upload"]);
      setCurrentStep("create");

      const result = await createToken(
        connection,
        publicKey,
        signTransaction,
        tokenConfig
      );

      setCompletedSteps((prev) => [...prev, "create"]);

      let metadataTxid = "";
      if (result.metadataCID) {
        metadataTxid = await attachMetadata(
          connection,
          result.mintAddress,
          publicKey,
          signTransaction,
          `https://ipfs.io/ipfs/${result.metadataCID}`,
          tokenConfig.name,
          tokenConfig.symbol
        );
        console.log("Metadata attached successfully, txid:", metadataTxid);
      }

      setCompletedSteps((prev) => [...prev, "metadata"]);
      setCurrentStep("mint");

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCompletedSteps((prev) => [...prev, "mint"]);
      setCurrentStep("finalize");

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCompletedSteps((prev) => [...prev, "finalize"]);

      await refreshBalance();

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
      };

      // Store in localStorage as a fallback
      localStorage.setItem("createdToken", JSON.stringify(createdTokenData));

      // Store in Supabase
      const completionId = await storeTokenCompletion(createdTokenData);
      setTokenCompletionId(completionId);

      // Store in token service
      await storeCreatedToken(publicKey.toBase58(), {
        name: tokenConfig.name,
        symbol: tokenConfig.symbol,
        mintAddress: result.mintAddress,
        createdAt: new Date().toISOString(),
        logo: tokenConfig.logo,
        decimals: tokenConfig.decimals,
        supply: tokenConfig.initialSupply.toString(),
      });

      toast.success({
        title: "Token Created Successfully",
        description: `Your token ${tokenConfig.name} (${tokenConfig.symbol}) has been created with proper metadata!`,
      });

      setCreatedToken(createdTokenData);
    } catch (error) {
      console.error("Token creation failed:", error);
      toast.error({
        title: "Token Creation Failed",
        description:
          error instanceof Error
            ? error.message
            : "There was an error creating your token. Please try again.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const validateTokenConfig = (config: TokenConfig | null) => {
    if (!config)
      return {
        isValid: false,
        errors: { form: "No token configuration found" },
      };

    const errors: Record<string, string> = {};

    if (!config.name || config.name.trim() === "") {
      errors.name = "Token name is required";
    }

    if (!config.symbol || config.symbol.trim() === "") {
      errors.symbol = "Token symbol is required";
    }

    if (config.initialSupply === undefined || config.initialSupply <= 0) {
      errors.initialSupply = "Initial supply must be greater than zero";
    }

    if (
      config.decimals === undefined ||
      config.decimals < 0 ||
      config.decimals > 9
    ) {
      errors.decimals = "Decimals must be between 0 and 9";
    }

    if (config.logo && typeof config.logo !== "string") {
      errors.logo = "Token logo format is invalid";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const handleDeployClick = () => {
    const validation = validateTokenConfig(tokenConfig);

    if (validation.isValid) {
      setFieldErrors({});
      setConfirmDialogOpen(true);
    } else {
      setFieldErrors(validation.errors);
      console.error("Token validation errors:", validation.errors);
    }
  };

  if (!connected) {
    return (
        <div className="container py-32">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold tracking-tight gradient-text">
                Create Your Token
              </h1>
              <p className="mt-4 text-muted-foreground">
                Connect your wallet to start creating your Solana token.
              </p>
            </div>

            <Card className="mx-auto max-w-md">
              <CardHeader>
                <CardTitle>Wallet Required</CardTitle>
                <CardDescription>
                  You need to connect a Solana wallet to create and deploy
                  tokens.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-6 space-y-4">
                <Wallet className="h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">No wallet connected</p>
                <Button
                  onClick={() => setVisible(true)}
                  className="gradient-border"
                >
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
    );
  }

  if (isCreating) {
    return (
      <div className="container py-32">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight gradient-text">
              Creating Your Token
            </h1>
            <p className="mt-4 text-muted-foreground">
              Please wait while we create your token on the Solana blockchain.
            </p>
          </div>

          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle>Token Creation Progress</CardTitle>
              <CardDescription>
                This process may take a few moments to complete.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressSteps
                steps={tokenCreationSteps}
                currentStep={currentStep}
                completedSteps={completedSteps}
                isProcessing={isCreating}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-32">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight gradient-text">
            Create Your Token
          </h1>
          <p className="mt-4 text-muted-foreground">
            Customize and deploy your Solana token in minutes with our
            easy-to-use platform.
          </p>
        </div>

        <Tabs defaultValue="standard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="standard">Standard Token</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Token</TabsTrigger>
            <TabsTrigger value="nft">NFT Collection</TabsTrigger>
          </TabsList>
          <TabsContent value="standard">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Token Details</CardTitle>
                  <CardDescription>
                    Configure the basic properties of your token.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TokenCreationForm
                    onSubmit={handleFormSubmit}
                    onChange={(values) => {
                      setTokenConfig(values);
                      setSaved(false);

                      if (fieldErrors) {
                        const updatedErrors = { ...fieldErrors };
                        Object.keys(values).forEach((key) => {
                          if (
                            updatedErrors[key] &&
                            ((key === "name" &&
                              values.name &&
                              values.name.trim() !== "") ||
                              (key === "symbol" &&
                                values.symbol &&
                                values.symbol.trim() !== "") ||
                              (key === "initialSupply" &&
                                values.initialSupply > 0) ||
                              (key === "decimals" &&
                                values.decimals >= 0 &&
                                values.decimals <= 9))
                          ) {
                            delete updatedErrors[key];
                          }
                        });
                        setFieldErrors(updatedErrors);
                      }
                    }}
                    initialValues={tokenConfig}
                    fieldErrors={fieldErrors}
                    saved={saved}
                    setSaved={setSaved}
                  />
                </CardContent>
              </Card>
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Token Preview</CardTitle>
                    <CardDescription>
                      Preview how your token will appear.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TokenPreview
                      tokenData={
                        tokenConfig
                          ? {
                              ...tokenConfig,
                              initialSupply:
                                tokenConfig.initialSupply?.toString(),
                            }
                          : null
                      }
                    />
                  </CardContent>
                </Card>
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
          </TabsContent>
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Token Configuration</CardTitle>
                <CardDescription>
                  Configure advanced token features like vesting, minting, and
                  burning.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64">
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="nft">
            <Card>
              <CardHeader>
                <CardTitle>NFT Collection</CardTitle>
                <CardDescription>
                  Create your own NFT collection on Solana.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64">
                  <p className="text-muted-foreground">Coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <ConfirmationDialog
          title="Deploy Token"
          description={`Are you sure you want to deploy ${
            tokenConfig?.name || "this token"
          } (${
            tokenConfig?.symbol || ""
          }) to the Solana ${network}? This action cannot be undone and will cost approximately ${deploymentCost.toFixed(
            2
          )} SOL.`}
          open={confirmDialogOpen}
          onOpenChange={setConfirmDialogOpen}
          onConfirm={createTokenOnChain}
          confirmText="Deploy Token"
        />
      </div>
    </div>
  );
}
