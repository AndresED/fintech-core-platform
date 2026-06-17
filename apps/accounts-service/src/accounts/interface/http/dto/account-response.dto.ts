import { ApiProperty } from '@nestjs/swagger';
import type { AccountId } from '../../../domain/value-objects/account-id.vo';
import { AccountStatus } from '../../../domain/value-objects/account-status.vo';
import type { Account } from '../../../domain/entities/account.entity';

export class AccountResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  ownerName!: string;

  @ApiProperty({ enum: AccountStatus })
  status!: AccountStatus;

  @ApiProperty()
  createdAt!: string;

  static fromId(id: AccountId): AccountResponseDto {
    const dto = new AccountResponseDto();
    dto.id = id.value;
    return dto;
  }

  static fromAccount(account: Account): AccountResponseDto {
    const dto = new AccountResponseDto();
    dto.id = account.id.value;
    dto.ownerName = account.ownerName;
    dto.status = account.status;
    dto.createdAt = account.createdAt.toISOString();
    return dto;
  }
}
