import { registerAs } from '@nestjs/config';

/**
 * Economy-tuning knobs surfaced as env vars so designers can tweak balance
 * without code changes. Defaults match the EARTH-365 v2 blueprint.
 */
export const economyConfig = registerAs('economy', () => ({
  /** EarthCoin granted to a fresh account. */
  newPlayerEarthCoin: Number(process.env.ECONOMY_NEW_PLAYER_EARTHCOIN ?? 500),
  /** Weekly property-tax rate, as a fraction of plot basePrice. */
  propertyTaxRateWeekly: Number(process.env.ECONOMY_PROPERTY_TAX_RATE_WEEKLY ?? 0.005),
  /** Platform marketplace fee in basis points (7% = 700). */
  marketplaceFeeBps: Number(process.env.ECONOMY_MARKETPLACE_FEE_BPS ?? 700),
  /** City-tax slice in basis points (5% = 500). */
  cityTaxBps: Number(process.env.ECONOMY_CITY_TAX_BPS ?? 500),
  /** Controlling-corporation cut in basis points (2% = 200). */
  corpControlBps: Number(process.env.ECONOMY_CORP_CONTROL_BPS ?? 200),
}));

export type EconomyConfig = ReturnType<typeof economyConfig>;
