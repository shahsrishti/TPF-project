"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard error:", error)
  }, [error])

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center space-y-4">
      <div className="rounded-full bg-red-500/10 p-4">
        <AlertCircle className="h-10 w-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-white">Something went wrong!</h2>
      <p className="text-gray-400 max-w-md text-center">
        {error.message || "An unexpected error occurred while loading this page."}
      </p>
      <div className="flex items-center gap-4 pt-4">
        <Button onClick={() => reset()} className="bg-violet-600 hover:bg-violet-700 text-white">
          Try again
        </Button>
        <Button variant="outline" onClick={() => window.location.href = '/dashboard'} className="bg-white/5 border-white/10 text-white">
          Go to Overview
        </Button>
      </div>
    </div>
  )
}
