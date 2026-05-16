import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TaxRecord } from '@prisma/client';
import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaxService } from './tax.service';

class PayTaxDto {
  @ApiProperty({ description: 'ISO-8601 start-of-week timestamp (Monday 00:00 UTC).' })
  @IsDateString()
  weekStart!: string;
}

@ApiTags('tax')
@Controller('plots/:plotId/tax')
export class TaxController {
  constructor(private readonly tax: TaxService) {}

  @Post()
  @ApiOperation({ summary: 'Pay weekly property tax for a plot. Idempotent per (plot, week).' })
  pay(@Param('plotId') plotId: string, @Body() dto: PayTaxDto): Promise<TaxRecord> {
    return this.tax.payWeeklyTax(plotId, new Date(dto.weekStart));
  }

  @Get('estimate')
  @ApiOperation({ summary: 'Estimate the weekly tax owed for a plot at current rates.' })
  async estimate(@Param('plotId') plotId: string): Promise<{ weeklyTax: string }> {
    const tax = await this.tax['prisma'].plot.findUnique({ where: { id: plotId } });
    if (!tax) {
      return { weeklyTax: '0' };
    }
    return { weeklyTax: this.tax.computeWeeklyTax(tax).toString() };
  }
}
