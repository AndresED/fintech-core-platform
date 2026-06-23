import type { IntegrationEvent } from '../integration/integration-event';

export const INTEGRATION_EVENT_PUBLISHER = Symbol('INTEGRATION_EVENT_PUBLISHER');

export interface IntegrationEventPublisherPort {
  publish(event: IntegrationEvent): Promise<void>;
}
