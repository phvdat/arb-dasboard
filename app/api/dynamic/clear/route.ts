import { DYNAMIC_DATA_PATH } from "@/lib/constants/paths";
import fs from "fs";
import { NextResponse } from "next/server";

const FILE = DYNAMIC_DATA_PATH

export async function POST() {
  if (fs.existsSync(FILE)) {
    fs.unlinkSync(FILE);
  }

  return NextResponse.json({ ok: true });
}