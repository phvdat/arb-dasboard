import { DYNAMIC_DATA_PATH } from '@/lib/constants/paths';
import fs from 'fs';
import { NextResponse } from 'next/server';

const PATH = DYNAMIC_DATA_PATH

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({ error: 'Missing key' }, { status: 400 });
  }

  const json = JSON.parse(fs.readFileSync(PATH, 'utf8'));
  return NextResponse.json(json.results[key] ?? null);
}
