import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
} from 'typeorm';
import { LedgerDirection } from '../../domain/value-objects/ledger-direction.vo';

@Entity({ name: 'ledger_entries' })
export class LedgerEntryOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Index()
  @Column({ name: 'account_id', type: 'uuid' })
  accountId!: string;

  @Column({ name: 'amount_cents', type: 'bigint' })
  amountCents!: string;

  @Column({ type: 'varchar', length: 10 })
  direction!: LedgerDirection;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency!: string;

  @Index({ unique: true, where: '"idempotency_key" IS NOT NULL' })
  @Column({ name: 'idempotency_key', type: 'varchar', length: 128, nullable: true })
  idempotencyKey!: string | null;

  @Index()
  @Column({ name: 'transfer_reference', type: 'uuid', nullable: true })
  transferReference!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
