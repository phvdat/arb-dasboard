import { DYNAMIC_DATA_PATH } from "@/lib/constants/paths";
import { ArbitrageResult } from "@/lib/store/type";
import { ArbitrageTable } from "@/types/common";
import fs from "fs";
import { NextResponse } from "next/server";

const DATA_PATH = DYNAMIC_DATA_PATH;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const range = searchParams.get("range") || "all";

  if (!fs.existsSync(DATA_PATH)) {
    return NextResponse.json({ history: [] });
  }

  const data: { results: Record<string, ArbitrageResult> } = JSON.parse(
    fs.readFileSync(DATA_PATH, "utf8")
  );


  if (range === "all") {
    return NextResponse.json(data.results);
  }

  const ms = Number(range);

  if (isNaN(ms)) {
    return NextResponse.json({}, { status: 400 });
  }

  const cutoff = Date.now() - ms;
  const results = Object.entries(data.results).reduce<
    Record<string, ArbitrageTable>
  >((acc, [k, v]: [string, ArbitrageResult]) => {
    const { history = [], ...rest } = v

    const count = history.reduce(
      (a, h) => (h.ts > cutoff ? a + 1 : a),
      0
    )

    if (count > 0) {
      acc[k] = { ...rest, count }
    }

    return acc
  }, {})

  return NextResponse.json(results)
}