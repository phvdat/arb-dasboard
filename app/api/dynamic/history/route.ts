import { DYNAMIC_DATA_PATH } from '@/lib/constants/paths';
import { ArbitrageResult } from '@/lib/store/type';
import fs from 'fs';
import { NextResponse } from 'next/server';

const DATA_PATH = DYNAMIC_DATA_PATH

export async function GET(req: Request) {
  const {searchParams} = new URL(req.url);
  const pair = searchParams.get('pair');
  
  if (!fs.existsSync(DATA_PATH)) {
    return NextResponse.json({ results: {} });
  }

  const data: { results: Record<string, ArbitrageResult> } = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

  const history = pair ? data.results[pair]?.history : [];
  
  return NextResponse.json(history||[]);
}
