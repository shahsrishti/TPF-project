import { prisma } from '../db/prisma';
import { subDays } from 'date-fns';

export async function generateWeeklyDigest() {
  const oneWeekAgo = subDays(new Date(), 7);
  
  const articles = await prisma.article.findMany({
    where: {
      isProcessed: true,
      createdAt: { gte: oneWeekAgo }
    },
    orderBy: { importanceScore: 'desc' },
    include: { source: true }
  });

  if (articles.length === 0) {
    return "# AI & Product Weekly Digest\n\nNo articles processed this week.";
  }

  // Group by category
  const categories = ['Product Launches', 'AI Models', 'Research', 'Funding', 'Startups', 'Developer Tools', 'Productivity Tools'];
  
  let markdown = `# AI & Product Weekly Digest\n\n`;
  markdown += `*Generated on ${new Date().toLocaleDateString()}*\n\n`;

  markdown += `## Executive Summary\n\n`;
  const topArticles = articles.slice(0, 3);
  markdown += `This week saw ${articles.length} major updates. Key highlights include ${topArticles.map(a => a.title).join(', ')}.\n\n`;

  for (const category of categories) {
    const categoryArticles = articles.filter(a => a.category === category);
    if (categoryArticles.length > 0) {
      markdown += `## ${category}\n\n`;
      for (const article of categoryArticles) {
        markdown += `### [${article.title}](${article.url})\n`;
        markdown += `**Source:** ${article.source.name} | **Score:** ${article.importanceScore}/10\n\n`;
        markdown += `${article.summary}\n\n`;
        markdown += `**Why It Matters:** ${article.whyItMatters}\n\n`;
      }
    }
  }

  const otherArticles = articles.filter(a => !categories.includes(a.category || ''));
  if (otherArticles.length > 0) {
    markdown += `## Other Updates\n\n`;
    for (const article of otherArticles) {
      markdown += `### [${article.title}](${article.url})\n`;
      markdown += `**Source:** ${article.source.name} | **Score:** ${article.importanceScore}/10\n\n`;
      markdown += `${article.summary}\n\n`;
    }
  }

  return markdown;
}
