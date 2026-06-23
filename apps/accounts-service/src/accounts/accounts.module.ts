import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainToIntegrationEventHandler } from './application/handlers/domain-to-integration-event.handler';
import { ACCOUNT_REPOSITORY } from './domain/ports/account.repository.port';
import { DOMAIN_EVENT_PUBLISHER } from './domain/ports/domain-event-publisher.port';
import { LEDGER_REPOSITORY } from './domain/ports/ledger.repository.port';
import { INTEGRATION_EVENT_PUBLISHER } from './application/ports/integration-event-publisher.port';
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
import { InProcessDomainEventBus } from './infrastructure/messaging/in-process-domain-event-bus';
import { LoggingIntegrationEventPublisher } from './infrastructure/messaging/logging-integration-event.publisher';
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
    DomainToIntegrationEventHandler,
    InProcessDomainEventBus,
    {
      provide: DOMAIN_EVENT_PUBLISHER,
      useExisting: InProcessDomainEventBus,
    },
    {
      provide: INTEGRATION_EVENT_PUBLISHER,
      useClass: LoggingIntegrationEventPublisher,
    },
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
