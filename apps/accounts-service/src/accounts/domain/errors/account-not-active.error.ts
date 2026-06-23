import { DomainError } from '@fintech/domain-common';
import { AccountId } from '../value-objects/account-id.vo';

export class AccountNotActiveError extends DomainError {
  readonly code = 'ACCOUNT_NOT_ACTIVE';

  constructor(id: AccountId) {
    super(`Account ${id.value} cannot receive or send funds`);
  }
}
