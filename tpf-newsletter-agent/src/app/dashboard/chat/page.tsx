"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Bot, Send, User } from "lucide-react"
import { marked } from "marked"

export default function ChatPage() {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    
    const userMsg = input.trim()
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      })
      const data = await res.json()
      
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply || "Error: No response." }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Failed to fetch response." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Chat Assistant</h2>
        <p className="text-gray-400">Ask questions about the latest AI and Product news.</p>
      </div>

      <Card className="flex-1 flex flex-col glass-card overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <Bot className="h-12 w-12 mb-4 opacity-20" />
              <p>Ask me what's trending in AI this week!</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="h-8 w-8 mt-1 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className={`px-5 py-3 max-w-[85%] rounded-2xl ${msg.role === 'user' ? 'bg-white text-black' : 'bg-white/10 text-white border border-white/5 shadow-lg'}`}>
                  {msg.role === 'user' ? (
                    <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                  ) : (
                    <div 
                      className="space-y-3 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:ml-5 [&>ol]:list-decimal [&>ol]:ml-5 [&_strong]:text-violet-300 [&_strong]:font-semibold [&_a]:text-violet-400 [&_a]:underline"
                      dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) as string }}
                    />
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="h-8 w-8 mt-1 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="px-5 py-3 max-w-[85%] rounded-2xl bg-white/10 text-white border border-white/5 animate-pulse">
                Thinking...
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 border-t border-white/[0.08] bg-white/[0.01]">
          <form 
            className="flex w-full gap-2" 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          >
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about recent launches..." 
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl h-11 focus:border-violet-500/50 focus:ring-violet-500/20"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()} className="bg-white hover:bg-gray-200 text-black rounded-xl h-11 shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all hover:scale-105">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
