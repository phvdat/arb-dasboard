import fs from "fs/promises";
import path from "path";
import { getExchange } from "./exchangePool";

const CACHE_DIR = path.resolve("./cache");
const TTL = 7 * 24 * 60 * 60 * 1000; // 7 ngày

type VolumeCacheFile = {
  ts: number;
  pairs: string[];
};

function cacheFile(
  ex1: string,
  ex2: string,
  minVolume: number
) {
  const key = [ex1, ex2].sort().join("_");
  return path.join(
    CACHE_DIR,
    `volume_${key}_${minVolume}.json`
  );
}

async function readCache(
  ex1: string,
  ex2: string,
  minVolume: number
): Promise<string[] | null> {
  const file = cacheFile(ex1, ex2, minVolume);

  try {
    const raw = await fs.readFile(file, "utf-8");
    const data: VolumeCacheFile = JSON.parse(raw);

    if (Date.now() - data.ts > TTL) return null;
    return data.pairs;
  } catch {
    return null;
  }
}

async function writeCache(
  ex1: string,
  ex2: string,
  minVolume: number,
  pairs: string[]
) {
  const file = cacheFile(ex1, ex2, minVolume);

  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(
    file,
    JSON.stringify(
      {
        ts: Date.now(),
        pairs,
      },
      null,
      2
    )
  );
}

export async function filterByVolume(
  ex1Id: string,
  ex2Id: string,
  pairs: string[],
  minVolume: number
): Promise<string[]> {
  const cached = await readCache(ex1Id, ex2Id, minVolume);
  if (cached) return cached;

  const ex1 = getExchange(ex1Id);
  const ex2 = getExchange(ex2Id);

  const result: string[] = [];

  for (const pair of pairs) {
    try {
      const [t1, t2] = await Promise.all([
        ex1.fetchTicker(pair),
        ex2.fetchTicker(pair),
      ]);

      if (
        (t1.quoteVolume ?? 0) >= minVolume &&
        (t2.quoteVolume ?? 0) >= minVolume
      ) {
        result.push(pair);
      }
    } catch {
    }
  }

  await writeCache(ex1Id, ex2Id, minVolume, result);
  return result;
}
