import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const PATH = path.join(process.cwd(), 'data/dynamic.json');

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({ error: 'Missing key' }, { status: 400 });
  }

  const json = JSON.parse(fs.readFileSync(PATH, 'utf8'));
  return NextResponse.json(json.results[key] ?? null);
}
