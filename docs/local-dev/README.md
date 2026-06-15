# Stack local — desarrollo sin AWS/MSK

Emuladores usados en **dev y CI**. Mismo código que producción; distinto endpoint.

| Herramienta | Propósito | Guía |
|-------------|-----------|------|
| **Redpanda** | Kafka API — event bus, outbox, DLQ | [redpanda.md](./redpanda.md) |
| **[MiniStack](https://ministack.org/)** | AWS — S3, Secrets Manager, SES | [ministack.md](./ministack.md) |
| PostgreSQL | Transaccional | `docker-compose.yml` |
| Redis | Cache, sessions, rate limit | `docker-compose.yml` |

## Compose

```bash
# Base: PG + Redis + Redpanda
docker compose -f infra/docker/docker-compose.yml up -d

# + MiniStack (Fase 4+)
docker compose -f infra/docker/docker-compose.yml \
  -f infra/docker/docker-compose.ministack.yml up -d
```

## Filosofía

```
Dev:     kafkajs → Redpanda:9092      |  S3Client → MiniStack:4566
Prod:    kafkajs → MSK                |  S3Client → AWS S3
```

No bifurcar lógica de negocio — solo configuración de infra.
