import { Module } from '@nestjs/common';
import { PlotsController } from './plots.controller';
import { PlotsService } from './plots.service';
import { CurrencyModule } from '../currency/currency.module';
import { LedgerModule } from '../ledger/ledger.module';

@Module({
  imports: [CurrencyModule, LedgerModule],
  controllers: [PlotsController],
  providers: [PlotsService],
  exports: [PlotsService],
})
export class PlotsModule {}
