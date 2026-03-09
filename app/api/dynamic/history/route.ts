import { DYNAMIC_DATA_PATH } from '@/lib/constants/paths';
import { ArbitrageResult } from '@/lib/store/type';
import fs from 'fs';
import { NextResponse } from 'next/server';

const DATA_PATH = DYNAMIC_DATA_PATH;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const pair = searchParams.get('pair');
  const range = searchParams.get("range") || "all";

  const limit = Number(searchParams.get("limit") ?? 1000);
  const offset = Number(searchParams.get("offset") ?? 0);

  if (!fs.existsSync(DATA_PATH)) {
    return NextResponse.json({ total: 0, results: [] });
  }

  const data: { results: Record<string, ArbitrageResult> } = JSON.parse(
    fs.readFileSync(DATA_PATH, "utf8")
  );

  let history = pair ? data.results[pair]?.history ?? [] : [];

  // filter theo range nếu có
  if (range !== "all") {
    const minTs = Date.now() - Number(range);
    history = history.filter((item) => item.ts > minTs);
  }

  const total = history.length;

  // lấy record mới nhất trước mà không reverse toàn bộ
  const start = Math.max(total - offset - limit, 0);
  const end = total - offset;

  const results = history.slice(start, end).reverse();

  return NextResponse.json({
    total,
    limit,
    offset,
    results,
  });
}