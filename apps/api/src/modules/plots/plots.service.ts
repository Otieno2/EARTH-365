import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LedgerEntryType, Plot, PlotStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrencyService } from '../currency/currency.service';

@Injectable()
export class PlotsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currency: CurrencyService,
  ) {}

  list(filter: { status?: PlotStatus; districtId?: string } = {}): Promise<Plot[]> {
    return this.prisma.plot.findMany({
      where: {
        ...(filter.status ? { status: filter.status } : {}),
        ...(filter.districtId ? { districtId: filter.districtId } : {}),
      },
      orderBy: [{ districtId: 'asc' }, { gridY: 'asc' }, { gridX: 'asc' }],
    });
  }

  async findById(id: string): Promise<Plot> {
    const plot = await this.prisma.plot.findUnique({ where: { id } });
    if (!plot) {
      throw new NotFoundException(`Plot ${id} not found`);
    }
    return plot;
  }

  /**
   * Buy a plot. Server-authoritative: validates status, validates balance,
   * debits the buyer, transfers ownership, writes a PLOT_PURCHASE ledger entry,
   * all atomically.
   */
  async purchase(plotId: string, userId: string): Promise<Plot> {
    return this.prisma.$transaction(async (tx) => {
      const plot = await tx.plot.findUnique({ where: { id: plotId } });
      if (!plot) {
        throw new NotFoundException(`Plot ${plotId} not found`);
      }
      if (plot.status !== PlotStatus.AVAILABLE) {
        throw new ConflictException(`Plot ${plotId} is not available (status: ${plot.status})`);
      }
      if (plot.ownerId) {
        throw new ConflictException(`Plot ${plotId} already has an owner`);
      }
      if (plot.basePrice <= BigInt(0)) {
        throw new BadRequestException(`Plot ${plotId} has no price set`);
      }

      await this.currency.adjust(tx, {
        userId,
        currency: plot.basePriceCurrency,
        amount: -plot.basePrice,
        type: LedgerEntryType.PLOT_PURCHASE,
        reference: plotId,
      });

      return tx.plot.update({
        where: { id: plotId },
        data: {
          ownerId: userId,
          ownedSince: new Date(),
          status: PlotStatus.OWNED,
        },
      });
    });
  }
}
