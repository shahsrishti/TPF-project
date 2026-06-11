import { NextResponse } from 'next/server';
import { generateWeeklyDigest } from '@/lib/services/digest.service';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const result = await generateWeeklyDigest();
    return NextResponse.json({ markdown: result });
  } catch (error) {
    console.error('Digest error:', error);
    return NextResponse.json({ error: 'Failed to generate digest' }, { status: 500 });
  }
}
