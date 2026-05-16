import { Module } from '@nestjs/common';
import { CorporationsController } from './corporations.controller';
import { CorporationsService } from './corporations.service';
import { CurrencyModule } from '../currency/currency.module';
import { LedgerModule } from '../ledger/ledger.module';

@Module({
  imports: [CurrencyModule, LedgerModule],
  controllers: [CorporationsController],
  providers: [CorporationsService],
  exports: [CorporationsService],
})
export class CorporationsModule {}
