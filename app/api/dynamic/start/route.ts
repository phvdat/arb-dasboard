/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { acquireLock } from '@/lib/lock';
import { startMode } from '@/lib/store/metaStore';
import { setConfig } from '@/lib/store/dynamicStore';
import { runDynamicLoop } from '@/lib/engine/runDynamicLoop';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      exchanges,
      minVolume,
      minSpread,
      excludePairs = [],
      intervalMs = 15000,
    } = body;

    if (!exchanges || exchanges.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 exchanges required' },
        { status: 400 }
      );
    }

    if (!acquireLock('dynamic')) {
      return NextResponse.json(
        { error: 'Another mode is running' },
        { status: 409 }
      );
    }

    startMode('dynamic');

    setConfig({
      exchanges,
      minVolume,
      minSpread,
      excludePairs,
    });

    runDynamicLoop({
      exchanges,
      minVolume,
      minSpread,
      excludePairs,
      intervalMs,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    );
  }
}
