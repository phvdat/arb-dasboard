/* eslint-disable @typescript-eslint/no-explicit-any */
import {pro as ccxtpro} from 'ccxt';

export function createExchange(id: string) {
  const ExchangeClass = (ccxtpro as any)[id];
  if (!ExchangeClass) throw new Error(`Exchange ${id} not supported`);

  return new ExchangeClass({
    enableRateLimit: true,
    timeout: 30_000,
    options: { defaultType: 'spot' },
  });
}
