import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')

    const where = q ? {
      OR: [
        { title: { contains: q } },
        { summary: { contains: q } },
        { category: { contains: q } }
      ]
    } : {}

    const articles = await prisma.article.findMany({
      where,
      orderBy: { date: 'desc' },
      include: { source: true },
    })

    // Build CSV
    const headers = ["Title", "URL", "Source", "Date", "Category", "Importance", "TPF Relevance", "Keywords"]
    
    const rows = articles.map(a => [
      `"${a.title.replace(/"/g, '""')}"`,
      `"${a.url}"`,
      `"${a.source.name}"`,
      `"${a.date.toISOString()}"`,
      `"${a.category || ''}"`,
      a.importanceScore || '',
      a.tpfRelevanceScore || '',
      `"${a.keywords ? JSON.parse(a.keywords).join(', ') : ''}"`
    ])

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="articles_export.csv"',
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return new NextResponse("Export failed", { status: 500 })
  }
}
