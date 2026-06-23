import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class DepositDto {
  @ApiProperty({ example: 1050, description: 'Amount in cents' })
  @IsInt()
  @Min(1)
  amountCents!: number;
}
