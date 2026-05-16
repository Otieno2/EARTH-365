import { ConfigService } from '@nestjs/config';
import { MarketplaceService } from './marketplace.service';
import { PrismaService } from '../../prisma/prisma.service';

function makeService(overrides: Record<string, number> = {}): MarketplaceService {
  const economy = {
    marketplaceFeeBps: 700,
    cityTaxBps: 500,
    corpControlBps: 200,
    ...overrides,
  };
  const config = {
    get: (key: string) => (key === 'economy' ? economy : undefined),
  } as unknown as ConfigService;
  const prisma = {} as PrismaService;
  return new MarketplaceService(prisma, config);
}

describe('MarketplaceService.computeFees', () => {
  it('splits a sale into platform / city / corp / seller cuts at default bps', () => {
    const service = makeService();
    const fees = service.computeFees(BigInt(10_000), { hasControllingCorp: true });
    // 7% platform + 5% city + 2% corp = 14% off the top
    expect(fees.platformFee).toBe(BigInt(700));
    expect(fees.cityTax).toBe(BigInt(500));
    expect(fees.corpCut).toBe(BigInt(200));
    expect(fees.sellerNet).toBe(BigInt(8_600));
    // Invariant: parts sum to original price.
    expect(fees.platformFee + fees.cityTax + fees.corpCut + fees.sellerNet).toBe(BigInt(10_000));
  });

  it('omits the corp cut when no corporation controls the district', () => {
    const service = makeService();
    const fees = service.computeFees(BigInt(10_000), { hasControllingCorp: false });
    expect(fees.corpCut).toBe(BigInt(0));
    expect(fees.sellerNet).toBe(BigInt(8_800));
  });

  it('floors fees on odd prices so totals stay <= sale price', () => {
    const service = makeService();
    const fees = service.computeFees(BigInt(1), { hasControllingCorp: true });
    const sum = fees.platformFee + fees.cityTax + fees.corpCut + fees.sellerNet;
    expect(sum).toBeLessThanOrEqual(BigInt(1));
    expect(sum).toBeGreaterThanOrEqual(BigInt(0));
  });

  it('respects overridden bps from config', () => {
    const service = makeService({ marketplaceFeeBps: 1000, cityTaxBps: 0, corpControlBps: 0 });
    const fees = service.computeFees(BigInt(1_000), { hasControllingCorp: true });
    expect(fees.platformFee).toBe(BigInt(100));
    expect(fees.cityTax).toBe(BigInt(0));
    expect(fees.corpCut).toBe(BigInt(0));
    expect(fees.sellerNet).toBe(BigInt(900));
  });
});
