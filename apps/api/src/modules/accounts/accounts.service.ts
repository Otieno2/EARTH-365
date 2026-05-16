import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthProvider, Currency, LedgerEntryType, Prisma, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { LedgerService } from '../ledger/ledger.service';
import { CreateAccountDto } from './dto/create-account.dto';
import type { EconomyConfig } from '../../config/economy.config';

@Injectable()
export class AccountsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ledger: LedgerService,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateAccountDto): Promise<User> {
    const economy = this.config.get<EconomyConfig>('economy');
    const starterCoin = BigInt(economy?.newPlayerEarthCoin ?? 500);

    try {
      return await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: dto.email,
            displayName: dto.displayName,
            provider: dto.provider ?? AuthProvider.EMAIL,
            providerId: dto.providerId,
            // Note: real impl will hash dto.password with argon2 in a follow-up PR.
            passwordHash: dto.password ? `unhashed:${dto.password}` : null,
            currencyBalance: {
              create: {
                earthCoin: starterCoin,
                gems: BigInt(0),
              },
            },
          },
        });

        await this.ledger.record(tx, {
          userId: user.id,
          type: LedgerEntryType.STARTER_GRANT,
          currency: Currency.EARTH_COIN,
          amount: starterCoin,
        });

        return user;
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('Email or provider id already in use');
      }
      throw err;
    }
  }

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
