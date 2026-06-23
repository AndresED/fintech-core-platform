import {
  CurrencyMismatchError,
  InsufficientFundsError,
  NegativeMoneyError,
} from '../errors/money.errors';
import { Money } from './money.vo';

describe('Money', () => {
  it('should add two amounts in cents without floating point drift', () => {
    const tenCents = Money.fromCents(10n);
    const twentyCents = Money.fromCents(20n);

    expect(tenCents.add(twentyCents).amountCents).toBe(30n);
  });

  it('should reject negative cents at construction', () => {
    expect(() => Money.fromCents(-1n)).toThrow(NegativeMoneyError);
  });

  it('should subtract when funds are sufficient', () => {
    const balance = Money.fromCents(500n);
    const debit = Money.fromCents(125n);

    expect(balance.subtract(debit).amountCents).toBe(375n);
  });

  it('should throw when subtract would go negative', () => {
    const balance = Money.fromCents(100n);
    const debit = Money.fromCents(101n);

    expect(() => balance.subtract(debit)).toThrow(InsufficientFundsError);
  });

  it('should throw on currency mismatch', () => {
    const usd = Money.fromCents(100n, 'USD');
    const pen = Money.fromCents(100n, 'PEN');

    expect(() => usd.add(pen)).toThrow(CurrencyMismatchError);
  });

  it('should compare amounts with isGreaterThan', () => {
    const larger = Money.fromCents(200n);
    const smaller = Money.fromCents(199n);

    expect(larger.isGreaterThan(smaller)).toBe(true);
    expect(smaller.isGreaterThan(larger)).toBe(false);
  });
});

describe('Why not float (regression guard)', () => {
  it('should document that JS float arithmetic is unsafe for money', () => {
    expect(0.1 + 0.2).not.toBe(0.3);
    expect(Money.fromCents(10n).add(Money.fromCents(20n)).amountCents).toBe(30n);
  });
});
