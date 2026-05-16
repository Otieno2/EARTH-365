import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Plot, PlotStatus } from '@prisma/client';
import { PlotsService } from './plots.service';
import { PurchasePlotDto } from './dto/purchase-plot.dto';

@ApiTags('plots')
@Controller('plots')
export class PlotsController {
  constructor(private readonly plots: PlotsService) {}

  @Get()
  @ApiOperation({ summary: 'List plots, optionally filtered by status or district.' })
  @ApiQuery({ name: 'status', enum: PlotStatus, required: false })
  @ApiQuery({ name: 'districtId', required: false })
  list(
    @Query('status') status?: PlotStatus,
    @Query('districtId') districtId?: string,
  ): Promise<Plot[]> {
    return this.plots.list({ status, districtId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a single plot by id.' })
  findOne(@Param('id') id: string): Promise<Plot> {
    return this.plots.findById(id);
  }

  @Post(':id/purchase')
  @ApiOperation({ summary: 'Buy an available plot. Debits the buyer, transfers ownership.' })
  purchase(@Param('id') id: string, @Body() dto: PurchasePlotDto): Promise<Plot> {
    return this.plots.purchase(id, dto.userId);
  }
}
