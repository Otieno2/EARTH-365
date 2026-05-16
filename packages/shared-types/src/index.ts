/**
 * EARTH-365 shared types.
 *
 * These types describe API payloads exchanged between the backend and clients.
 * They are intentionally serialization-friendly: monetary amounts are strings
 * (so they survive JSON without precision loss), timestamps are ISO-8601
 * strings, and enum values match the Prisma enums one-to-one.
 *
 * Keep this file free of runtime dependencies — it's consumed by web tooling
 * and (via OpenAPI generation) by the Unity client too.
 */

export type AuthProvider = 'EMAIL' | 'GOOGLE' | 'APPLE';

export type Currency = 'EARTH_COIN' | 'GEMS';

export type PlotTier =
  | 'RAW_RESIDENTIAL'
  | 'RAW_COMMERCIAL'
  | 'PRIME'
  | 'INDUSTRIAL'
  | 'SCENIC'
  | 'CORPORATE_HQ';

export type PlotStatus = 'AVAILABLE' | 'OWNED' | 'DELINQUENT' | 'ON_AUCTION' | 'PLATFORM_RESERVED';

export type CorporationRank = 'CEO' | 'EXEC' | 'MANAGER' | 'MEMBER';

export type ItemCategory =
  | 'CLOTHING_HEAD'
  | 'CLOTHING_HAIR'
  | 'CLOTHING_TOP'
  | 'CLOTHING_BOTTOM'
  | 'CLOTHING_SHOES'
  | 'CLOTHING_ACCESSORY'
  | 'CLOTHING_FULL_BODY'
  | 'FURNITURE'
  | 'VEHICLE'
  | 'VEHICLE_SKIN'
  | 'BUILDING_MATERIAL'
  | 'EMOTE'
  | 'BLUEPRINT';

export type ItemRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LIMITED';

export type ChatChannel = 'GLOBAL' | 'CORP' | 'CITY' | 'PROXIMITY' | 'DIRECT';

export interface UserView {
  id: string;
  email: string;
  displayName: string;
  provider: AuthProvider;
  isBanned: boolean;
  createdAt: string;
}

export interface CurrencyBalanceView {
  earthCoin: string;
  gems: string;
}

export interface PlotView {
  id: string;
  districtId: string;
  gridX: number;
  gridY: number;
  width: number;
  height: number;
  tier: PlotTier;
  status: PlotStatus;
  basePrice: string;
  basePriceCurrency: Currency;
  ownerId: string | null;
  ownedSince: string | null;
  taxPaidUntil: string | null;
}

export interface CorporationView {
  id: string;
  name: string;
  tag: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  founderId: string;
  treasuryCoin: string;
  treasuryGems: string;
  createdAt: string;
}

export interface MarketplaceFeePreview {
  platformFee: string;
  cityTax: string;
  corpCut: string;
  sellerNet: string;
}
