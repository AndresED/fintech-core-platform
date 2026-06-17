import type { Account } from '../entities/account.entity';
import type { AccountId } from '../value-objects/account-id.vo';

export const ACCOUNT_REPOSITORY = Symbol('ACCOUNT_REPOSITORY');

export interface AccountRepositoryPort {
  save(account: Account): Promise<void>;
  findById(id: AccountId): Promise<Account | null>;
  findAll(): Promise<Account[]>;
}
