import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import {
  Corporation,
  CorporationMember,
  CorporationRank,
  Currency,
  LedgerEntryType,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrencyService } from '../currency/currency.service';
import { CreateCorporationDto } from './dto/create-corporation.dto';

/** Gem cost to register a Corporation. Exposed as a constant so it's tunable. */
export const CORPORATION_REGISTRATION_GEMS = BigInt(100);

@Injectable()
export class CorporationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currency: CurrencyService,
  ) {}

  async create(dto: CreateCorporationDto): Promise<Corporation> {
    try {
      return await this.prisma.$transaction(async (tx) => {
        await this.currency.adjust(tx, {
          userId: dto.founderId,
          currency: Currency.GEMS,
          amount: -CORPORATION_REGISTRATION_GEMS,
          type: LedgerEntryType.CORP_REGISTRATION,
        });

        const corp = await tx.corporation.create({
          data: {
            name: dto.name,
            tag: dto.tag,
            logoUrl: dto.logoUrl,
            bannerUrl: dto.bannerUrl,
            founderId: dto.founderId,
            members: {
              create: {
                userId: dto.founderId,
                rank: CorporationRank.CEO,
              },
            },
          },
        });
        return corp;
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('Corporation name or tag already taken');
      }
      throw err;
    }
  }

  async findById(id: string): Promise<Corporation> {
    const corp = await this.prisma.corporation.findUnique({ where: { id } });
    if (!corp) {
      throw new NotFoundException(`Corporation ${id} not found`);
    }
    return corp;
  }

  listMembers(corporationId: string): Promise<CorporationMember[]> {
    return this.prisma.corporationMember.findMany({
      where: { corporationId },
      orderBy: [{ rank: 'asc' }, { joinedAt: 'asc' }],
    });
  }
}
