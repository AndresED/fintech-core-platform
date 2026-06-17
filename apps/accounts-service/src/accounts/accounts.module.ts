import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ACCOUNT_REPOSITORY } from './domain/ports/account.repository.port';
import { CreateAccountUseCase } from './application/use-cases/create-account.use-case';
import { GetAccountUseCase } from './application/use-cases/get-account.use-case';
import { ListAccountsUseCase } from './application/use-cases/list-accounts.use-case';
import { AccountOrmEntity } from './infrastructure/persistence/account.orm-entity';
import { TypeOrmAccountRepository } from './infrastructure/persistence/typeorm-account.repository';
import { AccountsController } from './interface/http/accounts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AccountOrmEntity])],
  controllers: [AccountsController],
  providers: [
    CreateAccountUseCase,
    GetAccountUseCase,
    ListAccountsUseCase,
    {
      provide: ACCOUNT_REPOSITORY,
      useClass: TypeOrmAccountRepository,
    },
  ],
})
export class AccountsModule {}
