import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Character, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCharacterDto } from './dto/create-character.dto';

@Injectable()
export class CharactersService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string): Promise<Character[]> {
    return this.prisma.character.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(userId: string, dto: CreateCharacterDto): Promise<Character> {
    const existing = await this.prisma.character.count({ where: { userId } });
    try {
      return await this.prisma.character.create({
        data: {
          userId,
          name: dto.name,
          appearance: (dto.appearance ?? {}) as Prisma.InputJsonValue,
          isPrimary: existing === 0,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException(`Character name "${dto.name}" is taken`);
      }
      throw err;
    }
  }

  async findById(id: string): Promise<Character> {
    const character = await this.prisma.character.findUnique({ where: { id } });
    if (!character) {
      throw new NotFoundException(`Character ${id} not found`);
    }
    return character;
  }
}
