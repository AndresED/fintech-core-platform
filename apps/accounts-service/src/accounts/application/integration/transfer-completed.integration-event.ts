import { randomUUID } from 'crypto';
import type { InternalTransferCompletedEvent } from '../../domain/events/internal-transfer-completed.event';
import type { IntegrationEvent } from './integration-event';

export const TRANSFER_COMPLETED_V1 = 'com.fintech.transfer.completed.v1';

export function toTransferCompletedIntegrationEvent(
  event: InternalTransferCompletedEvent,
): IntegrationEvent {
  return {
    eventType: TRANSFER_COMPLETED_V1,
    eventId: randomUUID(),
    occurredAt: event.occurredAt.toISOString(),
    payload: {
      transferReference: event.transferReference,
      fromAccountId: event.fromAccountId.value,
      toAccountId: event.toAccountId.value,
      amountCents: event.amount.amountCents.toString(),
      currency: event.amount.currency,
    },
  };
}
