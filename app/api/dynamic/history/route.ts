import { getDynamicHistory } from '@/lib/db/dynamicDb';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const pair = searchParams.get('pair');
  const range = searchParams.get('range') || 'all';
  const limit = Number(searchParams.get('limit') ?? 1000);
  const offset = Number(searchParams.get('offset') ?? 0);

  if (!pair) {
    return NextResponse.json({ total: 0, limit, offset, results: [] });
  }

  const page = getDynamicHistory(pair, range, limit, offset);
  return NextResponse.json(page);
}
