import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsModule } from './accounts/accounts.module';
import { HealthController } from './health/health.controller';
import { AccountOrmEntity } from './accounts/infrastructure/persistence/account.orm-entity';
import { LedgerEntryOrmEntity } from './accounts/infrastructure/persistence/ledger-entry.orm-entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.get<string>('DATABASE_HOST', 'localhost'),
        port: config.get<number>('DATABASE_PORT', 5433),
        username: config.get<string>('DATABASE_USER', 'fintech'),
        password: config.get<string>('DATABASE_PASSWORD', 'fintech'),
        database: config.get<string>('DATABASE_NAME', 'accounts'),
        entities: [AccountOrmEntity, LedgerEntryOrmEntity],
        synchronize: config.get<string>('NODE_ENV', 'development') !== 'production',
      }),
    }),
    AccountsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
