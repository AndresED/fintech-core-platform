import {
  CurrencyMismatchError,
  InsufficientFundsError,
  NegativeMoneyError,
} from '../errors/money.errors';

export class Money {
  private constructor(
    readonly amountCents: bigint,
    readonly currency: string,
  ) {}

  static zero(currency = 'USD'): Money {
    return new Money(0n, currency);
  }

  static fromCents(amountCents: bigint, currency = 'USD'): Money {
    if (amountCents < 0n) {
      throw new NegativeMoneyError();
    }
    return new Money(amountCents, currency);
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return Money.fromCents(this.amountCents + other.amountCents, this.currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    if (other.amountCents > this.amountCents) {
      throw new InsufficientFundsError();
    }
    return Money.fromCents(this.amountCents - other.amountCents, this.currency);
  }

  isGreaterThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this.amountCents > other.amountCents;
  }

  equals(other: Money): boolean {
    return this.currency === other.currency && this.amountCents === other.amountCents;
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new CurrencyMismatchError(this.currency, other.currency);
    }
  }
}
