import { ApiProperty } from '@nestjs/swagger';
import type { DepositResult } from '../../../application/commands/deposit.command';

export class DepositResponseDto {
  @ApiProperty({ format: 'uuid' })
  accountId!: string;

  @ApiProperty({ example: '1050' })
  amountCents!: string;

  @ApiProperty({ example: 'USD' })
  currency!: string;

  @ApiProperty()
  idempotentReplay!: boolean;

  static from(result: DepositResult): DepositResponseDto {
    return {
      accountId: result.accountId,
      amountCents: result.balance.amountCents.toString(),
      currency: result.balance.currency,
      idempotentReplay: result.idempotentReplay,
    };
  }
}
