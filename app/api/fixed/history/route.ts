import { getFixedHistory } from '@/lib/db/fixedDb';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const pair = searchParams.get('pair');
  const limit = Number(searchParams.get('limit') ?? 10000);
  const offset = Number(searchParams.get('offset') ?? 0);

  if (!pair) {
    return NextResponse.json({ total: 0, limit, offset, results: [] });
  }

  const page = getFixedHistory(pair, limit, offset);
  return NextResponse.json(page);
}
