import { DYNAMIC_DATA_PATH } from '@/lib/constants/paths';
import fs from 'fs';
import { NextResponse } from 'next/server';

const DATA_PATH = DYNAMIC_DATA_PATH

export async function GET() {
  if (!fs.existsSync(DATA_PATH)) {
    return NextResponse.json({ results: [] });
  }

  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

  const results = Object.values(data.results || {});
  return NextResponse.json({ results });
}
