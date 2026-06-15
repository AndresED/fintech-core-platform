# Fase 0 — Bootstrap del monorepo

> **Estado:** Planificado (código pendiente)  
> **Teoría:** T-01, T-02, T-03, T-04  
> **LinkedIn:** Post #1 y #2

## Objetivo de la fase

Establecer el monorepo NestJS con arquitectura hexagonal en el servicio Accounts: dominio puro, application con use cases, infra con TypeORM, API con OpenAPI.

## Qué se implementará

- [ ] Workspace pnpm + NestJS app `accounts-service`
- [ ] Lib `domain-common`: `Money`, `AccountId`, errores de dominio tipados
- [ ] CRUD accounts + health check
- [ ] Docker Compose: PostgreSQL
- [ ] GitHub Actions: lint + test + build
- [ ] Swagger en `/api/docs`

## Cómo probar (cuando exista código)

```bash
pnpm install
docker compose -f infra/docker/docker-compose.yml up -d
pnpm --filter accounts-service migration:run
pnpm --filter accounts-service start:dev
curl http://localhost:3001/health
```

## Decisiones

- ADR-001: TypeORM ([privado](../../../fintech-academy-internal/03-planificacion-interna/adrs/ADR-001-orm-typeorm.md))

## Siguiente fase

[Fase 1 — Ledger](../phase-1/README.md)
