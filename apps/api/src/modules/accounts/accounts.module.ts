import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { CurrencyModule } from '../currency/currency.module';
import { LedgerModule } from '../ledger/ledger.module';

@Module({
  imports: [CurrencyModule, LedgerModule],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
