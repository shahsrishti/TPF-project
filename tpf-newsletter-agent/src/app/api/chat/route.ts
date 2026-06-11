import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    // Simple retrieval: Get last 20 processed articles for context
    const recentArticles = await prisma.article.findMany({
      where: { isProcessed: true },
      orderBy: { date: 'desc' },
      take: 20,
    });
    
    let contextStr = "Here is the latest AI & Product News context:\n\n";
    for (const article of recentArticles) {
      contextStr += `- ${article.title} (Score: ${article.importanceScore}): ${article.summary}\n`;
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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
