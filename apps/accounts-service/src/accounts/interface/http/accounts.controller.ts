import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateAccountUseCase } from '../../application/use-cases/create-account.use-case';
import { GetAccountUseCase } from '../../application/use-cases/get-account.use-case';
import { ListAccountsUseCase } from '../../application/use-cases/list-accounts.use-case';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountResponseDto } from './dto/account-response.dto';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly createAccount: CreateAccountUseCase,
    private readonly getAccount: GetAccountUseCase,
    private readonly listAccounts: ListAccountsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: AccountResponseDto })
  async create(@Body() dto: CreateAccountDto): Promise<AccountResponseDto> {
    const id = await this.createAccount.execute({ ownerName: dto.ownerName });
    return AccountResponseDto.fromId(id);
  }

  @Get()
  @ApiOkResponse({ type: AccountResponseDto, isArray: true })
  async list(): Promise<AccountResponseDto[]> {
    const accounts = await this.listAccounts.execute();
    return accounts.map((account) => AccountResponseDto.fromAccount(account));
  }

  @Get(':id')
  @ApiOkResponse({ type: AccountResponseDto })
  async getById(@Param('id', ParseUUIDPipe) id: string): Promise<AccountResponseDto> {
    const account = await this.getAccount.execute(id);
    return AccountResponseDto.fromAccount(account);
  }
}
