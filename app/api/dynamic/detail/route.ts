import { getDb } from '@/lib/db/database';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({ error: 'Missing key' }, { status: 400 });
  }

  const db = getDb();
  const row = db.prepare('SELECT * FROM results WHERE id = ?').get(key);
  return NextResponse.json(row ?? null);
}
