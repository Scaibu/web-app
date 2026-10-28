#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILE="deploy/docker/compose/docker-compose.single.yml"
PREVIOUS_ENV="/var/lib/deploy/web-app-previous.env"
APP_DIGEST="${APP_DIGEST:-}"
REGISTRY="${REGISTRY:-scaibu}"

if [ -z "$APP_DIGEST" ]; then
  echo "Error: APP_DIGEST is required. Mutable tags are strictly prohibited." >&2
  exit 1
fi

if command -v cosign &>/dev/null; then
  echo "Verifying image signature..."
  cosign verify --key cosign.pub "${REGISTRY}/web-app@${APP_DIGEST}" || {
    echo "Error: Image signature verification failed." >&2
    exit 1
  }
fi

if [ -f "$PREVIOUS_ENV" ]; then
  cp "$PREVIOUS_ENV" "${PREVIOUS_ENV}.bak"
fi

echo "Pulling web-app @ ${APP_DIGEST}..."
docker compose -f "$COMPOSE_FILE" pull web-app

echo "Running deployment..."
docker compose -f "$COMPOSE_FILE" up -d --wait --wait-timeout 180 web-app

echo "Running smoke check..."
RETRIES=5
for i in $(seq 1 $RETRIES); do
  if curl -sf --max-time 5 "http://127.0.0.1:${PORT:-31400}/api/health" >/dev/null 2>&1; then
    echo "Smoke check passed."
    break
  fi
  if [ "$i" -eq "$RETRIES" ]; then
    echo "Error: Smoke check failed after $RETRIES attempts. Rolling back..." >&2
    bash deploy/release/rollback.sh
    exit 1
  fi
  sleep 3
done

echo "PREVIOUS_APP_DIGEST=${APP_DIGEST}" > "$PREVIOUS_ENV"
echo "PREVIOUS_REGISTRY=${REGISTRY}" >> "$PREVIOUS_ENV"

echo "web-app deployment verified @ ${APP_DIGEST}"
