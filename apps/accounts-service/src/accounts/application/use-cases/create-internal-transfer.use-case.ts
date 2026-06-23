import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
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
import type {
  InternalTransferCommand,
  InternalTransferResult,
} from '../commands/internal-transfer.command';

@Injectable()
export class CreateInternalTransferUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accounts: AccountRepositoryPort,
    @Inject(LEDGER_REPOSITORY)
    private readonly ledger: LedgerRepositoryPort,
  ) {}

  async execute(command: InternalTransferCommand): Promise<InternalTransferResult> {
    if (command.fromAccountId === command.toAccountId) {
      throw new Error('Cannot transfer to the same account');
    }

    const fromId = AccountId.from(command.fromAccountId);
    const toId = AccountId.from(command.toAccountId);

    const fromAccount = await this.accounts.findById(fromId);
    if (!fromAccount) {
      throw new AccountNotFoundError(fromId);
    }
    const toAccount = await this.accounts.findById(toId);
    if (!toAccount) {
      throw new AccountNotFoundError(toId);
    }

    fromAccount.assertCanTransact();
    toAccount.assertCanTransact();

    const fromBalance = await this.ledger.computeBalance(fromId);
    fromBalance.subtract(command.amount);

    const transferReference = randomUUID();
    const debit = LedgerEntry.debit({
      accountId: fromId,
      amount: command.amount,
      transferReference,
    });
    const credit = LedgerEntry.credit({
      accountId: toId,
      amount: command.amount,
      transferReference,
    });

    await this.ledger.appendEntries([debit, credit]);

    const updatedFromBalance = await this.ledger.computeBalance(fromId);
    const updatedToBalance = await this.ledger.computeBalance(toId);

    return {
      transferReference,
      fromBalance: updatedFromBalance,
      toBalance: updatedToBalance,
    };
  }
}
