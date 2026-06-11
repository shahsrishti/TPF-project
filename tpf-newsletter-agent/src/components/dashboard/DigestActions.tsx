"use client"

import { Button } from "@/components/ui/button"
import { Copy, Download, FileText, Check, RefreshCw } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { marked } from "marked"

export function DigestActions({ markdown }: { markdown: string }) {
  const [copied, setCopied] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)

  const handleCopy = async () => {
    try {
      // Parse markdown to HTML so Notion, Gmail, etc. can paste it with formatting
      const htmlContent = await marked.parse(markdown)
      
      try {
        const blobHtml = new Blob([htmlContent as string], { type: "text/html" })
        const blobText = new Blob([markdown], { type: "text/plain" })
        const data = [new ClipboardItem({ "text/html": blobHtml, "text/plain": blobText })]
        await navigator.clipboard.write(data)
      } catch (clipboardError) {
        // Fallback for older browsers
        await navigator.clipboard.writeText(markdown)
      }

      setCopied(true)
      toast.success("Formatted digest copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Failed to copy digest")
    }
  }

  const handleDownloadMd = () => {
    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Weekly_Digest_${new Date().toISOString().split("T")[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Markdown file downloaded")
  }

  const handleDownloadPdf = async () => {
    try {
      const htmlContent = await marked.parse(markdown);
      
      const printWindow = window.open("", "_blank")
      if (!printWindow) {
        toast.error("Please allow popups to generate PDF")
        return
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>Weekly Digest - ${new Date().toLocaleDateString()}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 40px; }
              h1 { color: #111; border-bottom: 2px solid #eaeaea; padding-bottom: 10px; }
              h2 { color: #222; margin-top: 30px; border-bottom: 1px solid #eaeaea; padding-bottom: 5px; }
              h3 { color: #444; margin-top: 20px; }
              a { color: #7C3AED; text-decoration: none; }
              strong { color: #111; }
            </style>
          </head>
          <body>
            ${htmlContent}
            <script>
              window.onload = () => {
                window.print();
                setTimeout(() => window.close(), 500);
              }
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
    } catch (error) {
      toast.error("Failed to generate PDF")
      console.error(error)
    }
  }

  const handleRegenerate = () => {
    setIsRegenerating(true)
    toast.info("Regenerating digest...", { duration: 2000 })
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button 
        variant="outline" 
        onClick={handleRegenerate}
        disabled={isRegenerating}
        className="border-gray-800 bg-[#161B22] hover:bg-[#21262d] text-gray-300"
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
        Regenerate
      </Button>
      <Button 
        variant="outline" 
        onClick={handleDownloadMd}
        className="border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 text-violet-300"
      >
        <FileText className="mr-2 h-4 w-4" />
        Export .md
      </Button>
      <Button 
        variant="outline" 
        onClick={handleDownloadPdf}
        className="border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300"
      >
        <Download className="mr-2 h-4 w-4" />
        Export PDF
      </Button>
      <Button 
        onClick={handleCopy}
        className="bg-violet-600 hover:bg-violet-700 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]"
      >
        {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
        {copied ? "Copied!" : "Copy to Clipboard"}
      </Button>
    </div>
  )
}
