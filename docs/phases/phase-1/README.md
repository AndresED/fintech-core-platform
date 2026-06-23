# Fase 1 — Dinero y ledger (en progreso)

> **Estado:** Parcial (post #3) — value object `Money` implementado  
> **Teoría:** T-04, T-05  
> **Artículo:** [Modelar dinero en código](https://www.makingcode.dev/blog/modelar-dinero-en-codigo-fintech)

## Objetivo de la fase

Movimientos contables, saldo derivado, invariantes (sin saldo negativo). El post #3 cubre el **tipo** `Money`; el post #4 cubrirá ledger y endpoints.

## Qué incluye (post #3)

- [x] Value object `Money` en `@fintech/domain-common`
- [x] Centavos como `bigint`, moneda explícita
- [x] Errores de dominio: negativo, moneda distinta, fondos insuficientes
- [x] Tests unitarios (incl. regresión float `0.1 + 0.2`)

## Pendiente (post #4)

- [ ] Entidad `LedgerEntry` / movimientos append-only
- [ ] `POST /accounts/:id/deposit`
- [ ] `GET /accounts/:id/balance`
- [ ] Idempotency-Key en depósitos

## Cómo probar

```bash
pnpm install
pnpm --filter @fintech/domain-common test
```

## Siguiente fase

[Fase 2 — Event bus](../phase-2/README.md) *(planificado)*
