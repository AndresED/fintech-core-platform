import { Inject, Injectable } from '@nestjs/common';
import { Account } from '../../domain/entities/account.entity';
import { AccountId } from '../../domain/value-objects/account-id.vo';
import {
  ACCOUNT_REPOSITORY,
  type AccountRepositoryPort,
} from '../../domain/ports/account.repository.port';
import type { CreateAccountCommand } from '../commands/create-account.command';

@Injectable()
export class CreateAccountUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly repo: AccountRepositoryPort,
  ) {}

  async execute(command: CreateAccountCommand): Promise<AccountId> {
    const id = AccountId.generate();
    const account = Account.open(id, command.ownerName);
    await this.repo.save(account);
    return id;
  }
}
