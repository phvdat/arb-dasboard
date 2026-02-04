import { NextResponse } from 'next/server';
import { stopDynamic } from '@/lib/engine/runtime';
import { stopMode } from '@/lib/store/metaStore';
import { releaseLock } from '@/lib/lock';

export async function POST() {
  stopDynamic();
  stopMode();
  releaseLock();

  return NextResponse.json({ ok: true });
}
