import { Money } from '@fintech/domain-common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { LedgerEntry } from '../../domain/entities/ledger-entry.entity';
import { AccountId } from '../../domain/value-objects/account-id.vo';
import { LedgerDirection } from '../../domain/value-objects/ledger-direction.vo';
import type { LedgerRepositoryPort } from '../../domain/ports/ledger.repository.port';
import { LedgerEntryOrmEntity } from './ledger-entry.orm-entity';

@Injectable()
export class TypeOrmLedgerRepository implements LedgerRepositoryPort {
  constructor(
    @InjectRepository(LedgerEntryOrmEntity)
    private readonly repo: Repository<LedgerEntryOrmEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async appendEntries(entries: LedgerEntry[]): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      for (const entry of entries) {
        await manager.save(this.toOrm(entry));
      }
    });
  }

  async findByIdempotencyKey(key: string): Promise<LedgerEntry | null> {
    const row = await this.repo.findOne({ where: { idempotencyKey: key } });
    return row ? this.toDomain(row) : null;
  }

  async computeBalance(accountId: AccountId): Promise<Money> {
    const raw = await this.repo
      .createQueryBuilder('entry')
      .select(
        `COALESCE(SUM(CASE WHEN entry.direction = :credit THEN entry.amount_cents ELSE -entry.amount_cents END), 0)`,
        'balance',
      )
      .where('entry.account_id = :accountId', { accountId: accountId.value })
      .setParameter('credit', LedgerDirection.CREDIT)
      .getRawOne<{ balance: string }>();

    const cents = BigInt(raw?.balance ?? '0');
    if (cents < 0n) {
      return Money.zero();
    }
    return Money.fromCents(cents);
  }

  private toOrm(entry: LedgerEntry): LedgerEntryOrmEntity {
    return {
      id: entry.id,
      accountId: entry.accountId.value,
      amountCents: entry.amount.amountCents.toString(),
      direction: entry.direction,
      currency: entry.amount.currency,
      idempotencyKey: entry.idempotencyKey,
      transferReference: entry.transferReference,
      createdAt: entry.createdAt,
    };
  }

  private toDomain(row: LedgerEntryOrmEntity): LedgerEntry {
    return LedgerEntry.reconstitute({
      id: row.id,
      accountId: AccountId.from(row.accountId),
      amount: Money.fromCents(BigInt(row.amountCents), row.currency),
      direction: row.direction,
      idempotencyKey: row.idempotencyKey,
      transferReference: row.transferReference,
      createdAt: row.createdAt,
    });
  }
}
