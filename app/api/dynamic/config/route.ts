import { DYNAMIC_DATA_PATH } from '@/lib/constants/paths';
import fs from 'fs';
import { NextResponse } from 'next/server';

const PATH = DYNAMIC_DATA_PATH

export async function GET() {
  if (!fs.existsSync(PATH)) {
    return NextResponse.json({ config: null });
  }

  const json = JSON.parse(fs.readFileSync(PATH, 'utf8'));
  return NextResponse.json({ config: json.config });
}
