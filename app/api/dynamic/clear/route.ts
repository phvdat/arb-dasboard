import { clearDynamicResults } from '@/lib/db/dynamicDb';
import { NextResponse } from 'next/server';

export async function POST() {
  await clearDynamicResults();
  return NextResponse.json({ ok: true });
}
