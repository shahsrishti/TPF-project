"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Clock, CheckCircle2, Loader2, PauseCircle } from "lucide-react"

export default function ProcessingStatusBanner() {
  const [status, setStatus] = useState<any>(null)
  
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/cron/status')
        if (res.ok) {
          const data = await res.json()
          setStatus(data)
        }
      } catch (err) {
        console.error("Failed to fetch status", err)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 5000) // Poll every 5s
    return () => clearInterval(interval)
  }, [])

  if (!status) return null

  const { isPaused, resumeAt, articlesProcessed, articlesRemaining, etaMinutes, currentBatch } = status
  const totalArticles = articlesProcessed + articlesRemaining
  const progressPercent = totalArticles > 0 ? (articlesProcessed / totalArticles) * 100 : 0

  if (totalArticles === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10 mb-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className={`absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -z-10 transition-opacity duration-1000 ${isPaused ? 'opacity-0' : 'opacity-100'}`} />
      
      <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            {isPaused ? (
              <PauseCircle className="h-6 w-6 text-amber-400" />
            ) : articlesRemaining === 0 ? (
              <CheckCircle2 className="h-6 w-6 text-green-400" />
            ) : (
              <Loader2 className="h-6 w-6 text-violet-400 animate-spin" />
            )}
            <h3 className="text-xl font-semibold text-white">
              AI Processing Queue
            </h3>
            {isPaused && (
              <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-1 rounded-full font-medium border border-amber-500/30">
                Paused (Quota Exhausted)
              </span>
            )}
            {!isPaused && articlesRemaining > 0 && (
              <span className="bg-violet-500/20 text-violet-300 text-xs px-2.5 py-1 rounded-full font-medium border border-violet-500/30">
                Processing Batch of {currentBatch}
              </span>
            )}
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Progress</span>
              <span className="text-white font-medium">{articlesProcessed} / {totalArticles} Articles</span>
            </div>
            
            {/* Custom Tailwind Progress Bar */}
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${isPaused ? "bg-amber-500" : "bg-violet-500"}`} 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>

          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 md:border-l md:border-white/10 md:pl-6 min-w-[200px]">
          {isPaused ? (
            <div className="flex items-start gap-3 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
              <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-amber-200 font-medium">Free-Tier Limit Reached</p>
                <p className="text-amber-400/80 text-xs mt-1">
                  Resuming automatically at {new Date(resumeAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ) : articlesRemaining > 0 ? (
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
              <Clock className="h-5 w-5 text-violet-400" />
              <div className="text-sm">
                <p className="text-gray-300">Estimated Time</p>
                <p className="text-white font-medium">~{etaMinutes} mins remaining</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-green-500/10 p-3 rounded-xl border border-green-500/20">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <div className="text-sm text-green-300 font-medium">
                Queue Empty!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
