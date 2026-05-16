import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateCorporationDto {
  @ApiProperty({ description: 'Founding user.' })
  @IsString()
  founderId!: string;

  @ApiProperty({ minLength: 3, maxLength: 32 })
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  name!: string;

  @ApiProperty({ minLength: 2, maxLength: 6, description: 'Short display tag, alphanumeric.' })
  @IsString()
  @Matches(/^[A-Z0-9]{2,6}$/, { message: 'tag must be 2-6 uppercase letters or digits' })
  tag!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bannerUrl?: string;
}
