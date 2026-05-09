We currently store arbitrage trade logs inside large JSON files:
- data/dynamic.json
- data/fixed.json

This causes:
- corrupted JSON
- race conditions
- JSON.parse crashes
- high memory usage

I want to migrate the project to SQLite using better-sqlite3.

Requirements:
- create a database module
- auto create tables
- insert trades efficiently
- query latest trades
- support Next.js API routes
- keep code simple and production ready
- avoid ORM
- use TypeScript if project already uses TS

Please analyze the existing project structure first and propose:
1. folder structure
2. migration plan
3. schema design
4. replacement strategy for JSON reads/writes