import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Account } from '../../domain/entities/account.entity';
import { AccountId } from '../../domain/value-objects/account-id.vo';
import {
  ACCOUNT_REPOSITORY,
  type AccountRepositoryPort,
} from '../../domain/ports/account.repository.port';

@Injectable()
export class GetAccountUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly repo: AccountRepositoryPort,
  ) {}

  async execute(id: string): Promise<Account> {
    const account = await this.repo.findById(AccountId.from(id));
    if (!account) {
      throw new NotFoundException(`Account ${id} not found`);
    }
    return account;
  }
}
