# EARTH-365

A persistent online virtual-life game where players create characters, form **corporations**, own land on a finite map, build houses, dress up, drive vehicles, run businesses, and join cities.

> **Status: Phase 0 — scaffold.** Backend + monorepo are set up. The Unity client folder is scaffolded but the Unity project itself is created on first open in Unity Hub. See [`docs/GETTING_STARTED.md`](./docs/GETTING_STARTED.md).

## What's in this repo

| Path | What it is |
|---|---|
| [`apps/api/`](./apps/api) | Authoritative backend (NestJS + Prisma + Postgres + Redis). |
| [`apps/client-unity/`](./apps/client-unity) | Unity 3D game client. Android-first; PC and iOS later. |
| [`packages/shared-types/`](./packages/shared-types) | TypeScript types shared between backend and tooling. |
| [`docs/BLUEPRINT.md`](./docs/BLUEPRINT.md) | The full game design doc. |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Stack, conventions, request flow. |
| [`docs/ROADMAP.md`](./docs/ROADMAP.md) | Phase 1 (Arrival) → Phase 2 (Frontier) → Phase 3 (Empires). |
| [`docs/GETTING_STARTED.md`](./docs/GETTING_STARTED.md) | How to run it locally. |

## Quick start

```bash
npm install
docker compose up -d postgres redis
cp apps/api/.env.example apps/api/.env
npm -w @earth365/api run prisma:generate
npm -w @earth365/api run prisma:migrate
npm run dev:api
```

Then visit [http://localhost:3000/docs](http://localhost:3000/docs) for the Swagger UI.

## Design principles

1. **Server-authoritative everything.** The server owns currency, inventory, plot ownership, and corporate membership. The client only requests changes.
2. **Every economic transaction writes a ledger entry** in the same Prisma `$transaction` as the balance update. Sum of ledger entries == current balance.
3. **Monetary amounts are `BigInt`** stored in base units. Serialized to JSON as strings.
4. **Fee rates are basis points**, never floats.
5. **Tables are defined up front** for all of Phase 1–3 to avoid painful migrations later.

## Phased plan

| Phase | Name | Goal | Monetization focus |
|---|---|---|---|
| **1** | Arrival | Prove the core loop and earn first paying users | Cosmetic drops, VIP Pass |
| **2** | Frontier | Real estate market + retention | Real estate sales, premium materials |
| **3** | Empires | Player-run economy explodes | Marketplace fees, Creator Cut |
| **4+** | Later | Ads, opt-in arena combat, voice, console | TBD |

See [`docs/ROADMAP.md`](./docs/ROADMAP.md) for the detailed checklist.

## License

MIT — see [`LICENSE`](./LICENSE).
