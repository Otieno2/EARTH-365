import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PurchasePlotDto {
  @ApiProperty({ description: 'User performing the purchase.' })
  @IsString()
  userId!: string;
}
