"use client"

import { CheckCircle2, Circle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export type Step = {
  id: string
  title: string
  description: string
}

interface ProgressStepsProps {
  steps: Step[]
  currentStep: string
  completedSteps: string[]
  isProcessing: boolean
}

export function ProgressSteps({ steps, currentStep, completedSteps, isProcessing }: ProgressStepsProps) {
  return (
    <div className="space-y-4 py-4">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step.id)
        const isCurrent = currentStep === step.id
        const isActive = isCompleted || isCurrent

        return (
          <div key={step.id} className={cn("flex items-start", index !== steps.length - 1 && "pb-8")}>
            <div className="relative flex h-6 w-6 flex-shrink-0 items-center justify-center">
              {isCompleted ? (
                <CheckCircle2 className="h-6 w-6 text-primary" />
              ) : isCurrent && isProcessing ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <Circle className={cn("h-6 w-6", isActive ? "text-primary" : "text-muted-foreground")} />
              )}
              {index !== steps.length - 1 && (
                <div
                  className={cn(
                    "absolute left-1/2 top-6 h-full w-0.5 -translate-x-1/2",
                    isCompleted ? "bg-primary" : "bg-border",
                  )}
                />
              )}
            </div>
            <div className="ml-4 w-full">
              <div className="flex items-center justify-between">
                <p className={cn("font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>
                  {step.title}
                </p>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
