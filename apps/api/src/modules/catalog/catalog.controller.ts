import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags, ApiProperty } from '@nestjs/swagger';
import { CatalogItem, Currency, InventoryItem, ItemCategory } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';
import { CatalogService } from './catalog.service';

class PurchaseCatalogItemDto {
  @ApiProperty()
  @IsString()
  userId!: string;

  @ApiProperty({ enum: Currency })
  @IsEnum(Currency)
  currency!: Currency;
}

@ApiTags('catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('items')
  @ApiOperation({ summary: 'List active catalog items, optionally filtered by category.' })
  @ApiQuery({ name: 'category', enum: ItemCategory, required: false })
  list(@Query('category') category?: ItemCategory): Promise<CatalogItem[]> {
    return this.catalog.list(category);
  }

  @Post('items/:id/purchase')
  @ApiOperation({ summary: 'Buy a catalog item with EarthCoin or Gems.' })
  purchase(@Param('id') id: string, @Body() dto: PurchaseCatalogItemDto): Promise<InventoryItem> {
    return this.catalog.purchase(id, dto.userId, dto.currency);
  }
}
