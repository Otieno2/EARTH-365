import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { AuthProvider } from '@prisma/client';

export class CreateAccountDto {
  @ApiProperty({ format: 'email' })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 3, maxLength: 32 })
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  displayName!: string;

  @ApiProperty({ enum: AuthProvider, default: AuthProvider.EMAIL })
  @IsOptional()
  @IsEnum(AuthProvider)
  provider?: AuthProvider;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  providerId?: string;

  @ApiProperty({ required: false, description: 'Required when provider is EMAIL.' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
