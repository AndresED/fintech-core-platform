import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { AccountStatus } from '../../domain/value-objects/account-status.vo';

@Entity({ name: 'accounts' })
export class AccountOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'owner_name', type: 'varchar', length: 200 })
  ownerName!: string;

  @Column({ type: 'varchar', length: 20 })
  status!: AccountStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
