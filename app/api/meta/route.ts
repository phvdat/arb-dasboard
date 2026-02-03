import { NextResponse } from 'next/server';
import { getMeta } from '@/lib/store/metaStore';

export async function GET() {
  return NextResponse.json(getMeta());
}
