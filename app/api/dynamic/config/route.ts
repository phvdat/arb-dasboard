import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const PATH = path.join(process.cwd(), 'data/dynamic.json');

export async function GET() {
  if (!fs.existsSync(PATH)) {
    return NextResponse.json({ config: null });
  }

  const json = JSON.parse(fs.readFileSync(PATH, 'utf8'));
  return NextResponse.json({ config: json.config });
}
