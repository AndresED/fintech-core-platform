import { Inject, Injectable } from '@nestjs/common';
import { Account } from '../../domain/entities/account.entity';
import {
  ACCOUNT_REPOSITORY,
  type AccountRepositoryPort,
} from '../../domain/ports/account.repository.port';

@Injectable()
export class ListAccountsUseCase {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly repo: AccountRepositoryPort,
  ) {}

  async execute(): Promise<Account[]> {
    return this.repo.findAll();
  }
}
