import { NextResponse } from 'next/server';
import { stopMode } from '@/lib/store/metaStore';
import { releaseLock } from '@/lib/lock';
import { stopFixed } from '@/lib/engine/runtimeFixed';

export async function POST() {
  stopFixed()
  stopMode();
  releaseLock();
  return NextResponse.json({ ok: true });
}
