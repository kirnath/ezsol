"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Droplets } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import WalletButton from "@/components/wallet-button"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Create Token", href: "/create" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Liquidity", href: "/liquidity", icon: <Droplets className="h-4 w-4 mr-1" /> },
    { name: "Documentation", href: "/docs" },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "glass-effect py-2" : "bg-transparent py-4",
      )}
    >
      <div className="container flex items-center justify-between">
        <a href="/" className="flex items-center gap-4">
          <span className="text-xl font-bold gradient-text">EZSOL</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 md:justify-center">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary flex items-center",
                pathname === link.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {link.icon && link.icon}
              {link.name}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <WalletButton />
        </div>

        {/* Mobile Navigation Toggle */}
        <button className="md:hidden p-2 text-foreground" onClick={toggleMenu} aria-label="Toggle Menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden glass-effect absolute top-full left-0 w-full py-4">
          <div className="container flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium py-2 transition-colors hover:text-primary flex items-center",
                  pathname === link.href ? "text-primary" : "text-muted-foreground",
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.icon && link.icon}
                {link.name}
              </Link>
            ))}
            <div className="flex items-center justify-between mt-2">
              <WalletButton className="w-full ml-2" />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
