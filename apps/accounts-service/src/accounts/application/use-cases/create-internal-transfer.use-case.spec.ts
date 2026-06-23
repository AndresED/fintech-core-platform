import { Money } from '@fintech/domain-common';
import { Account } from '../../domain/entities/account.entity';
import { LedgerEntry } from '../../domain/entities/ledger-entry.entity';
import { InsufficientFundsError } from '@fintech/domain-common';
import { AccountId } from '../../domain/value-objects/account-id.vo';
import { LedgerDirection } from '../../domain/value-objects/ledger-direction.vo';
import type { AccountRepositoryPort } from '../../domain/ports/account.repository.port';
import type { LedgerRepositoryPort } from '../../domain/ports/ledger.repository.port';
import type { DomainEventPublisherPort } from '../../domain/ports/domain-event-publisher.port';
import { CreateInternalTransferUseCase } from './create-internal-transfer.use-case';

class NoopDomainEventPublisher implements DomainEventPublisherPort {
  readonly published: unknown[] = [];

  async publish(event: unknown): Promise<void> {
    this.published.push(event);
  }
}

class InMemoryAccountRepository implements AccountRepositoryPort {
  constructor(private readonly store: Map<string, Account>) {}

  async save(account: Account): Promise<void> {
    this.store.set(account.id.value, account);
  }

  async findById(id: AccountId): Promise<Account | null> {
    return this.store.get(id.value) ?? null;
  }

  async findAll(): Promise<Account[]> {
    return [...this.store.values()];
  }
}

class InMemoryLedgerRepository implements LedgerRepositoryPort {
  readonly entries: LedgerEntry[] = [];

  async appendEntries(entries: LedgerEntry[]): Promise<void> {
    this.entries.push(...entries);
  }

  async findByIdempotencyKey(key: string): Promise<LedgerEntry | null> {
    return this.entries.find((entry) => entry.idempotencyKey === key) ?? null;
  }

  async computeBalance(accountId: AccountId): Promise<Money> {
    let cents = 0n;
    for (const entry of this.entries) {
      if (entry.accountId.value !== accountId.value) {
        continue;
      }
      if (entry.direction === LedgerDirection.CREDIT) {
        cents += entry.amount.amountCents;
      } else {
        cents -= entry.amount.amountCents;
      }
    }
    return Money.fromCents(cents < 0n ? 0n : cents);
  }
}

describe('CreateInternalTransferUseCase', () => {
  it('should create debit and credit entries for a transfer', async () => {
    const fromId = AccountId.generate();
    const toId = AccountId.generate();
    const accounts = new Map<string, Account>([
      [fromId.value, Account.open(fromId, 'From')],
      [toId.value, Account.open(toId, 'To')],
    ]);
    const ledger = new InMemoryLedgerRepository();
    await ledger.appendEntries([
      LedgerEntry.credit({ accountId: fromId, amount: Money.fromCents(1000n) }),
    ]);

    const domainEvents = new NoopDomainEventPublisher();
    const useCase = new CreateInternalTransferUseCase(
      new InMemoryAccountRepository(accounts),
      ledger,
      domainEvents,
    );

    const result = await useCase.execute({
      fromAccountId: fromId.value,
      toAccountId: toId.value,
      amount: Money.fromCents(400n),
    });

    expect(ledger.entries).toHaveLength(3);
    expect(domainEvents.published).toHaveLength(1);
    expect(result.fromBalance.amountCents).toBe(600n);
    expect(result.toBalance.amountCents).toBe(400n);
  });

  it('should throw when balance is insufficient', async () => {
    const fromId = AccountId.generate();
    const toId = AccountId.generate();
    const accounts = new Map<string, Account>([
      [fromId.value, Account.open(fromId, 'From')],
      [toId.value, Account.open(toId, 'To')],
    ]);
    const ledger = new InMemoryLedgerRepository();

    const useCase = new CreateInternalTransferUseCase(
      new InMemoryAccountRepository(accounts),
      ledger,
      new NoopDomainEventPublisher(),
    );

    await expect(
      useCase.execute({
        fromAccountId: fromId.value,
        toAccountId: toId.value,
        amount: Money.fromCents(100n),
      }),
    ).rejects.toThrow(InsufficientFundsError);
  });
});
