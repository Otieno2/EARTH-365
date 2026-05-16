import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  CatalogItem,
  Currency,
  InventoryItem,
  ItemCategory,
  LedgerEntryType,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrencyService } from '../currency/currency.service';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class CatalogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currency: CurrencyService,
    private readonly inventory: InventoryService,
  ) {}

  list(category?: ItemCategory): Promise<CatalogItem[]> {
    return this.prisma.catalogItem.findMany({
      where: {
        isActive: true,
        ...(category ? { category } : {}),
      },
      orderBy: [{ rarity: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async purchase(
    catalogItemId: string,
    userId: string,
    currency: Currency,
  ): Promise<InventoryItem> {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.catalogItem.findUnique({ where: { id: catalogItemId } });
      if (!item || !item.isActive) {
        throw new NotFoundException(`Catalog item ${catalogItemId} not found or inactive`);
      }

      const price = currency === Currency.EARTH_COIN ? item.priceCoin : item.priceGems;
      if (price == null) {
        throw new BadRequestException(
          `Item ${item.sku} cannot be purchased with ${currency.toLowerCase()}`,
        );
      }

      await this.currency.adjust(tx, {
        userId,
        currency,
        amount: -price,
        type: LedgerEntryType.CATALOG_PURCHASE,
        reference: catalogItemId,
      });

      return this.inventory.grant(tx, userId, catalogItemId);
    });
  }
}
