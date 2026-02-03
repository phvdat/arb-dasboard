import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data/dynamic.json');

export async function GET() {
  if (!fs.existsSync(DATA_PATH)) {
    return NextResponse.json({ results: [] });
  }

  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

  const results = Object.values(data.results || {});
  return NextResponse.json({ results });
}
