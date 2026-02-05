import { getExchange } from './exchangePool';

export async function getUSDTMarkets(
  exchangeId: string
): Promise<Set<string>> {
  const ex = getExchange(exchangeId);
  await ex.loadMarkets();

  return new Set(
    Object.keys(ex.markets).filter((symbol) => {
      const m = ex.markets[symbol];
      return (
        symbol.endsWith('/USDT') &&
        m &&
        m.active !== false &&
        !symbol.includes(':')
      );
    })
  );
}