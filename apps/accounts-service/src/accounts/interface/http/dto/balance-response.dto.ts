import { ApiProperty } from '@nestjs/swagger';
import { Money } from '@fintech/domain-common';

export class BalanceResponseDto {
  @ApiProperty({ format: 'uuid' })
  accountId!: string;

  @ApiProperty({ example: '1050' })
  amountCents!: string;

  @ApiProperty({ example: 'USD' })
  currency!: string;

  static from(accountId: string, balance: Money): BalanceResponseDto {
    return {
      accountId,
      amountCents: balance.amountCents.toString(),
      currency: balance.currency,
    };
  }
}
