# EARTH-365 — Architecture

## Stack

- **Game client:** Unity 2022.3 LTS, URP, C# 11, IL2CPP. **Android first**, then PC and iOS.
- **Multiplayer:** Photon Fusion (Phase 2+).
- **Backend:** Node.js 20 + TypeScript 5 + NestJS 10.
- **Database:** PostgreSQL 16 (via Prisma 5).
- **Cache / pub-sub:** Redis 7 (via `ioredis`).
- **Auth:** to be wired in Phase 1.1 — Google Sign-In (Android), Apple Sign-In (iOS), email fallback.
- **Payments:** Google Play Billing (Android), Stripe (web/PC), Apple StoreKit (iOS).
- **Game-server hosting (Phase 2+):** Hathora or AWS GameLift.
- **Observability:** Sentry (errors), PostHog (product analytics), Grafana (metrics).
- **CDN:** Cloudflare.

## Repository layout

```
EARTH-365/
├── apps/
│   ├── api/                # NestJS backend
│   └── client-unity/       # Unity 3D client (scaffolded, not yet committed Unity files)
├── packages/
│   └── shared-types/       # TypeScript types shared with web tools; mirrored to Unity via OpenAPI
├── docs/                   # This folder
├── docker-compose.yml      # Local Postgres + Redis
├── .github/workflows/      # CI
└── package.json            # npm workspaces root
```

## Platform priority

> **Android first; PC and iOS later.**

What this means in practice:

- The Unity project's initial build target is **Android**.
- The backend is designed for mobile networks: small JSON payloads, idempotent endpoints, optimistic UI, retries on the client.
- Auth flow prioritizes Google Sign-In (the native Android UX).
- Payments wired up as Google Play Billing first, Stripe second, App Store third.
- Build pipelines will be added in this order: Android (Phase 1) → PC standalone (Phase 2) → iOS (Phase 3).

## Server-authoritative everything

The single most important architectural rule:

> **The server owns currency, inventory, plot ownership, and corporate membership. The client only requests changes.**

Practical consequences:
- Every state-changing API endpoint validates the caller's identity and authorization.
- Every economic transaction is wrapped in a Prisma `$transaction` and writes an immutable `LedgerEntry`.
- Sum of ledger entries == current balance is an invariant; the system has audit logs to verify it.
- The Unity client renders state changes optimistically but treats the server response as truth.

## Data model

See [`apps/api/prisma/schema.prisma`](../apps/api/prisma/schema.prisma) for the source of truth. The model is grouped into:

- **Accounts & identity:** `User`, `Character`.
- **Currency:** `CurrencyBalance`, `LedgerEntry`.
- **Land:** `Plot`, `District`, `City`, `TaxRecord`, `AuctionListing`.
- **Corporations:** `Corporation`, `CorporationMember`.
- **Catalog & inventory:** `CatalogItem`, `InventoryItem`.
- **Marketplace:** `MarketplaceListing` (Phase 3 enabled, scaffolded now).
- **Player-created content:** `BlueprintAsset`.
- **Social:** `ChatMessage`, `PlayerReport`.

Tables that aren't used until Phase 2 or 3 are still defined now to avoid painful migrations later.

## Money handling

- All monetary amounts are stored as **`BigInt` base units** (Prisma maps to Postgres `BIGINT`).
- EarthCoin has no fractions. Gems have no fractions. Smallest unit = 1.
- All amounts are serialized to JSON as **strings** to avoid 64-bit precision loss.
- Fee rates are stored as **basis points** (integers; 700 = 7.00%) — never floats — in `economy.config`.

## Sample request flow: buy a plot

```
Unity client                          API                      Postgres
     │                                 │                          │
     │  POST /plots/:id/purchase       │                          │
     │  { userId }                     │                          │
     │ ───────────────────────────────►│                          │
     │                                 │  BEGIN                   │
     │                                 │ ─────────────────────────►
     │                                 │  SELECT plot FOR UPDATE  │
     │                                 │  SELECT balance          │
     │                                 │  validate availability   │
     │                                 │  validate balance        │
     │                                 │  UPDATE balance -= price │
     │                                 │  INSERT ledger entry     │
     │                                 │  UPDATE plot.ownerId     │
     │                                 │  COMMIT                  │
     │ ◄───────────────────────────────│ ◄────────────────────────│
     │  200 OK + updated Plot          │                          │
```

If anything fails, the whole transaction rolls back. The client retries the API call (idempotency: future versions will accept an `Idempotency-Key` header).

## Folder layout inside the backend

```
apps/api/src/
├── main.ts
├── app.module.ts
├── prisma/                 # PrismaService + PrismaModule
├── config/                 # Env-driven configuration (economy.config.ts)
├── common/                 # Cross-cutting pipes, filters, guards (to be added)
└── modules/
    ├── health/
    ├── accounts/
    ├── characters/
    ├── currency/
    ├── ledger/
    ├── plots/
    ├── corporations/
    ├── tax/
    ├── marketplace/
    ├── inventory/
    ├── catalog/
    └── chat/
```

Each module owns its DTOs, services, and controllers. Modules import each other via Nest's `imports` array (e.g. `PlotsModule` imports `CurrencyModule` and `LedgerModule`).

## What's not yet implemented

- Auth (JWT issuance + verification, Passport strategies for Google / Apple).
- Real Stripe / Play Billing / StoreKit webhook handlers (only stubs).
- Realtime chat via WebSockets (currently chat is persist-only).
- Game-server (Photon room logic + state sync).
- Background workers for tax-week sweeps and auction settlements.

These are the targets for the next batch of PRs. See [`ROADMAP.md`](./ROADMAP.md).
