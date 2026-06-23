import { randomUUID } from 'crypto';
import type { FundsDepositedEvent } from '../../domain/events/funds-deposited.event';
import type { IntegrationEvent } from './integration-event';

export const ACCOUNT_CREDITED_V1 = 'com.fintech.account.credited.v1';

export function toAccountCreditedIntegrationEvent(
  event: FundsDepositedEvent,
): IntegrationEvent {
  return {
    eventType: ACCOUNT_CREDITED_V1,
    eventId: randomUUID(),
    occurredAt: event.occurredAt.toISOString(),
    payload: {
      accountId: event.accountId.value,
      amountCents: event.amount.amountCents.toString(),
      currency: event.amount.currency,
      idempotencyKey: event.idempotencyKey,
      ledgerEntryId: event.ledgerEntryId,
    },
  };
}
