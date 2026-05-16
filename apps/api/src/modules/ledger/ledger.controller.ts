import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LedgerEntry } from '@prisma/client';
import { LedgerService } from './ledger.service';

interface SerializedLedgerEntry extends Omit<LedgerEntry, 'amount'> {
  amount: string;
}

@ApiTags('ledger')
@Controller('accounts/:userId/ledger')
export class LedgerController {
  constructor(private readonly ledger: LedgerService) {}

  @Get()
  @ApiOperation({ summary: 'List recent ledger entries for a user (most recent first).' })
  async list(
    @Param('userId') userId: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ): Promise<SerializedLedgerEntry[]> {
    const entries = await this.ledger.listForUser(userId, limit);
    return entries.map((e) => ({ ...e, amount: e.amount.toString() }));
  }
}
