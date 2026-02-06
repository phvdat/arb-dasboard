import fs from 'fs/promises';
import path from 'path';
import { intersectPairs } from '../exchangePool';
import { getUSDTMarkets } from './marketCache';
import { filterByVolume } from './filterByVolume';

const CACHE_DIR = './cache';
const PAIR_TTL = 24 * 60 * 60 * 1000;

export async function getCachedPairs(ex1: string, ex2: string, exclude: Set<string>, minVolume: number): Promise<string[]> {
    const key = [ex1, ex2].sort().join('__');
    const file = path.join(CACHE_DIR, `${key}.json`);
    const now = Date.now();

    try {
        const raw = await fs.readFile(file, 'utf-8');
        const data = JSON.parse(raw);

        if (now - data.timestamp < PAIR_TTL) {
            return data.pairs.filter((p: string) => !exclude.has(p));
        }
    } catch (_) { }

    const m1 = await getUSDTMarkets(ex1);
    const m2 = await getUSDTMarkets(ex2);

    let pairs = intersectPairs(m1, m2).filter(
        (p) => !exclude.has(p)
    );
    pairs = await filterByVolume(ex1,ex2, pairs, minVolume);

    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(
        file,
        JSON.stringify({ timestamp: now, pairs }, null, 2)
    );

    return pairs;
}
