"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"

export function TokenTableTooltip() {
  const [isVisible, setIsVisible] = useState(true)
  const [isClosing, setIsClosing] = useState(false)

  // Check if the tooltip has been dismissed before
  useEffect(() => {
    const tooltipDismissed = localStorage.getItem("tokenTableTooltipDismissed")
    if (tooltipDismissed === "true") {
      setIsVisible(false)
    }
  }, [])

  const handleDismiss = () => {
    setIsClosing(true)
    // Store the dismissal in localStorage
    localStorage.setItem("tokenTableTooltipDismissed", "true")

    // Animate out
    setTimeout(() => {
      setIsVisible(false)
    }, 300)
  }

  if (!isVisible) return null

  return (
    <Card
      className={cn(
        "mb-4 border-primary/20 bg-primary/5 transition-opacity duration-300",
        isClosing ? "opacity-0" : "opacity-100",
      )}
    >
      <CardContent className="p-3 flex items-center justify-between">
        <div className="flex items-center">
          <Info className="h-4 w-4 text-primary mr-2" />
          <p className="text-sm">Pro tip: Click on any column header to sort the table.</p>
        </div>
        <button onClick={handleDismiss} className="text-xs text-muted-foreground hover:text-foreground">
          Got it
        </button>
      </CardContent>
    </Card>
  )
}
