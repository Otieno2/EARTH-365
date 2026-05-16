import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Currency, LedgerEntryType, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { LedgerService } from '../ledger/ledger.service';

export interface CurrencyBalanceView {
  earthCoin: string;
  gems: string;
}

@Injectable()
export class CurrencyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ledger: LedgerService,
  ) {}

  async getBalance(userId: string): Promise<CurrencyBalanceView> {
    const balance = await this.prisma.currencyBalance.findUnique({ where: { userId } });
    if (!balance) {
      throw new NotFoundException(`Currency balance for user ${userId} not found`);
    }
    return {
      earthCoin: balance.earthCoin.toString(),
      gems: balance.gems.toString(),
    };
  }

  /**
   * Atomically adjusts a currency balance and writes a ledger entry in the
   * same transaction. `amount` is signed (positive = credit, negative = debit).
   * Throws if the balance would go negative.
   */
  async adjust(
    tx: Prisma.TransactionClient,
    params: {
      userId: string;
      currency: Currency;
      amount: bigint;
      type: LedgerEntryType;
      reference?: string;
      metadata?: Prisma.InputJsonValue;
    },
  ): Promise<void> {
    const balance = await tx.currencyBalance.findUnique({ where: { userId: params.userId } });
    if (!balance) {
      throw new NotFoundException(`Currency balance for user ${params.userId} not found`);
    }

    const current = params.currency === Currency.EARTH_COIN ? balance.earthCoin : balance.gems;
    const next = current + params.amount;
    if (next < BigInt(0)) {
      throw new BadRequestException(
        `Insufficient ${params.currency.toLowerCase()} (have ${current}, need ${-params.amount})`,
      );
    }

    await tx.currencyBalance.update({
      where: { userId: params.userId },
      data: params.currency === Currency.EARTH_COIN ? { earthCoin: next } : { gems: next },
    });

    await this.ledger.record(tx, {
      userId: params.userId,
      type: params.type,
      currency: params.currency,
      amount: params.amount,
      reference: params.reference,
      metadata: params.metadata,
    });
  }
}
