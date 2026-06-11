import Parser from 'rss-parser';
import { prisma } from '../db/prisma';

const parser = new Parser();

export async function ingestSources() {
  const sources = await prisma.source.findMany({ where: { isActive: true } });
  let newArticlesCount = 0;
  let errors: string[] = [];

  for (const source of sources) {
    try {
      const response = await fetch(source.rssUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/rss+xml, application/xml, text/xml, */*'
        }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const xml = await response.text();
      const feed = await parser.parseString(xml);
      
      for (const item of feed.items) {
        if (!item.link || !item.title) continue;

        // Deduplication: Check for exact URL match OR exact title match from the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const exists = await prisma.article.findFirst({
          where: {
            OR: [
              { url: item.link },
              { title: item.title, date: { gte: sevenDaysAgo } }
            ]
          },
        });

        if (!exists) {
          await prisma.article.create({
            data: {
              title: item.title,
              url: item.link,
              sourceId: source.id,
              author: typeof (item.creator || item.author) === 'string' 
                ? (item.creator || item.author) 
                : ((item.creator || item.author)?.name?.[0] || JSON.stringify(item.creator || item.author) || ''),
              date: item.pubDate ? new Date(item.pubDate) : new Date(),
              contentSnippet: item.contentSnippet || item.content || '',
              isProcessed: false,
            },
          });
          newArticlesCount++;
        }
      }

      await prisma.source.update({
        where: { id: source.id },
        data: { lastSync: new Date() }
      });

    } catch (error: any) {
      console.error(`Failed to fetch RSS for ${source.name}:`, error);
      errors.push(`Failed to fetch RSS for ${source.name}: ${error.message}`);
    }
  }

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
