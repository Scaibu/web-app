#!/usr/bin/env bash
set -euo pipefail

APP_DIGEST="${APP_DIGEST:-}"
if [ -z "$APP_DIGEST" ]; then
  echo "Error: APP_DIGEST is required. Mutable tags are strictly prohibited." >&2
  exit 1
fi

echo "Deploying web-app @ ${APP_DIGEST}..."
docker compose -f deploy/docker/compose/docker-compose.single.yml pull web-app
docker compose -f deploy/docker/compose/docker-compose.single.yml up -d --wait --wait-timeout 180 web-app

echo "web-app deployment verified."
