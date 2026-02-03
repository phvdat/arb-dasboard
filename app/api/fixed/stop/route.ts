import { NextResponse } from 'next/server';
import { stopMode } from '@/lib/store/metaStore';
import { releaseLock } from '@/lib/lock';

export async function POST() {
  stopMode();
  releaseLock();
  return NextResponse.json({ ok: true });
}
