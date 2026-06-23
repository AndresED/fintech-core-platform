# Fase 1 — Dinero y ledger

> **Estado:** Implementado (posts #3 y #4)  
> **Teoría:** T-04, T-05, T-06, T-07  
> **Artículos:** [Modelar dinero](https://www.makingcode.dev/blog/modelar-dinero-en-codigo-fintech) · [Ledger interno](https://www.makingcode.dev/blog/ledger-interno-transferencias-fintech)

## Objetivo de la fase

Movimientos append-only, saldo derivado, invariantes (sin saldo negativo), depósito idempotente.

## Qué incluye

- [x] Value object `Money` en `@fintech/domain-common` (post #3)
- [x] Tabla `ledger_entries` (credit/debit, centavos `bigint`)
- [x] `POST /accounts/:id/deposit` con `Idempotency-Key`
- [x] `GET /accounts/:id/balance`
- [x] `POST /accounts/transfers` (dos movimientos, una transacción)
- [x] Tests unitarios de transferencia e insuficiencia de fondos

## Cómo probar

```bash
pnpm install
docker compose -f infra/docker/docker-compose.yml up -d
cp apps/accounts-service/.env.example apps/accounts-service/.env
pnpm dev:accounts
pnpm test
```

Swagger: http://localhost:3001/api/docs

## Siguiente fase

[Fase 2 — Event bus](../phase-2/README.md) *(planificado)*
