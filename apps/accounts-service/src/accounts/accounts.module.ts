import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ACCOUNT_REPOSITORY } from './domain/ports/account.repository.port';
import { LEDGER_REPOSITORY } from './domain/ports/ledger.repository.port';
import { CreateAccountUseCase } from './application/use-cases/create-account.use-case';
import { CreateInternalTransferUseCase } from './application/use-cases/create-internal-transfer.use-case';
import { DepositToAccountUseCase } from './application/use-cases/deposit-to-account.use-case';
import { GetAccountBalanceUseCase } from './application/use-cases/get-account-balance.use-case';
import { GetAccountUseCase } from './application/use-cases/get-account.use-case';
import { ListAccountsUseCase } from './application/use-cases/list-accounts.use-case';
import { AccountOrmEntity } from './infrastructure/persistence/account.orm-entity';
import { LedgerEntryOrmEntity } from './infrastructure/persistence/ledger-entry.orm-entity';
import { TypeOrmAccountRepository } from './infrastructure/persistence/typeorm-account.repository';
import { TypeOrmLedgerRepository } from './infrastructure/persistence/typeorm-ledger.repository';
import { AccountsController } from './interface/http/accounts.controller';
import { DomainExceptionFilter } from './interface/http/domain-exception.filter';

@Module({
  imports: [TypeOrmModule.forFeature([AccountOrmEntity, LedgerEntryOrmEntity])],
  controllers: [AccountsController],
  providers: [
    CreateAccountUseCase,
    GetAccountUseCase,
    ListAccountsUseCase,
    DepositToAccountUseCase,
    GetAccountBalanceUseCase,
    CreateInternalTransferUseCase,
    {
      provide: ACCOUNT_REPOSITORY,
      useClass: TypeOrmAccountRepository,
    },
    {
      provide: LEDGER_REPOSITORY,
      useClass: TypeOrmLedgerRepository,
    },
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
  ],
})
export class AccountsModule {}
