export interface IntegrationEvent {
  readonly eventType: string;
  readonly eventId: string;
  readonly occurredAt: string;
  readonly payload: Record<string, unknown>;
}
