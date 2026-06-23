import { Money } from '@fintech/domain-common';
import { LedgerEntry } from '../entities/ledger-entry.entity';
import { AccountId } from '../value-objects/account-id.vo';

export const LEDGER_REPOSITORY = Symbol('LEDGER_REPOSITORY');

export interface LedgerRepositoryPort {
  appendEntries(entries: LedgerEntry[]): Promise<void>;
  findByIdempotencyKey(key: string): Promise<LedgerEntry | null>;
  computeBalance(accountId: AccountId): Promise<Money>;
}
