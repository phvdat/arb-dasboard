import { clearDynamicResults } from '@/lib/db/dynamicDb';
import { NextResponse } from 'next/server';

export async function POST() {
  clearDynamicResults();
  return NextResponse.json({ ok: true });
}
