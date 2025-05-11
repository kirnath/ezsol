"use client"

import { useToast } from "@/hooks/use-toast"
import { CheckCircle, AlertCircle, Info, XCircle } from "lucide-react"

type ToastType = "success" | "error" | "info" | "warning"

interface ToastOptions {
  title: string
  description?: string
  duration?: number
}

export function useToastNotification() {
  const { toast } = useToast()

  const showToast = (type: ToastType, options: ToastOptions) => {
    const { title, description, duration = 5000 } = options

    const icons = {
      success: <CheckCircle className="h-5 w-5 text-green-500" />,
      error: <XCircle className="h-5 w-5 text-red-500" />,
      warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
      info: <Info className="h-5 w-5 text-blue-500" />,
    }

    toast({
      title,
      description,
      duration,
      variant: type === "error" ? "destructive" : "default",
      icon: icons[type],
    })
  }

  return {
    success: (options: ToastOptions) => showToast("success", options),
    error: (options: ToastOptions) => showToast("error", options),
    warning: (options: ToastOptions) => showToast("warning", options),
    info: (options: ToastOptions) => showToast("info", options),
  }
}
