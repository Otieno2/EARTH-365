import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCharacterDto {
  @ApiProperty({ minLength: 3, maxLength: 24 })
  @IsString()
  @MinLength(3)
  @MaxLength(24)
  name!: string;

  @ApiProperty({
    description: 'Serialized appearance customization (body, face, hair, starter outfit).',
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject()
  appearance?: Record<string, unknown>;
}
