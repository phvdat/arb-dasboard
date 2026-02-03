import fs from 'fs';
import { NextResponse } from 'next/server';
import { FIXED_DATA_PATH } from '@/lib/constants/paths';

const PATH = FIXED_DATA_PATH;

export async function GET() {
  if (!fs.existsSync(PATH)) {
    return NextResponse.json({
      config: { pairs: [] },
      results: {},
    });
  }
  return NextResponse.json(JSON.parse(fs.readFileSync(PATH, 'utf8')));
}
