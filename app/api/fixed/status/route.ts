import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const PATH = path.join(process.cwd(), 'data/fixed.json');

export async function GET() {
  if (!fs.existsSync(PATH)) {
    return NextResponse.json({ latest: [] });
  }
  return NextResponse.json(JSON.parse(fs.readFileSync(PATH, 'utf8')));
}
