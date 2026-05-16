import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ListingStatus, MarketplaceListing } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { EconomyConfig } from '../../config/economy.config';

export interface FeeBreakdown {
  /** Platform's 7% cut (in basis points of sale price). */
  platformFee: bigint;
  /** City tax (defaults to 5%). */
  cityTax: bigint;
  /** Controlling-corporation cut (defaults to 2%). */
  corpCut: bigint;
  /** Net amount routed to the seller. */
  sellerNet: bigint;
}

@Injectable()
export class MarketplaceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Compute fee breakdown for a sale price using current platform rates.
   * Exposed as a pure helper so it's trivially unit-testable and so the
   * client can preview fees before completing a purchase.
   */
  computeFees(price: bigint, opts: { hasControllingCorp: boolean }): FeeBreakdown {
    const economy = this.config.get<EconomyConfig>('economy');
    const platformBps = BigInt(economy?.marketplaceFeeBps ?? 700);
    const cityBps = BigInt(economy?.cityTaxBps ?? 500);
    const corpBps = opts.hasControllingCorp ? BigInt(economy?.corpControlBps ?? 200) : BigInt(0);

    const platformFee = (price * platformBps) / BigInt(10000);
    const cityTax = (price * cityBps) / BigInt(10000);
    const corpCut = (price * corpBps) / BigInt(10000);
    const sellerNet = price - platformFee - cityTax - corpCut;

    return { platformFee, cityTax, corpCut, sellerNet };
  }

  listActive(limit = 100): Promise<MarketplaceListing[]> {
    return this.prisma.marketplaceListing.findMany({
      where: { status: ListingStatus.ACTIVE },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 500),
    });
  }
}
