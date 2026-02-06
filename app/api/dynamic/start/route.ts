/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { setConfig } from '@/lib/store/dynamicStore';
import { runDynamicLoop } from '@/lib/engine/runDynamicLoop';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      exchanges,
      minVolume,
      minPriceRatio,
      maxAllowedRatio,
      excludePairs = [],
    } = body;

    if (!exchanges || exchanges.length < 2) {
      return NextResponse.json(
        { message: 'At least 2 exchanges required' },
        { status: 400 }
      );
    }
    
    setConfig({
      exchanges,
      minVolume,
      minPriceRatio,
      maxAllowedRatio,
      excludePairs,
    });

    runDynamicLoop({
      exchanges,
      minVolume,
      minPriceRatio,
      maxAllowedRatio,
      excludePairs,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    );
  }
}
