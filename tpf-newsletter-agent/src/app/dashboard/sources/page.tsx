import { prisma } from "@/lib/db/prisma"
import SourcesManager from "@/components/dashboard/SourcesManager"

export const dynamic = 'force-dynamic'

export default async function SourcesPage() {
  const sources = await prisma.source.findMany({
    include: {
      _count: {
        select: { articles: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return <SourcesManager initialSources={sources} />
}
