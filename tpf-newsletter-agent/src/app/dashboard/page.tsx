import { prisma } from "@/lib/db/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Newspaper, TrendingUp, Target, Database } from "lucide-react"
import ProcessingStatusBanner from "@/components/dashboard/ProcessingStatusBanner"

export const dynamic = 'force-dynamic'

export default async function DashboardOverview() {
  const totalArticles = await prisma.article.count()
  const processedArticles = await prisma.article.count({ where: { status: 'COMPLETED' } })
  const sources = await prisma.source.count({ where: { isActive: true } })
  
  const aggregates = await prisma.article.aggregate({
    _avg: {
      importanceScore: true,
      tpfRelevanceScore: true,
    },
    where: { status: 'COMPLETED' }
  })

  const recentTopStories = await prisma.article.findMany({
    where: { status: 'COMPLETED' },
    orderBy: { importanceScore: 'desc' },
    take: 6,
    include: { source: true }
  })

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Overview</h2>
        <p className="text-gray-400">Your AI-powered research dashboard</p>
      </div>

      <ProcessingStatusBanner />

      {/* Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Articles" value={totalArticles} icon={<Database className="h-4 w-4 text-gray-400" />} />
        <MetricCard title="Processed Articles" value={processedArticles} icon={<Newspaper className="h-4 w-4 text-gray-400" />} />
        <MetricCard title="Active Sources" value={sources} icon={<TrendingUp className="h-4 w-4 text-gray-400" />} />
        <MetricCard 
          title="Avg Importance" 
          value={aggregates._avg.importanceScore ? aggregates._avg.importanceScore.toFixed(1) : "0"} 
          icon={<Target className="h-4 w-4 text-gray-400" />} 
        />
      </div>

      {/* Top Stories */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-white/90">Top Stories This Week</h3>
        {recentTopStories.length === 0 ? (
          <div className="glass-card flex flex-col items-center justify-center py-16 px-4 text-center">
            <Newspaper className="h-12 w-12 text-gray-500 mb-4 opacity-50" />
            <h4 className="text-lg font-medium text-white mb-2">No stories processed yet</h4>
            <p className="text-gray-400 text-sm max-w-sm">
              Add sources and run the ingestion pipeline to start seeing curated top stories here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {recentTopStories.map(story => (
              <Card key={story.id} className="glass-card group">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 border border-violet-500/20 shadow-[0_0_10px_rgba(139,92,246,0.1)]">
                      {story.category || "Uncategorized"}
                    </Badge>
                    <span className="text-xs text-gray-500">{new Date(story.date).toLocaleDateString()}</span>
                  </div>
                  <CardTitle className="text-base leading-snug line-clamp-2">
                    <a href={story.url} target="_blank" rel="noreferrer" className="hover:text-violet-400 transition-colors">
                      {story.title}
                    </a>
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-400">
                    {story.source.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300/80 line-clamp-3 mb-4">
                    {story.summary}
                  </p>
                  <div className="flex gap-4 text-sm font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className="text-violet-400">{story.importanceScore}</span>
                      <span className="text-gray-500 text-xs uppercase tracking-wider">Impact</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-indigo-400">{story.tpfRelevanceScore}</span>
                      <span className="text-gray-500 text-xs uppercase tracking-wider">TPF Fit</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
        <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
      </CardContent>
    </Card>
  )
}
