import { clearFixedResults } from '@/lib/db/fixedDb';
import { NextResponse } from 'next/server';

export async function POST() {
  clearFixedResults();
  console.log('[Fixed] cleared');
  return NextResponse.json({ ok: true });
}
