import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Coins, BarChart } from "lucide-react";
import FeatureCard from "@/components/feature-card";
import TokenCard from "@/components/token-card";
import Testimonial from "@/components/testimonial";
import GraduatedTokens from "./graduated-tokens";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-purple-500/10 blur-[120px]" />
          <div className="absolute -bottom-[30%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[120px]" />
        </div>
        <div className="container relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-4">
              <span className="text-xs text-muted-foreground">
                Beta
              </span>
              <span className="ml-2 h-1.5 w-1.5 rounded-full bg-yellow-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight gradient-text animate-gradient-x">
              Create Solana Tokens Without Code
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Launch your own Solana token in minutes with our no-code platform.
              Customize, deploy, and manage your token without writing a single
              line of code.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <a href="/create" rel="noopener noreferrer">
                <Button size="lg" className="gradient-border">
                  Start Creating
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
              <Button size="lg" variant="outline" className="gradient-border">
                Learn More
              </Button>
            </div>
            <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl font-bold gradient-text">10K+</p>
                <p className="text-sm text-muted-foreground">Tokens Created</p>
              </div>
              <div>
                <p className="text-3xl font-bold gradient-text">$50M+</p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
              <div>
                <p className="text-3xl font-bold gradient-text">5K+</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
              <div>
                <p className="text-3xl font-bold gradient-text">99.9%</p>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">EzSol</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform makes token creation accessible to everyone,
              regardless of technical background.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-purple-500" />}
              title="Lightning Fast"
              description="Create and deploy your token in minutes, not days. Our streamlined process gets you up and running quickly."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6 text-blue-500" />}
              title="Secure & Reliable"
              description="Built on Solana's secure infrastructure with additional security measures to protect your assets."
            />
            <FeatureCard
              icon={<Coins className="h-6 w-6 text-cyan-500" />}
              title="Fully Customizable"
              description="Set your token's name, symbol, supply, and other parameters with our intuitive interface."
            />
            <FeatureCard
              icon={<BarChart className="h-6 w-6 text-purple-500" />}
              title="Analytics Dashboard"
              description="Track your token's performance with comprehensive analytics and insights."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-blue-500" />}
              title="Low Fees"
              description="Competitive pricing with transparent fee structure. No hidden costs or surprises."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6 text-cyan-500" />}
              title="24/7 Support"
              description="Our team is always available to help you with any questions or issues you may have."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-background/50 to-background relative">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Creating your own Solana token is as easy as 1-2-3.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-effect rounded-lg p-6 text-center relative">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white">
                1
              </div>
              <h3 className="text-xl font-bold mt-4 mb-2">Connect Wallet</h3>
              <p className="text-muted-foreground">
                Connect your Solana wallet to get started. We support Phantom,
                Solflare, and more.
              </p>
            </div>
            <div className="glass-effect rounded-lg p-6 text-center relative">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white">
                2
              </div>
              <h3 className="text-xl font-bold mt-4 mb-2">Customize Token</h3>
              <p className="text-muted-foreground">
                Set your token's name, symbol, supply, and other parameters with
                our intuitive interface.
              </p>
            </div>
            <div className="glass-effect rounded-lg p-6 text-center relative">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white">
                3
              </div>
              <h3 className="text-xl font-bold mt-4 mb-2">Deploy & Manage</h3>
              <p className="text-muted-foreground">
                Deploy your token to the Solana blockchain and manage it from
                your dashboard.
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Button size="lg" className="gradient-border">
              Start Creating
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Tokens Section */}
      <GraduatedTokens />

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-background/50 to-background relative">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our <span className="gradient-text">Users Say</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our users have to
              say.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Testimonial
              quote="EzSol made it incredibly easy to launch my community token. The process was smooth and the support team was amazing!"
              author="Alex Johnson"
              role="Founder, GalaxyToken"
              avatar="/a.johnson.webp?height=64&width=64"
            />
            <Testimonial
              quote="As someone with no coding experience, I never thought I could create my own token. EzSol changed that. Highly recommended!"
              author="Sarah Williams"
              role="Creator, NeonFinance"
              avatar="/s.william.jpg?height=64&width=64"
            />
            <Testimonial
              quote="The analytics dashboard is a game-changer. I can track my token's performance and make data-driven decisions."
              author="Michael Chen"
              role="CEO, CryptoVerse"
              avatar="/m.chen.jpeg?height=64&width=64"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container">
          <div className="glass-effect rounded-2xl p-8 md:p-12 relative overflow-hidden glow">
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Create Your{" "}
                <span className="gradient-text">Solana Token</span>?
              </h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of creators who have already launched their
                tokens with EzSol.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gradient-border">
                  Start Creating
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
