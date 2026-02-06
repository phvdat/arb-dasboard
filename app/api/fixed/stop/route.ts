import { NextResponse } from 'next/server';
import { stopFixed } from '@/lib/engine/runtimeFixed';

export async function POST() {
  stopFixed()
  return NextResponse.json({ ok: true });
}
