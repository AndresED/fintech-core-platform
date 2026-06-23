import { DomainError } from '@fintech/domain-common';
import { AccountId } from '../value-objects/account-id.vo';

export class AccountNotFoundError extends DomainError {
  readonly code = 'ACCOUNT_NOT_FOUND';

  constructor(id: AccountId) {
    super(`Account ${id.value} not found`);
  }
}
