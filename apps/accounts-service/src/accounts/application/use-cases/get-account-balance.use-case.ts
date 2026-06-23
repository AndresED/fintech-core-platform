import { Inject, Injectable } from '@nestjs/common';
import { AccountNotFoundError } from '../../domain/errors/account-not-found.error';
import {
  ACCOUNT_REPOSITORY,
  type AccountRepositoryPort,
} from '../../domain/ports/account.repository.port';
import {
  LEDGER_REPOSITORY,
  type LedgerRepositoryPort,
} from '../../domain/ports/ledger.repository.port';
import { AccountId } from '../../domain/value-objects/account-id.vo';
import { Money } from '@fintech/domain-common';

@Injectable()
export class GetAccountBalanceUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accounts: AccountRepositoryPort,
    @Inject(LEDGER_REPOSITORY)
    private readonly ledger: LedgerRepositoryPort,
  ) {}

  async execute(accountId: string): Promise<Money> {
    const id = AccountId.from(accountId);
    const account = await this.accounts.findById(id);
    if (!account) {
      throw new AccountNotFoundError(id);
    }
    return this.ledger.computeBalance(id);
  }
}
