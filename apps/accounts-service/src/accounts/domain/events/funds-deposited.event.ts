import type { DomainEvent } from '@fintech/domain-common';
import type { Money } from '@fintech/domain-common';
import type { AccountId } from '../value-objects/account-id.vo';

export const FUNDS_DEPOSITED_EVENT = 'accounts.funds_deposited';

export class FundsDepositedEvent implements DomainEvent {
  readonly eventName = FUNDS_DEPOSITED_EVENT;

  constructor(
    readonly accountId: AccountId,
    readonly amount: Money,
    readonly idempotencyKey: string,
    readonly ledgerEntryId: string,
    readonly occurredAt: Date = new Date(),
  ) {}
}
