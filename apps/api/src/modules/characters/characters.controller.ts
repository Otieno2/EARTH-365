import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Character } from '@prisma/client';
import { CharactersService } from './characters.service';
import { CreateCharacterDto } from './dto/create-character.dto';

@ApiTags('characters')
@Controller('accounts/:userId/characters')
export class CharactersController {
  constructor(private readonly characters: CharactersService) {}

  @Get()
  @ApiOperation({ summary: 'List all characters on an account.' })
  list(@Param('userId') userId: string): Promise<Character[]> {
    return this.characters.list(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new character on an account.' })
  create(@Param('userId') userId: string, @Body() dto: CreateCharacterDto): Promise<Character> {
    return this.characters.create(userId, dto);
  }
}
