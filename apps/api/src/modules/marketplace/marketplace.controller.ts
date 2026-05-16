import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MarketplaceListing } from '@prisma/client';
import { MarketplaceService, FeeBreakdown } from './marketplace.service';

interface SerializedFeeBreakdown {
  platformFee: string;
  cityTax: string;
  corpCut: string;
  sellerNet: string;
}

function serializeFeeBreakdown(fees: FeeBreakdown): SerializedFeeBreakdown {
  return {
    platformFee: fees.platformFee.toString(),
    cityTax: fees.cityTax.toString(),
    corpCut: fees.corpCut.toString(),
    sellerNet: fees.sellerNet.toString(),
  };
}

@ApiTags('marketplace')
@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplace: MarketplaceService) {}

  @Get('listings')
  @ApiOperation({ summary: 'List active marketplace listings (most recent first).' })
  list(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
  ): Promise<MarketplaceListing[]> {
    return this.marketplace.listActive(limit);
  }

  @Get('fees/preview')
  @ApiOperation({
    summary: 'Preview the fee breakdown for a hypothetical sale at a given price.',
  })
  previewFees(
    @Query('price') price: string,
    @Query('hasControllingCorp', new DefaultValuePipe('false')) hasControllingCorp: string,
  ): SerializedFeeBreakdown {
    return serializeFeeBreakdown(
      this.marketplace.computeFees(BigInt(price), {
        hasControllingCorp: hasControllingCorp === 'true',
      }),
    );
  }
}
