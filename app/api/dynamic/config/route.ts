import { getDynamicConfig } from '@/lib/db/dynamicDb';
import { NextResponse } from 'next/server';

export async function GET() {
  const config = getDynamicConfig();
  return NextResponse.json({ config });
}
