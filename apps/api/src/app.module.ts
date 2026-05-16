import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { CharactersModule } from './modules/characters/characters.module';
import { PlotsModule } from './modules/plots/plots.module';
import { CorporationsModule } from './modules/corporations/corporations.module';
import { CurrencyModule } from './modules/currency/currency.module';
import { LedgerModule } from './modules/ledger/ledger.module';
import { TaxModule } from './modules/tax/tax.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { ChatModule } from './modules/chat/chat.module';
import { economyConfig } from './config/economy.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [economyConfig],
      envFilePath: ['.env'],
    }),
    PrismaModule,
    HealthModule,
    AccountsModule,
    CharactersModule,
    PlotsModule,
    CorporationsModule,
    CurrencyModule,
    LedgerModule,
    TaxModule,
    MarketplaceModule,
    InventoryModule,
    CatalogModule,
    ChatModule,
  ],
})
export class AppModule {}
