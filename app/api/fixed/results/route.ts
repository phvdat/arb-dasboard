import fs from 'fs';
import { NextResponse } from 'next/server';
import { FIXED_DATA_PATH } from '@/lib/constants/paths';
import { ArbitrageResult } from '@/lib/store/type';

const PATH = FIXED_DATA_PATH;

export async function GET() {
  if (!fs.existsSync(PATH)) {
    return NextResponse.json({
      config: { pairs: [] },
      results: {},
    });
  } const data: { results: Record<string, ArbitrageResult> } = JSON.parse(fs.readFileSync(PATH, 'utf8'));
  const result = Object.fromEntries(
    Object.entries(data.results).map(([k, v]) => {
      const { history, ...rest } = v
      return [k, { ...rest, count: v.history.length }]
    }));
  return NextResponse.json(result);
}
