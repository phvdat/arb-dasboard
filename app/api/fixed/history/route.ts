import { FIXED_DATA_PATH } from '@/lib/constants/paths';
import { ArbitrageResult } from '@/lib/store/type';
import fs from 'fs';
import { NextResponse } from 'next/server';

const DATA_PATH = FIXED_DATA_PATH;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const pair = searchParams.get('pair');
  const limit = Number(searchParams.get('limit') ?? 10000);
  const offset = Number(searchParams.get('offset') ?? 0);

  if (!fs.existsSync(DATA_PATH)) {
    return NextResponse.json([]);
  }

  const data: { results: Record<string, ArbitrageResult> } = JSON.parse(
    fs.readFileSync(DATA_PATH, 'utf8')
  );

  const history = pair ? data.results[pair]?.history ?? [] : [];

  const total = history.length;

  const start = Math.max(total - offset - limit, 0);
  const end = total - offset;

  const result = history.slice(start, end).reverse();

  return NextResponse.json({
    total,
    limit,
    offset,
    results: result
  });
}