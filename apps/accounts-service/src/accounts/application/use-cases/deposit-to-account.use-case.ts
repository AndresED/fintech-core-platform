import { Inject, Injectable } from '@nestjs/common';
import { LedgerEntry } from '../../domain/entities/ledger-entry.entity';
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
import type { DepositCommand, DepositResult } from '../commands/deposit.command';

@Injectable()
export class DepositToAccountUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accounts: AccountRepositoryPort,
    @Inject(LEDGER_REPOSITORY)
    private readonly ledger: LedgerRepositoryPort,
  ) {}

  async execute(command: DepositCommand): Promise<DepositResult> {
    const accountId = AccountId.from(command.accountId);
    const existing = await this.ledger.findByIdempotencyKey(command.idempotencyKey);
    if (existing) {
      const balance = await this.ledger.computeBalance(accountId);
      return {
        accountId: accountId.value,
        balance,
        idempotentReplay: true,
      };
    }

    const account = await this.accounts.findById(accountId);
    if (!account) {
      throw new AccountNotFoundError(accountId);
    }
    account.assertCanTransact();

    const entry = LedgerEntry.credit({
      accountId,
      amount: command.amount,
      idempotencyKey: command.idempotencyKey,
    });
    await this.ledger.appendEntries([entry]);

    const balance = await this.ledger.computeBalance(accountId);
    return {
      accountId: accountId.value,
      balance,
      idempotentReplay: false,
    };
  }
}
