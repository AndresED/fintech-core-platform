import { Money } from '@fintech/domain-common';

export interface InternalTransferCommand {
  fromAccountId: string;
  toAccountId: string;
  amount: Money;
}

export interface InternalTransferResult {
  transferReference: string;
  fromBalance: Money;
  toBalance: Money;
}
