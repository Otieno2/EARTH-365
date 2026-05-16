import { Injectable } from '@nestjs/common';
import { Currency, LedgerEntry, LedgerEntryType, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface LedgerRecordParams {
  userId?: string;
  type: LedgerEntryType;
  currency: Currency;
  amount: bigint;
  reference?: string;
  metadata?: Prisma.InputJsonValue;
}

@Injectable()
export class LedgerService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Append-only ledger write. Must always be called inside the same
   * Prisma transaction as the balance update it describes, so the system
   * is invariant: sum of ledger entries == current balance.
   */
  async record(tx: Prisma.TransactionClient, params: LedgerRecordParams): Promise<LedgerEntry> {
    return tx.ledgerEntry.create({
      data: {
        userId: params.userId,
        type: params.type,
        currency: params.currency,
        amount: params.amount,
        reference: params.reference,
        metadata: params.metadata,
      },
    });
  }

  async listForUser(userId: string, limit = 50): Promise<LedgerEntry[]> {
    return this.prisma.ledgerEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 200),
    });
  }
}
