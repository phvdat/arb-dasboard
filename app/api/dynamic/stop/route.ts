import { NextResponse } from 'next/server';
import { clearDynamicInterval } from '@/lib/engine/runtime';
import { stopMode } from '@/lib/store/metaStore';
import { releaseLock } from '@/lib/lock';

export async function POST() {
  clearDynamicInterval();
  stopMode();
  releaseLock();

  return NextResponse.json({ ok: true });
}
