import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Money } from '@fintech/domain-common';
import { CreateAccountUseCase } from '../../application/use-cases/create-account.use-case';
import { CreateInternalTransferUseCase } from '../../application/use-cases/create-internal-transfer.use-case';
import { DepositToAccountUseCase } from '../../application/use-cases/deposit-to-account.use-case';
import { GetAccountBalanceUseCase } from '../../application/use-cases/get-account-balance.use-case';
import { GetAccountUseCase } from '../../application/use-cases/get-account.use-case';
import { ListAccountsUseCase } from '../../application/use-cases/list-accounts.use-case';
import { AccountResponseDto } from './dto/account-response.dto';
import { BalanceResponseDto } from './dto/balance-response.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { DepositDto } from './dto/deposit.dto';
import { DepositResponseDto } from './dto/deposit-response.dto';
import { InternalTransferDto } from './dto/internal-transfer.dto';
import { InternalTransferResponseDto } from './dto/internal-transfer-response.dto';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly createAccount: CreateAccountUseCase,
    private readonly getAccount: GetAccountUseCase,
    private readonly listAccounts: ListAccountsUseCase,
    private readonly depositToAccount: DepositToAccountUseCase,
    private readonly getAccountBalance: GetAccountBalanceUseCase,
    private readonly createInternalTransfer: CreateInternalTransferUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: AccountResponseDto })
  async create(@Body() dto: CreateAccountDto): Promise<AccountResponseDto> {
    const id = await this.createAccount.execute({ ownerName: dto.ownerName });
    return AccountResponseDto.fromId(id);
  }

  @Post('transfers')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: InternalTransferResponseDto })
  async transfer(@Body() dto: InternalTransferDto): Promise<InternalTransferResponseDto> {
    const result = await this.createInternalTransfer.execute({
      fromAccountId: dto.fromAccountId,
      toAccountId: dto.toAccountId,
      amount: Money.fromCents(BigInt(dto.amountCents)),
    });
    return InternalTransferResponseDto.from(result);
  }

  @Get()
  @ApiOkResponse({ type: AccountResponseDto, isArray: true })
  async list(): Promise<AccountResponseDto[]> {
    const accounts = await this.listAccounts.execute();
    return accounts.map((account) => AccountResponseDto.fromAccount(account));
  }

  @Post(':id/deposit')
  @HttpCode(HttpStatus.CREATED)
  @ApiHeader({ name: 'idempotency-key', required: true })
  @ApiCreatedResponse({ type: DepositResponseDto })
  async deposit(
    @Param('id', ParseUUIDPipe) id: string,
    @Headers('idempotency-key') idempotencyKey: string,
    @Body() dto: DepositDto,
  ): Promise<DepositResponseDto> {
    const result = await this.depositToAccount.execute({
      accountId: id,
      amount: Money.fromCents(BigInt(dto.amountCents)),
      idempotencyKey,
    });
    return DepositResponseDto.from(result);
  }

  @Get(':id/balance')
  @ApiOkResponse({ type: BalanceResponseDto })
  async balance(@Param('id', ParseUUIDPipe) id: string): Promise<BalanceResponseDto> {
    const money = await this.getAccountBalance.execute(id);
    return BalanceResponseDto.from(id, money);
  }

  @Get(':id')
  @ApiOkResponse({ type: AccountResponseDto })
  async getById(@Param('id', ParseUUIDPipe) id: string): Promise<AccountResponseDto> {
    const account = await this.getAccount.execute(id);
    return AccountResponseDto.fromAccount(account);
  }
}
