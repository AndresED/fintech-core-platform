import { Money } from '@fintech/domain-common';

export interface DepositCommand {
  accountId: string;
  amount: Money;
  idempotencyKey: string;
}

export interface DepositResult {
  accountId: string;
  balance: Money;
  idempotentReplay: boolean;
}
