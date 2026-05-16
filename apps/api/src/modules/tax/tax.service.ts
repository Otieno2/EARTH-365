import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Currency, LedgerEntryType, Plot, TaxRecord } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrencyService } from '../currency/currency.service';
import type { EconomyConfig } from '../../config/economy.config';

/**
 * Property tax + auction reclamation system. See docs/BLUEPRINT.md §3.3.
 *
 * The expensive parts (delinquency sweep, batch tax accrual) are designed as
 * pure methods so a scheduled worker can call them in Phase 2 without
 * pulling in the rest of the Nest container.
 */
@Injectable()
export class TaxService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currency: CurrencyService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Compute this week's tax for a single plot, in EarthCoin base units.
   * Public so we can unit-test the formula without a database.
   */
  computeWeeklyTax(plot: Pick<Plot, 'basePrice'>): bigint {
    const economy = this.config.get<EconomyConfig>('economy');
    const rate = economy?.propertyTaxRateWeekly ?? 0.005;
    // Use Number → BigInt conversion via floor. basePrice is bounded so we
    // tolerate the precision loss for the rate multiplication.
    const taxFloat = Number(plot.basePrice) * rate;
    return BigInt(Math.max(1, Math.floor(taxFloat)));
  }

  /**
   * Pay this week's tax for a plot. Idempotent: if a TaxRecord already exists
   * for the (plot, weekStart) pair it returns the existing record.
   */
  async payWeeklyTax(plotId: string, weekStart: Date): Promise<TaxRecord> {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.taxRecord.findUnique({
        where: { plotId_weekStart: { plotId, weekStart } },
      });
      if (existing?.paidAt) {
        return existing;
      }

      const plot = await tx.plot.findUnique({ where: { id: plotId } });
      if (!plot || !plot.ownerId) {
        throw new Error(`Cannot tax plot ${plotId} (missing or unowned)`);
      }

      const amount = this.computeWeeklyTax(plot);

      await this.currency.adjust(tx, {
        userId: plot.ownerId,
        currency: Currency.EARTH_COIN,
        amount: -amount,
        type: LedgerEntryType.PROPERTY_TAX,
        reference: plotId,
      });

      const record = await tx.taxRecord.upsert({
        where: { plotId_weekStart: { plotId, weekStart } },
        update: { paidAt: new Date(), delinquent: false, amount },
        create: { plotId, weekStart, amount, paidAt: new Date() },
      });

      await tx.plot.update({
        where: { id: plotId },
        data: { taxPaidUntil: new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000) },
      });

      return record;
    });
  }
}
