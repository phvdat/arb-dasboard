import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const FILE = path.join(process.cwd(), "data/dynamic.json");

export async function POST() {
  if (fs.existsSync(FILE)) {
    fs.unlinkSync(FILE);
  }

  return NextResponse.json({ ok: true });
}