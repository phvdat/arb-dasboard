import { DYNAMIC_DATA_PATH } from "@/lib/constants/paths";
import { ArbitrageResult } from "@/lib/store/type";
import { ArbitrageTable } from "@/types/common";
import fs from "fs";
import { NextResponse } from "next/server";

const DATA_PATH = DYNAMIC_DATA_PATH;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const range = searchParams.get("range") || "all";

  const minPriceRatio =
    Number(searchParams.get("minPriceRatio")) || 1;
  const exchangesParam = searchParams.get("exchanges") || "";
  const allowedExchanges = exchangesParam
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
  if (!fs.existsSync(DATA_PATH)) {
    return NextResponse.json({});
  }

  const data: {
    results: Record<string, ArbitrageResult>;
  } = JSON.parse(
    fs.readFileSync(DATA_PATH, "utf8")
  );

  const cutoff =
    range === "all"
      ? 0
      : Date.now() - Number(range);

  const results = Object.entries(data.results).reduce<
    Record<string, ArbitrageTable>
  >((acc, [key, value]) => {
    const {
      history = [],
      exchange1,
      exchange2,
      ...rest
    } = value;

    if (
      allowedExchanges.length &&
      (
        !allowedExchanges.includes(exchange1) ||
        !allowedExchanges.includes(exchange2)
      )
    ) {
      return acc;
    }

    const filteredHistory = history.filter(h =>
      h.ratio >= minPriceRatio &&
      (
        range === "all" ||
        h.ts > cutoff
      )
    );
    const count = filteredHistory.length;
    if (count > 0) {
      acc[key] = {
        ...rest,
        exchange1,
        exchange2,
        count,
        last:
          filteredHistory[
            filteredHistory.length - 1
          ],
      };
    }
    return acc;
  }, {});
  return NextResponse.json(results);
}