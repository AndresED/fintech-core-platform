import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from '@fintech/domain-common';

const STATUS_BY_CODE: Record<string, HttpStatus> = {
  ACCOUNT_NOT_FOUND: HttpStatus.NOT_FOUND,
  ACCOUNT_NOT_ACTIVE: HttpStatus.CONFLICT,
  ACCOUNT_CLOSED: HttpStatus.CONFLICT,
  INSUFFICIENT_FUNDS: HttpStatus.UNPROCESSABLE_ENTITY,
  NEGATIVE_MONEY: HttpStatus.BAD_REQUEST,
  CURRENCY_MISMATCH: HttpStatus.BAD_REQUEST,
};

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = STATUS_BY_CODE[exception.code] ?? HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      code: exception.code,
      message: exception.message,
    });
  }
}
