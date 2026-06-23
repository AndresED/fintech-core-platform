# Fase 2 — Eventos (inicio)

> **Estado:** En progreso (post #5 domain events; Kafka/outbox en posts #6–#8)  
> **Teoría:** T-08 … T-13  
> **Artículo:** [Domain events](https://www.makingcode.dev/blog/domain-events-fintech) *(tras publicar)*

## Objetivo de la fase

Desacoplar reacciones del ledger sync: eventos de dominio, contratos de integración, bus (Redpanda), outbox, consumidores idempotentes.

## Entregado en post #5

- [x] `DomainEvent` en `@fintech/domain-common`
- [x] `FundsDepositedEvent`, `InternalTransferCompletedEvent`
- [x] `DomainEventPublisherPort` + bus in-process
- [x] Mapeo a integration events (`com.fintech.account.credited.v1`, `com.fintech.transfer.completed.v1`)
- [x] `LoggingIntegrationEventPublisher` (preparado para Kafka en post #6)

## Pendiente (posts #6–#8)

- [ ] Redpanda en docker-compose activo en dev
- [ ] `KafkaIntegrationEventPublisher`
- [ ] Outbox table + relay worker
- [ ] Consumer idempotente + DLQ
- [ ] Split transfers-service

## Probar eventos en local

Tras un depósito o transferencia, revisa logs del `accounts-service`:

```json
{"message":"integration_event_ready","eventType":"com.fintech.account.credited.v1",...}
```

## Siguiente hito

Post #6: publicar esos integration events a Redpanda (`fintech.accounts.events`).
