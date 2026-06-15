# Redpanda — guía operativa (repo público)

Documentación resumida. Teoría completa en repo privado: `fintech-academy-internal/05-stack-local/redpanda/`.

## Cuándo se usa

| Fase | Uso |
|------|-----|
| 2 | Event bus, outbox relay, transfers consumer |
| 5–6 | Fraud + notifications consumers |

## Levantar

```bash
docker compose -f infra/docker/docker-compose.yml up -d redpanda redpanda-console
```

- Kafka API: `localhost:9092`
- Console UI: http://localhost:8080

## Variables (.env.example)

```env
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=fintech-dev
```

## Topics (init)

```bash
./infra/docker/redpanda/init-topics.sh
```

## Comandos útiles

```bash
docker exec -it redpanda rpk topic list
docker exec -it redpanda rpk group describe transfers-service
docker exec -it redpanda rpk topic consume fintech.accounts.events -n 3
```

## Producción

Fase 12: `KAFKA_BROKERS` apunta a Amazon MSK o Redpanda Cloud (+ TLS/SASL).

Topics y convenciones: repo privado `05-stack-local/redpanda/topics-y-convenciones.md`.
