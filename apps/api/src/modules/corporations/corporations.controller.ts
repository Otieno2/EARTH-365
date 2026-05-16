import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Corporation, CorporationMember } from '@prisma/client';
import { CorporationsService } from './corporations.service';
import { CreateCorporationDto } from './dto/create-corporation.dto';

@ApiTags('corporations')
@Controller('corporations')
export class CorporationsController {
  constructor(private readonly corporations: CorporationsService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new Corporation. Charges the founder Gems.' })
  create(@Body() dto: CreateCorporationDto): Promise<Corporation> {
    return this.corporations.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a Corporation by id.' })
  findOne(@Param('id') id: string): Promise<Corporation> {
    return this.corporations.findById(id);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'List members of a Corporation, sorted by rank then join date.' })
  listMembers(@Param('id') id: string): Promise<CorporationMember[]> {
    return this.corporations.listMembers(id);
  }
}
