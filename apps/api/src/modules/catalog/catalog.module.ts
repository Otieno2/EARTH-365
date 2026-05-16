import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { CurrencyModule } from '../currency/currency.module';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [CurrencyModule, InventoryModule],
  controllers: [CatalogController],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CatalogModule {}
