import { Injectable } from '@nestjs/common';
import { InventoryItem, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string): Promise<InventoryItem[]> {
    return this.prisma.inventoryItem.findMany({
      where: { userId },
      include: { catalogItem: true },
      orderBy: { acquiredAt: 'desc' },
    });
  }

  /** Grant a catalog item to a user (called by catalog purchase and admin tools). */
  async grant(
    tx: Prisma.TransactionClient,
    userId: string,
    catalogItemId: string,
    quantity = 1,
  ): Promise<InventoryItem> {
    return tx.inventoryItem.upsert({
      where: { userId_catalogItemId: { userId, catalogItemId } },
      update: { quantity: { increment: quantity } },
      create: { userId, catalogItemId, quantity },
    });
  }
}
