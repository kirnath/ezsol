import Link from "next/link"
import { Github, Twitter, DiscIcon as Discord } from "lucide-react"

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          <div className="space-y-3">
            <h3 className="text-lg font-bold gradient-text">EzSol</h3>
            <p className="text-sm text-muted-foreground">
              Create your own Solana tokens without writing a single line of code.
            </p>
            <div className="flex space-x-4">
              <Link href="https://twitter.com" className="text-muted-foreground hover:text-primary">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://github.com" className="text-muted-foreground hover:text-primary">
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="https://discord.com" className="text-muted-foreground hover:text-primary">
                <Discord size={20} />
                <span className="sr-only">Discord</span>
              </Link>
            </div>
          </div>
          <div></div>
          <div>
            <h3 className="mb-3 text-sm font-semibold">Resource</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border/40 pt-6">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} EzSol. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
