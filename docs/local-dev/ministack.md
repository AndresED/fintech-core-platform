# MiniStack — guía operativa (repo público)

Documentación resumida. Teoría completa en repo privado: `fintech-academy-internal/05-stack-local/ministack/`.

Sitio oficial: [ministack.org](https://ministack.org/)

## Cuándo se usa

| Fase | Servicios MiniStack |
|------|---------------------|
| 4 | Secrets Manager (JWT keys dev) |
| 6 | S3 recibos, SES emails |
| 8 | S3 documentos KYC |

## Levantar

```bash
# Rápido
docker run -p 4566:4566 ministackorg/ministack

# Con compose del proyecto
docker compose -f infra/docker/docker-compose.yml \
  -f infra/docker/docker-compose.ministack.yml up -d
```

## Variables (.env.example)

```env
AWS_ENDPOINT_URL=http://localhost:4566
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
S3_BUCKET_RECEIPTS=fintech-receipts-dev
S3_BUCKET_KYC=fintech-kyc-dev
```

## Smoke test

```bash
aws --endpoint-url=http://localhost:4566 sts get-caller-identity
aws --endpoint-url=http://localhost:4566 s3 ls
```

## Producción

Fase 12: eliminar `AWS_ENDPOINT_URL`; IAM roles + S3/Secrets reales en AWS.

## Kafka

MiniStack **no** reemplaza Kafka. Event bus → [Redpanda](./redpanda.md).
