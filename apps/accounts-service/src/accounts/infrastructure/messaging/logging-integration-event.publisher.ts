import { Injectable, Logger } from '@nestjs/common';
import type { IntegrationEvent } from '../../application/integration/integration-event';
import type { IntegrationEventPublisherPort } from '../../application/ports/integration-event-publisher.port';

@Injectable()
export class LoggingIntegrationEventPublisher implements IntegrationEventPublisherPort {
  private readonly logger = new Logger(LoggingIntegrationEventPublisher.name);

  async publish(event: IntegrationEvent): Promise<void> {
    this.logger.log(
      JSON.stringify({
        message: 'integration_event_ready',
        eventType: event.eventType,
        eventId: event.eventId,
        occurredAt: event.occurredAt,
        payload: event.payload,
      }),
    );
  }
}
