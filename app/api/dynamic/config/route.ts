import { getDynamicConfig } from '@/lib/db/dynamicDb';
import { NextResponse } from 'next/server';

export async function GET() {
  const config = await getDynamicConfig();
  return NextResponse.json({ config });
}
