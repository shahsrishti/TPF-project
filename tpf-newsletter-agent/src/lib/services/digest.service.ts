import { prisma } from '../db/prisma';
import { subDays } from 'date-fns';
import { generateAIResponse } from './openrouter.service';

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

  const topArticles = articles.slice(0, 5);
  
  // AI-Generated Executive Summary
  const systemPrompt = "You are the Editor-in-Chief of a premium AI & Product newsletter. Write an engaging, 2-paragraph executive summary highlighting the major themes from the provided top news articles of the week. Write directly to the reader. Be professional but captivating. Do not list the articles, just synthesize the trends.";
  const userPrompt = `Here are the top articles this week:\n` + topArticles.map(a => `- ${a.title}: ${a.summary}`).join('\n');
  
  try {
    const aiSummary = await generateAIResponse(systemPrompt, userPrompt);
    markdown += `## Executive Summary\n\n${aiSummary}\n\n`;
  } catch (err) {
    markdown += `## Executive Summary\n\nThis week saw ${articles.length} major updates. Key highlights include ${topArticles.slice(0,3).map(a => a.title).join(', ')}.\n\n`;
  }

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
