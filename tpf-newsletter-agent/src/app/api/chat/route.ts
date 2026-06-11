import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/services/openrouter.service';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    // Simple retrieval: Get last 20 processed articles for context
    let recentArticles = await prisma.article.findMany({
      where: { isProcessed: true },
      orderBy: { date: 'desc' },
      take: 20,
    });

    // Fallback to unprocessed articles if no processed articles exist
    if (recentArticles.length === 0) {
      recentArticles = await prisma.article.findMany({
        orderBy: { heuristicScore: 'desc' },
        take: 20,
      });
    }
    
    let contextStr = "Here is the latest AI & Product News context:\n\n";
    for (const article of recentArticles) {
      contextStr += `- ${article.title} (Score: ${article.importanceScore || article.heuristicScore}): ${article.summary || article.contentSnippet}\n`;
    }

    const prompt = `You are a highly professional AI & Product Research Assistant. Your job is to answer the user's question clearly and concisely using the provided news context. 

Guidelines:
- ALWAYS format your response using proper Markdown (e.g., bullet points, numbered lists, bold text for emphasis).
- Structure your answer cleanly. Use spacing between sections or points to avoid clustered text.
- Maintain a highly professional, helpful, and easy-to-read tone.
- If the answer isn't in the context, clearly state that you don't know based on the recent news.

Context:
${contextStr}

User Question: ${message}
Answer:`;

    const responseText = await generateAIResponse(
      "You are a helpful AI Assistant. Answer based on the context.", 
      prompt
    );

    return NextResponse.json({ reply: responseText });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
