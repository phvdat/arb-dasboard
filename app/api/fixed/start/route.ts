import { NextResponse } from 'next/server';
import { runFixedLoop } from '@/lib/engine/runFixedLoop';

export async function POST(req: Request) {
  runFixedLoop();

  return NextResponse.json({ ok: true });
}
