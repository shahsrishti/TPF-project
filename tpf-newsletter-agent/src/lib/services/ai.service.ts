import { generateAIResponse } from './openrouter.service';
import { prisma } from '../db/prisma';

// The client is initialized dynamically inside the function to pick up env updates

const systemPrompt = `You are an expert AI & Product Research Analyst. Your job is to analyze article content and extract structured insights for a newsletter.

Given the article title and content snippet, generate the following in JSON format:
{
  "summary": "A concise 2-3 sentence summary of the article.",
  "category": "One of: AI Models, Product Launches, Funding, Research, Startups, Developer Tools, Productivity Tools, AI Agents, Enterprise AI",
  "whyItMatters": "A short explanation focused on Product Managers, Startup Founders, Builders, and AI Enthusiasts.",
  "importanceScore": <number 1-10 based on industry impact and innovation>,
  "tpfRelevanceScore": <number 1-10 based on relevance to TPF community>,
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "trends": ["trend1", "trend2"]
}`;

// Priority keywords for heuristic ranking
const PRIORITY_KEYWORDS = [
  "ai", "llm", "gpt", "openai", "gemini", "claude", "anthropic", "llama", "meta",
  "google", "apple", "startup", "funding", "launch", "agent", "product", "series a",
  "seed", "vc", "research", "paper", "open source"
];

export async function rankPendingArticles() {
  const unranked = await prisma.article.findMany({
    where: { status: 'PENDING', heuristicScore: 0.0 },
    select: { id: true, title: true, contentSnippet: true, date: true }
  });

  if (unranked.length === 0) return 0;

  let rankedCount = 0;
  for (const article of unranked) {
    let score = 0.0;
    const textToSearch = `${article.title} ${article.contentSnippet || ''}`.toLowerCase();
    
    // Keyword matching
    for (const kw of PRIORITY_KEYWORDS) {
      if (textToSearch.includes(kw)) {
        score += 2.0;
      }
    }

    // Recency matching (newer is better)
    const daysOld = (new Date().getTime() - new Date(article.date).getTime()) / (1000 * 3600 * 24);
    if (daysOld < 2) score += 5.0;
    else if (daysOld < 7) score += 3.0;
    else if (daysOld < 30) score += 1.0;

    await prisma.article.update({
      where: { id: article.id },
      data: { heuristicScore: score }
    });
    rankedCount++;
  }
  return rankedCount;
}

export async function getProcessingState() {
  let state = await prisma.processingState.findUnique({ where: { id: 'global' } });
  if (!state) {
    state = await prisma.processingState.create({
      data: { id: 'global' }
    });
  }
  
  // Calculate accurate remaining and processed automatically
  const remaining = await prisma.article.count({ where: { status: 'PENDING' } });
  const processed = await prisma.article.count({ where: { status: 'COMPLETED' } });
  
  await prisma.processingState.update({
    where: { id: 'global' },
    data: { articlesProcessed: processed, articlesRemaining: remaining }
  });
  
  return await prisma.processingState.findUnique({ where: { id: 'global' } });
}

export async function processArticles() {
  // First, check if we are paused due to quota limits
  let state = await getProcessingState();
  if (state?.isPaused && state.resumeAt && new Date() < state.resumeAt) {
    console.log(`Processing paused. Will resume at ${state.resumeAt}`);
    return { success: false, paused: true, resumeAt: state.resumeAt };
  }

  // If we were paused but resume time passed, unpause
  if (state?.isPaused && (!state.resumeAt || new Date() >= state.resumeAt)) {
    await prisma.processingState.update({
      where: { id: 'global' },
      data: { isPaused: false, resumeAt: null }
    });
  }

  // Rank any unranked articles
  await rankPendingArticles();

  // Fetch the best pending articles
  const unprocessed = await prisma.article.findMany({
    where: { status: 'PENDING' },
    orderBy: { heuristicScore: 'desc' },
    take: 15, // Process in small batches of 15
  });

  if (unprocessed.length === 0) return { success: true, processedCount: 0, errors: [] };

  // Update ETA (assume 5 seconds per article + 15 seconds batch overhead)
  const etaMins = Math.ceil(((state?.articlesRemaining || 0) * 5) / 60);
  await prisma.processingState.update({
    where: { id: 'global' },
    data: { etaMinutes: etaMins, currentBatch: unprocessed.length }
  });

  let processedCount = 0;
  let errors: string[] = [];
  let hitDailyQuota = false;

  for (const article of unprocessed) {
    if (hitDailyQuota) break; // Stop loop if quota hit

    try {
      // Mark as processing
      await prisma.article.update({
        where: { id: article.id },
        data: { status: 'PROCESSING' }
      });

      const prompt = `Title: ${article.title}\n\nContent: ${article.contentSnippet}\n\nPlease analyze this article.`;
      
      let responseText = null;
      let retries = 3;
      while (retries > 0 && !responseText) {
        try {
          responseText = await generateAIResponse(systemPrompt, prompt, true);
        } catch (err: any) {
          retries--;
          const errMsg = err.message || '';
          // Detect hard quota limits
          if (errMsg.includes('429') || errMsg.includes('insufficient_quota')) {
             hitDailyQuota = true;
             throw err; // Break out immediately
          }
          if (retries === 0) throw err;
          const waitTime = (3 - retries) * 5000; 
          console.log(`Rate limited or error. Retrying in ${waitTime/1000}s...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }

      if (!responseText) throw new Error("No response from AI Provider");

      const data = JSON.parse(responseText);

      await prisma.article.update({
        where: { id: article.id },
        data: {
          summary: data.summary,
          category: data.category,
          whyItMatters: data.whyItMatters,
          importanceScore: data.importanceScore,
          tpfRelevanceScore: data.tpfRelevanceScore,
          keywords: JSON.stringify(data.keywords || []),
          trends: JSON.stringify(data.trends || []),
          status: 'COMPLETED',
          isProcessed: true,
        },
      });
      processedCount++;
      
      // Delay for 4.5 seconds to respect the 15 RPM free-tier limit
      await new Promise(resolve => setTimeout(resolve, 4500));
    } catch (error: any) {
      if (hitDailyQuota) {
        console.warn(`\n[API LIMIT] Article ${article.id} skipped due to empty billing account credits.`);
      } else {
        console.error(`Failed to process article ${article.id}:`, error);
      }
      errors.push(`Failed to process article ${article.id}: ${error.message}`);
      
      // Revert status to PENDING if not completed
      await prisma.article.update({
        where: { id: article.id },
        data: { status: hitDailyQuota ? 'PAUSED' : 'FAILED' }
      });

      if (hitDailyQuota) {
        console.log("Daily quota exhausted. Pausing global queue for 24 hours.");
        const resumeTime = new Date();
        resumeTime.setHours(resumeTime.getHours() + 24); // Pause for 24 hours
        
        await prisma.processingState.update({
          where: { id: 'global' },
          data: { isPaused: true, resumeAt: resumeTime }
        });
        break; // Stop processing further
      }
    }
  }

  // Final update of state
  await getProcessingState();

  return { success: true, processedCount, errors, hitDailyQuota };
}

