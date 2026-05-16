import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InventoryItem } from '@prisma/client';
import { InventoryService } from './inventory.service';

@ApiTags('inventory')
@Controller('accounts/:userId/inventory')
export class InventoryController {
  constructor(private readonly inventory: InventoryService) {}

  @Get()
  @ApiOperation({ summary: 'List items a user owns, with catalog details.' })
  list(@Param('userId') userId: string): Promise<InventoryItem[]> {
    return this.inventory.list(userId);
  }
}
