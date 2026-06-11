import { NextResponse } from 'next/server';
import { processArticles } from '@/lib/services/ai.service';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const result = await processArticles();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Processing error:', error);
    return NextResponse.json({ error: 'Failed to process articles' }, { status: 500 });
  }
}
