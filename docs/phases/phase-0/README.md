# Fase 0 — Bootstrap del monorepo

> **Estado:** Implementado (post #2)  
> **Teoría:** T-01  
> **Artículo:** [Por qué monolito modular](https://www.makingcode.dev/blog/por-que-monolito-modular-en-fintech)

## Objetivo de la fase

Monorepo NestJS con arquitectura hexagonal en `accounts-service`: dominio puro, application con use cases, infra con TypeORM, API con OpenAPI.

## Qué incluye

- [x] Workspace pnpm + app `accounts-service`
- [x] Lib `@fintech/domain-common`: `DomainError`
- [x] CRUD accounts + `GET /health`
- [x] Docker Compose: PostgreSQL (puerto **5433**)
- [x] GitHub Actions: lint + test + build
- [x] Swagger en `/api/docs`
- [x] Tests unitarios de dominio y application (sin Docker)

## Cómo probar

```bash
pnpm install
docker compose -f infra/docker/docker-compose.yml up -d
cp apps/accounts-service/.env.example apps/accounts-service/.env
pnpm dev:accounts
```

```bash
curl http://localhost:3001/health
curl -X POST http://localhost:3001/accounts \
  -H "Content-Type: application/json" \
  -d '{"ownerName":"Jane Doe"}'
```

OpenAPI: http://localhost:3001/api/docs

## Estructura hexagonal

```
apps/accounts-service/src/accounts/
├── domain/           # entidades, VOs, ports — sin NestJS/TypeORM
├── application/      # use cases
├── infrastructure/   # TypeORM repository
└── interface/        # controller + DTOs
```

## Decisiones

- ADR-001: TypeORM (repo privado)

## Siguiente fase

[Fase 1 — Ledger](../phase-1/README.md)
