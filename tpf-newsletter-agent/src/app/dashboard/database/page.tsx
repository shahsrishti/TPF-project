import { prisma } from "@/lib/db/prisma"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ExternalLink, Filter } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function DatabasePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string, category?: string, minScore?: string }>
}) {
  const { q, category, minScore } = await searchParams
  
  const where: any = {}
  
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { summary: { contains: q } },
      { keywords: { contains: q } }
    ]
  }

  if (category) {
    where.category = category;
  }

  if (minScore) {
    where.importanceScore = { gte: parseInt(minScore) }
  }

  const articles = await prisma.article.findMany({
    where,
    orderBy: { date: 'desc' },
    include: { source: true },
    take: 100 
  })

  // Get unique categories for filter
  const allCategories = await prisma.article.findMany({
    select: { category: true },
    where: { category: { not: null } },
    distinct: ['category']
  })

  // Export URL with params
  const exportUrl = new URL('/api/export/csv', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
  if (q) exportUrl.searchParams.set('q', q)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Research Database</h2>
          <p className="text-gray-400">All collected and processed articles</p>
        </div>
        <div className="flex items-center gap-2">
          <a href={exportUrl.toString()} download>
            <Button variant="outline" className="border-gray-800 bg-[#161B22] text-gray-300">
              <ExternalLink className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </a>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <form className="flex w-full items-center gap-2" method="GET" action="/dashboard/database">
          <Input 
            type="text" 
            name="q" 
            placeholder="Search articles & keywords..." 
            defaultValue={q || ''}
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-xl h-10 w-full sm:w-64 focus:border-violet-500/50 focus:ring-violet-500/20"
          />
          <select 
            name="category"
            defaultValue={category || ''}
            className="bg-white/5 border border-white/10 text-white rounded-xl h-10 px-3 text-sm focus:outline-none focus:border-violet-500/50"
          >
            <option value="" className="bg-gray-900">All Categories</option>
            {allCategories.map(c => c.category && (
              <option key={c.category} value={c.category} className="bg-gray-900">{c.category}</option>
            ))}
          </select>
          <select 
            name="minScore"
            defaultValue={minScore || ''}
            className="bg-white/5 border border-white/10 text-white rounded-xl h-10 px-3 text-sm focus:outline-none focus:border-violet-500/50"
          >
            <option value="" className="bg-gray-900">Any Score</option>
            <option value="5" className="bg-gray-900">Score &ge; 5</option>
            <option value="8" className="bg-gray-900">Score &ge; 8</option>
          </select>
          <Button type="submit" variant="secondary" className="bg-violet-600 hover:bg-violet-700 text-white border-0 shadow-[0_0_15px_rgba(139,92,246,0.3)] rounded-xl h-10 px-4">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          {(q || category || minScore) && (
            <a href="/dashboard/database" className="text-sm text-gray-400 hover:text-white px-2">Clear</a>
          )}
        </form>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/[0.02] border-b border-white/[0.08]">
            <TableRow className="border-transparent hover:bg-transparent">
              <TableHead className="w-[40%] text-gray-400">Title</TableHead>
              <TableHead className="text-gray-400">Source</TableHead>
              <TableHead className="text-gray-400">Category</TableHead>
              <TableHead className="text-right text-gray-400">Impact</TableHead>
              <TableHead className="text-right text-gray-400">TPF Fit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id} className="border-white/[0.05] hover:bg-white/[0.02] transition-colors">
                <TableCell className="font-medium">
                  <div className="flex flex-col gap-1">
                    <a href={article.url} target="_blank" rel="noreferrer" className="hover:text-violet-400 flex items-center gap-1 group">
                      {article.title}
                      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <span className="text-xs text-gray-500">{new Date(article.date).toLocaleDateString()}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">{article.source.name}</TableCell>
                <TableCell>
                  {article.category ? (
                    <Badge variant="outline" className="border-gray-700 text-gray-300 bg-gray-800/50">
                      {article.category}
                    </Badge>
                  ) : (
                    <span className="text-gray-600 text-sm">Processing...</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <span className={`font-semibold ${article.importanceScore && article.importanceScore >= 8 ? 'text-violet-400' : 'text-gray-400'}`}>
                    {article.importanceScore || '-'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className={`font-semibold ${article.tpfRelevanceScore && article.tpfRelevanceScore >= 8 ? 'text-blue-400' : 'text-gray-400'}`}>
                    {article.tpfRelevanceScore || '-'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {articles.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                  No articles found matching filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
