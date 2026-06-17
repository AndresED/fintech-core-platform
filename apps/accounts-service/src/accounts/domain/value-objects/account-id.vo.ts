import { randomUUID } from 'node:crypto';

export class AccountId {
  private constructor(readonly value: string) {}

  static generate(): AccountId {
    return new AccountId(randomUUID());
  }

  static from(value: string): AccountId {
    if (!value?.trim()) {
      throw new Error('AccountId cannot be empty');
    }
    return new AccountId(value);
  }
}
