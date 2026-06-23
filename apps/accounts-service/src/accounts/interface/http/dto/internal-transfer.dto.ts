import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class InternalTransferDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  fromAccountId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  toAccountId!: string;

  @ApiProperty({ example: 500, description: 'Amount in cents' })
  @IsInt()
  @Min(1)
  amountCents!: number;
}
