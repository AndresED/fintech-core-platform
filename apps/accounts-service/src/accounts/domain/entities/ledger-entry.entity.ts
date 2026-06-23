import { Money } from '@fintech/domain-common';
import { randomUUID } from 'crypto';
import { AccountId } from '../value-objects/account-id.vo';
import { LedgerDirection } from '../value-objects/ledger-direction.vo';

export class LedgerEntry {
  private constructor(
    readonly id: string,
    readonly accountId: AccountId,
    readonly amount: Money,
    readonly direction: LedgerDirection,
    readonly idempotencyKey: string | null,
    readonly transferReference: string | null,
    readonly createdAt: Date,
  ) {}

  static credit(props: {
    accountId: AccountId;
    amount: Money;
    idempotencyKey?: string | null;
    transferReference?: string | null;
  }): LedgerEntry {
    return new LedgerEntry(
      randomUUID(),
      props.accountId,
      props.amount,
      LedgerDirection.CREDIT,
      props.idempotencyKey ?? null,
      props.transferReference ?? null,
      new Date(),
    );
  }

  static debit(props: {
    accountId: AccountId;
    amount: Money;
    transferReference?: string | null;
  }): LedgerEntry {
    return new LedgerEntry(
      randomUUID(),
      props.accountId,
      props.amount,
      LedgerDirection.DEBIT,
      null,
      props.transferReference ?? null,
      new Date(),
    );
  }

  static reconstitute(props: {
    id: string;
    accountId: AccountId;
    amount: Money;
    direction: LedgerDirection;
    idempotencyKey: string | null;
    transferReference: string | null;
    createdAt: Date;
  }): LedgerEntry {
    return new LedgerEntry(
      props.id,
      props.accountId,
      props.amount,
      props.direction,
      props.idempotencyKey,
      props.transferReference,
      props.createdAt,
    );
  }
}
