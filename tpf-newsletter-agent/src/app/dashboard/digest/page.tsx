import { generateWeeklyDigest } from "@/lib/services/digest.service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DigestActions } from "@/components/dashboard/DigestActions"

export const dynamic = 'force-dynamic'

export default async function DigestPage() {
  const digestMarkdown = await generateWeeklyDigest()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Weekly Digest</h2>
          <p className="text-gray-400">Auto-generated newsletter ready for publication</p>
        </div>
        <DigestActions markdown={digestMarkdown} />
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription className="text-gray-400">
            Copy this markdown and paste it into Notion, Substack, or your email client.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-[#0A0A0A] p-6 overflow-auto max-h-[600px] border border-gray-800">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
              {digestMarkdown}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
