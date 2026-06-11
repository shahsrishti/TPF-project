import { prisma } from "@/lib/db/prisma"
import { AnalyticsCharts } from "@/components/AnalyticsCharts"

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const articles = await prisma.article.findMany({
    where: { isProcessed: true },
    include: { source: true }
  });

  // Aggregations
  const categoryMap: Record<string, number> = {};
  const sourceMap: Record<string, number> = {};
  const keywordMap: Record<string, number> = {};
  
  // Weekly growth (last 4 weeks)
  const growthMap: Record<string, number> = {};

  articles.forEach(a => {
    // Categories
    const cat = a.category || 'Uncategorized';
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;

    // Sources
    const src = a.source.name;
    sourceMap[src] = (sourceMap[src] || 0) + 1;

    // Keywords
    try {
      if (a.keywords) {
        const kws = JSON.parse(a.keywords);
        kws.forEach((k: string) => {
          keywordMap[k] = (keywordMap[k] || 0) + 1;
        });
      }
    } catch (e) {}

    // Weekly Growth (simplified by week of year, for demo just use YYYY-MM-DD or week offset)
    const d = new Date(a.date);
    const weekStart = new Date(d.setDate(d.getDate() - d.getDay())).toISOString().split('T')[0];
    growthMap[weekStart] = (growthMap[weekStart] || 0) + 1;
  });

  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  const sourceData = Object.entries(sourceMap).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  const keywordData = Object.entries(keywordMap).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 15);
  const growthData = Object.entries(growthMap).map(([name, value]) => ({ name, value })).sort((a,b) => new Date(a.name).getTime() - new Date(b.name).getTime());

  // Top articles
  const topTpf = [...articles].sort((a, b) => (b.tpfRelevanceScore || 0) - (a.tpfRelevanceScore || 0)).slice(0, 10);
  const topImportance = [...articles].sort((a, b) => (b.importanceScore || 0) - (a.importanceScore || 0)).slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-gray-400">Trends and insights from collected data</p>
      </div>

      <AnalyticsCharts 
        categoryData={categoryData}
        sourceData={sourceData}
        keywordData={keywordData}
        growthData={growthData}
        topTpf={topTpf}
        topImportance={topImportance}
      />
    </div>
  )
}
