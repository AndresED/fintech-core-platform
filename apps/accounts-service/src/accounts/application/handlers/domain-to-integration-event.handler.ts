import { Inject, Injectable } from '@nestjs/common';
import type { DomainEvent } from '@fintech/domain-common';
import { FundsDepositedEvent } from '../../domain/events/funds-deposited.event';
import { InternalTransferCompletedEvent } from '../../domain/events/internal-transfer-completed.event';
import { toAccountCreditedIntegrationEvent } from '../integration/account-credited.integration-event';
import { toTransferCompletedIntegrationEvent } from '../integration/transfer-completed.integration-event';
import {
  INTEGRATION_EVENT_PUBLISHER,
  type IntegrationEventPublisherPort,
} from '../ports/integration-event-publisher.port';

@Injectable()
export class DomainToIntegrationEventHandler {
  constructor(
    @Inject(INTEGRATION_EVENT_PUBLISHER)
    private readonly integrationEvents: IntegrationEventPublisherPort,
  ) {}

  async handle(event: DomainEvent): Promise<void> {
    if (event instanceof FundsDepositedEvent) {
      await this.integrationEvents.publish(toAccountCreditedIntegrationEvent(event));
      return;
    }
    if (event instanceof InternalTransferCompletedEvent) {
      await this.integrationEvents.publish(toTransferCompletedIntegrationEvent(event));
    }
  }
}
