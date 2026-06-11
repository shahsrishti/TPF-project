"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bot, ArrowRight, Loader2 } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      router.push("/dashboard")
    }, 1200)
  }

  const handleGoogleAuth = () => {
    setIsLoading(true)
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 selection:bg-violet-500/30">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">TPF Research</span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">Create your account</h1>
          <p className="text-gray-400">Join to start automating your research</p>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Full Name</label>
              <Input 
                type="text" 
                placeholder="John Doe" 
                required 
                className="bg-white/5 border-white/10 rounded-xl h-11 focus:border-violet-500/50 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <Input 
                type="email" 
                placeholder="john@example.com" 
                required 
                className="bg-white/5 border-white/10 rounded-xl h-11 focus:border-violet-500/50 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                required 
                className="bg-white/5 border-white/10 rounded-xl h-11 focus:border-violet-500/50 text-white"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium mt-6 transition-all"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 flex items-center">
            <div className="flex-1 border-t border-white/10"></div>
            <div className="px-4 text-xs text-gray-400 uppercase tracking-wider font-semibold">Or</div>
            <div className="flex-1 border-t border-white/10"></div>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full h-11 mt-6 bg-white/5 hover:bg-white/10 border-white/10 text-white rounded-xl"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
