import { ConfigService } from '@nestjs/config';
import { TaxService } from './tax.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrencyService } from '../currency/currency.service';

function makeService(rate = 0.005): TaxService {
  const config = {
    get: (key: string) => (key === 'economy' ? { propertyTaxRateWeekly: rate } : undefined),
  } as unknown as ConfigService;
  return new TaxService({} as PrismaService, {} as CurrencyService, config);
}

describe('TaxService.computeWeeklyTax', () => {
  it('returns floor(basePrice * rate) at the default 0.5% weekly rate', () => {
    const service = makeService();
    expect(service.computeWeeklyTax({ basePrice: BigInt(100_000) })).toBe(BigInt(500));
    expect(service.computeWeeklyTax({ basePrice: BigInt(1_000_000) })).toBe(BigInt(5_000));
  });

  it('never returns less than 1 EarthCoin (even for tiny plots)', () => {
    const service = makeService();
    expect(service.computeWeeklyTax({ basePrice: BigInt(10) })).toBe(BigInt(1));
    expect(service.computeWeeklyTax({ basePrice: BigInt(0) })).toBe(BigInt(1));
  });

  it('scales with the configured rate', () => {
    const cheap = makeService(0.001);
    const expensive = makeService(0.02);
    expect(cheap.computeWeeklyTax({ basePrice: BigInt(100_000) })).toBe(BigInt(100));
    expect(expensive.computeWeeklyTax({ basePrice: BigInt(100_000) })).toBe(BigInt(2_000));
  });
});
