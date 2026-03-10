/* eslint-disable @typescript-eslint/no-explicit-any */

import { WebSocketServer, WebSocket } from "ws"
import { pro as ccxt } from "ccxt"

const PORT = Number(process.env.WS_PORT) || 3001

type OB = {
  bids: number[][]
  asks: number[][]
}

type ExchangeId = keyof typeof ccxt

const exchangeCache: Record<string, any> = {}

async function getExchange(id: ExchangeId) {
  if (!exchangeCache[id]) {
    console.log("Creating exchange:", id)
    const ex = new ccxt[id]({
      enableRateLimit: true,
      options: { defaultType: "spot" }
    })
    console.log("Loading markets:", id)
    await ex.loadMarkets()
    exchangeCache[id] = ex
  }
  return exchangeCache[id]
}

class WSOrderbookWatcher {
  primary: any
  secondary: any
  symbol: string

  ob1: OB | null = null
  ob2: OB | null = null

  running = true
  onUpdate?: () => void

  constructor(primary: any, secondary: any, symbol: string) {
    this.primary = primary
    this.secondary = secondary
    this.symbol = symbol
  }

  async start() {
    console.log(
      "Watching orderbooks:",
      this.symbol,
      this.primary.id,
      this.secondary.id
    )
    this.watch(this.primary, "ob1")
    this.watch(this.secondary, "ob2")
  }

  async watch(exchange: any, key: "ob1" | "ob2") {
    while (this.running) {
      try {
        const ob = await exchange.watchOrderBook(this.symbol)
        this[key] = ob
        this.onUpdate?.()
      } catch (err: any) {
        if (err?.message?.includes("closedByUser")) return
        console.error(exchange.id, err)
        await new Promise(r => setTimeout(r, 1000))
      }
    }
  }

  getSnapshot() {
    if (!this.ob1 || !this.ob2) return null
    const asks1 = this.ob1.asks.slice(0, 10)
    const bids1 = this.ob1.bids.slice(0, 10)
    const asks2 = this.ob2.asks.slice(0, 10)
    const bids2 = this.ob2.bids.slice(0, 10)
    const bid1 = bids1[0]?.[0]
    const ask1 = asks1[0]?.[0]
    const bid2 = bids2[0]?.[0]
    const ask2 = asks2[0]?.[0]

    if (!bid1 || !ask1 || !bid2 || !ask2) return null

    const r1 = bid1 / ask2
    const r2 = bid2 / ask1
    let bestRatio = 0
    let direction = ""
    let buy = ""
    let sell = ""
    if (r1 > r2) {
      bestRatio = r1
      buy = this.secondary.id
      sell = this.primary.id
      direction = `${buy} → ${sell}`
    } else {
      bestRatio = r2
      buy = this.primary.id
      sell = this.secondary.id
      direction = `${buy} → ${sell}`
    }
    return {
      ex1: this.primary.id,
      ex2: this.secondary.id,
      ob1: { asks: asks1, bids: bids1 },
      ob2: { asks: asks2, bids: bids2 },
      bestRatio,
      direction,
      buy,
      sell
    }
  }

  async stop() {
    this.running = false
    console.log("Stopping watcher")
  }
}

const wss = new WebSocketServer({ port: PORT })
console.log(`WS server running on port ${PORT}`)
wss.on("connection", async (ws: WebSocket, req) => {
  console.log("Client connected:", req.url)
  const url = new URL(req.url!, "http://localhost")
  if (url.pathname !== "/ws") {
    ws.close()
    return
  }
  const pair = url.searchParams.get("pair")
  if (!pair) {
    ws.close()
    return
  }
  const [symbol, ex1, ex2] = pair.split("|")
  console.log("Start watcher:", symbol, ex1, ex2)
  try {
    const primary = await getExchange(ex1 as ExchangeId)
    const secondary = await getExchange(ex2 as ExchangeId)
    const watcher = new WSOrderbookWatcher(
      primary,
      secondary,
      symbol
    )
    await watcher.start()
    watcher.onUpdate = () => {
      const data = watcher.getSnapshot()
      if (data && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data))
      }
    }

    const heartbeat = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping()
      }
    }, 30000)

    ws.on("close", async () => {
      console.log("Client disconnected")
      clearInterval(heartbeat)
      await watcher.stop()
    })
  } catch (err) {
    console.error(err)
    ws.close()
  }
})