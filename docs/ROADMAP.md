# EARTH-365 — Roadmap

Phased rollout adopted from the original proposal: **Arrival → Frontier → Empires.**

## Phase 0 — Scaffold (this PR)

- Monorepo: npm workspaces.
- Backend skeleton (NestJS + Prisma + Postgres + Redis).
- Prisma schema covering Phase 1–3 entities.
- API stubs for: accounts, characters, currency, ledger, plots, corporations, tax, marketplace, inventory, catalog, chat, health.
- Unity client folder + README + gitignore (Unity project files are checked in by the developer on first open).
- Shared TypeScript types package.
- Docker compose for local Postgres + Redis.
- CI: lint + typecheck + build + test.

## Phase 1 — Earth 365: Arrival (Months 0–4)

**Goal:** prove the core loop and earn first paying users.

- [ ] Real auth (Google Sign-In + email).
- [ ] Stripe + Google Play Billing webhook handlers → Gems credits.
- [ ] Character creator + appearance persistence.
- [ ] One small city map (50 raw plots in 1 district of 1 city).
- [ ] Walk around in 3rd person, see other players (Photon Fusion integration).
- [ ] Buy plot (EarthCoin or Gems), drop a prefab house.
- [ ] Cosmetics shop: ~50 clothing items (10 free, 40 paid).
- [ ] Starter vehicle + 3 Gem-priced skins.
- [ ] Corporation creation (Gem-gated) + corp chat.
- [ ] Friends, DMs, global + corp chat (with Redis pub/sub for realtime delivery).
- [ ] Report + ban tools.
- [ ] The 365 App (in-game) — read-only listings, map, mail, feed.
- [ ] Soft launch on Google Play in one country.

**Monetization focus:** Gems bundles, premium cosmetics, VIP Pass.

## Phase 2 — Earth 365: Frontier (Months 5–8)

**Goal:** real estate market + retention.

- [ ] Property tax sweep (cron worker) live and enforced.
- [ ] Auction reclamation flow for delinquent plots.
- [ ] Blueprint engine: mobile grid-snap builder.
- [ ] Blueprint engine: PC free-place builder.
- [ ] Premium building materials (Gem-locked).
- [ ] Vehicle dealerships + multiple vehicle types.
- [ ] Companion mobile app (React Native or Flutter — separate decision in Phase 2 kickoff).
- [ ] Apple App Store launch (iOS support).
- [ ] PC standalone build (Steam / itch.io).

**Monetization focus:** real estate sales, premium building materials.

## Phase 3 — Earth 365: Empires (Months 9–14)

**Goal:** player-run economy explodes.

- [ ] Player businesses + storefronts.
- [ ] Marketplace fee distribution live (7% platform + 5% city + 2% corp).
- [ ] Custom asset uploads (UGC clothes, decals, blueprints) with the Creator Cut (30%).
- [ ] UGC moderation pipeline (auto-mod + human review).
- [ ] Cities, districts, mayoral elections, city treasuries.
- [ ] Economic Clan Wars: district control via weekly leaderboard.
- [ ] Marketplace transaction fee splits paid out automatically.

**Monetization focus:** marketplace fees, corporate registrations, Creator Cut.

## Phase 4+ — Later

- In-game billboard advertising / sponsored events.
- Opt-in arena combat ("Physical Clan Wars").
- Voice chat in-world.
- Console builds.
- Cross-game asset interop (very late).

## How we'll work

- One feature per PR, kept small. Big features get a tracking issue.
- Every PR must pass CI (lint + typecheck + build + tests).
- Schema migrations live in `apps/api/prisma/migrations/` and are reviewed carefully — never edit a committed migration.
- Every economic transaction must write a `LedgerEntry` in the same Prisma `$transaction` as the balance update. This is non-negotiable.
