import { NextResponse } from 'next/server';
import { acquireLock } from '@/lib/lock';
import { startMode } from '@/lib/store/metaStore';
import { runFixedLoop } from '@/lib/engine/runFixedLoop';

export async function POST(req: Request) {
  if (!acquireLock('fixed')) {
    return NextResponse.json({ message: 'Another mode running' }, { status: 409 });
  }

  startMode('fixed');
  runFixedLoop();

  return NextResponse.json({ ok: true });
}
