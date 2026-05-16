import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { serializeUser, SerializedUser } from './serialization';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accounts: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account and seed it with starter EarthCoin.' })
  async create(@Body() dto: CreateAccountDto): Promise<SerializedUser> {
    const user = await this.accounts.create(dto);
    return serializeUser(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch an account by its id.' })
  async findOne(@Param('id') id: string): Promise<SerializedUser> {
    const user = await this.accounts.findById(id);
    return serializeUser(user);
  }
}
