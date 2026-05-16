import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrencyBalanceView, CurrencyService } from './currency.service';

@ApiTags('currency')
@Controller('accounts/:userId/currency')
export class CurrencyController {
  constructor(private readonly currency: CurrencyService) {}

  @Get()
  @ApiOperation({ summary: "Get a user's EarthCoin and Gems balances." })
  getBalance(@Param('userId') userId: string): Promise<CurrencyBalanceView> {
    return this.currency.getBalance(userId);
  }
}
