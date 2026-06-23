import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import type { DomainEvent } from '@fintech/domain-common';
import { FUNDS_DEPOSITED_EVENT } from '../../domain/events/funds-deposited.event';
import { INTERNAL_TRANSFER_COMPLETED_EVENT } from '../../domain/events/internal-transfer-completed.event';
import type { DomainEventPublisherPort } from '../../domain/ports/domain-event-publisher.port';
import { DomainToIntegrationEventHandler } from '../../application/handlers/domain-to-integration-event.handler';

type DomainEventHandlerFn = (event: DomainEvent) => Promise<void>;

@Injectable()
export class InProcessDomainEventBus implements DomainEventPublisherPort, OnModuleInit {
  private readonly logger = new Logger(InProcessDomainEventBus.name);
  private readonly handlers = new Map<string, DomainEventHandlerFn[]>();

  constructor(private readonly integrationMapper: DomainToIntegrationEventHandler) {}

  onModuleInit(): void {
    this.register(FUNDS_DEPOSITED_EVENT, (event) => this.integrationMapper.handle(event));
    this.register(INTERNAL_TRANSFER_COMPLETED_EVENT, (event) =>
      this.integrationMapper.handle(event),
    );
  }

  private register(eventName: string, handler: DomainEventHandlerFn): void {
    const list = this.handlers.get(eventName) ?? [];
    list.push(handler);
    this.handlers.set(eventName, list);
  }

  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventName) ?? [];
    for (const handler of handlers) {
      await handler(event);
    }
    this.logger.debug(`Published domain event ${event.eventName}`);
  }
}
