# EARTH-365 — Getting Started

## Prerequisites

- **Node.js 20+** and **npm 10+**.
- **Docker** + **Docker Compose** (for local Postgres and Redis).
- **Unity Hub** + **Unity 2022.3 LTS** with the Android Build Support module (only required for the game client).

## First-time setup

```bash
# 1. Clone
git clone https://github.com/Otieno2/EARTH-365.git
cd EARTH-365

# 2. Install monorepo dependencies (workspaces)
npm install

# 3. Start Postgres + Redis
docker compose up -d postgres redis

# 4. Copy backend env
cp apps/api/.env.example apps/api/.env

# 5. Generate Prisma client + apply migrations
npm -w @earth365/api run prisma:generate
npm -w @earth365/api run prisma:migrate

# 6. Start the API in watch mode
npm run dev:api
```

API is at `http://localhost:3000`. Swagger docs at `http://localhost:3000/docs`.

## Opening the Unity client

1. Install [Unity Hub](https://unity.com/download) and Unity 2022.3 LTS with Android Build Support.
2. Unity Hub → "Add project from disk" → select `apps/client-unity/`.
3. Switch the build target to Android.

See [`apps/client-unity/README.md`](../apps/client-unity/README.md) for details.

## Daily workflow

```bash
# Pull latest
git pull

# Reinstall any new deps
npm install

# Apply any new migrations
npm -w @earth365/api run prisma:migrate

# Start everything
docker compose up -d postgres redis
npm run dev:api
```

## Running tests / lint / build

```bash
# Lint everything
npm run lint

# Type-check everything
npm run typecheck

# Run all unit tests
npm run test

# Build everything
npm run build
```

## Stopping the stack

```bash
npm run db:down       # stops Postgres + Redis containers
# (the API stops when you Ctrl+C the dev process)
```

## Troubleshooting

- **`Prisma client not generated`** → run `npm -w @earth365/api run prisma:generate`.
- **`P1001: Can't reach database server`** → start docker compose: `docker compose up -d postgres redis`.
- **Port 3000 already in use** → set `PORT=3001` in `apps/api/.env`.
- **Unity build target wrong** → File → Build Settings → Android → Switch Platform.
