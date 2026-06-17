import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../domain/entities/account.entity';
import { AccountId } from '../../domain/value-objects/account-id.vo';
import { AccountStatus } from '../../domain/value-objects/account-status.vo';
import type { AccountRepositoryPort } from '../../domain/ports/account.repository.port';
import { AccountOrmEntity } from './account.orm-entity';

@Injectable()
export class TypeOrmAccountRepository implements AccountRepositoryPort {
  constructor(
    @InjectRepository(AccountOrmEntity)
    private readonly repo: Repository<AccountOrmEntity>,
  ) {}

  async save(account: Account): Promise<void> {
    await this.repo.save({
      id: account.id.value,
      ownerName: account.ownerName,
      status: account.status,
      createdAt: account.createdAt,
    });
  }

  async findById(id: AccountId): Promise<Account | null> {
    const row = await this.repo.findOne({ where: { id: id.value } });
    return row ? this.toDomain(row) : null;
  }

  async findAll(): Promise<Account[]> {
    const rows = await this.repo.find({ order: { createdAt: 'DESC' } });
    return rows.map((row) => this.toDomain(row));
  }

  private toDomain(row: AccountOrmEntity): Account {
    return Account.reconstitute({
      id: AccountId.from(row.id),
      ownerName: row.ownerName,
      status: row.status as AccountStatus,
      createdAt: row.createdAt,
    });
  }
}
