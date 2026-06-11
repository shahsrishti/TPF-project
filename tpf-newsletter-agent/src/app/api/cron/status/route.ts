import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getProcessingState } from '@/lib/services/ai.service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const state = await getProcessingState();
    return NextResponse.json(state);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}
