import { NextResponse } from 'next/server';
import { stopDynamic } from '@/lib/engine/runtimeDynamic';

export async function POST() {
  stopDynamic();
  return NextResponse.json({ ok: true });
}
