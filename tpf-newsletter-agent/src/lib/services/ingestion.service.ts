import Parser from 'rss-parser';
import { prisma } from '../db/prisma';

const parser = new Parser();

export async function ingestSources() {
  const sources = await prisma.source.findMany({ where: { isActive: true } });
  let newArticlesCount = 0;
  let errors: string[] = [];

  const fetchPromises = sources.map(async (source) => {
    try {
      const response = await fetch(source.rssUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/rss+xml, application/xml, text/xml, */*'
        },
        signal: AbortSignal.timeout(8000) // 8s timeout for fetch
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const xml = await response.text();
      const feed = await parser.parseString(xml);
      
      const articlesData = feed.items
        .filter(item => item.link && item.title)
        .map(item => ({
          title: item.title as string,
          url: item.link as string,
          sourceId: source.id,
          author: typeof (item.creator || item.author) === 'string' 
            ? (item.creator || item.author) 
            : ((item.creator || item.author)?.name?.[0] || JSON.stringify(item.creator || item.author) || ''),
          date: item.pubDate ? new Date(item.pubDate) : new Date(),
          contentSnippet: item.contentSnippet || item.content || '',
          isProcessed: false,
        }));

      if (articlesData.length > 0) {
        // Bulk insert skipping duplicates based on the @unique url constraint
        const result = await prisma.article.createMany({
          data: articlesData,
          skipDuplicates: true,
        });
        newArticlesCount += result.count;
      }

      await prisma.source.update({
        where: { id: source.id },
        data: { lastSync: new Date() }
      });
    } catch (error: any) {
      console.error(`Failed to fetch RSS for ${source.name}:`, error);
      errors.push(`Failed to fetch RSS for ${source.name}: ${error.message}`);
    }
  });

  await Promise.all(fetchPromises);

  // Record System Log
  await prisma.systemLog.create({
    data: {
      type: 'ingestion',
      status: errors.length > 0 ? (newArticlesCount > 0 ? 'info' : 'error') : 'success',
      message: `Ingestion completed. Added ${newArticlesCount} new articles.`,
      details: JSON.stringify({ errors, newArticlesCount })
    }
  });

  return { success: true, newArticlesCount, errors };
}
