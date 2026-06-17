import { AccountClosedError } from '../errors/account-closed.error';
import { AccountId } from '../value-objects/account-id.vo';
import { AccountStatus } from '../value-objects/account-status.vo';

export class Account {
  private constructor(
    readonly id: AccountId,
    readonly ownerName: string,
    private _status: AccountStatus,
    readonly createdAt: Date,
  ) {}

  static open(id: AccountId, ownerName: string): Account {
    const trimmed = ownerName.trim();
    if (!trimmed) {
      throw new Error('ownerName cannot be empty');
    }
    return new Account(id, trimmed, AccountStatus.ACTIVE, new Date());
  }

  static reconstitute(props: {
    id: AccountId;
    ownerName: string;
    status: AccountStatus;
    createdAt: Date;
  }): Account {
    return new Account(props.id, props.ownerName, props.status, props.createdAt);
  }

  get status(): AccountStatus {
    return this._status;
  }

  suspend(): void {
    if (this._status === AccountStatus.CLOSED) {
      throw new AccountClosedError(this.id);
    }
    this._status = AccountStatus.SUSPENDED;
  }
}
