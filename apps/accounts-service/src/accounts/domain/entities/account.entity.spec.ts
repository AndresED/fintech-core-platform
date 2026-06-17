import { AccountClosedError } from '../errors/account-closed.error';
import { Account } from './account.entity';
import { AccountId } from '../value-objects/account-id.vo';
import { AccountStatus } from '../value-objects/account-status.vo';

describe('Account', () => {
  it('should suspend an active account', () => {
    const account = Account.open(AccountId.generate(), 'Jane Doe');
    account.suspend();
    expect(account.status).toBe(AccountStatus.SUSPENDED);
  });

  it('should throw when suspending a closed account', () => {
    const id = AccountId.generate();
    const account = Account.reconstitute({
      id,
      ownerName: 'Jane',
      status: AccountStatus.CLOSED,
      createdAt: new Date(),
    });

    expect(() => account.suspend()).toThrow(AccountClosedError);
  });
});
