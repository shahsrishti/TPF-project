import { NextResponse } from 'next/server';
import { ingestSources } from '@/lib/services/ingestion.service';

// Allow this endpoint to be called by Vercel Cron
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: Request) {
  // In production, we'd want to check the Authorization header for Vercel Cron
  try {
    const result = await ingestSources();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Ingestion error:', error);
    return NextResponse.json({ error: 'Failed to ingest sources' }, { status: 500 });
  }
}
