# EARTH-365 — Game Blueprint v2

A virtual-life online game where players log in, create characters, form **corporations** (clans), own land, build houses, dress up, drive vehicles, found cities and run businesses — designed with monetization built into the core loop.

> This is the canonical design doc. The repo is built to implement this blueprint phase by phase. See [`ROADMAP.md`](./ROADMAP.md) for the phase-by-phase plan and [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the technical setup.

---

## 1. Vision

> **EARTH-365** is a persistent online world where every day matters. Players live a second life: a character, a home on real land, friends, a corporation, a job, a business, a city. Status, identity, and *property* are the gameplay.

**Core fantasy:** "I have a *life* in EARTH-365 — I own things, I built things, I run a corporation, I belong somewhere."

**Why people will pay:** identity (cosmetics), status (rare land, rare cars), ownership (a *real* plot with my house on it), social belonging (corporation perks), convenience (faster build, premium materials).

---

## 2. Core systems

### 2.1 Accounts & identity
- Email / Google / Apple sign-in.
- One account = many characters (1 free, more via VIP Pass).
- Character creator: gender, body, face, skin, hair, starter outfit.
- Friend list, follow, block, report, DMs.

### 2.2 Land & Real Estate System (foundation)
- **Map Grid:** finite world divided into **sectors → districts → plots**. Plot count is capped — scarcity makes value compound.
- **Plot types:** raw residential, raw commercial, prime/skyscraper, industrial/factory, scenic (waterfront/hilltop), corporate HQ.
- **Acquisition:** raw plots in EarthCoin or Gems; prime plots Gems-only via auction; industrial via corporate Joint Ventures.
- **Deeds:** server-authoritative ownership record. Plots are tradable and rentable.

### 2.3 Property Tax & Auction Reclamation
- Every plot pays a small **weekly property tax** in EarthCoin.
- Tax scales with plot tier (raw < commercial < prime).
- If owner misses tax for 4 consecutive weeks **AND** is offline that whole period:
  - Plot flips to `DELINQUENT`.
  - After a grace period it goes to the open auction market.
  - Original owner gets 50% of the auction sale price back.
- Keeps land in active circulation. Fixes the dead-land problem.

### 2.4 The Blueprint Engine (building)
- **PC version:** free-placement modular builder. Walls, floors, roofs, doors, windows, stairs, full furniture catalog.
- **Mobile version:** simplified grid-snap. Pick a prefab, place modular rooms, decorate.
- **Materials:** basic free (wood, concrete, glass); premium Gem-locked (marble, gold, neon, exotic woods).
- **Sharing:** save buildings as blueprint assets; sell on marketplace.

### 2.5 Cosmetics
- Outfit slots: head, hair, top, bottom, shoes, accessory, full body, emotes.
- Drops: free (rotates weekly), standard paid (Gems), limited (timed/capped), creator-made.
- Vehicles get the same: skins, liveries, decals, custom horns.

### 2.6 Corporations (formerly "Clans")
- Players form **Corporations** with a name, logo, banner, treasury, tiered ranks (CEO, Exec, Manager, Member).
- **Registration fee:** Gems.
- **Joint Ventures:** pool funds to buy massive plots.
- **Corporate cosmetics:** custom logos on buildings, fleet colors on vehicles, branded uniforms.
- **Economic Clan Wars (Phase 3):** corporations compete to control a city district; controlling corp receives passive cut of marketplace transaction tax.

### 2.7 Communities & Cities
- A **community** is a self-organized group around a district.
- A **city** is a federation of districts with an elected **Mayor** who sets district tax rates, zoning, public works.

### 2.8 Vehicles
- Cars, bikes, boats; later planes and helicopters.
- Drivable in the open world. Garage per plot.
- Player dealerships sell vehicles.

### 2.9 Businesses & The Marketplace
- Players register a **Business** (lighter subtype of Corporation).
- Types: car dealership, clothing boutique, custom tailor, real estate agency, nightclub, restaurant, gym, photo studio, recording studio.
- Every player-to-player transaction:
  - **5%** city tax → city treasury.
  - **2%** controlling-corporation cut (if Economic Clan Wars active).
  - **7%** platform fee → operator.
  - Remainder to seller.

### 2.10 Jobs & quests
- NPC jobs for guaranteed EarthCoin.
- Daily quests + login streaks.

### 2.11 Economy & currencies
- **EarthCoin (soft):** earned by playing.
- **Gems (hard):** real money in, never out.
- **No direct EarthCoin → Gems exchange.**

### 2.12 Social & events
- Chat: proximity, DM, corporate, city, global.
- Voice chat in-world (Phase 3+).
- Photo mode + in-game social feed.

### 2.13 The 365 App (in-game smartphone)
A virtual smartphone every character carries. Provides:
- **Listings:** real estate, vehicle, clothing marketplaces.
- **365Bank:** balances, transfers, business revenue dashboard.
- **365Mail:** in-game messages.
- **365Map:** city map, plots, businesses, friends.
- **365Feed:** social photos and updates.
- **365Biz:** manage business stock, pricing, employees.
- **365Gov:** city politics, mayoral elections, tax reports.

**Companion mobile app (Phase 2):** the same app as a standalone iOS/Android app for use outside game sessions.

### 2.14 Safety & moderation
- Age gating (16+ recommended).
- Profanity filter, report queue, ban tools, audit logs.
- KYC-lite for Gems purchases over a threshold.

---

## 3. Monetization

Ranked by realistic ROI:

1. **Gems bundles** — $0.99 / $4.99 / $9.99 / $24.99 / $99.99.
2. **Cosmetic microtransactions.**
3. **Virtual real estate sales** (premium plots).
4. **Premium building materials.**
5. **Creator Cut (30%)** on UGC.
6. **Marketplace platform fee (7%).**
7. **VIP Pass** $7.99/month.
8. **Battle pass / Season Pass** $4.99/month.
9. **Corporate registration & cosmetics.**
10. **City taxes (Phase 3+).**
11. **In-game billboard advertising (Phase 4+).**

**Will NOT do:** pay-to-win combat, loot boxes, real-money cashout, crypto/NFT mechanics.

---

## 4. What's deferred

### Physical Clan Wars (combat)
Adopted in the economic form (district control + tax cut). Physical PvP combat is **deferred to Phase 4+** as an opt-in arena mode. Reason: shipping PvP in Phase 1/2 means balancing weapons, anti-cheat, 17+ age rating, and a moderation burden that competes with Fortnite / GTA Online on their turf.

### In-Game Advertising
Defer to Phase 4. Below ~50k DAU, ad revenue is rounding error vs the engineering cost.

---

## 5. Legal / compliance

- **Privacy:** GDPR + CCPA.
- **Children:** age-gate at 13+ with strict chat filters, or 16+.
- **Payments:** Stripe / Google / Apple handle PCI.
- **Virtual currency:** Gems are one-way only.
- **UGC:** content moderation pipeline + DMCA process + creator payout with tax forms.
- **Trademarks:** verify "EARTH-365" before brand investment.

---

## 6. KPIs

- D1 / D7 / D30 retention.
- DAU / MAU ratio (>20%).
- ARPDAU.
- Conversion to payer (target 2–5%).
- Whale concentration.
- Marketplace volume per DAU.
- Active plots / total plots ratio.

---

## 7. Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Scope explodes, never ships | very high | Lock Phase 1 (Arrival) feature list. No additions until launched. |
| No players show up | very high | TikTok + Discord before launch. Soft-launch in one country. |
| Toxic chat / minors at risk | high | Profanity filter, human mods from day one. |
| Dead land | medium | Property tax + auction reclamation (§2.3). |
| Duping / cheating economy | medium | Server-authoritative everything; ledger table; audit logs. |
| Apple/Google rejection | medium | Follow guidelines for virtual currency, age rating, moderation. |
| UGC moderation backlog | high (Phase 3) | Auto-mod + human review queue + creator vetting. |
| Founder burnout | high | Don't go solo on the Unity/Node stack indefinitely; hire help when revenue starts. |

---

## 8. Open questions

- Art style: realistic urban (chosen).
- Region/audience: TBD (suggested: African + global-south urban life sim niche).
- Hard launch date: TBD.
