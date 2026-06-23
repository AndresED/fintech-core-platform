import type { DomainEvent } from '@fintech/domain-common';

export const DOMAIN_EVENT_PUBLISHER = Symbol('DOMAIN_EVENT_PUBLISHER');

export interface DomainEventPublisherPort {
  publish(event: DomainEvent): Promise<void>;
}
