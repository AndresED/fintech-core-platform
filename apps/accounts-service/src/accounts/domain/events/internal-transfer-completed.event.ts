import type { DomainEvent } from '@fintech/domain-common';
import type { Money } from '@fintech/domain-common';
import type { AccountId } from '../value-objects/account-id.vo';

export const INTERNAL_TRANSFER_COMPLETED_EVENT = 'accounts.internal_transfer_completed';

export class InternalTransferCompletedEvent implements DomainEvent {
  readonly eventName = INTERNAL_TRANSFER_COMPLETED_EVENT;

  constructor(
    readonly transferReference: string,
    readonly fromAccountId: AccountId,
    readonly toAccountId: AccountId,
    readonly amount: Money,
    readonly occurredAt: Date = new Date(),
  ) {}
}
