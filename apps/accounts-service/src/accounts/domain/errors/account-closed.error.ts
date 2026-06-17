import { DomainError } from '@fintech/domain-common';
import type { AccountId } from '../value-objects/account-id.vo';

export class AccountClosedError extends DomainError {
  readonly code = 'ACCOUNT_CLOSED';

  constructor(readonly accountId: AccountId) {
    super(`Account ${accountId.value} is closed`);
  }
}
