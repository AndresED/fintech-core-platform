import { ApiProperty } from '@nestjs/swagger';
import type { InternalTransferResult } from '../../../application/commands/internal-transfer.command';

export class InternalTransferResponseDto {
  @ApiProperty({ format: 'uuid' })
  transferReference!: string;

  @ApiProperty({ example: '500' })
  fromBalanceCents!: string;

  @ApiProperty({ example: '1500' })
  toBalanceCents!: string;

  @ApiProperty({ example: 'USD' })
  currency!: string;

  static from(result: InternalTransferResult): InternalTransferResponseDto {
    return {
      transferReference: result.transferReference,
      fromBalanceCents: result.fromBalance.amountCents.toString(),
      toBalanceCents: result.toBalance.amountCents.toString(),
      currency: result.fromBalance.currency,
    };
  }
}
