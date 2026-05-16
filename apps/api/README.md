# @earth365/api

The EARTH-365 backend API. Owns all authoritative game state: accounts, characters, plots, corporations, currency balances, the transaction ledger, taxes, the marketplace, and chat.

## Stack

- **Runtime:** Node.js 20+ / TypeScript 5
- **Framework:** [NestJS](https://nestjs.com/) 10
- **ORM:** [Prisma](https://www.prisma.io/) 5 (Postgres)
- **Cache / pubsub:** Redis (via `ioredis`)
- **Docs:** Swagger / OpenAPI at `/docs`
- **Tests:** Jest

## Run locally

From the repo root:

```bash
# 1. Start Postgres + Redis
docker compose up -d postgres redis

# 2. Install deps (npm workspaces)
npm install

# 3. Copy env and generate Prisma client
cp apps/api/.env.example apps/api/.env
npm -w @earth365/api run prisma:generate

# 4. Apply migrations (creates dev schema)
npm -w @earth365/api run prisma:migrate

# 5. Start API in watch mode
npm run dev:api
```

API will be at `http://localhost:3000`. Swagger docs at `http://localhost:3000/docs`.

## Scripts

| Script                    | What it does                         |
| ------------------------- | ------------------------------------ |
| `npm run build`           | Compile TypeScript to `dist/`        |
| `npm run dev`             | Run in watch mode                    |
| `npm run start`           | Run compiled output (production-ish) |
| `npm run lint`            | ESLint check                         |
| `npm run typecheck`       | TypeScript check (no emit)           |
| `npm run test`            | Jest unit tests                      |
| `npm run prisma:generate` | Regenerate Prisma client             |
| `npm run prisma:migrate`  | Apply migrations in dev              |
| `npm run prisma:studio`   | Open Prisma Studio (DB GUI)          |

## Module layout

```
src/
├── main.ts                 # Bootstrap
├── app.module.ts           # Root module
├── prisma/                 # Prisma service + module
├── config/                 # Env-driven configuration
├── modules/
│   ├── accounts/           # Users + auth identities (stub)
│   ├── characters/         # Avatars owned by users
│   ├── plots/              # Land ownership and tax state
│   ├── corporations/       # Player-run corps (clans)
│   ├── currency/           # EarthCoin (soft) + Gems (hard) balances
│   ├── ledger/             # Immutable transaction log
│   ├── tax/                # Weekly property tax + auction reclamation
│   ├── marketplace/        # Player-to-player listings
│   ├── inventory/          # Items players own
│   ├── catalog/            # Items the platform sells
│   ├── chat/               # Global / corp / DM channels
│   └── health/             # /health endpoint for Kubernetes / Fly probes
└── common/                 # Pipes, filters, guards, decorators
```

## Status

**Phase 0 scaffold.** Modules are stubbed: routes are defined, services return placeholder data, the Prisma schema is the source of truth for the data model. The next milestone is wiring real auth (Google / Apple sign-in) and the plot purchase flow end-to-end.

See [`docs/ROADMAP.md`](../../docs/ROADMAP.md) for what comes next.
