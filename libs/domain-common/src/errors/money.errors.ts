import { DomainError } from '../domain-error';

export class NegativeMoneyError extends DomainError {
  readonly code = 'NEGATIVE_MONEY';

  constructor() {
    super('Money amount cannot be negative');
  }
}

export class CurrencyMismatchError extends DomainError {
  readonly code = 'CURRENCY_MISMATCH';

  constructor(expected: string, received: string) {
    super(`Currency mismatch: expected ${expected}, got ${received}`);
  }
}

export class InsufficientFundsError extends DomainError {
  readonly code = 'INSUFFICIENT_FUNDS';

  constructor() {
    super('Operation would result in negative balance');
  }
}
